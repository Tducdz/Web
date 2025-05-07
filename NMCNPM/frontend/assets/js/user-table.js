let users = [];
let editingUserId = null;
let currentPage = 1;

// Lấy danh sách người dùng
const fetchUsers = (page = 1, searchTerm = "") => {
  let url = `http://localhost:8080/users`;
  if (searchTerm) {
    url += `/search?page=${page}&search=${searchTerm}`;
  } else {
    url += `?page=${page}`;
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
      return response.json();
    })
    .then((data) => {
      users = data.users;
      renderUsers();
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại!");
    });
};

// Hiển thị danh sách người dùng
const renderUsers = () => {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = ""; // Xóa nội dung cũ

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.ten_tai_khoan}</td>
      <td>${user.mat_khau}</td>
      <td>${user.so_dien_thoai}</td>
      <td>${user.vai_tro}</td>
      <td class="actions">
        <button class="edit" onclick="editUser(${user.id})">Sửa</button>
        <button class="delete" onclick="deleteUser(${user.id})">Xóa</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Xóa tài khoản
const deleteUser = (id) => {
  if (confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
    fetch(`http://localhost:8080/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Xóa thất bại");
        return response.json();
      })
      .then(() => {
        alert("Xóa thành công");
        fetchUsers(currentPage); // Cập nhật lại danh sách người dùng sau khi xóa
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Đã xảy ra lỗi khi xóa!");
      });
  }
};

// Hiển thị popup chỉnh sửa
const editUser = (id) => {
  const user = users.find((user) => user.id === id);
  if (user) {
    editingUserId = id; // Lưu ID người dùng đang sửa
    document.getElementById("editName").value = user.ten_tai_khoan;
    document.getElementById("editPassword").value = user.mat_khau;
    document.getElementById("editSdt").value = user.so_dien_thoai;
    document.getElementById("editRole").value = user.vai_tro;
    document.getElementById("editPopup").style.display = "flex";
  } else {
    alert("Không tìm thấy người dùng!");
  }
};

const saveChanges = () => {
  if (editingUserId === null) return;

  const updatedName = document.getElementById("editName").value.trim();
  const updatedPassword = document.getElementById("editPassword").value.trim();
  const updatedSdt = document.getElementById("editSdt").value.trim();
  const updatedRole = document.getElementById("editRole").value;

  if (!updatedName || !updatedSdt || !updatedRole || !updatedPassword) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(updatedSdt)) {
    alert("Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng 0!");
    return;
  }

  // Trùng sdt
  const isDuplicate = users.some(
    (user) => user.so_dien_thoai === updatedSdt && user.id !== editingUserId
  );

  if (isDuplicate) {
    alert("Số điện thoại đã có tài khoản khác!");
    return;
  }

  fetch(`http://localhost:8080/users/${editingUserId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ten_tai_khoan: updatedName,
      mat_khau: updatedPassword,
      so_dien_thoai: updatedSdt,
      vai_tro: updatedRole,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // **XỬ LÝ LỖI TRÙNG SỐ ĐIỆN THOẠI TỪ PHÍA SERVER (NẾU CÓ)**
        if (response.status === 409) {
          // Giả sử server trả về mã 409 khi số điện thoại trùng
          return response.json().then((data) => {
            throw new Error(data.message || "Số điện thoại này đã tồn tại!");
          });
        }
        throw new Error("Cập nhật thất bại");
      }
      return response.json();
    })
    .then(() => {
      alert("Cập nhật thành công");
      fetchUsers(currentPage);
      closePopup();
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      alert(error.message || "Đã xảy ra lỗi, vui lòng thử lại!");
    });
};

// Đóng popup
const closePopup = () => {
  document.getElementById("editPopup").style.display = "none";
};

// Tìm kiếm người dùng theo tên
document
  .querySelector(".search-account-button")
  .addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value || "";
    currentPage = 1; // Reset về trang 1 khi tìm kiếm
    fetchUsers(currentPage, searchTerm);
    document.querySelector(".control-page p").textContent = currentPage;
  });

// Xử lý phân trang
document
  .querySelector(".fa-angles-left")
  .parentElement.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchUsers(currentPage, document.getElementById("searchInput").value);
      document.querySelector(".control-page p").textContent = currentPage;
    }
  });

document
  .querySelector(".fa-angles-right")
  .parentElement.addEventListener("click", () => {
    currentPage++;
    fetchUsers(currentPage, document.getElementById("searchInput").value);
    document.querySelector(".control-page p").textContent = currentPage;
  });

// Hiển thị danh sách tài khoản khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
  fetchUsers(); // Gọi API khi trang được tải
});
