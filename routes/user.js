const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  updateUserDetails,
} = require("../controllers/userDetailsController");

router.get("/details", getUserDetails);
router.put("/details", updateUserDetails);

module.exports = router;
