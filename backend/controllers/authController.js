const pool = require("../config/database.js");
const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

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

    request.session.user = {
      userid: parseInt(result.rows[0].userid),
      username: result.rows[0].username,
      email: result.rows[0].email,
      rollnumber: result.rows[0].rollnumber,
      fullName: fullName || null,
    };

    response.cookie("user", `${result.rows[0].username}`, { maxAge: 600000 });
    await client.query("COMMIT");

    return response.status(201).json({
      message: `User ${result.rows[0].username} registered successfully`,
      userid: result.rows[0].userid,
      username: result.rows[0].username,
      email: result.rows[0].email,
      rollnumber: result.rows[0].rollnumber,
      fullName: fullName || null,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    await pool.query("ROLLBACK");
    return response.status(500).json("Server Error");
  }
};

exports.login = async (request, response) => {
  const { email, password, username } = request.body;

  if (!email && !username)
    return response.status(400).json("Please provide Email or Username");

  if (!password) return response.status(400).json("Please provide Password");

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

    // Regenerate session for security
    await new Promise((resolve, reject) => {
      request.session.regenerate((err) => {
        if (err) {
          console.error("Session regenerate error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    request.session.user = {
      userid: user.userid,
      email: user.email,
      username: user.username,
      role: user.role,
      fullName: user.fullname,
    };

    await new Promise((resolve, reject) => {
      request.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          reject(err);
        }
        resolve();
      });
    });

    // CORS is handled by the main middleware configuration

    return response.status(200).json({
      message: "Login successful",
      user: {
        userid: user.userid,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullname,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (request, response) => {
  const {
    body: { OTP, newPassword },
    session: {
      user: { userid },
    },
  } = request;

  if (!OTP || !newPassword)
    return response.status(400).json(`Enter all the fields`);

  const client = await pool.connect();

  try {
    let res = await pool.query(
      `Select * from ResetPassword where userid = $1`,
      [userid]
    );

    const resetToken = res.rows[0].reset_token;
    const isMatch = bcrypt.compare(String(resetToken), String(OTP));

    if (!isMatch) return response.status(400).json(`Invalid OTP Entered!`);

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

    return response.status(200).json("OTP Verrified!");
  } catch (error) {
    console.log(error.message);
    await client.query(`ROLLBACK`);
    return response.jsonStatus(500);
  } finally {
    if (client) client.release();
  }
};

exports.forgotPassword = async (request, response) => {
  const to = request.session.user.email;

  const OTPGenerated = Math.floor(100000 + Math.random() * 900000);
  const signedOTP = jwt.sign(OTPGenerated, process.env.ACCESS_TOKEN_SECRET);

  const mailOptions = {
    from: from,
    to: to,
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
      [request.session.user.userid]
    );

    if (res.rowCount)
      await client.query(
        `Delete from ResetPassword where userid = $1 or token_expiry < current_timestamp + interval '1 hour'`,
        [request.session.user.userid]
      );

    await client.query(
      `Insert into ResetPassword (userid, reset_token, token_expiry)
      Values ($1, $2, current_timestamp + Interval '1 hour')`,
      [request.session.user.userid, signedOTP]
    );

    await client.query("COMMIT");
  } catch (error) {
    console.log(error.message);
    await client.query("ROLLBACK");
    return response.jsonStatus(500);
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
    request.session.destroy((error) => {
      if (error) {
        console.error("Logout error:", error);
        return response.status(500).json("Server Error");
      }

      response.clearCookie("connect.sid");
      return response.status(200).json("Logged Out Successfully");
    });
  } catch (error) {
    console.error("Logout error:", error);
    return response.status(500).json("Server Error");
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
      `Select * from Users where username = $1 or email = $1`,
      [username || email]
    );

    if (!res.rowCount) return response.status(404).json("Invalid Credentials");

    const user = res.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return response.status(401).json("Invalid Credentials");

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    return response.status(200).json(`Login Successful! ${accessToken}`);
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({ error: "Server error" });
  }
};

exports.userRole = async (request, response) => {
  try {
    return response
      .status(200)
      .json({ userRole: request.session.user.role ?? null });
  } catch (error) {
    console.log(error.message);
    return response.jsonStatus(500);
  }
};
