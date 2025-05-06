const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET || "tducshop_secret_key";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader || !token) {
    return res.status(403).json({ message: "Cần phải đăng nhập!" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log("JWT Verify Error:", err.message); // Debug lỗi
      return res.status(403).json({ message: "Token không hợp lệ!" });
    }

    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Quyền truy cập bị từ chối!" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
