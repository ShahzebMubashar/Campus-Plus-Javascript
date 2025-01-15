// const pool = require("../config/database.js");

import pool from "../config/database.js";

export const getChatrooms = async (request, response) => {
  try {
    console.log("Fetching Chatrooms");
    const result = await pool.query("Select * from Rooms");

    if (!result.rowCount)
      return response.status(404).send("No Chatrooms Available");

    return response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const createChatroom = async (request, response) => {
  const {
    body: { roomName, description },
    session: {
      user: { userid },
    },
  } = request;

  if (!roomName) return response.status(400).send("Chatroom name is required");
  if (!description)
    return response.status(400).send("Chatroom description is required");

  try {
    const res = await pool.query(
      `Insert into Rooms (name, description, created_at, created_by)
        values ($1, $2, current_timestamp, $3) returning *`,
      [roomName, description, userid]
    );

    return response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const joinRoom = async (request, response) => {
  const {
    body: { roomid, chatRoomName },
    session: {
      user: { userid },
    },
  } = request;

  try {
    let client = await pool.connect();

    let res = await client.query(
      `Select * from RoomMembers where userid = $1 and roomid = $2`,
      [userid, roomid]
    );

    if (res.rowCount) return response.status(400).send("Already Joined");

    await client.query("BEGIN");

    res = await client.query(
      `Insert into RoomMembers (roomid, userid, joined_at)
        values ($1, $2, current_timestamp)`,
      [roomid, userid]
    );

    await client.query("COMMIT");

    return response.status(201).json(`Room Joined Successfully`);
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  }
};
