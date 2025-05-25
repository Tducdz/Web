const db = require("../config/db");

const getUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const sql =
    "SELECT id, name, email, phone_number, address, role, password FROM Users LIMIT ? OFFSET ?";
  db.query(sql, [limit, offset], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Lỗi lấy danh sách tài khoản." });
    res.json(result);
  });
};

const searchUsers = (req, res) => {
  let { keyword = "", page = 1 } = req.query;
  keyword = keyword.trim().toLowerCase();
  page = parseInt(page);
  const limit = 10;
  const offset = (page - 1) * limit;

  if (!keyword) {
    return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
  }

  const sql = `
      SELECT id, name, email, phone_number, address, role, password
      FROM Users
      WHERE LOWER(name) LIKE ?
      LIMIT ? OFFSET ?
    `;

  const values = [`%${keyword}%`, limit, offset];

  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi tìm kiếm tài khoản." });
    }

    res.status(200).json({ data: results, page });
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;

  const sql = `
      SELECT id, name, email, phone_number, address, role, password
      FROM Users
      WHERE id = ?
    `;

  db.query(sql, [userId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Lỗi khi lấy chi tiết tài khoản." });

    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản." });
    }

    res.json(result[0]);
  });
};

const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, phone_number, address, role, password } = req.body;

  if (!name || !email || !role) {
    return res
      .status(400)
      .json({ message: "Tên, email và vai trò là bắt buộc." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ." });
  }

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Vai trò không hợp lệ." });
  }

  if (phone_number && !/^\d{9,10}$/.test(phone_number)) {
    return res.status(400).json({ message: "Số điện thoại không hợp lệ." });
  }

  // Kiểm tra xem tài khoản cần cập nhật có phải admin không
  const checkAdminSql = `SELECT role FROM Users WHERE id = ?`;
  db.query(checkAdminSql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi kiểm tra tài khoản." });
    }
    if (results.length > 0 && results[0].role === "admin") {
      return res
        .status(403)
        .json({ message: "Không thể cập nhật tài khoản admin." });
    }

    let sql = `
      UPDATE Users
      SET name = ?, email = ?, phone_number = ?, address = ?, role = ?
    `;
    const values = [name, email, phone_number || null, address || null, role];

    if (password) {
      sql += `, password = ?`;
      values.push(password);
    }

    sql += ` WHERE id = ?`;
    values.push(userId);

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi cập nhật tài khoản." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản." });
      }
      res.json({ message: "Cập nhật tài khoản thành công." });
    });
  });
};

const deleteUser = (req, res) => {
  const userId = req.params.id;

  // Kiểm tra xem tài khoản có phải admin không
  const checkAdminSql = `SELECT role FROM Users WHERE id = ?`;
  db.query(checkAdminSql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi kiểm tra tài khoản." });
    }
    if (results.length > 0 && results[0].role === "admin") {
      return res
        .status(403)
        .json({ message: "Không thể xóa tài khoản admin." });
    }

    const sql = "DELETE FROM Users WHERE id = ?";
    db.query(sql, [userId], (err) => {
      if (err) return res.status(500).json({ message: "Lỗi xóa tài khoản." });
      res.json({ message: "Xóa tài khoản thành công." });
    });
  });
};

const disablePassword = (req, res) => {
  const userId = req.params.id;

  // Kiểm tra xem tài khoản có phải admin không
  const checkAdminSql = `SELECT role FROM Users WHERE id = ?`;
  db.query(checkAdminSql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi kiểm tra tài khoản." });
    }
    if (results.length > 0 && results[0].role === "admin") {
      return res
        .status(403)
        .json({ message: "Không thể khóa tài khoản admin." });
    }

    const sql = `UPDATE Users SET password = NULL WHERE id = ?`;
    db.query(sql, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi khóa tài khoản." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản." });
      }
      res.status(200).json({ message: "Tài khoản đã bị khóa." });
    });
  });
};

const enablePassword = (req, res) => {
  const userId = req.params.id;

  // Kiểm tra xem tài khoản có phải admin không
  const checkAdminSql = `SELECT role FROM Users WHERE id = ?`;
  db.query(checkAdminSql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi kiểm tra tài khoản." });
    }
    if (results.length > 0 && results[0].role === "admin") {
      return res
        .status(403)
        .json({ message: "Không thể mở khóa tài khoản admin." });
    }

    const sql = `UPDATE Users SET password = '123456' WHERE id = ?`;
    db.query(sql, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi mở khóa tài khoản." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản." });
      }
      res
        .status(200)
        .json({ message: "Tài khoản đã được mở khóa (password = 123456)." });
    });
  });
};

module.exports = {
  getUsers,
  searchUsers,
  getUserById,
  updateUser,
  deleteUser,
  disablePassword,
  enablePassword,
};
