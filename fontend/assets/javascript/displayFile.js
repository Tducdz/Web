// Hiện tên file
document.getElementById("fileUpload").addEventListener("change", function () {
  let fileName = this.files.length > 0 ? this.files[0].name : "";
  document.getElementById("fileName").textContent = fileName;
});

// Giới hạn kí tự
document.getElementById("fileUpload").addEventListener("change", function () {
  let fileName = this.files.length > 0 ? this.files[0].name : "";
  let maxLength = 15; // 15 kí tự
  if (fileName.length > maxLength) {
    fileName = fileName.substring(0, maxLength) + "…";
  }

  document.getElementById("fileName").textContent = fileName;
});

// Giới hạn kích thước
document.getElementById("fileUpload").addEventListener("change", function () {
  let file = this.files[0];

  if (file) {
    let maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      alert("File quá lớn! Vui lòng chọn ảnh nhỏ hơn 2MB.");
      this.value = ""; // Xóa file đã chọn
      document.getElementById("fileName").textContent = "";
      return;
    }

    let fileName = file.name;
    let maxLength = 15;
    if (fileName.length > maxLength) {
      fileName = fileName.substring(0, maxLength) + "…";
    }

    document.getElementById("fileName").textContent = fileName;
  } else {
    document.getElementById("fileName").textContent = "";
  }
});
