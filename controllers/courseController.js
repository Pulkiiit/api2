const { queryDatabase } = require("../config/dbConnect");
const { sendEmail } = require("../helper/sendEmail");
const getCourseDetails = async (req, res) => {
  try {
    const { category, level, page, pageSize } = req.params;
    let query = "SELECT * FROM courses";
    let params = [];

    // dynamically contruct query based on category and level (filtering)
    if (category && level) {
      query += " WHERE category = $1 AND level = $2";
      params = [category, level];
    } else if (category) {
      query += " WHERE category = $1";
      params = [category];
    } else if (level) {
      query += " WHERE level = $1";
      params = [level];
    }
    //pagination useing lemi and offset
    const offset = (page - 1) * pageSize;
    query += ` LIMIT $3 OFFSET $4`;
    params.push(pageSize, offset);
    const data = await queryDatabase(query, params);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const { course_id, verifiedEmail } = req.body;
    // first get user id
    const user_id = await queryDatabase(
      "SELECT id FROM users WHERE email = $1",
      [verifiedEmail]
    );
    // enroll user
    await queryDatabase(
      "INSERT INTO enrollemnts (user_id, course_id) VALUES ($1, $2)",
      [user_id, course_id]
    );

    const course_name = await queryDatabase(
      "SELECT name FROM courses WHERE id = $1",
      [course_id]
    );
    await sendEmail(verifiedEmail, "enrollment", { course: course_name });
    return res.status(200).json({ message: "Successfull" });
  } catch (err) {
    if (err.code === "23505") {
      //constraint violation
      res.status(400).json({ error: "user already enrolled in this course" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const enrolledCourses = async (req, res) => {
  try {
    const { verifiedEmail } = req.body;
    const user_id = await queryDatabase(
      "SELECT id FROM users WHERE email = $1",
      [verifiedEmail]
    );
    const courses = await queryDatabase(
      "SELECT course_id FROM enrollemnts WHERE user_id = $1",
      [user_id]
    );
    const data = await queryDatabase(
      "SELECT * FROM courses WHERE id = ANY($1)",
      [courses]
    );
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCourseDetails, enrollCourse, enrolledCourses };
