const pool = require("../config/database.js");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Please provide all the fields");
  }

  try {
    const client = await pool.connect();

    let newUsername = username;

    // Check if username exists, and suggest an alternative if it does
    while (true) {
      const userCheck = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [newUsername]
      );

      if (userCheck.rowCount === 0) break;

      // Suggest a new username
      newUsername = `${username}${Math.floor(Math.random() * 1000)}`;
    }

    const emailCheck = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rowCount > 0) {
      return res.status(409).send(`Email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [newUsername, email, hashedPassword]
    );

    res.status(201).send(`User ${result.rows[0].username} registered successfully`);
    client.release();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};


exports.login = async (request, response) => {
  const { username, email, password } = request.body;

  if (!username && !email) {
    return response.status(400).send("Please provide username or email");
  }
  if (!password) {
    return response.status(400).send("Please provide password");
  }

  try {
    // Fetch user by username or email
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $1",
      [username || email]
    );

    if (result.rows.length === 0) {
      return response.status(404).send("Invalid Credentials");
    }

    const user = result.rows[0];

    // Debugging logs
    console.log("Plaintext password:", password);
    console.log("Hashed password from DB:", user.password_hash);

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return response.status(401).send("Invalid Credentials");
    }

    // Set session and cookie
    request.session.user = {
      userid: user.id,
      username: user.username,
      email: user.email,
    };

    response.cookie("user", `${user.username}`, { maxAge: 600000 });

    console.log(`Successfully logged in as ${user.username}`);

    return response
      .status(200)
      .send(`Successfully logged in as ${user.username}`);
  } catch (error) {
    console.error(error.message);
    return response.status(500).send("Server Error");
  }
};

