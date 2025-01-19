const pool = require("../config/database");
const {
  checkAuthorisation,
  checkAdmin,
} = require("../middlewares/authMiddleware");

const getRooms = async (request, response) => {
  try {
    let res = await pool.query(`Select * from Rooms`);

    if (!res.rowCount) return response.status(404).send(`No Rooms Available`);

    return response.status(200).json(res.rows);
  } catch (error) {
    console.log("Error in getRooms:", error);
    return response.sendStatus(500);
  }
};

const createRoom = async (request, response) => {
  const {
    body: { roomname, description },
    session: {
      user: { userid },
    },
  } = request;

  let client;
  try {
    await client.query("BEGIN");

    let res = await client.query(`Select * from Rooms where name ilike $1`, [
      roomname,
    ]);

    if (res.rowCount) {
      client.release();
      return response.status(400).send(`Room Name already exists`);
    }

    res = await client.query(
      `Insert into Rooms (name, description, created_at, created_by)
      values ($1, $2, current_timestamp, $3)`,
      [roomname, description, userid]
    );
  } catch (error) {
    console.log("Error in createRoom:", error);
    return response.sendStatus(500);
  }
};

module.exports = { getRooms, createRoom };
