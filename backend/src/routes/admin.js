const express = require("express");
const router = express.Router();
const { getAdminSummary } = require("../controllers/adminHomeController");
const {
  getPageProducts,
  getProductById,
  searchProducts,
  updateProduct,
  addProduct,
  deleteProduct,
} = require("../controllers/adminProductController");

const {
  getUsers,
  searchUsers,
  getUserById,
  updateUser,
  deleteUser,
  disablePassword,
  enablePassword,
} = require("../controllers/adminUsersController");

const {
  getComments,
  getCommentsByProductName,
  censorComment,
  deleteComment,
} = require("../controllers/adminCommentCongtroller");

const {
  getAllOrders,
  searchOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/adminOrderController");

router.get("/", getAdminSummary);

router.get("/product-manage", getPageProducts);
router.get("/search", searchProducts);
router.get("/product-manage/:id", getProductById);
router.put("/product-manage/:id", updateProduct);
router.delete("/product-manage/:id", deleteProduct);
const upload = require("../middleware/upload");
router.post("/product-manage/add", upload.single("image"), addProduct);

router.get("/users", getUsers);
router.get("/users/search", searchUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.put("/users/:id/disable", disablePassword);
router.put("/users/:id/enable", enablePassword);
router.delete("/users/:id", deleteUser);

router.get("/comments", getComments);
router.get("/comments/search", getCommentsByProductName);
router.put("/comments/:id", censorComment);
router.delete("/comments/:id", deleteComment);

router.get("/orders", getAllOrders);
router.get("/orders/search", searchOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

module.exports = router;
