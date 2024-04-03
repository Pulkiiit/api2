const express = require("express");
const router = express.Router();
const { getCourseDetails } = require("../controllers/courseController");
router.get("/details", getCourseDetails);

module.exports = router;
