const pool = require("../config/database.js");
const fetch = require('node-fetch');
// Controller to fetch all courses
const getCourses = async (request, response) => {
  try {
    const result = await pool.query("SELECT * FROM ViewCourses");
    // console.log("Courses Data:", result.rows); // Log the result for debugging
    if (!result.rowCount) {
      return response.status(404).json({ message: "No Courses Available" });
    }
    return response.status(200).json(result.rows); // Send valid JSON
  } catch (error) {
    console.error("Error in getCourses:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to rate a course
const rateCourse = async (request, response) => {
  const {
    body: { courseid, rating },
    session: {
      user: { userid },
    },
  } = request;

  if (!courseid || !rating) return response.status(400).send("Invalid Input");

  try {
    const client = await pool.connect();

    let res = await client.query(
      `Select * from UserCourseRating where userid = $1 and courseid = $2`,
      [userid, courseid]
    );

    if (res.rowCount)
      return response.status(400).send("You have already rated this course");

    res = await client.query(`Select * from CourseRating where courseid = $1`, [
      courseid,
    ]);

    await client.query("BEGIN");

    if (!res.rowCount) {
      res = await client.query(
        `Insert into CourseRating (courseid, ratingsum, ratedcount) values ($1, $2, $3)`,
        [courseid, rating, 1]
      );
    } else {
      res = await client.query(
        `Update CourseRating set ratingsum = ratingsum + $1, ratedcount = ratedcount + 1 where courseid = $2`,
        [rating, courseid]
      );
    }

    res = await client.query(
      `Insert into UserCourseRating (userid, courseid) values ($1, $2)`,
      [userid, courseid]
    );

    await client.query("COMMIT");

    return response.status(200).send("Course Rating Added Successfully");
  } catch (error) {
    console.error("Error in rateCourse:", error);
    return response.status(500).send("Internal Server Error");
  }
};

// Controller to review a course
const reviewCourse = async (request, response) => {
  const {
    body: { courseid, review },
    session: {
      user: { userid },
    },
  } = request;

  try {
    const client = await pool.connect();

    await client.query("BEGIN");

    const res = await client.query(
      "SELECT * FROM CourseReviews WHERE userid = $1 AND courseid = $2",
      [userid, courseid]
    );

    if (res.rowCount)
      return response.status(400).send("You have already reviewed this course");

    await client.query(
      "INSERT INTO CourseReviews (userid, courseid, review) VALUES ($1, $2, $3)",
      [userid, courseid, review]
    );

    await client.query("COMMIT");
    return response.status(200).send("Review Added");
  } catch (error) {
    console.error("Error in reviewCourse:", error);
    await pool.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  }
};

const addCourse = async (request, response) => {
  const {
    body: { coursename, coursecode, credits, grading, difficulty },
  } = request;

  try {
    let res = await pool.query(
      `Select * from Courses where coursecode ilike $1`,
      [coursecode]
    );

    if (res.rowCount)
      return response.status(400).send(`Course already added to database!`);

    const client = await pool.connect();

    await client.query("BEGIN");

    res = await client.query(
      `Insert into Courses (coursecode) values ($1) returning courseid`,
      [coursecode]
    );

    res = await client.query(
      `Insert into CourseInfo (courseid, coursename, credits, grading, difficulty)
      values ($1, $2, $3, $4, $5)`,
      [courseid, coursename, credits, grading, difficulty]
    );

    await client.query("COMMIT");
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    return response.sendStatus(500);
  }
};

const getPastPapers = async (req, res) => {
  const { courseId } = req.params;
  try {
      const result = await pool.query(
          'SELECT paper_id, paper_type, paper_year, file_link FROM past_papers WHERE courseid = $1',
          [courseId]
      );
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};

const downloadPastPapers = async (req, res) => {
  const { paperId } = req.params;
  try {
      // Query the database for the file_link using paperId
      const result = await pool.query('SELECT file_link FROM past_papers WHERE paper_id = $1', [paperId]);
      if (result.rows.length === 0) {
          return res.status(404).send('Paper not found');
      }
      const fileLink = result.rows[0].file_link;

      // Fetch the file from the external link (e.g., Google Drive)
      const response = await fetch(fileLink);
      if (!response.ok) {
          return res.status(500).send('Failed to fetch file');
      }
      // Stream the file to the client
      res.setHeader('Content-Type', 'application/pdf'); // Adjust the type if needed
      response.body.pipe(res);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};

// Exporting the functions
module.exports = {
  getCourses,
  rateCourse,
  reviewCourse,
  addCourse,
  getPastPapers,
  downloadPastPapers,
};
