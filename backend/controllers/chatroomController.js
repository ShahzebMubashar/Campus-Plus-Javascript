const pool = require("../config/database");

exports.getChatrooms = async (request, response) => {
  try {
    console.log("Fetching Chatrooms");
    const result = await pool.query("SELECT * FROM Chatrooms");

    if (!result.rowCount)
      return response.status(404).send("No Chatrooms Available");

    return response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal Server Error");
  }
};

exports.createChatroom = async (request, response) => {
  const {
    body: { chatroomName },
  } = request;

  if (!chatroomName)
    return response.status(400).send("Chatroom name is required");

  try {
    const result = await pool.query(
      "INSERT INTO Chatrooms (name) VALUES ($1) RETURNING *",
      [chatroomName]
    );
    return response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal Server Error");
  }
};
