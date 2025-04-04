const { request } = require("http");
const pool = require("../config/database");

const checkRoomMember = async (request, response, next) => {
  try {
    console.log("Middleware Request:", request.params);

    const {
      params: { roomid },
      session: {
        user: { userid },
      },
    } = request;

    if (!userid || !roomid) {
      return response
        .status(400)
        .json({ error: "User ID and Room ID are required" });
    }

    let res = await pool.query(
      `SELECT * FROM RoomMembers WHERE roomid = $1 AND userid = $2`,
      [roomid, userid]
    );

    if (!res.rowCount) {
      return response.status(400).send("You are not a member of this room");
    }

    next();
  } catch (error) {
    console.error("Error in checkRoomMember:", error);
    return response.sendStatus(500);
  }
};

const validateRoom = async (request, response, next) => {
  const {
    params: { roomid },
  } = request;

  try {
    const res = await pool.query(`Select * from Rooms where roomid = $1`, [
      roomid,
    ]);

    if (!res.rowCount) return response.status(404).send("Room not found");
    
    if (res.rows[0].isDeleted)
      return response.status(400).send("Room has been deleted");

    next();
  } catch (error) {
    console.error("Error in validateRoom:", error);
    return response.sendStatus(500);
  }
};

module.exports = { checkRoomMember, validateRoom };
