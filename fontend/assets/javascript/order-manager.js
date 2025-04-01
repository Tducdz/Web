document.addEventListener("DOMContentLoaded", function () {
  const orderTable = document.getElementById("orderTable");

  // Xử lý xóa đơn hàng
  orderTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      if (confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
        event.target.closest("tr").remove();
      }
    }
  });

  // Xử lý sửa đơn hàng
  let currentEditRow = null;
  const editModal = document.getElementById("editModal");
  const editCustomer = document.getElementById("editCustomer");
  const editProduct = document.getElementById("editProduct");
  const editTotal = document.getElementById("editTotal");
  const editStatus = document.getElementById("editStatus");
  const saveEdit = document.getElementById("saveEdit");
  const closeEdit = document.getElementById("closeEdit");

  orderTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
      currentEditRow = event.target.closest("tr");
      editCustomer.value = currentEditRow.cells[2].innerText;
      editProduct.value = currentEditRow.cells[3].innerText;
      editTotal.value = currentEditRow.cells[4].innerText;
      editStatus.value = currentEditRow.cells[5].innerText;

      editModal.style.display = "flex";
    }
  });

  // Lưu chỉnh sửa
  saveEdit.addEventListener("click", function () {
    if (currentEditRow) {
      currentEditRow.cells[2].innerText = editCustomer.value;
      currentEditRow.cells[3].innerText = editProduct.value;
      currentEditRow.cells[4].innerText = editTotal.value;
      currentEditRow.cells[5].innerText = editStatus.value;
    }
    editModal.style.display = "none";
  });

  // Đóng modal chỉnh sửa
  closeEdit.addEventListener("click", function () {
    editModal.style.display = "none";
  });
});
