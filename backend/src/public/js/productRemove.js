const token = localStorage.getItem("jwt_token");
let currentPage = 1;
const limit = 10;

async function fetchProducts(page = 1, keyword = "") {
  try {
    const url = keyword
      ? `${API_BASE_URL}/admin/search?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}`
      : `${API_BASE_URL}/admin/product-manage?page=${page}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) throw new Error("Lỗi khi lấy danh sách sản phẩm");
    const { data: products, page: current, totalPages } = await response.json();

    displayProducts(products);

    currentPage = current;
    document.querySelector("#page-info p").innerText = `${currentPage}`;
    document
      .getElementById("prev-page")
      .classList.toggle("disabled", currentPage === 1);
    document
      .getElementById("next-page")
      .classList.toggle("disabled", currentPage >= totalPages);
  } catch (error) {
    console.error(error);
    alert("Không thể tải danh sách sản phẩm");
  }
}

const categoryMap = {
  1: "Apple",
  2: "Samsung",
  3: "Xiaomi",
  4: "Oppo",
  5: "Realme",
  6: "Vivo",
  7: "Sony",
};

function displayProducts(products) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  products.forEach((product) => {
    const category_name =
      categoryMap[product.category_id] || "Không có trong hệ thống";
    const row = `
        <tr class="edit-btn" data-id="${product.id}">
            <td>${product.id}</td>
            <td>${category_name}</td>
            <td>${product.name}</td>
            <td>${product.ROM}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
        </tr>`;
    tbody.innerHTML += row;
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
      showProductDetails(button.dataset.id);
    });
  });
}

let currentProductId = 1;

async function showProductDetails(productId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/product-manage/${productId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
    const product = await response.json();

    currentProductId = productId;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = parseInt(
      product.price
    ).toLocaleString("vi-VN");
    document.getElementById("price-old").value = product.price_old
      ? parseInt(product.price_old).toLocaleString("vi-VN")
      : "";
    document.getElementById("product-brand").value = product.category_id;
    document.getElementById("screen-size").value = product.screen_size;
    document.getElementById("screen-tech").value = product.screen_tech;
    document.getElementById("chipset").value = product.chipset;
    document.getElementById("nfc").value =
      product.nfc === "1" || product.nfc === true ? "1" : "0";
    document.getElementById("ram").value = product.RAM;
    document.getElementById("rom").value = product.ROM;
    document.getElementById("battery").value = product.battery;
    document.getElementById("sim-slots").value = product.sim_slots;
    document.getElementById("os").value = product.os;
    document.getElementById("water-resistant").value = product.water_resistant;
    document.getElementById("stock").value = product.stock;
    document.getElementById("fileName").textContent = product.image_url || "";
    document.getElementById("product-image").src = product.image_url
      ? `/img/${product.image_url}`
      : "";
    document.getElementById("pop-up").style.display = "block";
  } catch (error) {
    console.error(error);
    alert("Lỗi tải chi tiết sản phẩm");
  }
}

// Update product
document
  .getElementById("update-product-btn")
  .addEventListener("click", async () => {
    if (!currentProductId) return alert("Không tìm thấy ID sản phẩm");

    const formData = {
      category_id: parseInt(document.getElementById("product-brand").value),
      name: document.getElementById("product-name").value,
      price: parseInt(
        document.getElementById("product-price").value.replace(/\D/g, "")
      ),
      price_old:
        parseInt(
          document.getElementById("price-old").value.replace(/\D/g, "")
        ) || 0,
      screen_size: document.getElementById("screen-size").value,
      screen_tech: document.getElementById("screen-tech").value,
      chipset: document.getElementById("chipset").value,
      nfc: parseInt(document.getElementById("nfc").value),
      RAM: parseInt(document.getElementById("ram").value),
      ROM: parseInt(document.getElementById("rom").value),
      battery: parseInt(document.getElementById("battery").value),
      sim_slots: parseInt(document.getElementById("sim-slots").value),
      os: document.getElementById("os").value,
      water_resistant: document.getElementById("water-resistant").value,
      stock: parseInt(document.getElementById("stock").value),
      image_url: document.getElementById("fileName").textContent,
    };

    if (
      !formData.name ||
      isNaN(formData.price) ||
      isNaN(formData.RAM) ||
      isNaN(formData.ROM) ||
      isNaN(formData.battery) ||
      isNaN(formData.sim_slots) ||
      isNaN(formData.stock)
    ) {
      return alert("Vui lòng nhập đầy đủ và đúng định dạng các trường số");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/product-manage/${currentProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Lỗi khi cập nhật sản phẩm");
      const result = await response.json();
      alert(result.message);
      document.getElementById("pop-up").style.display = "none";
      fetchProducts(currentPage, document.getElementById("search-input").value);
    } catch (error) {
      console.error(error);
      alert("Không thể cập nhật sản phẩm");
    }
  });

// Delete product
document
  .getElementById("delete-product-btn")
  .addEventListener("click", async () => {
    if (!currentProductId) return alert("Không tìm thấy ID sản phẩm");
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/product-manage/${currentProductId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm");
      const result = await response.json();
      alert(result.message);
      document.getElementById("pop-up").style.display = "none";
      fetchProducts(currentPage, document.getElementById("search-input").value);
    } catch (error) {
      console.error(error);
      alert("Không thể xóa sản phẩm");
    }
  });

document.getElementById("search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = document.getElementById("search-input").value;
  currentPage = 1;
  await fetchProducts(currentPage, keyword);
});

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    const keyword = document.getElementById("search-input").value;
    fetchProducts(currentPage - 1, keyword);
  }
});

document.getElementById("next-page").addEventListener("click", () => {
  const keyword = document.getElementById("search-input").value;
  fetchProducts(currentPage + 1, keyword);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(currentPage, "");
});
