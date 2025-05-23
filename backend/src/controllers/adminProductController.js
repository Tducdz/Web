const db = require("../config/db");

const getPageProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const sql = "SELECT * FROM Products ORDER BY id LIMIT ? OFFSET ?";
  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi truy vấn sản phẩm." });
    }

    db.query("SELECT COUNT(*) AS total FROM Products", (err2, totalResult) => {
      if (err2) {
        return res.status(500).json({ message: "Lỗi lấy tổng số sản phẩm." });
      }

      const total = totalResult[0].total;
      const totalPages = Math.ceil(total / limit);
      res.status(200).json({ data: results, totalPages, page });
    });
  });
};

const getProductById = (req, res) => {
  const productId = req.params.id;

  const sqlProduct = "SELECT * FROM products WHERE id = ?";

  db.query(sqlProduct, [productId], (err, productResult) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy chi tiết sản phẩm." });
    }

    if (productResult.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    const product = productResult[0];
    res.status(200).json(product);
  });
};

const searchProducts = (req, res) => {
  let { keyword = "", page = 1 } = req.query;
  keyword = keyword.trim().toLowerCase();
  page = parseInt(page);
  const limit = 10;
  const offset = (page - 1) * limit;

  if (!keyword) {
    return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
  }

  const sql = `
    SELECT * FROM products
    WHERE LOWER(name) LIKE ?
    LIMIT ? OFFSET ?
  `;
  const values = [`%${keyword}%`, limit, offset];

  db.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm." });
    }

    const countSql = `SELECT COUNT(*) AS total FROM products WHERE LOWER(name) LIKE ?`;
    db.query(countSql, [`%${keyword}%`], (err2, countResult) => {
      if (err2) {
        return res.status(500).json({ message: "Lỗi lấy tổng số kết quả." });
      }

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);
      res.status(200).json({ data: results, totalPages, page });
    });
  });
};

const updateProduct = (req, res) => {
  const productId = req.params.id;
  const {
    category_id,
    name,
    price,
    price_old,
    screen_size,
    screen_tech,
    chipset,
    nfc,
    RAM,
    ROM,
    battery,
    sim_slots,
    os,
    water_resistant,
    stock,
    image_url,
  } = req.body;

  const sql = `
    UPDATE Products
    SET category_id = ?, name = ?, price = ?, price_old = ?, screen_size = ?, screen_tech = ?,
        chipset = ?, nfc = ?, RAM = ?, ROM = ?, battery = ?, sim_slots = ?, os = ?,
        water_resistant = ?, stock = ?, image_url = ?
    WHERE id = ?`;

  db.query(
    sql,
    [
      category_id,
      name,
      price,
      price_old,
      screen_size,
      screen_tech,
      chipset,
      nfc,
      RAM,
      ROM,
      battery,
      sim_slots,
      os,
      water_resistant,
      stock,
      image_url,
      productId,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      res.status(200).json({ message: "Cập nhật sản phẩm thành công" });
    }
  );
};

const addProduct = (req, res) => {
  const {
    category_id,
    name,
    price,
    screen_size,
    screen_tech,
    chipset,
    nfc,
    RAM,
    ROM,
    battery,
    sim_slots,
    os,
    water_resistant,
    stock,
  } = req.body;

  const imagePath = req.file ? `/img/${req.file.filename}` : null;

  if (!imagePath) {
    return res.status(400).json({ message: "Vui lòng tải lên ảnh sản phẩm." });
  }

  const checkProductSql = "SELECT * FROM Products WHERE name = ?";
  db.query(checkProductSql, [name], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi kiểm tra sản phẩm." });

    if (result.length > 0) {
      return res.status(400).json({ message: "Sản phẩm đã tồn tại." });
    }

    const sql = `
      INSERT INTO Products 
      (category_id, name, price, screen_size, screen_tech, chipset, nfc, RAM, ROM, battery, sim_slots, os, water_resistant, image_url, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        category_id,
        name,
        price,
        screen_size,
        screen_tech,
        chipset,
        nfc,
        RAM,
        ROM,
        battery,
        sim_slots,
        os,
        water_resistant,
        imagePath, // lưu đường dẫn
        stock,
      ],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi thêm sản phẩm." });
        res.status(201).json({ message: "Thêm sản phẩm thành công." });
      }
    );
  });
};

const deleteProduct = (req, res) => {
  const productId = req.params.id;

  const sql = "DELETE FROM Products WHERE id = ?";

  db.query(sql, [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi xóa sản phẩm." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    res.status(200).json({ message: "Xóa sản phẩm thành công." });
  });
};

module.exports = {
  getPageProducts,
  getProductById,
  searchProducts,
  updateProduct,
  addProduct,
  deleteProduct,
};
