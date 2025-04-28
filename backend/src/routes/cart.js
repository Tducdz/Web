const express = require("express");
const router = express.Router();
const {
  addOrUpdateCart,
  getCartByUser,
} = require("../controllers/cartController");

router.put("/", addOrUpdateCart);

router.get("/:user_id", getCartByUser);

module.exports = router;
