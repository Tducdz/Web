const express = require("express");
const router = express.Router();
const {
  getListUser,
  searchUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getListUser);
router.get("/search", searchUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
