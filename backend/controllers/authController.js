const pool = require("../config/database.js");
const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");

exports.register = async (request, response) => {
  // console.log("Register endpoint hit"); // Log to confirm the route is called
  // console.log("Request body:", request.body); // Log the incoming request body

  const {
    body: { username, email, password, rollnumber },
  } = request;

  if (!username || !email || !password || !rollnumber) {
    console.log("Missing fields in the request body");
    return response.status(400).send("Please provide all the fields");
  }

  try {
    const client = await pool.connect();
    // console.log("Database connection established for registration");
    await client.query("BEGIN");

    const checkUser = await client.query(
      `SELECT (SELECT COUNT(*) FROM Users WHERE username = $1) AS usernameCount,
                    (SELECT COUNT(*) FROM Users WHERE email = $2) AS emailCount,
                    (SELECT COUNT(*) FROM Users WHERE rollnumber = $3) AS rollnumberCount`,
      [username, email, rollnumber]
    );

    // console.log("User existence check result:", checkUser.rows[0]); // Log database query result

    const { usernamecount, emailcount, rollnumbercount } = checkUser.rows[0];

    if (parseInt(rollnumbercount)) {
      // console.log(`Roll Number ${rollnumber} already exists`);
      return response
        .status(409)
        .send(`Roll Number ${rollnumber} already exists`);
    }
    if (parseInt(emailcount)) {
      // console.log(`Email ${email} already exists`);
      return response.status(409).send(`Email ${email} already exists`);
    }

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
      // console.log(`Suggested new username: ${newUserName}`);
      return response
        .status(409)
        .send(`Username ${username} already exists. Try ${newUserName}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Password hashed successfully");

    const result = await client.query(
      `INSERT INTO Users (username, email, password, rollnumber) VALUES ($1, $2, $3, $4) RETURNING userid, username, email, rollnumber`,
      [username, email, hashedPassword, rollnumber]
    );

    // console.log("User successfully registered:", result.rows[0]);

    request.session.user = {
      userid: parseInt(result.rows[0].userid),
      username: result.rows[0].username,
      email: result.rows[0].email,
      rollnumber: result.rows[0].rollnumber,
    };

    response.cookie("user", `${result.rows[0].username}`, { maxAge: 600000 });
    await client.query("COMMIT");

    return response.status(201).json({
      message: `User ${result.rows[0].username} registered successfully`,
      userid: result.rows[0].userid,
      username: result.rows[0].username,
      email: result.rows[0].email,
      rollnumber: result.rows[0].rollnumber,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    await pool.query("ROLLBACK");
    return response.status(500).send("Server Error");
  }
};

exports.login = async (request, response) => {
    const { email, password, username } = request.body;

    if (!email && !username) {
        return response.status(400).send("Please provide Email or Username");
    }
    if (!password) {
        return response.status(400).send("Please provide Password");
    }

    try {
        const result = await pool.query(
            "SELECT * FROM Users WHERE email = $1 or username = $1",
            [email || username]
        );

        if (!result.rowCount) {
            return response.status(404).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(401).json({ error: "Invalid credentials" });
        }

        // Set session data
        request.session.user = {
            userid: user.userid,
            email: user.email,
            username: user.username,
            role: user.role
        };

        // Save session explicitly and wait for it to complete
        await new Promise((resolve, reject) => {
            request.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    reject(err);
                }
                resolve();
            });
        });

        // Set proper headers
        response.header('Access-Control-Allow-Credentials', 'true');
        response.header('Access-Control-Allow-Origin', 'http://localhost:3000');

        return response.status(200).json({
            message: "Login successful",
            user: {
                userid: user.userid,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return response.status(500).json({ error: "Server error" });
    }
};

exports.forgotPassword = async (request, response) => {
  const {
    body: { rollnumber, username, email },
  } = request;

  if (!rollnumber && !username && !email)
    return response
      .status(400)
      .send("Please provide Roll Number, Username or Email");

  try {
    const result = await pool.query(
      "SELECT userid FROM Users WHERE rollnumber = $1 OR email = $1 OR username = $1",
      [rollnumber || username || email]
    );

    if (!result.rowCount)
      return response.status(401).send("Invalid Credentials");

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 600000).toISOString();

    await pool.query("INSERT INTO ResetPassword VALUES ($1, $2, $3)", [
      result.rows[0].userid,
      token,
      expiry,
    ]);

    return response.status(200).send(`Token: ${token}`);
  } catch (error) {
    console.error(error.message);
    return response.status(500).send("Server Error");
  }
};

exports.resetPassword = async (request, response) => {
  const { newPassword, confirmPassword, token } = request.body;

  if (!newPassword || !confirmPassword || !token)
    return response.status(400).send("Please provide all the fields");

  try {
    const result = await pool.query(
      "SELECT * FROM ResetPassword WHERE reset_token = $1 AND token_expiry > current_timestamp",
      [token]
    );

    if (!result.rowCount)
      return response.status(401).send("Invalid Token or Token Expired");
    if (newPassword !== confirmPassword)
      return response.status(400).send("Passwords do not match");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userId = result.rows[0].userid;

    await pool.query("UPDATE Users SET password = $1 WHERE userid = $2", [
      hashedPassword,
      userId,
    ]);
    await pool.query("DELETE FROM ResetPassword WHERE reset_token = $1", [
      token,
    ]);

    return response.status(200).send("Password Reset Successfully");
  } catch (error) {
    console.error(error.message);
    return response.status(500).send("Server Error");
  }
};

exports.logout = async (request, response) => {
    try {
        request.session.destroy((error) => {
            if (error) {
                console.error('Logout error:', error);
                return response.status(500).send("Server Error");
            }
            
            response.clearCookie('connect.sid');
            return response.status(200).send("Logged Out Successfully");
        });
    } catch (error) {
        console.error('Logout error:', error);
        return response.status(500).send("Server Error");
    }
};

exports.testLogin = async (request, response) => {
  const {
    body: { username, password, email },
  } = request;

  if (!username && !email)
    return response.status(400).send("Please provide Username or Email");

  if (!password) return response.status(400).send("Please provide Password");

  try {
    let res = await pool.query(
      `Select * from Users where username = $1 or email = $1`,
      [username || email]
    );

    if (!res.rowCount) return response.status(404).send("Invalid Credentials");

    const user = res.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return response.status(401).send("Invalid Credentials");

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    return response.status(200).send(`Login Successful! ${accessToken}`);
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({ error: "Server error" });
  }
};
