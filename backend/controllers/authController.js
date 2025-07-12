const pool = require("../config/database.js");
const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { generateTokenPair, verifyToken } = require("../utils/jwt.js");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mahdijaffri5@gmail.com",
    pass: process.env.MAILER_PASS,
  },
});

const from = "no-reply@campusplus.com";

exports.register = async (request, response) => {
  const {
    body: { username, email, password, rollnumber, fullName },
  } = request;

  if (!username || !email || !password || !rollnumber) {
    console.log("Missing fields in the request body");
    return response.status(400).json("Please provide all the fields");
  }

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    const checkUser = await client.query(
      `SELECT (SELECT COUNT(*) FROM Users WHERE username = $1) AS usernameCount,
                    (SELECT COUNT(*) FROM Users WHERE email = $2) AS emailCount,
                    (SELECT COUNT(*) FROM Users WHERE rollnumber = $3) AS rollnumberCount`,
      [username, email, rollnumber]
    );

    const { usernamecount, emailcount, rollnumbercount } = checkUser.rows[0];

    if (parseInt(rollnumbercount))
      return response
        .status(409)
        .json(`Roll Number ${rollnumber} already exists`);

    if (parseInt(emailcount))
      return response.status(409).json(`Email ${email} already exists`);

    if (parseInt(usernamecount)) {
      let newUserName = username;
      let randomUserID = Math.floor(Math.random() * 1000);
      while (true) {
        newUserName = `${username}${randomUserID}`;
        const userCheck = await client.query(
          "SELECT * FROM Users WHERE username = $1",
          [newUserName]
        );
        if (!userCheck.rowCount) break;
      }

      return response
        .status(409)
        .json(`Username ${username} already exists. Try ${newUserName}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO Users (username, email, password, rollnumber) VALUES ($1, $2, $3, $4) RETURNING userid, username, email, rollnumber`,
      [username, email, hashedPassword, rollnumber]
    );

    if (fullName) {
      await client.query(
        `INSERT INTO UserInfo (userid, name) VALUES ($1, $2)`,
        [result.rows[0].userid, fullName]
      );
    }

    await client.query("COMMIT");

    const user = {
      userid: parseInt(result.rows[0].userid),
      username: result.rows[0].username,
      email: result.rows[0].email,
      rollnumber: result.rows[0].rollnumber,
      fullName: fullName || null,
      role: 'Student' // Default role for new users
    };

    // Generate JWT tokens
    const tokens = generateTokenPair(user);

    return response.status(201).json({
      message: `User ${result.rows[0].username} registered successfully`,
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        rollnumber: user.rollnumber,
        fullName: user.fullName,
        role: user.role
      },
      ...tokens
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    await pool.query("ROLLBACK");
    return response.status(500).json("Server Error");
  }
};

exports.login = async (request, response) => {
  console.log("=== JWT LOGIN ENDPOINT ===");

  const { email, password, username } = request.body;
  
  if (!email && !username)
    return response.status(400).json({ error: "Please provide Email or Username" });

  if (!password) return response.status(400).json({ error: "Please provide Password" });

  try {
    const result = await pool.query(
      `SELECT u.*, ui.name as fullName 
       FROM Users u 
       LEFT JOIN UserInfo ui ON u.userid = ui.userid 
       WHERE u.email = $1 OR u.username = $1`,
      [email || username]
    );

    if (!result.rowCount)
      return response.status(404).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return response.status(401).json({ error: "Invalid credentials" });

    console.log("✅ Login successful for user:", user.username);

    // Generate JWT tokens
    const tokens = generateTokenPair(user);

    return response.status(200).json({
      message: "Login successful",
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        role: user.role,
        rollnumber: user.rollnumber,
        fullName: user.fullname,
      },
      ...tokens
    });
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (request, response) => {
  const {
    body: { OTP, newPassword },
    user: { userid },
  } = request;

  if (!OTP || !newPassword)
    return response.status(400).json(`Enter all the fields`);

  const client = await pool.connect();

  try {
    let res = await pool.query(
      `Select * from ResetPassword where userid = $1`,
      [userid]
    );

    if (!res.rowCount) {
      return response.status(400).json(`No reset request found. Please request a new OTP.`);
    }

    const resetToken = res.rows[0].reset_token;

    // Verify the OTP token using JWT
    try {
      const decoded = verifyToken(resetToken);
      if (decoded !== parseInt(OTP)) {
        return response.status(400).json(`Invalid OTP Entered!`);
      }
    } catch (error) {
      return response.status(400).json(`Invalid or expired OTP!`);
    }

    await client.query(`BEGIN`);

    res = await client.query(`Delete from ResetPassword where userid = $1`, [
      userid,
    ]);

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    res = await client.query(
      `Update Users set password = $1, lasteditted = current_timestamp where userid = $2`,
      [hashedNewPassword, userid]
    );

    await client.query("COMMIT");

    return response.status(200).json("Password reset successfully!");
  } catch (error) {
    console.log(error.message);
    await client.query(`ROLLBACK`);
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

exports.forgotPassword = async (request, response) => {
  const { userid, email } = request.user;

  const OTPGenerated = Math.floor(100000 + Math.random() * 900000);

  // Use proper JWT signing with expiration
  const signedOTP = jwt.sign(
    OTPGenerated,
    process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
      issuer: process.env.JWT_ISSUER || 'campus-plus-app',
      audience: process.env.JWT_AUDIENCE || 'campus-plus-users'
    }
  );

  const mailOptions = {
    from: from,
    to: email,
    subject: "Password Change Verification – One-Time Password (OTP)",
    text: `Dear User,
  
  You have requested to change your password. Please use the following One-Time Password (OTP) to proceed:
  
  OTP: ${OTPGenerated}
  
  This OTP is valid for 1 hour. 
  If you did not request a password change, please disregard this email.
  
  Thank you,
  CampusPlus Support Team`,
  };

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const res = await client.query(
      `Select * from ResetPassword where userid = $1`,
      [userid]
    );

    if (res.rowCount)
      await client.query(
        `Delete from ResetPassword where userid = $1 or token_expiry < current_timestamp + interval '1 hour'`,
        [userid]
      );

    await client.query(
      `Insert into ResetPassword (userid, reset_token, token_expiry)
      Values ($1, $2, current_timestamp + Interval '1 hour')`,
      [userid, signedOTP]
    );

    await client.query("COMMIT");
  } catch (error) {
    console.log(error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(`Error: `, error);
  });

  return response.status(200).json("OTP Generated!");
};

exports.logout = async (request, response) => {
  try {
    // With JWT, logout is handled client-side by removing the token
    // We could implement a token blacklist here if needed
    console.log("✅ Logout successful for user:", request.user?.username || "unknown");
    return response.status(200).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (error) {
    console.error("Logout error:", error);
    return response.status(500).json({ error: "Server Error" });
  }
};

exports.testLogin = async (request, response) => {
  const {
    body: { username, password, email },
  } = request;

  if (!username && !email)
    return response.status(400).json("Please provide Username or Email");

  if (!password) return response.status(400).json("Please provide Password");

  try {
    let res = await pool.query(
      `SELECT u.*, ui.name as fullName 
       FROM Users u 
       LEFT JOIN UserInfo ui ON u.userid = ui.userid 
       WHERE u.username = $1 OR u.email = $1`,
      [username || email]
    );

    if (!res.rowCount) return response.status(404).json("Invalid Credentials");

    const user = res.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return response.status(401).json("Invalid Credentials");

    // Generate proper JWT tokens
    const tokens = generateTokenPair(user);

    return response.status(200).json({
      message: "Login Successful!",
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        role: user.role,
        rollnumber: user.rollnumber,
        fullName: user.fullname,
      },
      ...tokens
    });
  } catch (error) {
    console.error("Test login error:", error);
    return response.status(500).json({ error: "Server error" });
  }
};

exports.userRole = async (request, response) => {
  try {
    return response
      .status(200)
      .json({ userRole: request.user?.role ?? null });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: "Server Error" });
  }
};

