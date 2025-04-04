const { request } = require("http");
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
    await client.query("ROLLBACK");
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
    await client.query("ROLLBACK");
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
    await client.query("ROLLBACK");
    return response.status(500).send("Server Error");
  } finally {
    if (client) client.release();
  }
};

const sendReply = async (request, response) => {
  const {
    body: { message },
    params: { roomid, parentMessage },
    session: {
      user: { userid },
    },
  } = request;

  const client = await pool.connect();

  try {
    let res = await client.query(
      `Select * from Messages where messageid = $1 and roomid = $2 and status = 'Approved'`,
      [parentMessage, roomid]
    );

    if (!res.rowCount)
      return response.status(400).send("Parent message not found");

    await client.query("BEGIN");

    res = await client.query(
      `Insert into Replies (messageid, roomid, userid, content, posted_at)
      values ($1, $2, $3, $4, current_timestamp)`,
      [parentMessage, roomid, userid, message]
    );

    await client.query("COMMIT");

    return response.status(200).send("Reply sent successfully");
  } catch (error) {
    console.error("Send reply error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).send("Server Error");
  } finally {
    if (client) client.release();
  }
};

const leaveRoom = async (request, response) => {
  const {
    params: { roomid },
    session: {
      user: { userid },
    },
  } = request;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let res = await client.query(
      `Delete from RoomMembers where roomid = $1 and userid = $2`,
      [roomid, userid]
    );

    await client.query("COMMIT");

    return response.status(200).send("Left room successfully");
  } catch (error) {
    console.error("Leave room error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).send("Server Error");
  } finally {
    if (client) client.release();
  }
};

const processPost = async (request, response) => {
  const {
    body: { messageid, status },
    params: { roomid },
  } = request;

  if (status !== "Approved" && status !== "Rejected")
    return response.status(400).send("Please provide valid status");

  const client = await pool.connect();

  try {
    let res = await client.query(
      `Select * from Messages where messageid = $1`,
      [messageid]
    );

    if (!res.rowCount) return response.status(400).send("Message not found");

    await client.query("BEGIN");

    res = await client.query(
      `Update Messages set status = $1 where messageid = $2 and roomid = $3`,
      [status, messageid, roomid]
    );

    await client.query("COMMIT");

    return response.status(200).send("Message status updated successfully");
  } catch (error) {
    console.error("Process post error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).send("Server Error");
  }
};

module.exports = {
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
  sendReply,
  leaveRoom,
  processPost,
};
