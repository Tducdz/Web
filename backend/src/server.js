const express = require("express");
const path = require("path");
require("dotenv").config();
const configViewEngine = require("./config/viewEngine");
const { verifyToken, verifyAdmin } = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME;

// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/img", express.static(path.join(__dirname, "src/public/img")));

// config template engine
configViewEngine(app);

// Khai báo route
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Routes cần JWT
const products = require("./routes/product");
app.use("/product", products);
const addToCart = require("./routes/cart");
app.use("/cart", verifyToken, addToCart);
const order = require("./routes/order");
app.use("/order", verifyToken, order);
const review = require("./routes/review");
app.use("/review", verifyToken, review);

const admin = require("./routes/admin");
app.use("/admin", verifyToken, verifyAdmin, admin);

// test connection
app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
