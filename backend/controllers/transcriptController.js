const { get } = require("react-scroll/modules/mixins/scroller");
const pool = require("../config/database");

const getTranscript = async (request, response) => {
  const {
    session: {
      user: { userid },
    },
  } = request;

  try {
    let res = await pool.query(`Select * from Transcript where userid = $1`, [
      userid,
    ]);

    if (!res.rowCount)
      return response.status(404).send(`No Transcript Available`);

    response.status(200).json(res.rows);
  } catch (error) {
    console.error("Error in getTranscript:", error);
    return response.status(500).send("Internal Server Error");
  }
};

module.exports = { getTranscript };
