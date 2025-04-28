const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  searchProducts,
} = require("../controllers/productController");

router.get("/list", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

module.exports = router;
