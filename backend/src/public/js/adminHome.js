window.addEventListener("DOMContentLoaded", () => {
  const userRole = localStorage.getItem("user_role");
  const token = localStorage.getItem("jwt_token");
  if (userRole != "admin") {
    alert("Không có quyền truy cập");
    window.location.href = "index.html";
    return;
  }

  fetch(`${API_BASE_URL}/admin/`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("revenue").textContent =
        Number(data.monthlyRevenue).toLocaleString("vi-VN") + " VND";
      document.getElementById("sold").textContent = data.productsSold;
      document.getElementById("customers").textContent = data.uniqueCustomers;

      const top = data.topCustomer;

      document.getElementById("topCustomer").textContent = `${top.name} - 0${
        top.phone_number
      } - ${Number(top.totalSpent).toLocaleString("vi-VN")} VND`;
    })
    .catch((error) => {
      console.error("Lỗi lấy dữ liệu: ", error);
    });
});
