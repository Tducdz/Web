document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt_token");
  fetch(`${API_BASE_URL}/order/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("orderTable");
      tbody.innerHTML = "";

      data.forEach((order) => {
        const productList = order.products
          .map((p) => `${p.name} (x${p.quantity})`)
          .join("<br>");
        const date = new Date(order.order_date);
        const formattedDate = date.toLocaleDateString("vi-VN");
        const row = `
          <tr>
            <td>${order.order_id}</td>
            <td>${formattedDate}</td>
            <td>${productList}</td>
            <td>${order.products.reduce((acc, p) => acc + p.quantity, 0)}</td>
            <td>${order.total_price.toLocaleString()}đ</td>
            <td>${order.order_status}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch((err) => {
      console.error("Lỗi khi lấy đơn hàng:", err);
    });
});
