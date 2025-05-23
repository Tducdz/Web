const token = localStorage.getItem("jwt_token");
const userId = localStorage.getItem("user_id");
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

document
  .querySelector("#submit-comment")
  .addEventListener("click", async () => {
    if (!token) {
      alert("Vui lòng đăng nhập để gửi đánh giá!");
      window.location.href = "/login";
      return;
    }

    const commentInput = document.querySelector("#comment-input");
    const comment = commentInput.value.trim();

    if (!comment) {
      alert("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    const formData = {
      user_id: userId,
      product_id: productId,
      comment: comment,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          alert(
            result.message ||
              "Bạn chưa mua sản phẩm này nên không thể đánh giá."
          );
        } else {
          alert(result.message || "Lỗi khi gửi đánh giá");
        }
        return;
      }

      alert(result.message || "Đánh giá đã được gửi!");
      commentInput.value = ""; // Xóa textarea
    } catch (error) {
      console.error(error);
      alert("Không thể gửi đánh giá");
    }
  });
