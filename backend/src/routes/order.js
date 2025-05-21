const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
} = require("../controllers/orderController");

router.get("/:id", getOrdersByUser);
router.post("/", createOrder);

module.exports = router;
