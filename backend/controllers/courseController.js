const pool = require("../config/database.js");

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

// Exporting the functions
module.exports = {
  getCourses,
  rateCourse,
  reviewCourse,
  addCourse,
};
