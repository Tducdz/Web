document.addEventListener("DOMContentLoaded", function () {
  const orderButton = document.getElementById("order-submit");
  const paymentPopup = document.getElementById("paymentPopup");
  const closePayment = document.getElementById("closePayment");
  const confirmPayment = document.getElementById("confirmPayment");
  const totalAmount = document.getElementById("totalAmount");
  const paymentMethod = document.getElementById("paymentMethod");
  const qrCodeContainer = document.getElementById("qrCodeContainer");

  let orderTotal = 294210000; // Tổng tiền mẫu (có thể cập nhật động)

  // Hiển thị popup khi nhấn "Đặt hàng"
  orderButton.addEventListener("click", function (event) {
    event.preventDefault();
    totalAmount.innerText = orderTotal.toLocaleString();
    paymentPopup.style.display = "block";
  });

  // Ẩn popup khi nhấn "Hủy"
  closePayment.addEventListener("click", function () {
    paymentPopup.style.display = "none";
  });

  // Hiển thị mã QR khi chọn "Chuyển khoản"
  paymentMethod.addEventListener("change", function () {
    if (paymentMethod.value === "Chuyển khoản") {
      qrCodeContainer.style.display = "block";
    } else {
      qrCodeContainer.style.display = "none";
    }
  });

  // Xác nhận thanh toán
  confirmPayment.addEventListener("click", function () {
    alert("Thanh toán thành công bằng: " + paymentMethod.value);
    paymentPopup.style.display = "none";
  });
});
