const db = require("../config/db");
const { get } = require("../routes/auth");

const getUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 30;
  const offset = (page - 1) * limit;

  const sql =
    "SELECT id, name, email, phone_number, address, role FROM Users LIMIT ? OFFSET ?";
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
  const limit = 30;
  const offset = (page - 1) * limit;

  if (!keyword) {
    return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
  }

  const sql = `
      SELECT id, name, email, phone_number, address, role
      FROM Users
      WHERE LOWER(name) LIKE ?
      LIMIT ? OFFSET ?
    `;

  const values = [`%${keyword}%`, limit, offset];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Lỗi tìm kiếm tài khoản:", err);
      return res.status(500).json({ message: "Lỗi tìm kiếm tài khoản." });
    }

    res.status(200).json({ data: results, page });
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;

  const sql = `
      SELECT id, name, email, phone_number, address, role
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
  const { name, email, phone_number, address, role } = req.body;

  const sql = `
      UPDATE Users
      SET name = ?, email = ?, phone_number = ?, address = ?, role = ?
      WHERE id = ?
    `;

  db.query(
    sql,
    [name, email, phone_number, address, role, userId],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Lỗi cập nhật tài khoản." });
      res.json({ message: "Cập nhật tài khoản thành công." });
    }
  );
};

const deleteUser = (req, res) => {
  const userId = req.params.id;
  const sql = "DELETE FROM Users WHERE id = ?";
  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi xóa tài khoản." });
    res.json({ message: "Xóa tài khoản thành công." });
  });
};

const disablePassword = (req, res) => {
  const userId = req.params.id;

  // Password = null
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
};

const enablePassword = (req, res) => {
  const userId = req.params.id;

  // Password = 123456
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
