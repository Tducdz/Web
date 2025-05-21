document.getElementById("order-submit").addEventListener("click", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    return alert("Vui lòng điền đầy đủ thông tin giao hàng.");
  }

  // Hiển thị popup thanh toán
  document.getElementById("paymentPopup").style.display = "block";
});

document
  .getElementById("paymentMethod")
  .addEventListener("change", function () {
    const qrContainer = document.getElementById("qrCodeContainer");
    if (this.value === "Chuyển khoản") {
      qrContainer.style.display = "block";
    } else {
      qrContainer.style.display = "none";
    }
  });

document
  .getElementById("confirmPayment")
  .addEventListener("click", async () => {
    const user_id = localStorage.getItem("user_id");
    const payment_method = document.getElementById("paymentMethod").value;
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!user_id || !address || !payment_method) {
      return alert("Thiếu thông tin đơn hàng.");
    }

    const shipping_address = `Tên: ${name} | SĐT: ${phone} | Địa chỉ: ${address}`;

    try {
      const res = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({ user_id, payment_method, shipping_address }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Đặt hàng thành công! Mã đơn: " + data.order_id);
        window.location.href = "customerOrders.html";
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert("Không thể kết nối máy chủ.");
    }
  });

document.getElementById("closePayment").addEventListener("click", () => {
  document.getElementById("paymentPopup").style.display = "none";
});
