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

  let client = await pool.connect();
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

const joinRoom = async (request, response) => {
  const {
    params: { roomid },
    session: {
      user: { userid },
    },
  } = request;

  if (!roomid) return response.status(400).send(`Room ID is required`);

  let client = await pool.connect();

  try {
    let res = await client.query(`Select * from Rooms where roomid = $1`, [roomid]);

    if (!res.rowCount) {
      client.release();
      return response.status(404).send(`Room not found`);
    }
    
    await client.query("BEGIN");

    res = await client.query(
      `Select * from RoomMembers where roomid = $1 and userid = $2`,
      [roomid, userid]
    );

    if (res.rowCount) {
      client.release();
      return response.status(400).send(`You are already a member of this room`);
    }

    res = await client.query(
      `Insert into RoomMembers (roomid, userid)
      values ($1, $2)`,
      [roomid, userid]
    );

    await client.query("COMMIT");
    client.release();

    return response.status(200).send(`Joined Room Successfully`);
  } catch (error) {
    console.log("Error in joinRoom:", error);
    await client.query("ROLLBACK");
    return response.sendStatus(500);
  }
};

const sendMessage = async (request, response) => {
  const {
    body: { message },
    params: { roomid },
    session: {
      user: { userid },
    },
  } = request;

  let client = await pool.connect();

  try {
    await client.query("BEGIN");

    let res = await client.query(
      `Insert into Messages(roomid, userid, content, posted_at)
      values ($1, $2, $3, current_timestamp)`,
      [roomid, userid, message]
    );

    await client.query("COMMIT");
    client.release();

    return response.status(200).send(`Message Sent Successfully`);
  } catch (error) {
    console.log("Error in sendMessage:", error);
    await client.query("ROLLBACK");
    return response.sendStatus(500);
  }
};

module.exports = { getRooms, createRoom, joinRoom, sendMessage };
