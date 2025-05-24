const db = require("../config/db");

const getComments = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM Comments c
    JOIN Products p ON c.product_id = p.id
    JOIN Users u ON c.user_id = u.id
  `;

  db.query(countQuery, (err, countResults) => {
    if (err) {
      console.error("Lỗi lấy tổng số bình luận:", err);
      return res.status(500).send("Có lỗi xảy ra!");
    }

    const totalCount = countResults[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    const query = `
      SELECT 
        c.id, 
        c.comment, 
        c.create_at, 
        c.censor,
        p.name AS product_name,
        u.name AS user_name
      FROM Comments c
      JOIN Products p ON c.product_id = p.id
      JOIN Users u ON c.user_id = u.id
      ORDER BY c.create_at DESC
      LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi lấy bình luận:", err);
        return res.status(500).send("Có lỗi xảy ra!");
      }

      res.json({
        page: page,
        totalPages: totalPages,
        comments: results,
      });
    });
  });
};

const getCommentsByProductName = (req, res) => {
  let { page = 1, limit = 10, keyword } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = (page - 1) * limit;

  if (!keyword || keyword.trim() === "") {
    return res.status(400).json({ error: "Vui lòng nhập tên sản phẩm" });
  }

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM Comments c
    JOIN Products p ON c.product_id = p.id
    JOIN Users u ON c.user_id = u.id
    WHERE p.name LIKE ?
  `;

  db.query(countQuery, [`%${keyword}%`], (err, countResults) => {
    if (err) {
      console.error("Lỗi đếm bình luận:", err);
      return res.status(500).send("Có lỗi xảy ra!");
    }

    const totalCount = countResults[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    const query = `
      SELECT 
        c.id, 
        c.comment, 
        c.censor, 
        c.create_at,
        p.name AS product_name,
        u.name AS user_name
      FROM Comments c
      JOIN Products p ON c.product_id = p.id
      JOIN Users u ON c.user_id = u.id
      WHERE p.name LIKE ?
      ORDER BY c.create_at DESC
      LIMIT ? OFFSET ?
    `;

    db.query(query, [`%${keyword}%`, limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi tìm kiếm bình luận:", err);
        return res.status(500).send("Có lỗi xảy ra!");
      }

      res.json({
        page: page,
        totalPages: totalPages,
        comments: results,
      });
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
