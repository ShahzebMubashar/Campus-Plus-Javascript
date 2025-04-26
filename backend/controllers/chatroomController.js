const pool = require("../config/database");

const getRooms = async (request, response) => {
  const {
    params: { roomid },
  } = request;

  try {
    let res;

    if (roomid) {
      res = await pool.query(
        `SELECT * FROM viewroommessages1 WHERE roomid = $1`,
        [roomid]
      );

      if (!res.rowCount)
        return response.status(404).json("No messages found for this room");

      const roomMessages = res.rows;

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

      return response.status(200).json(structuredResponse);
    }

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
    session: {
      user: { role },
    },
  } = req;

  try {
    let messagesResult;

    if (role == "Admin" || role == "Moderator")
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
    else
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
        status: msg.status || "Approved",
        is_pinned: msg.is_pinned,
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
      `Select * from Messages where messageid = $1 and roomid = $2`,
      [parentMessage, roomid]
    );

    if (!res.rowCount)
      return response.status(400).json("Parent message not found");

    await client.query("BEGIN");

    res = await client.query(
      `Insert into Replies (messageid, roomid, userid, content, posted_at)
      values ($1, $2, $3, $4, current_timestamp)
      RETURNING replyid`,
      [parentMessage, roomid, userid, message]
    );

    await client.query("COMMIT");

    return response.status(200).json({
      message: "Reply sent successfully",
      replyid: res.rows[0].replyid
    });
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
    session: {
      user: { role },
    },
  } = request;

  if (role !== "Admin") {
    return response.status(403).json("Only admins can delete posts");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // First delete all replies to this message
    await client.query(
      `DELETE FROM replies WHERE messageid = $1`,
      [messageid]
    );

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
    session: {
      user: { role, userid },
    },
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
    session: {
      user: { role },
    },
  } = request;

  if (role !== "Admin" && role !== "Moderator") {
    return response.status(403).json("Only admins and moderators can pin posts");
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
      `INSERT INTO pinned_posts (messageid, roomid, pinned_by)
       VALUES ($1, $2, $3)`,
      [messageid, roomid, request.session.user.userid]
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
    session: {
      user: { userid },
    },
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
    session: {
      user: { userid },
    },
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
    session: {
      user: { userid },
    },
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
    session: {
      user: { userid },
    },
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
};
