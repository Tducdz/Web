document.addEventListener("DOMContentLoaded", function () {
  const loginDiv = document.getElementById("login");
  const loginClickBtn = document.getElementById("login-click");
  const loginForm = loginDiv.querySelector(".login-form");
  const loginHeading = loginForm.querySelector("h2");
  const usernameLabel = loginForm.querySelector('label[for="username"]');
  const passwordLabel = loginForm.querySelector('label[for="password"]');
  const passwordInput = loginForm.querySelector("#password");
  const rewriteLabel = loginForm.querySelector("label.register");
  const rewriteInput = loginForm.querySelector("input.register");
  const registerHelpBtn = loginForm.querySelector("#register-btn");
  const forgotPasswordSpan = loginForm.querySelector(".help span:last-child");
  const loginSubmitBtn = loginForm.querySelector("#login-btn.login-btn");
  const registerSubmitBtn = loginForm.querySelector("button.register");

  let isRegistering = false;

  function toggleRegisterForm() {
    isRegistering = !isRegistering;

    if (isRegistering) {
      loginHeading.textContent = "Đăng ký";
      rewriteLabel.style.display = "block";
      rewriteInput.style.display = "block";
      forgotPasswordSpan.style.display = "none";
      loginSubmitBtn.style.display = "none";
      registerSubmitBtn.style.display = "block";
      registerHelpBtn.textContent = "Đăng nhập";
    } else {
      loginHeading.textContent = "Đăng nhập";
      rewriteLabel.style.display = "none";
      rewriteInput.style.display = "none";
      forgotPasswordSpan.style.display = "block";
      loginSubmitBtn.style.display = "block";
      registerSubmitBtn.style.display = "none";
      registerHelpBtn.textContent = "Đăng ký";
    }
  }

  registerHelpBtn.addEventListener("click", toggleRegisterForm);

  const token = localStorage.getItem("jwt_token");
  if (!token) {
    loginClickBtn.addEventListener("click", function (event) {
      event.preventDefault();
      loginDiv.style.display = "flex";
      isRegistering = false;
      loginHeading.textContent = "Đăng nhập";
      rewriteLabel.style.display = "none";
      rewriteInput.style.display = "none";
      forgotPasswordSpan.style.display = "block";
      loginSubmitBtn.style.display = "block";
      registerSubmitBtn.style.display = "none";
      registerHelpBtn.textContent = "Đăng ký";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === loginDiv) {
      loginDiv.style.display = "none";
    }
  });

  loginSubmitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_name", data.user.name);
        localStorage.setItem("user_role", data.user.role);

        alert("Đăng nhập thành công!");
        window.location.reload();
      } else {
        alert(data.message || "Sai thông tin đăng nhập.");
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert("Không thể kết nối đến máy chủ.");
    }
  });

  registerSubmitBtn.addEventListener("click", async function (e) {
    if (!isRegistering) return;
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("rewrite").value.trim();

    if (!email || !password || !confirm) {
      return alert("Vui lòng nhập đầy đủ thông tin.");
    }

    if (password !== confirm) {
      return alert("Mật khẩu xác nhận không khớp.");
    }

    const name = email.split("@")[0];

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công! Mời bạn đăng nhập.");
        toggleRegisterForm();
      } else {
        alert(data.message || "Đăng ký thất bại.");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert("Không thể kết nối đến máy chủ.");
    }
  });

  updateLoginButton();
});

function updateLoginButton() {
  const userName = localStorage.getItem("user_name");
  const userRole = localStorage.getItem("user_role"); // Lấy vai trò người dùng
  const loginBtn = document.getElementById("login-click");

  if (userName && loginBtn) {
    let dropdownHTML = `
      <div class="user-dropdown">
        <a href="#" class="mode" id="user-toggle">
          <i class="fa-solid fa-user" style="color: #ffffff"></i>
          <span>${userName}</span>
          <i class="fa-solid fa-caret-down" style="margin-left: 5px; color: white;"></i>
        </a>
        <ul class="dropdown-menu" id="user-menu">
          <li><a href="yourAccount.html">Thông tin tài khoản</a></li>
    `;

    if (userRole === "admin") {
      dropdownHTML += `<li><a href="adminHome.html">Trang quản trị</a></li>`;
    }

    dropdownHTML += `
          <li><a href="#" id="logout-btn">Đăng xuất</a></li>
        </ul>
      </div>
    `;

    loginBtn.innerHTML = dropdownHTML;

    // Toggle dropdown
    const toggleBtn = document.getElementById("user-toggle");
    const menu = document.getElementById("user-menu");

    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      menu.classList.toggle("show");
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener("click", function (e) {
      const isClickInside =
        toggleBtn.contains(e.target) || menu.contains(e.target);
      if (!isClickInside) {
        menu.classList.remove("show");
      }
    });

    // Log out
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.clear();
      window.location.reload();
    });
  }
}
