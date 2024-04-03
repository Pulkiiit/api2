const express = require("express");
const router = express.Router();
const {
  getCourseDetails,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/adminController");

router.get("/read", getCourseDetails);
router.post("/create", createCourse);
router.put("/update", updateCourse);
router.delete("/delete", deleteCourse);

module.exports = router;
