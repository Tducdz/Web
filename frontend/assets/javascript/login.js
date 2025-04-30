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

  // Hàm chuyển đổi giữa đăng nhập và đăng ký (giữ nguyên)
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
  registerSubmitBtn.addEventListener("click", toggleRegisterForm);

  // Xử lý sự kiện click để hiển thị form đăng nhập
  loginClickBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> (nếu có)
    loginDiv.style.display = "flex"; // Hiển thị form bằng cách thay đổi display thành flex
    isRegistering = false; // Đảm bảo khi hiển thị luôn ở trạng thái đăng nhập ban đầu
    loginHeading.textContent = "Đăng nhập";
    rewriteLabel.style.display = "none";
    rewriteInput.style.display = "none";
    forgotPasswordSpan.style.display = "block";
    loginSubmitBtn.style.display = "block";
    registerSubmitBtn.style.display = "none";
    registerHelpBtn.textContent = "Đăng ký";
  });

  window.addEventListener("click", function (event) {
    if (event.target === loginDiv) {
      loginDiv.style.display = "none";
    }
  });
});
