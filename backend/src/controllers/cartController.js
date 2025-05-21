const db = require("../config/db");

const addOrUpdateCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || quantity == null) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin user_id, product_id hoặc quantity." });
  }

  if (quantity <= 0) {
    // Nếu quantity <= 0 thì xóa sản phẩm khỏi giỏ
    db.execute(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id],
      (err, result) => {
        if (err) {
          console.error("Error deleting cart item:", err);
          return res
            .status(500)
            .json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ." });
        }
        res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
      }
    );
  } else {
    // Nếu quantity > 0 thì cập nhật hoặc thêm mới
    db.execute(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id],
      (err, results) => {
        if (err) {
          console.error("Error checking cart item:", err);
          return res
            .status(500)
            .json({ message: "Lỗi kiểm tra sản phẩm trong giỏ." });
        }

        if (results.length > 0) {
          // Sản phẩm đã có => cập nhật
          db.execute(
            "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
            [quantity, user_id, product_id],
            (err, result) => {
              if (err) {
                console.error("Error updating cart item:", err);
                return res
                  .status(500)
                  .json({ message: "Lỗi khi cập nhật giỏ hàng." });
              }
              res
                .status(200)
                .json({ message: "Cập nhật giỏ hàng thành công." });
            }
          );
        } else {
          // Sản phẩm chưa có => thêm mới
          db.execute(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [user_id, product_id, quantity],
            (err, result) => {
              if (err) {
                console.error("Error adding cart item:", err);
                return res
                  .status(500)
                  .json({ message: "Lỗi khi thêm sản phẩm vào giỏ." });
              }
              res
                .status(201)
                .json({ message: "Đã thêm sản phẩm vào giỏ hàng." });
            }
          );
        }
      }
    );
  }
};

const getCartByUser = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "Thiếu thông tin user_id." });
  }

  db.execute(
    `SELECT cart.id AS cart_id, cart.user_id, cart.product_id, cart.quantity,
            products.name, products.price, products.image_url
     FROM cart
     JOIN products ON cart.product_id = products.id
     WHERE cart.user_id = ?`,
    [user_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ message: "Lỗi khi lấy giỏ hàng." });
      }
      res.status(200).json({ data: results });
    }
  );
};

module.exports = { addOrUpdateCart, getCartByUser };
