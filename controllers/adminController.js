const { queryDatabase } = require("../config/dbConnect");
const getCourseDetails = async (req, res) => {
  try {
    const id = req.body.id;
    const data = await queryDatabase("SELECT * FROM courses WHERE id = $1", [
      id,
    ]);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, description, category, level } = req.body;
    await queryDatabase(
      "INSERT INTO courses (name, description,category,level) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, category, level]
    );
    return res.status(200).json({ message: "Course created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateCourse = async (req, res) => {
  try {
    //
    const { id, name, description, category, level } = req.body;
    if (!name && !description && !category && !level) {
      return res
        .status(400)
        .json({ message: "Please provide atleast one input field to update" });
    }
    const course = await queryDatabase("SELECT * FROM courses WHERE id = $1", [
      id,
    ]);
    const courseData = course[0];
    if (name) courseData.name = name;
    if (description) courseData.description = description;
    if (category) courseData.category = category;
    if (level) courseData.level = level;
    await queryDatabase(
      "UPDATE courses SET name = $1, description = $2, category = $3, level = $4 WHERE id = $5",
      [
        courseData.name,
        courseData.description,
        courseData.category,
        courseData.level,
        id,
      ]
    );
    return res.status(200).json({ message: "Successfull" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.status(400).json({ message: "Please provide course id" });
    await queryDatabase("DELETE FROM courses WHERE id = $1", [id]);
    return res.status(200).json({ message: "Successfull" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCourseDetails, createCourse, updateCourse, deleteCourse };
