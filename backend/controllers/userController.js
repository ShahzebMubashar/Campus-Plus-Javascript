const pool = require("../config/database");

const viewUserInfo = async (request, response) => {
  console.log("=== VIEW USER INFO ENDPOINT ===");
  console.log("JWT User:", request.user);

  const userid = request.user.userid; // From JWT middleware
  console.log(`[ENDPOINT HIT] GET Userinfo for userid: ${userid}`);

  if (!userid) {
    console.log("❌ No userid found - this should not happen after middleware");
    return response.status(401).json({ error: "No user ID found" });
  }

  try {
    console.log("🔍 Querying database for user:", userid);
    const result = await pool.query(
      "SELECT * FROM ViewUserInfo1 WHERE userid = $1",
      [userid]
    );

    console.log("📊 Database result:", result.rows);
    console.log("📊 Row count:", result.rowCount);

    if (!result.rowCount) {
      console.log("❌ User not found in database");
      return response.status(404).send("User Not Found");
    }

    console.log("✅ User info retrieved successfully");
    console.log("=== END VIEW USER INFO ===");
    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Database error:", error.message);
    console.log("=== END VIEW USER INFO (ERROR) ===");
    return response.status(500).send("Internal Server Error");
  }
};

const editUserInfo = async (request, response) => {
  const {
    body: { batch, degree, name },
  } = request;

  const userid = request.user.userid; // From JWT middleware

  if (!batch || !degree || !name)
    return response.status(400).json(`Please Enter all the fields`);

  try {
    const client = await pool.connect();

    let res = await client.query(`Select * from UserInfo where userid = $1`, [
      userid,
    ]);

    await client.query("BEGIN");

    if (!res.rowCount)
      await client.query(
        `Insert into UserInfo (userid, name, degree, batch) values ($1, $2, $3, $4)`,
        [userid, name, degree, batch]
      );
    else
      await client.query(
        "UPDATE UserInfo SET degree = COALESCE($1, degree), batch = COALESCE($2, batch), name = COALESCE($3, name) WHERE userid = $4",
        [degree, batch, name, userid]
      );

    await client.query(
      "UPDATE Users SET lasteditted = current_timestamp WHERE userid = $1",
      [userid]
    );

    await client.query("COMMIT");

    return response.status(200).json("Information Updated Successfully");
  } catch (error) {
    console.error(error.message);
    await pool.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  } finally {
    if (client) client.release();
  }
};

const currentCourses = async (request, response) => {
  const userid = request.user.userid; // From JWT middleware

  try {
    let res = await pool.query(
      `Select * from ViewTranscripts where userid = $1 and grade = 'I' limit 3`,
      [userid]
    );

    if (!res.rowCount)
      return response
        .status(404)
        .json(`You are not enrolled in any Courses currently`);

    return response.status(200).json(res.rows);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json(`Internal Server Error`);
  }
};

const addReminder = async (request, response) => {
  const client = await pool.connect();

  try {
    const {
      body: { duedate, content, priority },
    } = request;

    const userid = request.user.userid; // From JWT middleware

    await client.query("BEGIN");

    const result = await client.query(
      `Insert into UserTasks (userid, content, priority, duedate, status)
      Values ($1, $2, $3, $4, 'Pending')`,
      [userid, content, priority, duedate]
    );

    if (!result.rowCount) {
      return response.status(500).json({ error: "Failed to Add Task" });
    }

    await client.query("COMMIT");
    return response.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding reminder:", error.message);
    return response.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

// Add this new endpoint to fetch reminders
const getReminders = async (request, response) => {
  const userid = request.user.userid; // From JWT middleware

  try {
    const result = await pool.query(
      `SELECT * FROM UserTasks 
       WHERE userid = $1 
       ORDER BY priority, duedate`,
      [userid]
    );

    if (!result.rowCount) return response.status(404).json("No Upcoming Tasks");

    return response.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching reminders:", error.message);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteReminder = async (request, response) => {
  const {
    params: { reminderid },
  } = request;

  const userid = request.user.userid; // From JWT middleware

  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const res = await client.query(
      `Delete from UserTasks where taskid = $1 and userid = $2`,
      [reminderid, userid]
    );

    await client.query(`COMMIT`);

    return response.status(200).json(`Reminder Deleted Successfully`);
  } catch (error) {
    console.log(error.message);
    await client.query(`ROLLBACK`);
    return response.status(500).json(`Internal Server Error`);
  } finally {
    if (client) client.release();
  }
};

const updatePriority = async (request, response) => {
  const {
    params: { taskid },
    body: { priority, status },
  } = request;

  const userid = request.user.userid; // From JWT middleware

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let res = await client.query(
      `Update UserTasks set priority = COALESCE($1, priority), status = COALESCE($2, status) where userid = $3 and taskid = $4`,
      [priority, status, userid, taskid]
    );

    await client.query("COMMIT");

    return response.status(200).json("Priority Updated Successfully");
  } catch (error) {
    console.log(error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Internal Server Error");
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  viewUserInfo,
  editUserInfo,
  currentCourses,
  addReminder,
  getReminders,
  deleteReminder,
  updatePriority,
};
