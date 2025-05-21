document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  if (!searchInput || !searchBtn) return;

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      alert("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    window.location.href = `http://localhost:8080/storange.html?keyword=${encodeURIComponent(
      keyword
    )}`;
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});
