let editingUserId = null;
const token = localStorage.getItem("jwt_token");

async function fetchUsers(page = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    if (!response.ok) throw new Error("Lỗi lấy danh sách người dùng");
    return await response.json();
  } catch (error) {
    alert("Không thể lấy danh sách người dùng");
    return [];
  }
}

async function searchUsers(keyword, page = 1) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/users/search?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}`,
      { method: "GET", headers: { Authorization: "Bearer " + token } }
    );
    if (!response.ok) throw new Error("Lỗi tìm kiếm người dùng");
    const data = await response.json();
    return data.data;
  } catch (error) {
    alert("Không thể tìm kiếm người dùng");
    return [];
  }
}

async function renderUsers(page = 1) {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";
  const users = await fetchUsers(page);
  users.forEach((user, index) => {
    const status = user.password === null ? "Bị khóa" : "Hoạt động";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone_number ? `0${user.phone_number}` : "-"}</td>
      <td>${user.address || "-"}</td>
      <td>${user.role}</td>
      <td>${status}</td>
      <td class="actions" style="text-align: left;">
        <button class="edit" onclick="editUser(${user.id})">Sửa</button>
        <button class="delete" onclick="deleteUser(${user.id})">Xóa</button>
        <button class="lock" onclick="toggleLock(${user.id}, '${status}')">
          ${status === "Hoạt động" ? "Khóa" : "Mở khóa"}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function deleteUser(id) {
  if (confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!response.ok) throw new Error();
      alert("Xóa tài khoản thành công");
      renderUsers();
    } catch {
      alert("Không thể xóa tài khoản");
    }
  }
}

async function toggleLock(id, currentStatus) {
  try {
    const endpoint = currentStatus === "Hoạt động" ? "disable" : "enable";
    const response = await fetch(
      `${API_BASE_URL}/admin/users/${id}/${endpoint}`,
      {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      }
    );
    if (!response.ok) throw new Error();
    alert(
      `Tài khoản đã được ${currentStatus === "Hoạt động" ? "khóa" : "mở khóa"}`
    );
    renderUsers();
  } catch {
    alert(
      `Không thể ${
        currentStatus === "Hoạt động" ? "khóa" : "mở khóa"
      } tài khoản`
    );
  }
}

async function editUser(id) {
  if (!token) {
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error();
    const user = await response.json();
    if (!user || !user.name || !user.email || !user.role) throw new Error();

    editingUserId = id;

    const e = (id) => document.getElementById(id);
    e("editName").value = user.name;
    e("editEmail").value = user.email;
    e("editPassword").value = "";
    e("editPhoneNumber").value = user.phone_number
      ? `0${user.phone_number}`
      : "";
    e("editAddress").value = user.address || "";
    e("editRole").value = user.role;
    e("editPopup").style.display = "flex";
  } catch {
    alert("Không thể lấy thông tin người dùng");
  }
}

async function saveChanges() {
  if (!token) {
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    window.location.href = "/login";
    return;
  }
  if (!editingUserId) {
    alert("Không có tài khoản được chọn");
    return;
  }

  const e = (id) => document.getElementById(id);
  const name = e("editName").value.trim();
  const email = e("editEmail").value.trim();
  const password = e("editPassword").value.trim();
  let phone_number = e("editPhoneNumber").value.trim();
  const address = e("editAddress").value.trim();
  const role = e("editRole").value;

  if (!name || !email || !role) {
    alert("Vui lòng điền đầy đủ tên, email và vai trò");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Email không hợp lệ");
    return;
  }

  if (phone_number && !/^0?\d{9,10}$/.test(phone_number)) {
    alert("Số điện thoại phải chứa 10-11 chữ số và bắt đầu bằng 0");
    return;
  }

  try {
    const userData = { name, email, phone_number, address, role };
    if (password) userData.password = password;

    const response = await fetch(
      `${API_BASE_URL}/admin/users/${editingUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Lỗi cập nhật tài khoản");
    }

    alert("Cập nhật tài khoản thành công");
    await renderUsers();
    closePopup();
  } catch (error) {
    alert(`Không thể cập nhật tài khoản: ${error.message}`);
  }
}

function closePopup() {
  document.getElementById("editPopup").style.display = "none";
  editingUserId = null;
}

async function handleSearch() {
  const keyword = document.getElementById("searchInput").value;
  const page = document.getElementById("pageInput")?.value || 1;
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";
  const users = await searchUsers(keyword, page);
  users.forEach((user, index) => {
    const status = user.password === null ? "Bị khóa" : "Hoạt động";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone_number ? `0${user.phone_number}` : "-"}</td>
      <td>${user.address || "-"}</td>
      <td>${user.role}</td>
      <td>${status}</td>
      <td class="actions" style="text-align: left;">
        <button class="edit" onclick="editUser(${user.id})">Sửa</button>
        <button class="delete" onclick="deleteUser(${user.id})">Xóa</button>
        <button class="lock" onclick="toggleLock(${user.id}, '${status}')">
          ${status === "Hoạt động" ? "Khóa" : "Mở khóa"}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderUsers();
  const byId = (id) => document.getElementById(id);
  byId("searchButton")?.addEventListener("click", handleSearch);
  byId("pageInput")?.addEventListener("change", (e) =>
    renderUsers(e.target.value)
  );
  byId("saveChanges")?.addEventListener("click", saveChanges);
  byId("closePopup")?.addEventListener("click", closePopup);
});
