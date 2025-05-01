const db = require("../config/db");

const getComments = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;
  let offset = (page - 1) * limit;

  const query = `
        SELECT c.id, c.user_id, c.product_id, c.comment, c.created_at, c.censor
        FROM Comments c
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
    `;

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Lỗi lấy bình luận:", err);
      return res.status(500).send("Có lỗi xảy ra!");
    }

    res.json({
      page: page,
      limit: limit,
      comments: results,
    });
  });
};

const getCommentsByProductName = (req, res) => {
  let { page = 1, limit = 10, keyword } = req.query;
  let offset = (page - 1) * limit;

  if (!keyword) {
    return res.status(400).json({ error: "Vui lòng nhập tên sản phảm" });
  }

  let query = `
        SELECT c.id, c.user_id, c.product_id, c.comment, c.censor, c.created_at
        FROM Comments c
        JOIN Products p ON c.product_id = p.id
        WHERE p.name LIKE ?
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
    `;

  let queryParams = [`%${keyword}%`, parseInt(limit), offset];

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Lỗi tìm kiếm bình luận:", err);
      return res.status(500).send("Có lỗi xảy ra!");
    }

    res.json({
      page: page,
      limit: limit,
      comments: results,
    });
  });
};

const censorComment = (req, res) => {
  const { id } = req.params;

  const query = `UPDATE Comments SET censor = 1 WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi server khi duyệt bình luận." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy bình luận." });
    }

    res.json({ message: "Duyệt bình luận thành công." });
  });
};

const deleteComment = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM Comments WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Lỗi xóa bình luận:", err);
      return res.status(500).json({ error: "Lỗi server khi xóa bình luận." });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy bình luận để xóa." });
    }

    res.json({ message: "Xóa bình luận thành công." });
  });
};

module.exports = {
  getComments,
  getCommentsByProductName,
  censorComment,
  deleteComment,
};
