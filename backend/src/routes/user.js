const express = require("express");
const router = express.Router();
const {
  getUserInfo,
  updateUserInfo,
  changePassword,
} = require("../controllers/userController");

router.get("/:id", getUserInfo);
router.put("/:id", updateUserInfo);
router.put("/:id/password", changePassword);

module.exports = router;
