document.getElementById("fileUpload").addEventListener("change", function () {
  let file = this.files[0];
  let fileNameDisplay = document.getElementById("fileName");

  if (!file) {
    fileNameDisplay.textContent = "";
    return;
  }

  // Kiểm tra loại file là ảnh
  if (!file.type.startsWith("image/")) {
    alert("Vui lòng chọn một file ảnh hợp lệ (jpg, png, webp, ...).");
    this.value = "";
    fileNameDisplay.textContent = "";
    return;
  }

  // Giới hạn kích thước 2MB
  let maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("File quá lớn! Vui lòng chọn ảnh nhỏ hơn 2MB.");
    this.value = "";
    fileNameDisplay.textContent = "";
    return;
  }

  // Lấy tên file và giới hạn ký tự
  let fileName = file.name;
  let maxLength = 15;
  if (fileName.length > maxLength) {
    fileName = fileName.substring(0, maxLength) + "…";
  }

  fileNameDisplay.textContent = fileName;
});
