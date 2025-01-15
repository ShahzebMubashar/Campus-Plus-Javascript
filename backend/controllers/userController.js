// const pool = require("../config/database.js");

import pool from "../config/database.js";

export const viewUserInfo = async (request, response) => {
  const {
    session: {
      user: { userid },
    },
  } = request;

  try {
    const result = await pool.query(
      "SELECT * FROM ViewUserInfo WHERE userid = $1",
      [userid]
    );
    if (!result.rowCount) return response.status(404).send("User Not Found");

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    return response.status(500).send("Internal Server Error");
  }
};

export const editUserInfo = async (request, response) => {
  const {
    body: { batch, degree },
    session: {
      user: { userid },
    },
  } = request;

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    await client.query(
      "UPDATE UserInfo SET degree = COALESCE($1, degree), batch = COALESCE($2, batch) WHERE userid = $3",
      [degree, batch, userid]
    );

    await client.query(
      "UPDATE Users SET lasteditted = current_timestamp WHERE userid = $1",
      [userid]
    );
    await client.query("COMMIT");

    return response.status(200).send("Information Updated Successfully");
  } catch (error) {
    console.error(error.message);
    await pool.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  }
};
