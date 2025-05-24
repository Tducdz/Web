const token = localStorage.getItem("jwt_token");

document.addEventListener("DOMContentLoaded", function () {
  const orderTableBody = document.getElementById("orderTableBody");
  const searchForm = document.getElementById("searchForm");
  const searchName = document.getElementById("searchName");
  const editModal = document.getElementById("editModal");
  const editAddress = document.getElementById("editAddress");
  const editStatus = document.getElementById("editStatus");
  const saveEdit = document.getElementById("saveEdit");
  const closeEdit = document.getElementById("closeEdit");
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  const currentPageElement = document.getElementById("currentPage");

  let editingOrderId = null;
  let currentPage = 1;
  let totalPages = 1;
  let currentSearch = "";

  // Định dạng ngày
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Định dạng tiền
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  function renderOrders(orders) {
    orderTableBody.innerHTML = "";
    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.dataset.id = order.id;
      row.dataset.address = order.shipping_address;
      row.dataset.status = order.order_status;
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${formatDate(order.order_date)}</td>
        <td>${order.name}</td>
        <td>${formatPrice(order.total_price)}</td>
        <td>${order.payment_method}</td>
        <td>${order.payment_status}</td>
        <td>${order.order_status}</td>
        <td>${order.shipping_address}</td>
        <td>
          <button class="edit-btn">Sửa</button>
          <button class="delete-btn">Xóa</button>
        </td>
      `;
      orderTableBody.appendChild(row);
    });
  }

  function fetchOrders(page = 1, limit = 10, search = "") {
    const url = search
      ? `${API_BASE_URL}/admin/orders/search?name=${encodeURIComponent(
          search
        )}&page=${page}&limit=${limit}`
      : `${API_BASE_URL}/admin/orders?page=${page}&limit=${limit}`;

    fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Không được phép truy cập");
        return res.json();
      })
      .then((data) => {
        renderOrders(data.orders);
        currentPage = data.page;
        totalPages = Math.ceil(data.totalOrders / data.limit);
        updatePagination();
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách đơn hàng:", err);
        alert(err.message || "Lỗi khi lấy danh sách đơn hàng");
      });
  }

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    currentSearch = searchName.value.trim();
    currentPage = 1;
    fetchOrders(currentPage, 10, currentSearch);
  });

  orderTableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const row = event.target.closest("tr");
      const id = row.dataset.id;
      if (confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
        fetch(`${API_BASE_URL}/admin/orders/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.status === 401) throw new Error("Không được phép truy cập");
            return res.json();
          })
          .then((data) => {
            alert(data.message || "Đã xóa");
            row.remove();
          })
          .catch((err) => {
            console.error("Lỗi xóa đơn hàng:", err);
            alert(err.message || "Lỗi khi xóa đơn hàng");
          });
      }
    }
  });

  orderTableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
      const row = event.target.closest("tr");
      editingOrderId = row.dataset.id;
      editAddress.value = row.dataset.address || "";
      editStatus.value = row.dataset.status || "Chờ xác nhận";
      editPaymentStatus.value = row.dataset.paymentStatus || "Chưa thanh toán";
      editModal.style.display = "flex";
    }
  });

  saveEdit.addEventListener("click", function () {
    if (!editingOrderId) return;

    fetch(`${API_BASE_URL}/admin/orders/${editingOrderId}/status`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: editAddress.value,
        status: editStatus.value,
        payment_status: editPaymentStatus.value,
      }),
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Không được phép truy cập");
        return res.json();
      })
      .then((data) => {
        alert(data.message || "Cập nhật thành công");
        fetchOrders();
        editModal.style.display = "none";
      })
      .catch((err) => {
        console.error("Lỗi cập nhật đơn hàng:", err);
        alert(err.message || "Lỗi khi cập nhật đơn hàng");
      });
  });

  closeEdit.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  prevPage.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      fetchOrders(currentPage, 10, currentSearch);
    }
  });

  nextPage.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      fetchOrders(currentPage, 10, currentSearch);
    }
  });

  function updatePagination() {
    currentPageElement.textContent = currentPage;
    prevPage.classList.toggle("opacity-50", currentPage === 1);
    prevPage.classList.toggle("pointer-events-none", currentPage === 1);
    nextPage.classList.toggle("opacity-50", currentPage === totalPages);
    nextPage.classList.toggle(
      "pointer-events-none",
      currentPage === totalPages
    );
  }

  fetchOrders(currentPage, 10, currentSearch);
});
