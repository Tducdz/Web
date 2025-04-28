document.addEventListener("DOMContentLoaded", function () {
  const commentTable = document.getElementById("commentTable");

  // Xử lý xóa bình luận
  commentTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      if (confirm("Bạn có chắc muốn xóa bình luận này không?")) {
        event.target.closest("tr").remove();
        alert("Bình luận đã được xóa!"); // Thêm thông báo thành công
      }
    }
  });

  // Xử lý duyệt bình luận
  commentTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("approve-btn")) {
      if (confirm("Bạn có chắc muốn duyệt bình luận này không?")) {
        // Thêm xác nhận
        const row = event.target.closest("tr");
        row.cells[5].innerText = "Đã duyệt"; // Cập nhật trạng thái thành "Đã duyệt"
        const actionCell = row.cells[6]; // Cột Hành Động
        actionCell.innerHTML = `
          <button class="btn delete-btn" style="background-color: #f44336; border: none">
            Xóa
          </button>
        `; // Chỉ giữ lại nút "Xóa"
        alert("Bình luận đã được duyệt!"); // Thêm thông báo thành công
      }
    }
  });
});
