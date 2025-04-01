const pool = require("../config/database");

const getRooms = async (request, response) => {
  try {
    const res = await pool.query("SELECT * FROM Rooms");

    if (!res.rowCount) return response.status(404).send("No rooms found");
    return response.status(200).json(res.rows);
  } catch (error) {
    console.error("Get rooms error:", error.message);
    return response.status(500).send("Server Error");
  }
};

const createRoom = async (request, response) => {
  const {
    body: { roomName, description },
    session: {
      user: { userid },
    },
  } = request;

  console.log(`[CREATE ROOM] Request received for room: ${roomName}`);

  if (!roomName || !description)
    return response.status(400).send("Please provide all required fields");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let res = await client.query(`Select * from Rooms where name = $1`, [
      roomName,
    ]);

    if (res.rowCount) return response.status(400).send("Room already exists");

    res = await client.query(
      `Insert into Rooms (name, description, created_at, created_by)
      values ($1, $2, current_timestamp, $3)`,
      [roomName, description, userid]
    );

    await client.query("COMMIT");

    return response.status(201).send(`Room: ${roomName} created successfully`);
  } catch (error) {
    console.error("Create room error:", error.message);
    return response.status(500).send("Server Error");
  } finally {
    if (client) client.release();
  }
};

const joinRoom = async (request, response) => {
  const {
    params: { roomid },
    session: {
      user: { userid },
    },
  } = request;

  try {
    const client = await pool.connect();

    let res = await client.query(
      `Select * from RoomMembers where roomid = $1 and userid = $2`,
      [roomid, userid]
    );

    if (res.rowCount)
      return response.status(400).send("Already a member of this room");

    client.query("BEGIN");

    res = await client.query(
      `Insert into RoomMembers (roomid, userid, joined_at)
      values ($1, $2, current_timestamp)`,
      [roomid, userid]
    );

    await client.query("COMMIT");

    return response.status(201).send(`Joined room successfully`);
  } catch (error) {
    console.error("Join room error:", error.message);
    return response.status(500).send("Server Error");
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let res = await client.query(
      `Insert into Messages (roomid, userid, content, posted_at)
      values ($1, $2, $3, current_timestamp)`,
      [roomid, userid, message]
    );

    await client.query("COMMIT");

    return response.status(200).send("Message sent successfully");
  } catch (error) {
    console.error("Send message error:", error.message);
    return response.status(500).send("Server Error");
  } finally {
    if (client) client.release();
  }
};

module.exports = { getRooms, createRoom, joinRoom, sendMessage };
