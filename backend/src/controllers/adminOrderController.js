const db = require("../config/db");

const getAllOrders = (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  let offset = (page - 1) * limit;

  const query = `
      SELECT o.id, o.user_id, u.name AS name, o.order_date, o.total_price,
             o.payment_method, o.payment_status, o.order_status
      FROM Orders o
      JOIN Users u ON o.user_id = u.id
      ORDER BY o.order_date DESC
      LIMIT ? OFFSET ?
    `;

  db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
    if (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    res.json({ page, limit, orders: results });
  });
};

const searchOrders = (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;
  let offset = (page - 1) * limit;

  const query = `
      SELECT o.id, o.user_id, u.name AS name, o.order_date, o.total_price,
             o.payment_method, o.payment_status, o.order_status
      FROM Orders o
      JOIN Users u ON o.user_id = u.id
      WHERE u.name LIKE ?
      ORDER BY o.order_date DESC
      LIMIT ? OFFSET ?
    `;

  db.query(
    query,
    [`%${name}%`, parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) {
        console.error("Lỗi tìm đơn hàng:", err);
        return res.status(500).json({ error: "Lỗi server" });
      }

      res.json({
        page,
        limit,
        orders: results,
      });
    }
  );
};

const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = `UPDATE Orders SET order_status = ? WHERE id = ?`;

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    res.json({ message: "Cập nhật trạng thái thành công" });
  });
};

const deleteOrder = (req, res) => {
  const { id } = req.params;

  // delete orders_detail
  const deleteDetailsQuery = `DELETE FROM Orders_Details WHERE order_id = ?`;
  db.query(deleteDetailsQuery, [id], (err, result) => {
    if (err) {
      console.error("Lỗi xóa chi tiết đơn hàng:", err);
      return res.status(500).json({ error: "Lỗi khi xóa chi tiết đơn hàng" });
    }

    // delete order
    const deleteOrderQuery = `DELETE FROM Orders WHERE id = ?`;
    db.query(deleteOrderQuery, [id], (err2, result2) => {
      if (err2) {
        console.error("Lỗi xóa đơn hàng:", err2);
        return res.status(500).json({ error: "Lỗi khi xóa đơn hàng" });
      }

      if (result2.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }

      res.json({ message: "Xóa đơn hàng thành công" });
    });
  });
};

module.exports = { getAllOrders, searchOrders, updateOrderStatus, deleteOrder };
