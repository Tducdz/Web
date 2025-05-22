document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("jwt_token");

  if (!userId || !token) {
    alert("Bạn chưa đăng nhập.");
    window.location.href = "index.html";
    return;
  }

  // --- LẤY THÔNG TIN NGƯỜI DÙNG ---
  try {
    const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Không thể lấy thông tin.");
      return;
    }

    const inputs = document.querySelectorAll(".account-infor input");
    inputs[0].value = data.name || "";
    inputs[1].value = "0" + data.phone_number || "";
    inputs[2].value = data.address || "";
    inputs[3].value = data.email || "";
    inputs[3].setAttribute("disabled", true);
  } catch (err) {
    console.error("Lỗi khi tải thông tin:", err);
  }
});

// Sửa thông tin
document.querySelector(".infor-button").addEventListener("click", async () => {
  const name = document
    .querySelector(".account-infor input:nth-of-type(1)")
    .value.trim();
  const rawPhone = document
    .querySelector(".account-infor input:nth-of-type(2)")
    .value.trim();
  const phone = rawPhone.startsWith("0") ? rawPhone.slice(1) : rawPhone;
  const address = document
    .querySelector(".account-infor input:nth-of-type(3)")
    .value.trim();
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("jwt_token");

  if (!name || !phone || !address) {
    return alert("Vui lòng điền đầy đủ thông tin.");
  }

  try {
    const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, phone_number: phone, address }),
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) {
      localStorage.setItem("user_name", name); // Cập nhật tên hiển thị
    }
  } catch (err) {
    console.error("Lỗi cập nhật thông tin:", err);
    alert("Có lỗi xảy ra.");
  }
});

// Đổi mật khẩu
document
  .querySelector(".password-button")
  .addEventListener("click", async () => {
    const oldPass = document.querySelector(
      ".account-password input:nth-of-type(1)"
    ).value;
    const newPass = document.querySelector(
      ".account-password input:nth-of-type(2)"
    ).value;
    const confirm = document.querySelector(
      ".account-password input:nth-of-type(3)"
    ).value;
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("jwt_token");

    if (!oldPass || !newPass || !confirm) {
      return alert("Vui lòng nhập đầy đủ mật khẩu.");
    }

    if (newPass !== confirm) {
      return alert("Xác nhận mật khẩu không khớp.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/user/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      alert("Có lỗi xảy ra.");
    }
  });
