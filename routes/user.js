const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  updateUserDetails,
} = require("../controllers/userDetailsController");
const {
  enrollCourse,
  enrolledCourses,
} = require("../controllers/courseController");

const { argumentCheck } = require("../middlewares/argumentCheck");

router.get("/details", getUserDetails);
router.put("/details", updateUserDetails);
router.post("/enroll", argumentCheck(["course_id"]), enrollCourse);
router.get("/enrollments", enrolledCourses);
module.exports = router;
