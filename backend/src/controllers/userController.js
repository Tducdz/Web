const db = require("../config/db");

const getUserInfo = (req, res) => {
  const { id } = req.params;

  const sql =
    "SELECT id, name, email, phone_number, address FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn CSDL." });
    if (results.length === 0)
      return res.status(404).json({ message: "Không tìm thấy người dùng." });

    res.status(200).json(results[0]);
  });
};

const updateUserInfo = (req, res) => {
  const { id } = req.params;
  const { name, phone_number, address } = req.body;

  if (!name || !phone_number || !address) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
  }

  const sql =
    "UPDATE users SET name = ?, phone_number = ?, address = ? WHERE id = ?";
  db.query(sql, [name, phone_number, address, id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Lỗi cập nhật thông tin." });

    res.status(200).json({ message: "Cập nhật thông tin thành công." });
  });
};

const changePassword = (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới." });
  }

  // Kiểm tra mật khẩu cũ
  const checkSQL = "SELECT password FROM users WHERE id = ?";
  db.query(checkSQL, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: "Lỗi xác minh người dùng." });
    }

    const currentPassword = results[0].password;
    if (currentPassword !== oldPassword) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });
    }

    // Cập nhật mật khẩu mới
    const updateSQL = "UPDATE users SET password = ? WHERE id = ?";
    db.query(updateSQL, [newPassword, id], (err) => {
      if (err)
        return res.status(500).json({ message: "Lỗi cập nhật mật khẩu." });

      res.status(200).json({ message: "Đổi mật khẩu thành công." });
    });
  });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  changePassword,
};
