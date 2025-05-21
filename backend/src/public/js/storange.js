let currentPage = 1;
let filters = {};

const brandMap = {
  Iphone: 1,
  Samsung: 2,
  Xiaomi: 3,
  OPPO: 4,
  Realme: 5,
  Vivo: 6,
  SONY: 7,
};

const priceMap = {
  "Dưới 2 triệu": "duoi-2",
  "2 - 5 triệu": "2-5",
  "5 - 8 triệu": "5-8",
  "8 - 12 triệu": "8-12",
  "12 - 15 triệu": "12-15",
  "Trên 15 triệu": "tren-15",
};

const ramMap = {
  "Dưới 4GB": "duoi-4",
  "4GB - 6GB": "4-6",
  "8GB": "8",
  "12GB - 16GB": "12-16",
  "Trên 16GB": "tren-16",
};

const screenMap = {
  "Dưới 5.5 inch": "duoi-5.5",
  "5.5 - 6.2 inch": "5.5-6.2",
  "6.3 - 6.7 inch": "6.3-6.7",
};

const romMap = {
  "Dưới 32GB": "duoi-32",
  "32GB": "32",
  "64GB": "64",
  "128GB": "128",
  "256GB": "256",
  "512GB trở lên": "tren-512",
};

document.addEventListener("DOMContentLoaded", async () => {
  // Kiểm tra keyword từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const keyword = urlParams.get("keyword");
  if (keyword) {
    filters.keyword = keyword;
  }

  // Tải sản phẩm ban đầu
  await loadProducts();

  // Xử lý nút Xem thêm
  document
    .querySelector(".more-product span")
    ?.addEventListener("click", async () => {
      currentPage++;
      await loadProducts(true); // Truyền isLoadMore để xử lý đặc biệt
    });

  // Bắt sự kiện lọc
  document.querySelectorAll(".filter .list-choice li").forEach((item) => {
    item.addEventListener("click", async () => {
      const category = item
        .closest(".choice")
        .querySelector(".title-choice")
        .textContent.trim();
      const value = item.textContent.trim();

      if (category.includes("Thương hiệu")) filters.brand = brandMap[value];
      else if (category.includes("Giá")) filters.priceRange = priceMap[value];
      else if (category.includes("RAM")) filters.ramRange = ramMap[value];
      else if (category.includes("Màn Hình"))
        filters.screenSize = screenMap[value];
      else if (category.includes("Bộ nhớ")) filters.rom = romMap[value];

      currentPage = 1;
      document.querySelector(".products .row").innerHTML = "";
      await loadProducts();
    });
  });

  // Xử lý xóa bộ lọc
  document
    .getElementById("clear-filters")
    ?.addEventListener("click", async () => {
      const keyword = filters.keyword;
      filters = keyword ? { keyword } : {};
      currentPage = 1;
      document.querySelector(".products .row").innerHTML = "";
      document
        .querySelectorAll(".filter .list-choice li")
        .forEach((li) => li.classList.remove("active"));
      await loadProducts();
    });
});

async function loadProducts(isLoadMore = false) {
  try {
    const products = await fetchProducts({ page: currentPage, ...filters });
    renderProducts(products, isLoadMore);
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    if (isLoadMore) {
      currentPage--; // Hoàn nguyên trang nếu lỗi
      alert("Không thể tải thêm sản phẩm. Vui lòng thử lại!");
    } else {
      document.querySelector(".products .row").innerHTML =
        "<p>Không thể tải sản phẩm. Vui lòng thử lại sau!</p>";
    }
  }
}

async function fetchProducts({
  page = 1,
  keyword = "",
  brand,
  priceRange,
  ramRange,
  screenSize,
  rom,
} = {}) {
  try {
    const params = new URLSearchParams({ page });
    if (brand) params.append("brand", brand);
    if (priceRange) params.append("priceRange", priceRange);
    if (ramRange) params.append("ramRange", ramRange);
    if (screenSize) params.append("screenSize", screenSize);
    if (rom) params.append("rom", rom);
    if (keyword) params.append("keyword", keyword);

    const endpoint = keyword ? "/product/search" : "/product/list";
    const response = await fetch(
      `${window.API_BASE_URL}${endpoint}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi khi ${keyword ? "tìm kiếm" : "lấy danh sách"} sản phẩm`
      );
    }

    const data = await response.json();
    console.log("Dữ liệu từ API:", data); // Log để kiểm tra
    return data.data || []; // Trả về mảng rỗng nếu không có data.data
  } catch (error) {
    console.error("Fetch products error:", error);
    throw error;
  }
}

function renderProducts(products = [], isLoadMore = false) {
  const row = document.querySelector(".products .row");
  if (!row) return;

  // Chỉ xóa nội dung nếu không phải load more hoặc có sản phẩm mới
  if (!isLoadMore || products.length > 0) {
    row.innerHTML = "";
  }

  if (products.length === 0 && !isLoadMore) {
    row.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
    return;
  }

  const html = products
    .map(
      (product) => `
      <div class="col l-2-4">
        <a href="product.html?id=${product.id}" class="item">
          <img src="/img/${product.image_url || "default.png"}" alt="${
        product.name
      }" />
          <div class="product-info">
            <span class="product-name">${product.name}</span>
            <div class="feature">
              <span class="product-feature">${
                product.screen_size || "N/A"
              } inches</span>
              <span class="product-feature">${product.ROM || "N/A"} GB</span>
            </div>
            <div class="price">
              <div class="price-current">${Number(product.price).toLocaleString(
                "vi-VN"
              )}đ</div>
              <div class="price-old">${Number(product.price_old).toLocaleString(
                "vi-VN"
              )}đ</div>
            </div>
          </div>
        </a>
      </div>
    `
    )
    .join("");

  row.insertAdjacentHTML("beforeend", html);

  // Ẩn nút "Xem thêm" nếu không còn sản phẩm
  const moreButton = document.querySelector(".more-product span");
  if (products.length === 0 && isLoadMore) {
    moreButton.style.display = "none";
  } else {
    moreButton.style.display = "block";
  }
}
