const db = require("../config/db");

const getAdminSummary = (req, res) => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentYear = new Date().getFullYear();

  const revenueSQL = `
      SELECT SUM(total_price) AS monthlyRevenue
      FROM Orders
      WHERE MONTH(order_date) = ? AND YEAR(order_date) = ?
    `;

  const soldSQL = `
      SELECT SUM(Orders_Details.quantity) AS productsSold
      FROM Orders
      JOIN Orders_Details ON Orders.id = Orders_Details.order_id
      WHERE MONTH(Orders.order_date) = ? AND YEAR(Orders.order_date) = ?
    `;

  const customerSQL = `
      SELECT COUNT(DISTINCT user_id) AS uniqueCustomers
      FROM Orders
      WHERE MONTH(order_date) = ? AND YEAR(order_date) = ?
    `;

  const topCustomerSQL = `
      SELECT Users.name, SUM(Orders.total_price) AS totalSpent
      FROM Orders
      JOIN Users ON Orders.user_id = Users.id
      WHERE MONTH(order_date) = ? AND YEAR(order_date) = ?
      GROUP BY Users.id
      ORDER BY totalSpent DESC
      LIMIT 1
    `;

  // Thực hiện tất cả truy vấn song song
  db.query(revenueSQL, [currentMonth, currentYear], (err, revResult) => {
    if (err)
      return res.status(500).json({ message: "Lỗi truy vấn doanh thu." });

    db.query(soldSQL, [currentMonth, currentYear], (err, soldResult) => {
      if (err)
        return res.status(500).json({ message: "Lỗi truy vấn số lượng bán." });

      db.query(
        customerSQL,
        [currentMonth, currentYear],
        (err, customerResult) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Lỗi truy vấn khách hàng." });

          db.query(
            topCustomerSQL,
            [currentMonth, currentYear],
            (err, topResult) => {
              if (err)
                return res
                  .status(500)
                  .json({ message: "Lỗi truy vấn khách chi tiêu cao nhất." });

              const summary = {
                monthlyRevenue: revResult[0].monthlyRevenue || 0,
                productsSold: soldResult[0].productsSold || 0,
                uniqueCustomers: customerResult[0].uniqueCustomers || 0,
                topCustomer: topResult[0] || null,
              };

              res.status(200).json(summary);
            }
          );
        }
      );
    });
  });
};

module.exports = { getAdminSummary };
