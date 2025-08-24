const pool = require("../config/database");

const viewUserInfo = async (request, response) => {
  const userid = request.user.userid; 

  if (!userid) {
    return response.status(401).json({ error: "No user ID found" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM ViewUserInfo1 WHERE userid = $1",
      [userid]
    );

    if (!result.rowCount) {
      return response.status(404).send("User Not Found");
    }

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Database error:", error.message);
    return response.status(500).send("Internal Server Error");
  }
};

const editUserInfo = async (request, response) => {
  const {
    body: { batch, degree, name },
  } = request;

  const userid = request.user.userid; 

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
  const userid = request.user.userid; 

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
    return response.status(500).json(`Internal Server Error`);
  }
};

const addReminder = async (request, response) => {
  const client = await pool.connect();

  try {
    const {
      body: { duedate, content, priority },
    } = request;

    const userid = request.user.userid; 

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

const getReminders = async (request, response) => {
  const userid = request.user.userid; 

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

  const userid = request.user.userid; 

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

  const userid = request.user.userid; 

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
