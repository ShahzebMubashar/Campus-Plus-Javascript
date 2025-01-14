const pool = require("../config/database.js");

exports.getCourses = async (request, response) => {
  try {
    const result = await pool.query("SELECT * FROM ViewCourses");
    if (!result.rowCount)
      return response.status(404).send("No Courses Available");
    return response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal Server Error");
  }
};

exports.rateCourse = async (request, response) => {
  const {
    body: { courseid, rating },
    session: {
      user: { userid },
    },
  } = request;

  try {
    const check = await pool.query(
      "SELECT * FROM UserCourseRating WHERE userid = $1 AND courseid = $2",
      [userid, courseid]
    );

    if (check.rowCount)
      return response.status(400).send("You have already rated this course");

    const client = await pool.connect();
    await client.query("BEGIN");

    let courseRating = await client.query(
      "SELECT * FROM CourseRating WHERE courseid = $1",
      [courseid]
    );

    if (!courseRating.rowCount) {
      await client.query(
        "INSERT INTO CourseRating (courseid, ratingsum, ratedcount) VALUES ($1, $2, $3)",
        [courseid, rating, 1]
      );
    } else {
      const { ratingsum, ratedcount } = courseRating.rows[0];
      const newRatingSum = ratingsum + rating;
      await client.query(
        "UPDATE CourseRating SET ratingsum = $1, ratedcount = $2 WHERE courseid = $3",
        [newRatingSum, ratedcount + 1, courseid]
      );
    }

    await client.query(
      "INSERT INTO UserCourseRating (userid, courseid, rating) VALUES ($1, $2, $3)",
      [userid, courseid, rating]
    );

    await client.query("COMMIT");
    return response.status(200).send("Rating Added");
  } catch (error) {
    console.error(error);
    await pool.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  }
};

exports.reviewCourse = async (request, response) => {
  const {
    body: { courseid, review },
    session: {
      user: { userid },
    },
  } = request;

  try {
    let client = await pool.connect();

    await client.query("BEGIN");

    let res = await client.query(
      `Select * from CourseReviews where userid = $1`,
      [userid]
    );

    if (res.rowCount)
      return response.status(400).send("You have already reviewed this course");

    res = await client.query(
      `INSERT INTO CourseReviews (userid, courseid, review) VALUES ($1, $2, $3)`,
      [userid, courseid, review]
    );

    await client.query("COMMIT");

    return response.status(200).send("Review Added");
  } catch (error) {
    console.error(error);
    await pool.query("ROLLBACK");
    return response.status(500).send("Internal Server Error");
  }
};
