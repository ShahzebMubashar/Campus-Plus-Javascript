const pool = require("../config/database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { generateTokenPair } = require("../utils/jwt.js");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mahdijaffri5@gmail.com",
    pass: process.env.MAILER_PASS,
  },
});

const from = "no-reply@campusplus.com";

exports.newRegister = async (request, response) => {
  const {
    body: { username, rollnumber, fullName, password, email }
  } = request;

  if (!username || !rollnumber || !email || !password)
    return response.status(400).json("Please provide all the required fields");

  try {
    const rollInput = rollnumber.trim().toUpperCase();
    const patterns = [
      /^(\d{2})([A-Z])-(\d{4})$/,
      /^([A-Z])(\d{2})(\d{4})$/,
      /^(\d{2})([A-Z])(\d{4})$/
    ];

    let match = null, city = '', batch = '', digits = '';

    for (const p of patterns) {
      match = rollInput.match(p);
      if (match) break;
    }

    if (!match) {
      return response.status(400).json("Invalid roll number format");
    }

    if (match.length === 4) {
      if (/^\d{2}[A-Z]-\d{4}$/.test(rollInput) || /^\d{2}[A-Z]\d{4}$/.test(rollInput)) {
        batch = match[1];
        city = match[2];
        digits = match[3];
      } else {
        city = match[1];
        batch = match[2];
        digits = match[3];
      }
    }

    const formattedRoll = `${batch}${city}-${digits}`;

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAILER_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Registration OTP',
      html: `<p>Dear ${fullName || 'Student'},</p>
             <p>Your OTP for registration is: <b>${otp}</b></p>
             <p>This OTP is valid for 10 minutes.</p>
             <p>Thank you,<br/>FAST Registration Team</p>`
    });

    let client = await pool.connect();


    try {
      await client.query('BEGIN');
      const res = await client.query(`Insert into OTPVerification (email, otp, expires_at)
        Values ($1, $2, current_timestamp + Interval '10 minutes') returning *`,
        [email, otp]
      );

      if (!res.rowCount) {
        await client.query('ROLLBACK');
        return response.status(500).json("Failed to send OTP. Please try again.");
      }

      await client.query('COMMIT');
    } catch (error) {
      console.error("Error inserting OTP:", error);
      await client.query('ROLLBACK');
      return response.status(500).json("Failed to send OTP. Please try again.");
    } finally {
      client.release();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    client = await pool.connect();

    try {
      await client.query('BEGIN');

      const res = await client.query(`Insert into Users (email, username, rollnumber, password)
        values ($1, $2, $3, $4) returning userid`,
        [email, username, formattedRoll, hashedPassword]
      );

      if (!res.rowCount) {
        await client.query('ROLLBACK');
        return response.status(500).json("Failed to create user. Please try again.");
      }

      await client.query('COMMIT');

    } catch (error) {
      console.error("Error sending email:", error);
      return response.status(500).json("Failed to send OTP email. Please try again.");
    } finally {
      client.release();
    }

    return response.status(200).json({
      message: 'OTP sent to institutional email',
      email: email,
      otpSent: true,
    });

  } catch (error) {
    console.error(error);
    return response.status(500).json('Internal Server Error');
  }
};

