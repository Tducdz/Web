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

    // Chọn endpoint dựa trên việc có keyword hay không
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
    console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu từ API
    return data.data || []; // Đảm bảo trả về mảng sản phẩm từ thuộc tính data
  } catch (error) {
    console.error("Fetch products error:", error);
    throw error;
  }
}

async function fetchProductById(productId) {
  try {
    const response = await fetch(
      `${window.API_BASE_URL}/product/${productId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
    const data = await response.json();
    if (!data.product || !data.comments)
      throw new Error("Dữ liệu sản phẩm hoặc bình luận không hợp lệ");
    return { product: data.product, comments: data.comments };
  } catch (error) {
    console.error("Fetch product by ID error:", error);
    throw error;
  }
}
