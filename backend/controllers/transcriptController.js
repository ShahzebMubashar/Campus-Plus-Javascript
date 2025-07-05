const pool = require("../config/database");

const getTranscript = async (request, response) => {
  const userid = request.userid; // From unifiedAuthMiddleware

  try {
    const res = await pool.query(
      `SELECT * FROM ViewTranscripts WHERE userid = $1`,
      [userid]
    );

    if (!res.rowCount)
      return response.status(404).json(`Transcript Not Found!`);

    const organizedTranscript = res.rows.reduce((acc, course) => {
      const semester = course.semestername;

      if (!acc[semester]) acc[semester] = [];

      acc[semester].push({
        id: course.transcriptid,
        code: course.coursecode,
        name: course.coursename,
        credits: course.credits,
        grade: course.grade,
      });
      return acc;
    }, {});

    const formattedTranscript = Object.entries(organizedTranscript).map(
      ([semester, courses]) => ({
        id: semester,
        name: semester,
        courses,
      })
    );

    return response.status(200).json(formattedTranscript);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json(`Internal Server Error`);
  }
};

const addCourse = async (request, response) => {
  const {
    body: { coursecode, credits, grade, semester },
  } = request;

  const userid = request.userid; // From unifiedAuthMiddleware

  if (!coursecode || !credits || !grade || !semester)
    return response.status(400).json(`Enter all the fields`);

  const client = await pool.connect();

  try {
    let res = await client.query(
      "Select * from Courses where coursecode = $1",
      [coursecode]
    );

    if (!res.rowCount) return response.status(404).json(`Course Not Found!`);

    const courseid = res.rows[0].courseid;

    res = await client.query(`Select * from Semesters where name = $1`, [
      semester,
    ]);

    if (!res.rowCount) return response.status(404).json(`Semester Not Found`);

    const semesterid = res.rows[0].semesterid;

    res = await client.query(
      `Select * from Transcript where userid = $1 and courseid = $2`,
      [userid, courseid]
    );

    if (res.rowCount) return response.status(400).json(`Course Already Added!`);

    await client.query(`BEGIN`);

    res = await client.query(
      `Insert into Transcript (userid, courseid, credits, grade, semesterid)
        values ($1, $2, $3, $4, $5)`,
      [userid, courseid, credits, grade, semesterid]
    );

    await client.query(`COMMIT`);

    return response.status(200).json(`Course Added Successfully`);
  } catch (error) {
    console.log(error.message);
    await client.query(`ROLLBACK`);
    return response.status(500).json(`Internal Server Error`);
  } finally {
    if (client) client.release();
  }
};

const addSemester = async (request, response) => {
  const {
    body: { name },
  } = request;

  const userid = request.userid; // From unifiedAuthMiddleware

  if (!name) {
    return response.status(400).json({ error: "Semester name is required" });
  }

  const client = await pool.connect();

  try {
    let checkResult = await client.query(
      `Select * from ViewTranscripts where semestername = $1 and userid = $2`,
      [name, userid]
    );
    console.log(checkResult.rows);

    if (checkResult.rowCount)
      return response.status(400).json(`Semester Already Exists!`);

    checkResult = await client.query(
      "SELECT * FROM semesters WHERE name = $1",
      [name]
    );

    if (checkResult.rowCount > 0) {
      return response.status(200).json({
        id: checkResult.rows[0].id,
        name: checkResult.rows[0].name,
        courses: [],
      });
    }

    const result = await client.query(
      "INSERT INTO semesters (name) VALUES ($1) RETURNING *",
      [name]
    );

    return response.status(200).json({
      id: result.rows[0].id,
      name: result.rows[0].name,
      courses: [],
    });
  } catch (error) {
    console.error("Error adding semester:", error);
    return response.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

const removeCourse = async (request, response) => {
  const {
    params: { transcriptId },
  } = request;

  const userid = request.userid; // From unifiedAuthMiddleware

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const res = await client.query(
      `DELETE FROM Transcript 
       WHERE transcriptid = $1 AND userid = $2 
       RETURNING *`,
      [transcriptId, userid]
    );

    if (res.rowCount === 0) {
      return response.status(404).json(`Course not found in transcript`);
    }

    await client.query("COMMIT");
    return response.status(200).json(`Deleted Course Successfully!`);
  } catch (error) {
    console.log(error.message);
    await client.query("ROLLBACK");
    return response.status(500).json(`Internal Server Error`);
  } finally {
    if (client) client.release();
  }
};

const removeSemester = async (request, response) => {
  const {
    params: { semestername },
  } = request;

  const userid = request.userid; // From unifiedAuthMiddleware

  const client = await pool.connect();

  try {
    let res = await client.query(`Select * from Semesters where name = $1`, [
      semestername,
    ]);

    if (!res.rowCount)
      return response.status(404).json(`Invalid Semester Name`);

    const semesterid = res.rows[0].semesterid;

    await client.query(`BEGIN`);

    res = await client.query(
      `Delete from Transcript where semesterid = $1 and userid = $2`,
      [semesterid, userid]
    );

    await client.query(`COMMIT`);

    return response.status(200).json(`Semester Removed Successfully!`);
  } catch (error) {
    console.log(error.message);
    await client.query("ROLLBACK");
    return response.status(500).json(`Internal Server Error`);
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  addCourse,
  getTranscript,
  addSemester,
  removeCourse,
  removeSemester,
};
