const pool = require("../config/database");

const checkRoomMember = async (request, response, next) => {
  const {
    params: { roomid },
    session: {
      user: { userid },
    },
  } = request;

  try {
    let res = await pool.query(
      `Select * from RoomMembers where roomid = $1 and userid = $2`,
      [roomid, userid]
    );

    if (!res.rowCount)
      return response.status(400).send(`You are not a member of this room`);

    next();
  } catch (error) {
    console.log("Error in checkRoomMember:", error);
    return response.sendStatus(500);
  }
};

module.exports = { checkRoomMember };