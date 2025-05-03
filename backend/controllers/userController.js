const pool = require("../config/database");

const viewUserInfo = async (request, response) => {
  const {
    session: {
      user: { userid },
    },
  } = request;
  console.log(`[ENDPOINT HIT] GET Userinfo\n\n`);

  try {
    const result = await pool.query(
      "SELECT * FROM ViewUserInfo1 WHERE userid = $1",
      [userid]
    );

    console.log(result.rows);

    if (!result.rowCount) return response.status(404).send("User Not Found");

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    return response.status(500).send("Internal Server Error");
  }
};

const editUserInfo = async (request, response) => {
  const {
    body: { batch, degree, name },
    session: {
      user: { userid },
    },
  } = request;

  if (!batch || !degree || !name)
    return response.status(400).json(`Please Enter all the fields`);

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    let res = await client.query(`Select * from UserInfo where userid = $1`, [
      userid,
    ]);

    console.log(`Query Returned: ${res.rows[0]}\nRow Count: ${res.rowCount}`);

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
  }
};

const currentCourses = async (request, response) => {
  const {
    session: {
      user: { userid },
    },
  } = request;
  
  try {
    let res = await pool.query(
      `Select * from ViewTranscripts where userid = $1 and grade = 'I'`,
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

module.exports = { viewUserInfo, editUserInfo, currentCourses };
