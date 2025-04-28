const db = require("../config/db");

const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
  }

  // check duplicate email
  db.execute("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err, results) => {
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

  db.execute(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (results.length > 0) {
        return res.status(200).json({ message: "Đăng nhập thành công!" });
      } else {
        return res.status(400).json({ message: "Sai thông tin đăng nhập." });
      }
    }
  );
};

module.exports = { registerUser, login };
