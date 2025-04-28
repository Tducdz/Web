document.getElementById("login-click").addEventListener("click", function () {
  document.getElementById("login").style.display = "flex";
});

document.getElementById("login").addEventListener("click", function (event) {
  if (event.target === this) {
    this.style.display = "none";
  }
});

document.getElementById("register-btn").addEventListener("click", function () {
  let elements = document.getElementsByClassName("register");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.display = "inline-block";
  }
  document.getElementById("login-btn").style.display = "none";
});
