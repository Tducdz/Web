const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET || "tducshop_secret_key";

const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
  }

  db.execute("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi kiểm tra email." });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      [name, email, password],
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Lỗi thêm người dùng vào CSDL." });
        }
        res.status(201).json({ message: "Đăng ký thành công!" });
      }
    );
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đủ thông tin." });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.execute(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi đăng nhập." });

    if (results.length === 0) {
      return res.status(400).json({ message: "Sai thông tin đăng nhập." });
    }

    const user = results[0];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secretKey,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};

module.exports = { registerUser, login };
