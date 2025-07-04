const pool = require("../config/database.js");
const fetch = require('node-fetch');
// Controller to fetch all courses
const getCourses = async (request, response) => {
  try {
    const result = await pool.query(`
      SELECT 
        vci.*,
        CASE WHEN vci.past_papers_count > 0 THEN true ELSE false END as has_past_papers,
        CASE WHEN cr.ratedcount > 0 THEN ROUND(cr.ratingsum::numeric / cr.ratedcount, 1) ELSE NULL END as rating,
        CASE WHEN cr.ratedcount > 0 THEN cr.ratedcount ELSE 0 END as rating_count
      FROM ViewCourseInfo vci
      LEFT JOIN CourseRating cr ON vci.courseid = cr.courseid
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

  // Validate input
  if (!coursename || !coursecode || !credits || !grading || !difficulty) {
    return response.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the course already exists
    let res = await pool.query(
      `SELECT * FROM Courses WHERE coursecode ILIKE $1`,
      [coursecode]
    );

    if (res.rowCount) {
      return response.status(400).json({ message: "Course already exists in the database" });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Insert into Courses table
      res = await client.query(
        `INSERT INTO Courses (coursecode) VALUES ($1) RETURNING courseid`,
        [coursecode]
      );

      const courseid = res.rows[0].courseid;

      // Insert into CourseInfo table
      await client.query(
        `INSERT INTO CourseInfo (courseid, coursename, credits, grading, difficulty)
         VALUES ($1, $2, $3, $4, $5)`,
        [courseid, coursename, credits, grading, difficulty]
      );

      await client.query("COMMIT");
      return response.status(201).json({ message: "Course added successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in addCourse transaction:", error);
      return response.status(500).json({ message: "Internal Server Error" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error in addCourse:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

const addCourses = async (request, response) => {
  const { courses } = request.body;

  if (!Array.isArray(courses) || courses.length === 0) {
    return response.status(400).json({ message: "Courses array is required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const course of courses) {
      const { coursename, coursecode, credits, grading, difficulty } = course;

      // Validate each course
      if (!coursename || !coursecode || !credits || !grading || !difficulty) {
        await client.query("ROLLBACK");
        return response.status(400).json({ message: "All fields are required for each course" });
      }

      // Check if course exists
      const existsRes = await client.query(
        `SELECT 1 FROM viewcourseinfo WHERE coursecode ILIKE $1 and coursename ILIKE $2`,
        [coursecode, coursename]
      );
      if (existsRes.rowCount > 0) {
        await client.query("ROLLBACK");
        return response.status(400).json({ message: `Course with code ${coursecode} and ${coursename} already exists` });
      }

      // Insert into Courses
      const res = await client.query(
        `INSERT INTO Courses (coursecode) VALUES ($1) RETURNING courseid`,
        [coursecode]
      );
      const courseid = res.rows[0].courseid;

      // Insert into CourseInfo
      await client.query(
        `INSERT INTO CourseInfo (courseid, coursename, credits, grading, difficulty)
         VALUES ($1, $2, $3, $4, $5)`,
        [courseid, coursename, credits, grading, difficulty]
      );
    }

    await client.query("COMMIT");
    return response.status(201).json({ message: "All courses added successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in addCourses transaction:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
};

const getPastPapers = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      'SELECT paper_id, paper_type, paper_year, file_link, file_link_down, file_name FROM past_papers WHERE courseid = $1',
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

  let client = await pool.connect();

  try {
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
      [courseId, req.session?.user?.userid || 0]
    );

    await client.query("BEGIN");

    await client.query(`Update TrendingCourses set clicks = clicks + 1 where courseid = $1`,
      [courseId]
    );

    await client.query("COMMIT");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching course details:', err);
    await client.query("ROLLBACK");
    return res.status(500).json({ message: 'Server error while fetching course details' });
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
  addCourses,
};
