const pool = require("../config/database.js");
const fetch = require('node-fetch');
// Controller to fetch all courses
const getCourses = async (request, response) => {
  try {
    const result = await pool.query(`
      SELECT *,
      CASE WHEN past_papers_count > 0 THEN true ELSE false END as has_past_papers
      FROM ViewCourseInfo
      ORDER BY has_past_papers DESC
    `);
    if (!result.rowCount) {
      return response.status(404).json({ message: "No Courses Available" });
    }
    return response.status(200).json(result.rows);
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
          'SELECT paper_id, paper_type, paper_year, file_link, file_link_down FROM past_papers WHERE courseid = $1',
          [courseId]
      );
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No past papers found for this course' });
      }
      res.json(result.rows);
  } catch (err) {
      console.error('Error fetching past papers:', err.message);
      res.status(500).json({ message: 'Server error while fetching past papers' });
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

const getCourseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      `SELECT vci.*, 
      CASE WHEN cr.ratedcount > 0 THEN cr.ratedcount ELSE 0 END as rating_count,
      ci.difficulty as difficulty,
      CASE WHEN EXISTS (
        SELECT 1 FROM UserCourseRating 
        WHERE courseid = vci.courseid 
        AND userid = $2
      ) THEN true ELSE false END as has_rated
      FROM ViewCourseInfo vci
      LEFT JOIN CourseRating cr ON vci.courseid = cr.courseid
      LEFT JOIN CourseInfo ci ON vci.courseid = ci.courseid
      WHERE vci.courseid = $1`,
      [courseId, req.session?.user?.userid || 0]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching course details:', err);
    res.status(500).json({ message: 'Server error while fetching course details' });
  }
};

// Controller to rate course difficulty
const rateCourseDifficulty = async (request, response) => {
  const {
    body: { courseid, rating },
    session: {
      user: { userid },
    },
  } = request;

  if (!courseid || !rating || rating < 1 || rating > 5) {
    return response.status(400).json({ message: "Invalid Input" });
  }

  try {
    const client = await pool.connect();

    // Update the difficulty in courseinfo table
    await client.query(
      `UPDATE CourseInfo 
       SET difficulty = $1 
       WHERE courseid = $2`,
      [rating, courseid]
    );

    // Get the updated course details
    const result = await client.query(
      `SELECT vci.*, 
       CASE WHEN cr.ratedcount > 0 THEN ROUND(cr.ratingsum::numeric / cr.ratedcount, 1) ELSE NULL END as rating,
       CASE WHEN cr.ratedcount > 0 THEN cr.ratedcount ELSE 0 END as rating_count,
       ci.difficulty as difficulty,
       CASE WHEN EXISTS (
           SELECT 1 FROM UserCourseRating 
           WHERE courseid = vci.courseid 
           AND userid = $2
       ) THEN true ELSE false END as has_rated
       FROM ViewCourseInfo vci
       LEFT JOIN CourseRating cr ON vci.courseid = cr.courseid
       LEFT JOIN CourseInfo ci ON vci.courseid = ci.courseid
       WHERE vci.courseid = $1`,
      [courseid, userid]
    );

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error in rateCourseDifficulty:", error);
    return response.status(500).json({ message: "Internal Server Error" });
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
  getCourseDetails,
  rateCourseDifficulty,
};
