const { request } = require("http");
const pool = require("../config/database");

// const getRooms = async (request, response) => {
//   const {
//     params: { roomid },
//   } = request;

//   try {
//     let res;

//     if (roomid)
//       res = await pool.query(
//         `SELECT * FROM ViewRoomMessages WHERE roomid = $1`,
//         [roomid]
//       );
//     else
//       res = await pool.query("SELECT * FROM Rooms");

//     if (!res.rowCount) return response.status(404).send("No rooms found");

//     // Structure the data
//     if (roomid) {
//       const roomMessages = res.rows;

//       if (roomMessages.length === 0)
//         return response.status(404).send("No messages found for this room");

//       const structuredResponse = {
//         roomid: roomMessages[0].roomid,
//         roomname: roomMessages[0].roomname,
//         description: roomMessages[0].description,
//         messages: roomMessages.map((msg) => ({
//           author: msg.name, // Assuming 'name' is the username
//           rollnumber: msg.rollnumber,
//           content: msg.content,
//           posted_at: msg.posted_at,
//         })),
//       };

//       return response.status(200).json(structuredResponse);
//     }

//     // If no roomid is provided, return the list of rooms
//     return response.status(200).json(res.rows);
//   } catch (error) {
//     console.error("Get rooms error:", error.message);
//     return response.status(500).send("Server Error");
//   }
// };


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
        return response.status(404).send("No messages found for this room");
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
    console.log("Fetching All Rooms from DB");

    res = await pool.query("SELECT * FROM rooms");

    console.log("Fetched All Rooms:", res.rows);

    if (!res.rowCount) {
      console.log("No rooms found in DB");
      return response.status(404).send("No rooms found");
    }

    return response.status(200).json(res.rows);
  } catch (error) {
    console.error("Get Rooms Error:", error.message);
    return response.status(500).send("Server Error");
  }
};

// const getRoomMessages = async (req, res) => {
//   const { roomid } = req.params;  // Extract roomid from the URL params
//   console.log("Fetching posts for room:", roomid);

//   try {
//     const result = await pool.query(
//       `SELECT * from viewroommessages1 WHERE roomid = $1 `,
//       [roomid]
//     );

//     console.log("Fetched from DB:", result.rows);

//     if (result.rowCount === 0) {
//       return res.status(404).send("No messages found for this room");
//     }

//     const structuredResponse = {
//       roomid: result.rows[0].roomid,
//       roomname: result.rows[0].roomname,
//       description: result.rows[0].description,
//       messages: result.rows.map((msg) => ({
//         messageid: msg.messageid,
//         userid: msg.userid,
//         username: msg.username,
//         rollnumber: msg.rollnumber,
//         content: msg.content,
//         posted_at: msg.posted_at,
//       })),
//     };

//     console.log("Structured Response sent to frontend:", structuredResponse);
//     return res.status(200).json(structuredResponse);

//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


const getRoomMessages = async (req, res) => {
  const { roomid } = req.params;

  try {
    // Fetch messages from the room
    const messagesResult = await pool.query(
      `SELECT * from viewroommessages1 WHERE roomid = $1`,
      [roomid]
    );

    if (messagesResult.rowCount === 0) {
      return res.status(404).send("No messages found for this room");
    }

    // Fetch comments (replies) for each message
    const commentsResult = await pool.query(
      `SELECT * FROM Replies WHERE roomid = $1`,
      [roomid]
    );

    // Structure the response to include comments for each post
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
          .filter((comment) => comment.messageid === msg.messageid)  // Only include comments for this message
          .map((comment) => ({
            commentid: comment.replyid,
            userid: comment.userid,
            content: comment.content,
            posted_at: comment.posted_at,
          })),
      })),
    };

    return res.status(200).json(structuredResponse);
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

// const joinRoom = async (request, response) => {
//   const {
//     params: { roomid },
//     session: {
//       user: { userid },
//     },
//   } = request;

//   try {
//     const client = await pool.connect();

//     let res = await client.query(
//       `Select * from RoomMembers where roomid = $1 and userid = $2`,
//       [roomid, userid]
//     );

//     if (res.rowCount)
//       return response.status(400).send("Already a member of this room");

//     client.query("BEGIN");

//     res = await client.query(
//       `Insert into RoomMembers (roomid, userid, joined_at)
//       values ($1, $2, current_timestamp)`,
//       [roomid, userid]
//     );

//     await client.query("COMMIT");

//     return response.status(201).send(`Joined room successfully`);
//   } catch (error) {
//     console.error("Join room error:", error.message);
//     await client.query("ROLLBACK");
//     return response.status(500).send("Server Error");
//   }
// };


const joinRoom = async (req, res) => {
  const { roomid } = req.params;
  const { userid } = req.session.user;

  if (!userid || !roomid) {
    return res.status(400).send("User ID and Room ID are required");
  }

  try {
    const result = await pool.query(
      `INSERT INTO RoomMembers (roomid, userid) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [roomid, userid]
    );

    res.status(200).send("Joined successfully");
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).send("Server error");
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

// Like a Post
const likePost = async (req, res) => {
  const messageid = req.params.messageid;
  const userid = req.session.user.userid; // Retrieve user ID from session

  // if (!userid) {
  //   console.log('[AUTH] User not authenticated');
  //   return res.status(401).send("User is not authenticated");
  // }

  try {
    // Insert the like
    await pool.query(
      `INSERT INTO messagereactions (messageid, userid, reaction_type) VALUES ($1, $2, 'Like')`,
      [messageid, userid]
    );

    // Get the updated like count
    const result = await pool.query(
      `SELECT COUNT(*) FROM messagereactions WHERE messageid = $1 AND reaction_type = 'Like'`,
      [messageid]
    );
    const likeCount = result.rows[0].count;

    // Return the updated like count
    res.status(200).json({ message: 'Like added successfully', likeCount });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).send({ message: 'Error liking post' });
  }
};


// Get the Number of Likes for a Post
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
    res.status(500).send({ message: 'Error fetching like count' });
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
  likePost,
  getLikeCount,
  getRoomMessages
};
