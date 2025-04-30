const db = require("../config/db");

const getProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const { brand, priceRange, ramRange, screenSize, rom } = req.query;

  const conditions = [];
  const values = [];

  const addCondition = (condition, ...vals) => {
    //...vals là rest parameter — nghĩa là nó gom nhiều giá trị vào thành một mảng vals
    conditions.push(condition);
    values.push(...vals); // Dấu 3 chấm để đẩy từng phần tử vào
  };

  // Brand
  if (brand) addCondition("category_id = ?", Number(brand));

  // Price
  if (priceRange) {
    switch (priceRange) {
      case "duoi-2":
        addCondition("price < ?", 2_000_000);
        break;
      case "tren-15":
        addCondition("price > ?", 15_000_000);
        break;
      default:
        const [min, max] = priceRange.split("-").map(Number);
        addCondition("price BETWEEN ? AND ?", min * 1_000_000, max * 1_000_000);
    }
  }

  // RAM
  if (ramRange) {
    switch (ramRange) {
      case "duoi-4":
        addCondition("RAM < ?", 4);
        break;
      case "tren-16":
        addCondition("RAM > ?", 16);
        break;
      default:
        const [min, max] = ramRange.split("-").map(Number);
        addCondition("RAM BETWEEN ? AND ?", min, max);
    }
  }

  // Screen size
  if (screenSize) {
    switch (screenSize) {
      case "duoi-5.5":
        addCondition("screen_size < ?", 5.5);
        break;
      case "tren-6.3":
        addCondition("screen_size >= ?", 6.3);
        break;
      default:
        const [min, max] = screenSize.split("-").map(Number);
        addCondition("screen_size BETWEEN ? AND ?", min, max);
    }
  }

  // ROM
  if (rom) {
    switch (rom) {
      case "duoi-32":
        addCondition("ROM < ?", 32);
        break;
      case "512+":
        addCondition("ROM >= ?", 512);
        break;
      default:
        addCondition("ROM = ?", Number(rom));
    }
  }

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const sql = `SELECT * FROM products ${whereClause} LIMIT ? OFFSET ?`;

  db.query(sql, [...values, limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm." });
    }

    res.status(200).json({
      data: results,
    });
  });
};

const getProductById = (req, res) => {
  const productId = req.params.id;

  const sqlProduct = "SELECT * FROM products WHERE id = ?";
  const sqlComments = `
    SELECT c.id, c.comment, c.creat_at, u.name AS user_name
    FROM Comments c
    JOIN Users u ON c.user_id = u.id
    WHERE c.product_id = ?
    ORDER BY c.creat_at DESC
  `;

  db.query(sqlProduct, [productId], (err, productResult) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy chi tiết sản phẩm." });
    }

    if (productResult.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    const product = productResult[0];

    // Comment
    db.query(sqlComments, [productId], (err, commentResult) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi lấy bình luận." });
      }

      res.status(200).json({
        product,
        comments: commentResult,
      });
    });
  });
};

const searchProducts = (req, res) => {
  const { keyword } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  if (!keyword) {
    return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
  }

  const searchQuery = `
    SELECT * FROM products
    WHERE LOWER(name) LIKE LOWER(?)
    LIMIT ? OFFSET ?
  `;

  const searchValue = [`%${keyword}%`, limit, offset];

  db.query(searchQuery, searchValue, (err, results) => {
    if (err) {
      console.error("Error searching products:", err);
      return res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm." });
    }

    res.status(200).json({ data: results });
  });
};

module.exports = { getProducts, getProductById, searchProducts };