exports.resetPassword = async (request, response) => {
  const { body: { email, rollnumber, password } } = request;

  if (!email || !rollnumber || !password) {
    return response.status(400).json("Please provide all required fields");
  }

  const client = await pool.connect();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let res = await pool.query(`Select password from Users where email = $1 and rollnumber = $2`,
      [email, rollnumber]
    );

    await client.query('BEGIN');

    res = await client.query(`Update Users set password = $1 where email = $2 and rollnumber = $3 returning userid`,
      [hashedPassword, email, rollnumber]
    );

    if (!res.rowCount) {
      await client.query('ROLLBACK');
      return response.status(400).json("Email and Roll Number do not match any user");
    }

    await client.query('COMMIT');

    return response.status(200).json({
      message: "Password reset successfully",
      email: email,
      rollnumber: rollnumber,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json('Internal Server Error');
  } finally {
    client.release();
  }
}

exports.verifyIdentity = async (request, response) => {
  const { body: { email, rollnumber } } = request;

  if (!email || !rollnumber) {
    return response.status(400).json("Please provide all required fields");
  }

  const client = await pool.connect();

  try {
    const res = await pool.query(`Select * from Users where email = $1 and rollnumber = $2`, [email, rollnumber]);

    if (!res.rowCount) {
      return response.status(400).json("Email and Roll Number do not match any user");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAILER_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Reset OTP',
      html: `<p>Dear User,</p>
             <p>Your OTP for password reset is: <b>${otp}</b></p>
             <p>This OTP is valid for 10 minutes.</p>
             <p>Thank you,<br/>CampusPlus Support Team</p>`
    });

    await client.query('BEGIN');

    await client.query(`Delete from OTPVerification where email = $1`, [email]);

    const insertRes = await client.query(`Insert into OTPVerification (email, otp, expires_at)
      Values ($1, $2, current_timestamp + Interval '10 minutes') returning *`,
      [email, otp]
    );

    if (!insertRes.rowCount) {
      await client.query('ROLLBACK');
      return response.status(500).json("Failed to send OTP. Please try again.");
    }

    await client.query('COMMIT');

    return response.status(200).json({
      message: "Identity verified successfully",
      email: email,
      rollnumber: rollnumber,
      identityVerified: true
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json('Internal Server Error');
  } finally {
    client.release();
  }
};

exports.verifyOTP = async (request, response) => {
  const { body: { otp, email } } = request;

  if (!otp || !email) {
    return response.status(400).json("Please provide all required fields");
  }

  const client = await pool.connect();

  try {
    let res = await pool.query(`Select * from OTPVerification where email = $1 and otp = $2`,
      [email, otp]
    );

    if (!res.rowCount) {
      return response.status(400).json("Invalid OTP entered or Email does not match rollnumber");
    }

    await client.query('BEGIN');

    res = await client.query(`Delete from OTPVerification where email = $1`, [email]);

    res = await client.query(`Update Users set isverified = True where email = $1`, [email]);

    if (!res.rowCount) {
      await client.query('ROLLBACK');
      return response.status(500).json("Failed to create user. Please try again.");
    }

    await client.query("COMMIT");

    return response.status(200).json({
      message: "OTP verified successfully",
      email: email,
      otpVerified: true
    });

  } catch (error) {
    await client.query("ROLLBACK");
    return response.status(500).json("Internal Server Error");
  } finally {
    client.release();
  }
}

exports.resendOTP = async (request, response) => {
  const { body: { email, rollnumber } } = request;

  if (!email || !rollnumber) {
    return response.status(400).json("Please provide all required fields");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let res = await client.query(`Delete from OTPVerification where email = $1`, [email]);

    const otp = Math.floor(100000 + Math.random() * 900000);

    res = await client.query(`Insert into OTPVerification (email, otp, expires_at)
      Values ($1, $2, current_timestamp + Interval '10 minutes') returning *`,
      [email, otp]
    );

    if (!res.rowCount) {
      await client.query("ROLLBACK");
      return response.status(500).json("Failed to resend OTP. Please try again.");
    }

    await client.query("COMMIT");

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.MAILER_PASS
      }
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Resent',
        html: `<p>Dear User,</p>
               <p>Your OTP is: <b>${otp}</b></p>
               <p>This OTP is valid for 10 minutes.</p>
               <p>Thank you,<br/>CampusPlus Support Team</p>`
      });
    } catch (error) {
      console.error("Error sending OTP email:", error);
    }

    return response.status(200).json({
      message: "OTP resent successfully",
      email: email,
      otpResent: true
    });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return response.status(500).json('Internal Server Error');
  } finally {
    client.release();
  }
};

exports.login = async (request, response) => {
  const { email, password, username } = request.body;

  if (!email && !username)
    return response.status(400).json({ error: "Please provide Email or Username" });

  if (!password) return response.status(400).json({ error: "Please provide Password" });

  try {
    const result = await pool.query(
      `SELECT u.*, ui.name as fullName 
       FROM Users u 
       LEFT JOIN UserInfo ui ON u.userid = ui.userid 
       WHERE (u.email = $1 OR u.username = $1) and isverified = True`,
      [email || username]
    );

    if (!result.rowCount)
      return response.status(404).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return response.status(401).json({ error: "Invalid credentials" });

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

exports.logout = async (request, response) => {
  try {
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
    console.error(error.message);
    return response.status(500).json({ error: "Server Error" });
  }
};

exports.refreshToken = async (request, response) => {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return response.status(400).json({ error: "Refresh token required" });
    }

    const { verifyToken } = require("../utils/jwt.js");
    const decoded = verifyToken(refreshToken);

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