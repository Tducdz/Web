document.addEventListener("DOMContentLoaded", function () {
  var courseID;
  var deleteForm = document.forms["delete-course-form"];
  var restoreForm = document.forms["restore-course-form"];
  var btnDeleteCourse = document.getElementById("btn-delete-course");
  var restoreBtn = $(".btn-restore");

  // When dialog confirm clicked
  $("#delete-course-modal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    courseID = button.data("id");
  });

  // When delete course course btn clicked
  btnDeleteCourse.onclick = function () {
    deleteForm.action = "/courses/" + courseID + "?_method=DELETE";
    deleteForm.submit();
  };

  // Restore btn clicked
  restoreBtn.click(function (e) {
    e.preventDefault();

    var courseID = $(this).data("id");

    restoreForm.action = "/courses/" + courseID + "/restore?_method=PATCH";
    restoreForm.submit();
  });
});
