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

document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) return alert("Vui lòng đăng nhập để xem giỏ hàng.");

  const cartItems = await getCart(userId);
  renderCart(cartItems);
});

async function getCart(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Lỗi khi tải giỏ hàng:", err);
    return [];
  }
}

function renderCart(items) {
  const list = document.getElementById("cart-list");
  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
    document.getElementById("totalAmount").textContent = "0";
    return;
  }

  let total = 0;

  items.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const html = `
      <div class="col l-4 cart-item" data-id="${item.product_id}">
        <div class="item">
          <div class="item-infor">
            <img src="/img/${item.image_url}" alt="${item.name}" />
            <div class="product-infor">
              <span class="product-name">${item.name}</span>
              <span class="price-current">${Number(item.price).toLocaleString(
                "vi-VN"
              )}đ</span>
            </div>
          </div>
          <div class="input-group">
            <button class="btn decrease">−</button>
            <input style="width: 40px" type="text" class="text-center quantity" value="${
              item.quantity
            }" readonly />
            <button class="btn increase">+</button>
            <i class="fa-solid fa-trash remove" style="color: #cc0000; cursor: pointer;"></i>
          </div>
        </div>
      </div>
    `;
    list.insertAdjacentHTML("beforeend", html);
  });

  document.getElementById("totalAmount").textContent =
    total.toLocaleString("vi-VN");

  addCartEvents();
}

function addCartEvents() {
  const userId = localStorage.getItem("user_id");

  document.querySelectorAll(".cart-item").forEach((item) => {
    const productId = item.dataset.id;
    const input = item.querySelector(".quantity");

    item.querySelector(".increase").addEventListener("click", async () => {
      let qty = parseInt(input.value) + 1;
      await updateCart(userId, productId, qty);
    });

    item.querySelector(".decrease").addEventListener("click", async () => {
      let qty = parseInt(input.value);
      if (qty > 1) {
        qty--;
        await updateCart(userId, productId, qty);
      }
    });

    item.querySelector(".remove").addEventListener("click", async () => {
      const confirmDelete = confirm("Bạn có chắc muốn xoá sản phẩm?");
      if (confirmDelete) await updateCart(userId, productId, 0);
    });
  });
}

async function updateCart(user_id, product_id, quantity) {
  try {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: JSON.stringify({ user_id, product_id, quantity }),
    });

    const data = await res.json();
    if (res.ok) {
      const updatedCart = await getCart(user_id);
      renderCart(updatedCart);
    } else {
      alert(data.message || "Thao tác thất bại.");
    }
  } catch (err) {
    console.error("Lỗi gọi API giỏ hàng:", err);
    alert("Không thể kết nối đến máy chủ.");
  }
}
