const express = require("express");
const router = express.Router();
const { addReview } = require("../controllers/reviewController");

router.post("/", addReview);

module.exports = router;
