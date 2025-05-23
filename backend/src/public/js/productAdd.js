const token = localStorage.getItem("jwt_token");

document
  .getElementById("add-product-btn")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "category_id",
      document.getElementById("product-brand").value
    );
    formData.append("name", document.getElementById("product-name").value);
    formData.append(
      "price",
      document.getElementById("product-price").value.replace(/\D/g, "")
    );
    formData.append(
      "price_old",
      document.getElementById("price-old").value.replace(/\D/g, "") || 0
    );
    formData.append(
      "screen_size",
      document.getElementById("screen-size").value
    );
    formData.append(
      "screen_tech",
      document.getElementById("screen-tech").value
    );
    formData.append("chipset", document.getElementById("chipset").value);
    formData.append("nfc", document.getElementById("nfc").value);
    formData.append("RAM", document.getElementById("ram").value);
    formData.append("ROM", document.getElementById("rom").value);
    formData.append("battery", document.getElementById("battery").value);
    formData.append("sim_slots", document.getElementById("sim-slots").value);
    formData.append("os", document.getElementById("os").value);
    formData.append(
      "water_resistant",
      document.getElementById("water-resistant").value
    );
    formData.append("stock", document.getElementById("stock").value);
    const file = document.getElementById("fileUpload").files[0];
    if (file) formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/product-manage/add`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message || "Lỗi khi thêm sản phẩm");
        return;
      }

      alert(result.message || "Thêm sản phẩm thành công!");
      document.getElementById("add-product-form").reset();
      document.getElementById("fileName").textContent = "";
    } catch (error) {
      console.error(error);
      alert("Không thể thêm sản phẩm");
    }
  });

document.getElementById("fileUpload").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    document.getElementById("fileName").textContent = file.name;
  } else {
    document.getElementById("fileName").textContent = "";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const userRole = localStorage.getItem("user_role");
  if (userRole != "admin") {
    alert("Không có quyền truy cập");
    window.location.href = "index.html";
    return;
  }
});
