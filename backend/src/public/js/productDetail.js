window.onload = function () {
  const productId = parseInt(
    new URLSearchParams(window.location.search).get("id")
  );
  if (!productId) return;

  fetchProductById(productId)
    .then(({ product, comments }) => {
      renderProductDetail(product);
      renderComments(comments);
      setupActionButtons(product);
    })
    .catch((err) => {
      document.querySelector(".product").innerHTML =
        "<p>Không tìm thấy sản phẩm.</p>";
    });
};

function renderProductDetail(product) {
  const productContainer = document.querySelector(".product");
  productContainer.innerHTML = `
      <div class="product-img">
        <img src="/img/${product.image_url || "default.jpg"}" alt="${
    product.name
  }" />
        <h3 style="text-align: center; font-size: 16px; font-weight: 600; margin-top: 12px;">
          ${product.name}
        </h3>
        <p style="text-align: center; font-size: 20px; font-weight: 500; margin-top: 8px;">
          Giá ưu đãi: ${Number(product.price || 0).toLocaleString("vi-VN")}đ
        </p>
        <div class="table">
          <h2><i class="fa-solid fa-gift" style="color: #ff5757"></i> Khuyến mãi</h2>
          <p><i class="fa-solid fa-star" style="color: #ffd43b"></i> Trả góp 0%, kỳ hạn 12 tháng, không phụ phí</p>
          <p><i class="fa-solid fa-star" style="color: #ffd43b"></i> Tặng Voucher giảm 300.000đ cho đơn hàng tiếp theo</p>
          <p><i class="fa-solid fa-star" style="color: #ffd43b"></i> Giảm ngay 200.000đ khi khách hàng là sinh viên</p>
        </div>
      </div>
      <div class="functions">
        <div class="button red" id="buy-now">Mua ngay</div>
        <div class="button orange" id="add-to-cart">Thêm vào giỏ hàng</div>
        <div class="product-information">
          <h2>Thông số kỹ thuật</h2>
          <div class="information-form">
            <ul>
              <li>Kích thước màn hình: ${
                product.screen_size || "N/A"
              } inches</li>
              <li>Công nghệ màn hình: ${product.screen_tech || "N/A"}</li>
              <li>Chipset: ${product.chipset || "N/A"}</li>
              <li>Công nghệ NFC: ${product.nfc ? "Có" : "Không"}</li>
              <li>Dung lượng RAM: ${product.RAM || "N/A"} GB</li>
              <li>Bộ nhớ trong: ${product.ROM || "N/A"} GB</li>
              <li>Pin: ${product.battery || "N/A"} mAh</li>
              <li>Số thẻ SIM: ${product.sim_slots || "N/A"}</li>
              <li>Hệ điều hành: ${product.os || "N/A"}</li>
              <li>Chỉ số kháng nước: ${product.water_resistant || "N/A"}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="extra">
        <div class="table">
          <h2>Sản phẩm còn hàng tại</h2>
          <p>Km 10 Nguyễn Trãi, Hà Đông, Hà Nội</p>
          <p>122 Hoàng Quốc Việt, Nghĩa Tân, Cầu Giấy, Hà Nội</p>
          <p>Đường Man Thiện, Thủ Đức, TP.HCM</p>
        </div>
        <div class="table">
          <h2>Yên Tâm Mua Sắm</h2>
          <p>Đội ngũ kỹ thuật tư vấn chuyên sâu</p>
          <p>Thanh toán thuận tiện</p>
          <p>Sản phẩm 100% chính hãng</p>
          <p>Bảo hành 1 đổi 1</p>
          <p>Giá rẻ nhất thị trường</p>
        </div>
      </div>
    `;
}

function renderComments(comments = []) {
  const commentList = document.querySelector(".comment-list");
  if (!commentList) return;

  if (!Array.isArray(comments)) {
    commentList.innerHTML = "<p>Không có bình luận nào.</p>";
    return;
  }

  commentList.innerHTML = comments
    .map((c) => {
      const user = c.user_name || "Ẩn danh";
      const content = c.comment || "Không có nội dung";
      const date = c.create_at
        ? new Date(c.create_at).toLocaleDateString("vi-VN")
        : "N/A";
      return `
        <div class="comment-item">
          <div class="comment-header">
            <span class="user">${user}</span>
            <span class="date"><i class="fa-regular fa-clock fa-l"></i> ${date}</span>
          </div>
          <div class="comment-content">${content}</div>
        </div>
      `;
    })
    .join("");
}

function setupActionButtons(product) {
  const buyNowBtn = document.getElementById("buy-now");
  const addToCartBtn = document.getElementById("add-to-cart");

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", async () => {
      const result = await addToCart(product, 1);
      if (result.success) {
        window.location.href = "cart.html";
      }
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      addToCart(product, 1);
    });
  }
}

async function addToCart(product, quantity = 1) {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("jwt_token");

  if (!userId || !token) {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
    return { success: false };
  }

  const body = {
    user_id: userId,
    product_id: product.id,
    quantity: quantity,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message || "Đã thêm sản phẩm vào giỏ hàng!");
      return { success: true };
    } else {
      alert(result.message || "Thao tác thất bại.");
      return { success: false };
    }
  } catch (err) {
    console.error("Lỗi gọi API giỏ hàng:", err);
    alert("Không thể kết nối đến máy chủ.");
    return { success: false };
  }
}
