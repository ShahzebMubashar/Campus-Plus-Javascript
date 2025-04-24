const pool = require("../config/database");

const getRooms = async (request, response) => {
  const {
    params: { roomid },
  } = request;

  try {
    let res;

    if (roomid) {
      console.log("Middleware Request received for roomid:", roomid);

      res = await pool.query(
        `SELECT * FROM viewroommessages1 WHERE roomid = $1`,
        [roomid]
      );

      console.log("Raw DB Response:", res);

      if (!res.rowCount) {
        console.log("No messages found for this room:", roomid);
        return response.status(404).json("No messages found for this room");
      }

      const roomMessages = res.rows;

      console.log("Fetched Room Messages:", roomMessages);

      const structuredResponse = {
        roomid: roomMessages[0].roomid,
        roomname: roomMessages[0].roomname,
        description: roomMessages[0].description,
        messages: roomMessages.map((msg) => ({
          messageid: msg.messageid,
          userid: msg.userid,
          username: msg.username,
          rollnumber: msg.rollnumber,
          content: msg.content,
          posted_at: msg.posted_at,
        })),
      };

      console.log("Structured Response sent to frontend:", structuredResponse);

      return response.status(200).json(structuredResponse);
    }

    // If no roomid provided → Fetch All Rooms
    // console.log("Fetching All Rooms from DB");

    res = await pool.query("SELECT * FROM rooms");

    // console.log("Fetched All Rooms:", res.rows);

    if (!res.rowCount) {
      console.log("No rooms found in DB");
      return response.status(404).json("No rooms found");
    }

    return response.status(200).json(res.rows);
  } catch (error) {
    console.error("Get Rooms Error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const getRoomMessages = async (req, res) => {
  const {
    params: { roomid },
  } = req;

  try {
    const messagesResult = await pool.query(
      `SELECT * from RoomMessages WHERE roomid = $1 and status = 'Approved'order by posted_at desc`,
      [roomid]
    );

    if (messagesResult.rowCount === 0) {
      return res.status(404).json({
        message: "No messages found for this room",
        userRole: req.session.user.role ?? null,
      });
    }

    const commentsResult = await pool.query(
      `SELECT * FROM MessageReplies1 WHERE roomid = $1 order by posted_at`,
      [roomid]
    );
    const structuredResponse = {
      roomid: messagesResult.rows[0].roomid,
      roomname: messagesResult.rows[0].roomname,
      description: messagesResult.rows[0].description,
      messages: messagesResult.rows.map((msg) => ({
        messageid: msg.messageid,
        userid: msg.userid,
        username: msg.username,
        rollnumber: msg.rollnumber,
        content: msg.content,
        posted_at: msg.posted_at,
        comments: commentsResult.rows
          .filter((comment) => comment.messageid === msg.messageid)
          .map((comment) => ({
            commentid: comment.replyid,
            userid: comment.userid,
            username: comment.username,
            rollnumber: comment.rollnumber,
            content: comment.content,
            posted_at: comment.posted_at,
          })),
      })),
    };

    const returnData = {
      data: structuredResponse,
      userRole: req.session?.user?.role ?? null,
    };

    return res.status(200).json(returnData);
  } catch (error) {
    console.error("Error fetching room messages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
    return response.status(400).json("Please provide all required fields");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let res = await client.query(`Select * from Rooms where name = $1`, [
      roomName,
    ]);

    if (res.rowCount) return response.status(400).json("Room already exists");

    res = await client.query(
      `Insert into Rooms (name, description, created_at, created_by)
      values ($1, $2, current_timestamp, $3)`,
      [roomName, description, userid]
    );

    await client.query("COMMIT");

    return response.status(201).json(`Room: ${roomName} created successfully`);
  } catch (error) {
    console.error("Create room error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const joinRoom = async (req, res) => {
  const { roomid } = req.params;
  const { userid } = req.session.user;

  if (!userid || !roomid) {
    return res.status(400).json("User ID and Room ID are required");
  }

  try {
    const result = await pool.query(
      `INSERT INTO RoomMembers (roomid, userid) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [roomid, userid]
    );

    res.status(200).json("Joined successfully");
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json("Server error");
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

    return response.status(200).json("Message sent successfully");
  } catch (error) {
    console.error("Send message error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
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
      return response.status(400).json("Parent message not found");

    await client.query("BEGIN");

    res = await client.query(
      `Insert into Replies (messageid, roomid, userid, content, posted_at)
      values ($1, $2, $3, $4, current_timestamp)`,
      [parentMessage, roomid, userid, message]
    );

    await client.query("COMMIT");

    return response.status(200).json("Reply sent successfully");
  } catch (error) {
    console.error("Send reply error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
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
    return response.status(400).json("Please provide valid status");

  const client = await pool.connect();

  try {
    let res = await client.query(
      `Select * from Messages where messageid = $1`,
      [messageid]
    );

    if (!res.rowCount) return response.status(400).json("Message not found");

    await client.query("BEGIN");

    res = await client.query(
      `Update Messages set status = $1 where messageid = $2 and roomid = $3`,
      [status, messageid, roomid]
    );

    await client.query("COMMIT");

    return response.status(200).json("Message status updated successfully");
  } catch (error) {
    console.error("Process post error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  }
};

const likePost = async (req, res) => {
  const messageid = req.params.messageid;
  const userid = req.session.user.userid;

  try {
    await pool.query(
      `INSERT INTO messagereactions (messageid, userid, reaction_type) VALUES ($1, $2, 'Like')`,
      [messageid, userid]
    );

    const result = await pool.query(
      `SELECT COUNT(*) FROM messagereactions WHERE messageid = $1 AND reaction_type = 'Like'`,
      [messageid]
    );
    const likeCount = result.rows[0].count;

    res.status(200).json({ message: "Like added successfully", likeCount });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Error liking post" });
  }
};

const getLikeCount = async (req, res) => {
  const messageid = req.params.messageid;

  try {
    const result = await pool.query(
      `SELECT messageid, COUNT(*) AS like_count 
       FROM messagereactions 
       WHERE messageid = $1 AND reaction_type = 'Like'
       GROUP BY messageid`,
      [messageid]
    );

    if (result.rows.length > 0) {
      const likeCount = result.rows[0].like_count;
      res.status(200).json({ likeCount });
    } else {
      res.status(200).json({ likeCount: 0 });
    }
  } catch (error) {
    console.error("Error fetching like count:", error);
    res.status(500).json({ message: "Error fetching like count" });
  }
};

const createPost = async (req, res) => {
  const { roomid } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message content cannot be empty" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (roomid, userid, content, posted_at, status) 
           VALUES ($1, $2, $3, NOW(), 'Pending') 
           RETURNING messageid, roomid, userid, content, posted_at, status`,
      [roomid, req.session.user.userid, message]
    );

    return res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Failed to create post" });
  }
};

const LeaveRoom = async (request, response) => {
  const {
    params: { roomid },
    session: {
      user: { userid },
    },
  } = request;
  console.log(`[LEAVE ROOM] Request received for room: ${roomid}`);
  console.log(`[LEAVE ROOM] User ID: ${userid}`);
  if (!roomid) return response.status(400).json("Room ID is required");

  const client = await pool.connect();

  try {
    console.log("Leaving room:", roomid, "for user:", userid);
    client.query(`BEGIN`);
    console.log("Deleting from RoomMembers table");
    let res = await client.query(
      `Delete from RoomMembers where roomid = $1 and userid = $2`,
      [roomid, userid]
    );
    console.log("Deleted from RoomMembers table:", res.rowCount);
    client.query(`COMMIT`);
    console.log("Left room successfully:", roomid, "for user:", userid);
    return response.status(200).json("Left Room Successfully!");
  } catch (error) {
    console.error("Leave room error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const changeRoomDetails = async (request, response) => {
  console.log(`Request: [CHANGE ROOM INFO]`);
  const {
    params: { roomid },
    body: { newName, description },
  } = request;

  console.log(
    `Received: Params: ${roomid}, Body: ${(newName, description)}\n\n`
  );

  if (!newName && !description)
    return response.status(400).json("Enter at least one of the fields");

  const client = await pool.connect();

  try {
    let res = await client.query(`Select * from Rooms where roomid = $1`, [
      roomid,
    ]);

    if (!res.rowCount)
      return response.status(404).json(`Invalid RoomId Entered!`);

    await client.query(`BEGIN`);

    res = await client.query(
      `Update Rooms set name = COALESCE($1, name), description = COALESCE($2, description) where roomid = $3`,
      [newName, description, roomid]
    );

    await client.query(`COMMIT`);

    return response.status(200).json(`Room Details Changed Successfully`);
  } catch (error) {
    console.log(error.message);
    await client.query(`ROLLBACK`);
    return response.status(500).json(`Server Error`);
  } finally {
    if (client) client.release();
  }
};

const deleteRoom = async (request, response) => {
  const {
    params: { roomid },
  } = request;

  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    let res = await client.query(`Delete from Rooms where roomid = $1`, [
      roomid,
    ]);

    await client.query(`COMMIT`);

    return response.status(200).json(`Room Deleted Successfully!`);
  } catch (error) {
    console.log(error.message);
    await client.query(`ROLLBACK`);
    return response.status(500).json(`Server Error`);
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  getRooms,
  createRoom,
  joinRoom,
  sendMessage,
  sendReply,
  LeaveRoom,
  processPost,
  likePost,
  getLikeCount,
  getRoomMessages,
  createPost,
  changeRoomDetails,
  deleteRoom,
};
