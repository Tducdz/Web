let users = [
  {
    id: 1,
    name: "Đào Trung Đức",
    sdt: "0987654321",
    role: "NQT",
  },
  {
    id: 2,
    name: "Trần Thị B",
    sdt: "0976543218",
    role: "MG",
  },
];

let editingUserId = null; // Lưu ID tài khoản đang chỉnh sửa

// Hiển thị danh sách tài khoản
function renderUsers() {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = ""; // Xóa nội dung cũ

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.sdt}</td>
            <td>${user.role}</td>
            <td class="actions">
                <button class="edit" onclick="editUser(${user.id})">Sửa</button>
                <button class="delete" onclick="deleteUser(${
                  user.id
                })">Xóa</button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Xóa tài khoản
function deleteUser(id) {
  if (confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
    users = users.filter((user) => user.id !== id);
    renderUsers();
  }
}

// Hiển thị popup chỉnh sửa
function editUser(id) {
  const user = users.find((user) => user.id === id);
  if (user) {
    editingUserId = id; // Lưu ID người dùng đang sửa
    document.getElementById("editName").value = user.name;
    document.getElementById("editSdt").value = user.sdt;
    document.getElementById("editRole").value = user.role;

    document.getElementById("editPopup").style.display = "flex";
  }
}

// Lưu thông tin chỉnh sửa
function saveChanges() {
  if (editingUserId !== null) {
    const user = users.find((user) => user.id === editingUserId);
    if (user) {
      user.name = document.getElementById("editName").value;
      user.sdt = document.getElementById("editSdt").value;
      user.role = document.getElementById("editRole").value;
      user.status = document.getElementById("editStatus").value;

      renderUsers();
      closePopup();
    }
  }
}

// Đóng popup
function closePopup() {
  document.getElementById("editPopup").style.display = "none";
}

// Hiển thị danh sách tài khoản khi trang tải xong
document.addEventListener("DOMContentLoaded", renderUsers);
