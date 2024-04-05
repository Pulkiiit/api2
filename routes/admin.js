const express = require("express");
const router = express.Router();
const {
  getCourseDetails,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/adminController");

const { argumentCheck } = require("../middlewares/argumentCheck");

// admin details can be inserted directly in the database after hashing the password

router.get("/read", argumentCheck(["id"]), getCourseDetails);
router.post(
  "/create",
  argumentCheck(["name", "description", "category", "level"]),
  createCourse
);
router.put("/update", updateCourse);
router.delete("/delete", deleteCourse);

module.exports = router;
