const pool = require("../config/database");

const getTranscript = async (request, response) => {
  const {
    session: {
      user: { userid },
    },
  } = request;

  try {
    let res = await pool.query(`Select * from Transcript where userid = $1`, [
      userid,
    ]);

    if (!res.rowCount)
      return response.status(404).send(`No Transcript Available`);

    response.status(200).json(res.rows);
  } catch (error) {
    console.error("Error in getTranscript:", error);
    return response.status(500).send("Internal Server Error");
  }
};

const addCourse = async (request, response) => {
  const {
    body: { courseid, credits, grade, semester },
    session: {
      user: { userid },
    },
  } = request;

  try {
    const client = await pool.connect();

    let res = await client.query(
      `Select * from Transcript where courseid = $1 and userid = $2`,
      [courseid, userid]
    );

    if (res.rowCount)
      return response.status(400).send(`Course already added to transcript!`);

    await client.query("BEGIN");

    res = await client.query(
      `Insert into Transcript (userid, courseid, credits, grade, semester)
        values ($1, $2, $3, $4, $5)`,
      [userid, courseid, credits, grade, semester]
    );

    await client.query("COMMIT");

    return response
      .status(201)
      .send(`Course successfully added to Transcript!`);
  } catch (error) {
    console.error("Error in addCourse:", error);
    await pool.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  }
};

const removeCourse = async (request, response) => {
  const {
    body: { courseid },
    session: {
      user: { userid },
    },
  } = request;

  try {
    const client = await pool.connect();

    let res = await client.query(
      `Select * from Transcript where courseid = $1 and userid = $2`,
      [courseid, userid]
    );

    if (!res.rowCount)
      return response.status(404).send(`Course not found in transcript!`);

    await client.query("BEGIN");

    res = await client.query(
      `Delete from Transcript where courseid = $1 and userid = $2`,
      [courseid, userid]
    );

    await client.query("COMMIT");

    return response
      .status(200)
      .send(`Course successfully removed from Transcript!`);
  } catch (error) {
    console.error("Error in removeCourse:", error);
    await pool.query("ROLLBACK");
    return response.sendStatus(500);
  }
};

const editCourse = async (request, response) => {
  const {
    body: { courseid, credits, grade, semester },
    session: {
      user: { userid },
    },
  } = request;

  try {
    const client = await pool.connect();

    let res = await client.query(
      `Update Transcript 
        set credits = COALESCE($1, credits),
            grade = COALESCE($2, grade),
            semester = COALESCE($3, semester)
            where
            courseid = $4 and userid = $5`,
      [credits, grade, semester, courseid, userid]
    );

    await client.query("COMMIT");

    return response
      .status(200)
      .send(`Course successfully updated in Transcript!`);
  } catch (error) {
    console.error("Error in editCourse:", error);
    await pool.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  }
};

module.exports = { getTranscript, addCourse, removeCourse, editCourse };
