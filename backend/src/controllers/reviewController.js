const db = require("../config/db");

const addReview = (req, res) => {
  const { user_id, product_id, comment } = req.body;

  // Check ordered
  const checkSQL = `
      SELECT * FROM OrdersDetails od
      JOIN Orders o ON od.order_id = o.id
      WHERE o.user_id = ? AND od.product_id = ?
    `;

  db.query(checkSQL, [user_id, product_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn kiểm tra." });

    if (results.length === 0) {
      return res
        .status(403)
        .json({ message: "Bạn chưa mua sản phẩm này nên không thể đánh giá." });
    }

    const insertSQL = `
        INSERT INTO Comments (user_id, product_id, comment)
        VALUES (?, ?, ?)
      `;

    db.query(insertSQL, [user_id, product_id, comment], (err2, result2) => {
      if (err2)
        return res.status(500).json({ message: "Lỗi khi thêm đánh giá." });

      res.status(200).json({ message: "Đánh giá sản phẩm thành công." });
    });
  });
};

module.exports = { addReview };