// Add token refresh endpoint
exports.refreshToken = async (request, response) => {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return response.status(400).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    const { verifyToken } = require("../utils/jwt.js");
    const decoded = verifyToken(refreshToken);

    // Get user from database
    const result = await pool.query(
      `SELECT u.*, ui.name as fullName 
       FROM Users u 
       LEFT JOIN UserInfo ui ON u.userid = ui.userid 
       WHERE u.userid = $1`,
      [decoded.userid]
    );

    if (!result.rowCount) {
      return response.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const tokens = generateTokenPair(user);

    return response.status(200).json({
      message: "Token refreshed successfully",
      ...tokens
    });

  } catch (error) {
    console.error("Token refresh error:", error);
    return response.status(401).json({ error: "Invalid refresh token" });
  }
};

// Add current user endpoint for JWT
exports.currentUser = async (request, response) => {
  try {
    if (!request.user) {
      return response.status(200).json({ isAuthenticated: false });
    }

    return response.status(200).json({
      isAuthenticated: true,
      userid: request.user.userid,
      email: request.user.email,
      username: request.user.username,
      rollnumber: request.user.rollnumber,
      fullName: request.user.fullName,
      role: request.user.role
    });
  } catch (error) {
    console.error("Current user error:", error);
    return response.status(500).json({ error: "Server Error" });
  }
};
