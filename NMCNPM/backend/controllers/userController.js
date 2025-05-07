const db = require("../config/db");

const getListUser = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) AS total FROM users";
  const dataQuery = "SELECT * FROM users LIMIT ? OFFSET ?";

  db.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn tổng số" });

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataQuery, [limit, offset], (err, results) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });

      res.json({
        currentPage: page,
        totalPages,
        totalUsers: total,
        users: results,
      });
    });
  });
};

const searchUser = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  const searchValue = `%${search.toLowerCase()}%`;

  const countQuery = `
        SELECT COUNT(*) AS total 
        FROM users 
        WHERE LOWER(ten_tai_khoan) LIKE ?
      `;

  const dataQuery = `
        SELECT * 
        FROM users 
        WHERE LOWER(ten_tai_khoan) LIKE ? 
        LIMIT ? OFFSET ?
      `;

  db.query(countQuery, [searchValue], (err, countResult) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn tổng số" });

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataQuery, [searchValue, limit, offset], (err, results) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });

      res.json({
        currentPage: page,
        totalPages,
        totalUsers: total,
        search,
        users: results,
      });
    });
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(results[0]);
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { ten_tai_khoan, mat_khau, so_dien_thoai, vai_tro } = req.body;

  const sql =
    "UPDATE users SET ten_tai_khoan = ?, mat_khau = ?, so_dien_thoai = ?, vai_tro = ? WHERE id = ?";
  db.query(
    sql,
    [ten_tai_khoan, mat_khau, so_dien_thoai, vai_tro, id],
    (err, result) => {
      if (err) {
        console.error("Lỗi cập nhật:", err);
        return res.status(500).json({ message: "Cập nhật thất bại" });
      }
      res.json({ message: "Cập nhật thành công" });
    }
  );
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi xóa:", err);
      return res.status(500).json({ message: "Xóa thất bại" });
    }
    res.json({ message: "Xóa thành công" });
  });
};

module.exports = {
  getListUser,
  searchUser,
  getUserById,
  updateUser,
  deleteUser,
};
