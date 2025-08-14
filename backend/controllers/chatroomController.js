const transporter = require("../controllers/Mailer").transporter;
const pool = require("../config/database");

const getRooms = async (request, response) => {
  const {
    params: { roomid },
  } = request;

  try {
    let res;

    if (roomid) {
      // Get room details and all messages with their replies
      res = await pool.query(
        `SELECT 
          r.roomid, r.roomname, r.description,
          m.messageid, m.userid as message_userid, m.username as message_username, 
          m.rollnumber as message_rollnumber, m.content as message_content, 
          m.posted_at as message_posted_at,
          re.replyid, re.userid as reply_userid, re.username as reply_username,
          re.rollnumber as reply_rollnumber, re.content as reply_content,
          re.posted_at as reply_posted_at, re.parent_reply_id
        FROM rooms r
        LEFT JOIN messages m ON m.roomid = r.roomid
        LEFT JOIN messagereplies1 re ON re.messageid = m.messageid
        WHERE r.roomid = $1
        ORDER BY m.posted_at, re.posted_at`,
        [roomid]
      );

      if (!res.rowCount) {
        return response.status(404).json("No messages found for this room");
      }

      // Structure the response with nested replies
      const roomData = {
        roomid: res.rows[0].roomid,
        roomname: res.rows[0].roomname,
        description: res.rows[0].description,
        messages: [],
      };

      // Create a map for messages and replies
      const messagesMap = new Map();
      const repliesMap = new Map();

      res.rows.forEach((row) => {
        // Process messages
        if (row.messageid && !messagesMap.has(row.messageid)) {
          messagesMap.set(row.messageid, {
            messageid: row.messageid,
            userid: row.message_userid,
            username: row.message_username,
            rollnumber: row.message_rollnumber,
            content: row.message_content,
            posted_at: row.message_posted_at,
            replies: [], // Initialize empty array for replies
          });
        }

        // Process replies
        if (row.replyid) {
          const reply = {
            replyid: row.replyid,
            userid: row.reply_userid,
            username: row.reply_username,
            rollnumber: row.reply_rollnumber,
            content: row.reply_content,
            posted_at: row.reply_posted_at,
            parent_reply_id: row.parent_reply_id,
            replies: [], // For nested replies
          };

          repliesMap.set(row.replyid, reply);
        }
      });

      // Build the reply hierarchy
      repliesMap.forEach((reply) => {
        if (reply.parent_reply_id) {
          // This is a nested reply, add to its parent
          const parentReply = repliesMap.get(reply.parent_reply_id);
          if (parentReply) {
            parentReply.replies.push(reply);
          }
        } else {
          // Top-level reply, add to its message
          const message = messagesMap.get(row.messageid);
          if (message) {
            message.replies.push(reply);
          }
        }
      });

      // Convert messages map to array and sort by posted_at
      roomData.messages = Array.from(messagesMap.values()).sort(
        (a, b) => new Date(a.posted_at) - new Date(b.posted_at)
      );

      return response.status(200).json(roomData);
    }

    // Handle case when no roomid is provided (get all rooms)
    res = await pool.query("SELECT * FROM rooms");
    if (!res.rowCount) return response.status(404).json("No rooms found");
    return response.status(200).json(res.rows);
  } catch (error) {
    console.error("Get Rooms Error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const getRoomMessages = async (req, res) => {
  const {
    params: { roomid },
    user: { role },
  } = req;

  try {
    let messagesResult;

    if (role === "Admin" || role === "Moderator") {
      messagesResult = await pool.query(
        `SELECT m.*, u.username, u.rollnumber, 
                CASE WHEN pp.pinid IS NOT NULL THEN true ELSE false END as is_pinned
         FROM messages m
         JOIN users u ON m.userid = u.userid
         LEFT JOIN pinned_posts pp ON m.messageid = pp.messageid AND m.roomid = pp.roomid
         WHERE m.roomid = $1
         ORDER BY 
           CASE WHEN pp.pinid IS NOT NULL THEN 0 ELSE 1 END,
           m.posted_at DESC`,
        [roomid]
      );
    } else {
      messagesResult = await pool.query(
        `SELECT m.*, u.username, u.rollnumber,
                CASE WHEN pp.pinid IS NOT NULL THEN true ELSE false END as is_pinned
         FROM messages m
         JOIN users u ON m.userid = u.userid
         LEFT JOIN pinned_posts pp ON m.messageid = pp.messageid AND m.roomid = pp.roomid
         WHERE m.roomid = $1 AND m.status = 'Approved'
         ORDER BY 
           CASE WHEN pp.pinid IS NOT NULL THEN 0 ELSE 1 END,
           m.posted_at DESC`,
        [roomid]
      );
    }

    if (messagesResult.rowCount === 0) {
      return res.status(404).json({
        message: "No messages found for this room",
        userRole: req.user?.role ?? null,
      });
    }

    // Fetch replies using the nested view
    const commentsResult = await pool.query(
      `SELECT * FROM MESSAGEREPLIES WHERE roomid = $1 ORDER BY posted_at`,
      [roomid]
    );

    // Step 1: Group replies by messageId
    const repliesByMessage = {};
    for (const reply of commentsResult.rows) {
      if (!repliesByMessage[reply.messageid]) {
        repliesByMessage[reply.messageid] = [];
      }
      repliesByMessage[reply.messageid].push(reply);
    }

    // Step 2: Build nested replies for a given flat list
    function buildReplyTree(flatReplies) {
      const replyMap = {};
      const rootReplies = [];

      // Initialize map
      for (const reply of flatReplies) {
        reply.replies = [];
        replyMap[reply.replyid] = reply;
      }

      // Assign children to their parents
      for (const reply of flatReplies) {
        if (reply.parent_reply_id) {
          const parent = replyMap[reply.parent_reply_id];
          if (parent) {
            parent.replies.push(reply);
          } else {
            // Orphaned reply (parent not found), treat as root-level
            rootReplies.push(reply);
          }
        } else {
          rootReplies.push(reply);
        }
      }

      return rootReplies;
    }

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
        status: msg.status || "Approved",
        is_pinned: msg.is_pinned,
        comments: buildReplyTree(repliesByMessage[msg.messageid] || []).map(
          cleanReply
        ),
      })),
    };

    const returnData = {
      data: structuredResponse,
      userRole: req.user?.role ?? null,
    };

    return res.status(200).json(returnData);
  } catch (error) {
    console.error("Error fetching room messages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper to clean and structure reply
function cleanReply(reply) {
  return {
    commentid: reply.replyid,
    parent_reply_id: reply.parent_reply_id,
    userid: reply.userid,
    username: reply.username,
    rollnumber: reply.rollnumber,
    content: reply.content,
    posted_at: reply.posted_at,
    reply_count: reply.reply_count,
    parent_author_name: reply.parent_author_name,
    replies: reply.replies?.map(cleanReply) || [],
  };
}

const createRoom = async (request, response) => {
  const {
    body: { roomName, description },
    user: { userid },
  } = request;

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

    transporter.sendMail({
      from: "CampusPlus",
      
    })

    return response.status(201).json(`Room: ${roomName} created successfully`);
  } catch (error) {
    console.error("Create room error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const joinRoom = async (request, response) => {
  const {
    params: { roomid },
    user: { userid },
  } = request;

  if (!userid || !roomid) {
    return res.status(400).json("User ID and Room ID are required");
  }

  const client = await pool.connect();

  try {
    let res = await pool.query(
      `Select * from RoomMembers where userid = $1 and roomid = $2`,
      [userid, roomid]
    );

    if (res.rowCount)
      return response.status(200).json(`Already A Member of the Room!`);

    await client.query("BEGIN");

    res = await client.query(
      `Insert into RoomMembers (userid, roomid) Values ($1, $2)`,
      [userid, roomid]
    );

    await client.query("COMMIT");

    return response.status(200).json("Joined successfully");
  } catch (error) {
    console.error("Error joining room:", error);
    return response.status(500).json("Server error");
  } finally {
    if (client) client.release();
  }
};

const sendMessage = async (request, response) => {
  const {
    body: { message, parent_reply_id = null, messageid = null },
    params: { roomid },
    user: { userid },
  } = request;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (messageid) {
      // It's a reply
      await client.query(
        `INSERT INTO Replies (messageid, userid, content, posted_at, parent_reply_id)
         VALUES ($1, $2, $3, current_timestamp, $4)`,
        [messageid, userid, message, parent_reply_id]
      );
    } else {
      // It's a top-level message
      await client.query(
        `INSERT INTO Messages (roomid, userid, content, posted_at)
         VALUES ($1, $2, $3, current_timestamp)`,
        [roomid, userid, message]
      );
    }

    await client.query("COMMIT");
    return response.status(200).json("Message sent successfully");
  } catch (error) {
    console.error("Send message error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    client.release();
  }
};

const sendReply = async (request, response) => {
  const {
    body: { message, parent_reply_id = null },
    params: { roomid, parentMessage }, // parentMessage is the messageid
    user: { userid },
  } = request;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validate parent message exists and belongs to the room
    const messageCheck = await client.query(
      `SELECT * FROM Messages WHERE messageid = $1 AND roomid = $2`,
      [parentMessage, roomid]
    );

    if (!messageCheck.rowCount) {
      await client.query("ROLLBACK");
      return response.status(400).json("Parent message not found");
    }

    // If replying to another reply, validate it belongs to same message
    if (parent_reply_id !== null) {
      const replyCheck = await client.query(
        `SELECT * FROM Replies WHERE replyid = $1 AND messageid = $2`,
        [parent_reply_id, parentMessage]
      );

      if (!replyCheck.rowCount) {
        await client.query("ROLLBACK");
        return response
          .status(400)
          .json("Parent reply not found or doesn't belong to the same message");
      }
    }

    const insertResult = await client.query(
      `INSERT INTO Replies (messageid, userid, content, posted_at, parent_reply_id)
       VALUES ($1, $2, $3, current_timestamp, $4)
       RETURNING replyid`,
      [parentMessage, userid, message, parent_reply_id]
    );

    await client.query("COMMIT");

    return response.status(200).json({
      message: "Reply sent successfully",
      replyid: insertResult.rows[0].replyid,
    });
  } catch (error) {
    console.error("Send reply error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    client.release();
  }
};

const addnestedReply = async (request, response) => {
  console.log("ADDING NESTED\n\n\n\n\n\n\n");
  const {
    params: { roomid, parentReplyId },
    body: { content },
    user: { userid },
  } = request;

  const client = await pool.connect();

  try {
    let res = await pool.query("Select * from Replies where replyid = $1", [
      parentReplyId,
    ]);

    if (!res.rowCount) return response.status(404).json("Reply Not Found");

    const parentMessageId = res.rows[0].messageid;

    await client.query("BEGIN");

    res = await client.query(
      `Insert into Replies (messageid, roomid, userid, content, posted_at, parent_reply_id)
      Values ($1, $2, $3, $4, current_timestamp, $5)`,
      [parentMessageId, roomid, userid, content, parentReplyId]
    );

    await client.query("COMMIT");

    return response.status(200).json("Successfully Sent Reply");
  } catch (error) {
    console.log(error.message);
    await client.query("ROlLBACK");
    return response.status(500).json("Internal Server Error");
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

    if (status == "Rejected")
      res = await client.query(
        `Delete from Messages where messageid = $1 and roomid = $2`,
        [messageid, roomid]
      );
    else
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
  const {
    params: { messageid },
    user: { userid },
  } = req;

  try {
    await pool.query(
      `INSERT INTO messagereactions (messageid, userid, reaction_type) VALUES ($1, $2, 'Like')
      on conflict
      do nothing
      returning *`,
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
      [roomid, req.user.userid, message]
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
    user: { userid },
  } = request;

  if (!roomid) return response.status(400).json("Room ID is required");

  const client = await pool.connect();

  try {
    client.query(`BEGIN`);

    let res = await client.query(
      `Delete from RoomMembers where roomid = $1 and userid = $2`,
      [roomid, userid]
    );

    client.query(`COMMIT`);

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
  const {
    params: { roomid },
    body: { newName, description },
  } = request;

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

const deletePost = async (request, response) => {
  const {
    params: { roomid, messageid },
    user: { role },
  } = request;

  if (role !== "Admin") {
    return response.status(403).json("Only admins can delete posts");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // First delete all replies to this message
    await client.query(`DELETE FROM replies WHERE messageid = $1`, [messageid]);

    // Then delete the message
    const res = await client.query(
      `DELETE FROM messages WHERE messageid = $1 AND roomid = $2`,
      [messageid, roomid]
    );

    if (!res.rowCount) {
      return response.status(404).json("Message not found");
    }

    await client.query("COMMIT");
    return response.status(200).json("Message deleted successfully");
  } catch (error) {
    console.error("Delete post error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const getPost = async (request, response) => {
  const {
    params: { roomid, messageid },
  } = request;

  try {
    const postResult = await pool.query(
      `SELECT m.*, u.username, u.rollnumber, r.name as roomname, r.description
       FROM messages m
       JOIN users u ON m.userid = u.userid
       JOIN rooms r ON m.roomid = r.roomid
       WHERE m.messageid = $1 AND m.roomid = $2`,
      [messageid, roomid]
    );

    if (!postResult.rowCount) {
      return response.status(404).json("Post not found");
    }

    const repliesResult = await pool.query(
      `SELECT r.*, u.username, u.rollnumber
       FROM replies r
       JOIN users u ON r.userid = u.userid
       WHERE r.messageid = $1
       ORDER BY r.posted_at ASC`,
      [messageid]
    );

    const post = {
      ...postResult.rows[0],
      replies: repliesResult.rows,
    };

    return response.status(200).json(post);
  } catch (error) {
    console.error("Get post error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const editPost = async (request, response) => {
  const {
    params: { roomid, messageid },
    body: { content },
    user: { role, userid },
  } = request;

  const client = await pool.connect();

  try {
    // Check if the post exists and get its details
    let res = await client.query(
      `SELECT * FROM messages WHERE messageid = $1 AND roomid = $2`,
      [messageid, roomid]
    );

    if (!res.rowCount) {
      return response.status(404).json("Post not found");
    }

    const post = res.rows[0];

    // Check if user is authorized to edit
    if (role !== "Admin" && post.userid !== userid) {
      return response.status(403).json("You can only edit your own posts");
    }

    await client.query("BEGIN");

    // Save the old content to edit history
    await client.query(
      `INSERT INTO message_edits (messageid, userid, old_content)
       VALUES ($1, $2, $3)`,
      [messageid, userid, post.content]
    );

    // Update the post content
    res = await client.query(
      `UPDATE messages SET content = $1 WHERE messageid = $2 AND roomid = $3`,
      [content, messageid, roomid]
    );

    await client.query("COMMIT");

    return response.status(200).json("Post updated successfully");
  } catch (error) {
    console.error("Edit post error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const getPostEditHistory = async (request, response) => {
  const {
    params: { messageid },
  } = request;

  try {
    const res = await pool.query(
      `SELECT me.*, u.username
       FROM message_edits me
       JOIN users u ON me.userid = u.userid
       WHERE me.messageid = $1
       ORDER BY me.edited_at DESC`,
      [messageid]
    );

    return response.status(200).json(res.rows);
  } catch (error) {
    console.error("Get post edit history error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const pinPost = async (request, response) => {
  const {
    params: { roomid, messageid },
    user: { role, userid },
  } = request;

  if (role !== "Admin" && role !== "Moderator") {
    return response
      .status(403)
      .json("Only admins and moderators can pin posts");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the post is already pinned
    let res = await client.query(
      `SELECT * FROM pinned_posts WHERE messageid = $1 AND roomid = $2`,
      [messageid, roomid]
    );

    if (res.rowCount) {
      // Unpin the post
      await client.query(
        `DELETE FROM pinned_posts WHERE messageid = $1 AND roomid = $2`,
        [messageid, roomid]
      );
      await client.query("COMMIT");
      return response.status(200).json("Post unpinned successfully");
    }

    // Pin the post
    await client.query(
      `INSERT INTO pinned_posts (messageid, roomid, userid)
       VALUES ($1, $2, $3)`,
      [messageid, roomid, userid]
    );

    await client.query("COMMIT");
    return response.status(200).json("Post pinned successfully");
  } catch (error) {
    console.error("Pin post error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const reportPost = async (request, response) => {
  const {
    params: { messageid },
    body: { reason },
    user: { userid },
  } = request;

  try {
    const res = await pool.query(
      `INSERT INTO post_reports (messageid, reporterid, reason)
       VALUES ($1, $2, $3)
       RETURNING reportid`,
      [messageid, userid, reason]
    );

    return response.status(201).json({
      message: "Post reported successfully",
      reportid: res.rows[0].reportid,
    });
  } catch (error) {
    console.error("Report post error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const createPoll = async (request, response) => {
  const {
    params: { roomid },
    body: { question, options, isMultipleChoice, endTime },
    user: { userid },
  } = request;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create the post first
    const postRes = await client.query(
      `INSERT INTO messages (roomid, userid, content, posted_at)
       VALUES ($1, $2, $3, current_timestamp)
       RETURNING messageid`,
      [roomid, userid, question]
    );

    const messageid = postRes.rows[0].messageid;

    // Create the poll
    await client.query(
      `INSERT INTO post_polls (messageid, question, options, is_multiple_choice, end_time)
       VALUES ($1, $2, $3, $4, $5)`,
      [messageid, question, JSON.stringify(options), isMultipleChoice, endTime]
    );

    await client.query("COMMIT");

    return response.status(201).json({
      message: "Poll created successfully",
      messageid,
    });
  } catch (error) {
    console.error("Create poll error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const votePoll = async (request, response) => {
  const {
    params: { pollid },
    body: { selectedOptions },
    user: { userid },
  } = request;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the poll is still active
    const pollRes = await client.query(
      `SELECT * FROM post_polls WHERE pollid = $1 AND (end_time IS NULL OR end_time > CURRENT_TIMESTAMP)`,
      [pollid]
    );

    if (!pollRes.rowCount) {
      return response.status(400).json("Poll is closed or not found");
    }

    // Check if user has already voted
    const voteRes = await client.query(
      `SELECT * FROM poll_votes WHERE pollid = $1 AND userid = $2`,
      [pollid, userid]
    );

    if (voteRes.rowCount) {
      return response.status(400).json("You have already voted in this poll");
    }

    // Record the vote
    await client.query(
      `INSERT INTO poll_votes (pollid, userid, selected_options)
       VALUES ($1, $2, $3)`,
      [pollid, userid, JSON.stringify(selectedOptions)]
    );

    await client.query("COMMIT");

    return response.status(200).json("Vote recorded successfully");
  } catch (error) {
    console.error("Vote poll error:", error.message);
    await client.query("ROLLBACK");
    return response.status(500).json("Server Error");
  } finally {
    if (client) client.release();
  }
};

const trackPostView = async (request, response) => {
  const {
    params: { messageid },
    user: { userid },
  } = request;

  try {
    await pool.query(
      `INSERT INTO post_views (messageid, userid)
       VALUES ($1, $2)
       ON CONFLICT (messageid, userid) DO NOTHING`,
      [messageid, userid]
    );

    return response.status(200).json("View tracked successfully");
  } catch (error) {
    console.error("Track view error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const searchPosts = async (request, response) => {
  const {
    params: { roomid },
    query: { keyword, username, date },
    user: { role },
  } = request;

  try {
    let query = `
      SELECT m.*, u.username, u.rollnumber,
             CASE WHEN pp.pinid IS NOT NULL THEN true ELSE false END as is_pinned,
             COUNT(DISTINCT pv.userid) as view_count
      FROM messages m
      JOIN users u ON m.userid = u.userid
      LEFT JOIN pinned_posts pp ON m.messageid = pp.messageid AND m.roomid = pp.roomid
      LEFT JOIN post_views pv ON m.messageid = pv.messageid
      WHERE m.roomid = $1
    `;

    const queryParams = [roomid];
    let paramCount = 1;

    if (keyword) {
      paramCount++;
      query += ` AND (m.content ILIKE $${paramCount} OR u.username ILIKE $${paramCount})`;
      queryParams.push(`%${keyword}%`);
    }

    if (username) {
      paramCount++;
      query += ` AND u.username ILIKE $${paramCount}`;
      queryParams.push(`%${username}%`);
    }

    if (date) {
      paramCount++;
      query += ` AND DATE(m.posted_at) = $${paramCount}`;
      queryParams.push(date);
    }

    if (role !== "Admin" && role !== "Moderator") {
      query += ` AND m.status = 'Approved'`;
    }

    query += `
      GROUP BY m.messageid, u.username, u.rollnumber, pp.pinid
      ORDER BY 
        CASE WHEN pp.pinid IS NOT NULL THEN 0 ELSE 1 END,
        m.posted_at DESC
    `;

    console.log("Search query:", query);
    console.log("Query params:", queryParams);

    const result = await pool.query(query, queryParams);

    const structuredResponse = {
      roomid,
      messages: result.rows.map((msg) => ({
        messageid: msg.messageid,
        userid: msg.userid,
        username: msg.username,
        rollnumber: msg.rollnumber,
        content: msg.content,
        posted_at: msg.posted_at,
        status: msg.status || "Approved",
        is_pinned: msg.is_pinned,
        view_count: msg.view_count || 0,
      })),
    };

    return response.status(200).json(structuredResponse);
  } catch (error) {
    console.error("Search posts error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const getUserJoinedGroups = async (request, response) => {
  const {
    user: { userid },
  } = request;

  try {
    const result = await pool.query(
      `SELECT r.*, 
              COUNT(DISTINCT rm.userid) as member_count,
              COUNT(DISTINCT m.messageid) as post_count
       FROM rooms r
       JOIN roommembers rm ON r.roomid = rm.roomid
       LEFT JOIN messages m ON r.roomid = m.roomid
       WHERE rm.userid = $1
       GROUP BY r.roomid, r.name, r.description, r.created_at, r.created_by
       ORDER BY r.name ASC`,
      [userid]
    );

    // Transform the response to match the expected format
    const transformedGroups = result.rows.map((group) => ({
      roomid: group.roomid,
      roomname: group.name, // Map 'name' to 'roomname'
      description: group.description,
      created_at: group.created_at,
      member_count: group.member_count,
      post_count: group.post_count,
    }));

    return response.status(200).json(transformedGroups);
  } catch (error) {
    console.error("Get user joined groups error:", error.message);
    return response.status(500).json("Server Error");
  }
};

const myRooms = async (request, response) => {
  const {
    params: { userid },
  } = request;

  try {
    let res = await pool.query(
      `Select * from Rooms r
      left join RoomMembers rm on rm.roomid = r.roomid
      where userid = $1
      limit 3
      `,
      [userid]
    );

    if (!res.rowCount)
      return response.status(404).json("You have not joined any rooms yet!");

    console.log(res.rows);

    return response.status(200).json(res.rows);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json("Internal Server Error");
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
  deletePost,
  getPost,
  editPost,
  getPostEditHistory,
  pinPost,
  reportPost,
  createPoll,
  votePoll,
  trackPostView,
  searchPosts,
  getUserJoinedGroups,
  myRooms,
  addnestedReply,
};
