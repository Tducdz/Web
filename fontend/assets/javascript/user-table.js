let users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    role: "Admin",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    role: "User",
    status: "Bị khóa",
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
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td class="actions" style="text-align: left;"">
                <button class="edit" onclick="editUser(${user.id})">Sửa</button>
                <button class="delete" onclick="deleteUser(${
                  user.id
                })">Xóa</button>
                <button class="lock" onclick="toggleLock(${user.id})">
                    ${user.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                </button>
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

// Khóa/Mở khóa tài khoản
function toggleLock(id) {
  const user = users.find((user) => user.id === id);
  if (user) {
    user.status = user.status === "Hoạt động" ? "Bị khóa" : "Hoạt động";
    renderUsers();
  }
}

// Hiển thị popup chỉnh sửa
function editUser(id) {
  const user = users.find((user) => user.id === id);
  if (user) {
    editingUserId = id; // Lưu ID người dùng đang sửa
    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editRole").value = user.role;
    document.getElementById("editStatus").value = user.status;

    document.getElementById("editPopup").style.display = "flex";
  }
}

// Lưu thông tin chỉnh sửa
function saveChanges() {
  if (editingUserId !== null) {
    const user = users.find((user) => user.id === editingUserId);
    if (user) {
      user.name = document.getElementById("editName").value;
      user.email = document.getElementById("editEmail").value;
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
