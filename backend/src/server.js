const express = require("express");
const path = require("path");
require("dotenv").config();
const { verifyToken, verifyAdmin } = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

// config req.body
app.use(express.json());
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/img", express.static(path.join(__dirname, "public/img")));
// app.use(express.urlencoded({ extended: true }));

// frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// Khai báo route
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const products = require("./routes/product");
app.use("/product", products);

// Routes cần JWT
const user = require("./routes/user");
app.use("/user", verifyToken, user);
const addToCart = require("./routes/cart");
app.use("/cart", verifyToken, addToCart);
const order = require("./routes/order");
app.use("/order", verifyToken, order);
const review = require("./routes/review");
app.use("/review", verifyToken, review);

const admin = require("./routes/admin");
app.use("/admin", verifyToken, verifyAdmin, admin);

// ConnectPort cho frontend
const connectPort = require("./config/port");
app.get("/js/config.js", connectPort);

// test connection
app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
