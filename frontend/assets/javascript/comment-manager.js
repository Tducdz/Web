const token = localStorage.getItem("jwt_token");

document.addEventListener("DOMContentLoaded", function () {
  const commentTableBody = document.getElementById("commentTable");
  const searchInput = document.querySelector("input[type='text']");
  const searchButton = document.querySelector(".search-button");

  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const currentPageText = document.getElementById("currentPage");

  let currentPage = 1;
  let totalPages = 1;

  async function loadComments(page = 1, keyword = "") {
    currentPage = page;
    const params = new URLSearchParams({ page });
    let url = "/admin/comments";

    if (keyword && keyword.trim() !== "") {
      params.append("keyword", keyword);
      url = "/admin/comments/search";
    }

    url += "?" + params.toString();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      displayComments(data.comments);

      // Cập nhật phân trang
      currentPageText.textContent = data.page;
      totalPages = data.totalPages || 1;
      prevPageBtn.style.visibility = data.page > 1 ? "visible" : "hidden";
      nextPageBtn.style.visibility =
        data.page < totalPages ? "visible" : "hidden";
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
      alert("Không thể tải bình luận. Vui lòng thử lại sau.");
    }
  }

  function displayComments(comments) {
    commentTableBody.innerHTML = "";

    if (comments.length === 0) {
      commentTableBody.innerHTML =
        '<tr><td colspan="7">Không có bình luận nào để hiển thị.</td></tr>';
      return;
    }

    comments.forEach((comment) => {
      const row = document.createElement("tr");

      let formattedDate = "Không rõ";
      if (comment.create_at) {
        const createAt = new Date(comment.create_at);
        formattedDate = createAt.toLocaleDateString("vi-VN");
      }

      const status = comment.censor === 1 ? "Đã duyệt" : "Chờ duyệt";

      let actionButtons = `
        <button class="btn delete-btn" style="background-color: #f44336; border: none">
          Xóa
        </button>
      `;
      if (comment.censor === 0) {
        actionButtons = `
          <button class="btn approve-btn" style="background-color: #4caf50; border: none">
            Duyệt
          </button>
          ${actionButtons}
        `;
      }

      row.innerHTML = `
        <td>${comment.id}</td>
        <td>${formattedDate}</td>
        <td>${comment.user_name}</td>  
        <td>${comment.product_name}</td> 
        <td>${comment.comment}</td>
        <td>${status}</td>
        <td>${actionButtons}</td>
      `;

      commentTableBody.appendChild(row);
    });
  }

  // Xử lý nút phân trang
  prevPageBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    if (currentPage > 1) {
      loadComments(currentPage - 1, keyword);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    if (currentPage < totalPages) {
      loadComments(currentPage + 1, keyword);
    }
  });

  // Xóa bình luận
  commentTableBody.addEventListener("click", async function (event) {
    if (event.target.classList.contains("delete-btn")) {
      if (confirm("Bạn có chắc muốn xóa bình luận này không?")) {
        const row = event.target.closest("tr");
        const commentId = row.cells[0].innerText;

        try {
          const response = await fetch(`/admin/comments/${commentId}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          alert(data.message);
          const keyword = searchInput.value.trim();
          await loadComments(currentPage, keyword);
        } catch (error) {
          console.error("Lỗi khi xóa bình luận:", error);
          alert("Có lỗi xảy ra khi xóa bình luận.");
        }
      }
    }
  });

  // Duyệt bình luận
  commentTableBody.addEventListener("click", async function (event) {
    if (event.target.classList.contains("approve-btn")) {
      if (confirm("Bạn có chắc muốn duyệt bình luận này không?")) {
        const row = event.target.closest("tr");
        const commentId = row.cells[0].innerText;

        try {
          const response = await fetch(`/admin/comments/${commentId}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          alert(data.message);
          const keyword = searchInput.value.trim();
          await loadComments(currentPage, keyword);
        } catch (error) {
          console.error("Lỗi khi duyệt bình luận:", error);
          alert("Có lỗi xảy ra khi duyệt bình luận.");
        }
      }
    }
  });

  // Tìm kiếm bình luận
  searchButton.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    loadComments(1, keyword);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });

  // Load bình luận ban đầu
  loadComments();
});
