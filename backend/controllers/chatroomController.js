const pool = require("../config/database");
// const {
//   checkAuthorisation,
//   checkAdmin,
// } = require("../middlewares/authMiddleware");

// const getRooms = async (request, response) => {
//   try {
//     const res = await pool.query(`SELECT * FROM Rooms ORDER BY created_at DESC`)

//     if (!res.rowCount) return response.status(404).send(`No Rooms Available`)

//     return response.status(200).json(res.rows)
//   } catch (error) {
//     console.log("Error in getRooms:", error)
//     return response.status(500).json({ error: "Internal Server Error" })
//   }
// }

const getRooms = async (request, response) => {
  try {
    const res = await pool.query(`
      SELECT r.*, COUNT(rm.userid) as member_count 
      FROM Rooms r 
      LEFT JOIN RoomMembers rm ON r.roomid = rm.roomid 
      GROUP BY r.roomid 
      ORDER BY r.created_at DESC
    `);

    if (!res.rowCount) return response.status(404).send(`No Rooms Available`);

    return response.status(200).json(res.rows);
  } catch (error) {
    console.log("Error in getRooms:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// const createRoom = async (request, response) => {
//   try {
//     const { room_name } = request.body
//     const res = await pool.query(`INSERT INTO Rooms (room_name) VALUES ('${room_name}') RETURNING *`)
//     response.status(201).json(res.rows[0])
//   } catch (error) {
//     console.log("Error in createRoom:", error)
//     response.status(500).json({ error: "Internal Server Error" })
//   }
// }

const createRoom = async (request, response) => {
  const { name, description } = request.body;
  const userId = request.session.user.userid; // Assuming you have user session

  try {
    const res = await pool.query(
      `INSERT INTO Rooms (name, description, created_by) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description, userId]
    );

    return response.status(201).json(res.rows[0]);
  } catch (error) {
    console.log("Error in createRoom:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// const joinRoom = async (request, response) => {
//   try {
//     const { room_id, user_id } = request.body
//     const res = await pool.query(`INSERT INTO RoomUsers (room_id, user_id) VALUES (${room_id}, ${user_id}) RETURNING *`)
//     response.status(201).json(res.rows[0])
//   } catch (error) {
//     console.log("Error in joinRoom:", error)
//     response.status(500).json({ error: "Internal Server Error" })
//   }
// }

const joinRoom = async (request, response) => {
  console.log("Received roomid:", request.params.roomid); // Debug log
  console.log("Request body:", request.body); // Debug log
  const { roomid } = request.params;
  // const userId = request.session.user.userid; // Assuming you have user session
  const userId = 12345;


  try {
    const checkMember = await pool.query(
      `SELECT * FROM RoomMembers WHERE roomid = $1 AND userid = $2`,
      [roomid, userId]
    );

    if (checkMember.rowCount > 0) {
      return response.status(400).json({ error: "User already a member of this room" });
    }

    await pool.query(
      `INSERT INTO RoomMembers (roomid, userid) VALUES ($1, $2)`,
      [roomid, userId]
    );

    return response.status(200).json({ message: "Successfully joined the room" });
  } catch (error) {
    console.log("Error in joinRoom:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// const sendMessage = async (request, response) => {
//   try {
//     const { room_id, user_id, message } = request.body
//     const res = await pool.query(
//       `INSERT INTO Messages (room_id, user_id, message) VALUES (${room_id}, ${user_id}, '${message}') RETURNING *`,
//     )
//     response.status(201).json(res.rows[0])
//   } catch (error) {
//     console.log("Error in sendMessage:", error)
//     response.status(500).json({ error: "Internal Server Error" })
//   }
// }

const getRoomMessages = async (request, response) => {
  const { roomid } = request.params;

  try {
    const res = await pool.query(
      `SELECT m.*, u.username 
       FROM Messages m 
       JOIN Users u ON m.userid = u.userid 
       WHERE m.roomid = $1 
       ORDER BY m.posted_at DESC`,
      [roomid]
    );

    return response.status(200).json(res.rows);
  } catch (error) {
    console.log("Error in getRoomMessages:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const sendMessage = async (request, response) => {
  const { roomid } = request.params;
  const { content } = request.body;
  const userId = request.session.user.userid; // Assuming you have user session

  try {
    const res = await pool.query(
      `INSERT INTO Messages (roomid, userid, content) 
       VALUES ($1, $2, $3) RETURNING *`,
      [roomid, userId, content]
    );

    return response.status(201).json(res.rows[0]);
  } catch (error) {
    console.log("Error in sendMessage:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getRooms,
  createRoom,
  joinRoom,
  getRoomMessages,
  sendMessage
};

// module.exports = { getRooms, createRoom, joinRoom, sendMessage };
