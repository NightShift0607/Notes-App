const express = require("express");
const router = express.Router();
const upload = require("../middleware/imageUpload");
const dashboardControllers = require("../controllers/dashboardControllers");
const { checkAuthProceed } = require("../middleware/checkAuth");

router.get("/dashboard", checkAuthProceed, dashboardControllers.dashboardPage);
router.get(
  "/dashboard/new-note",
  checkAuthProceed,
  dashboardControllers.newNotePage
);
router.get(
  "/dashboard/note/:id",
  checkAuthProceed,
  dashboardControllers.viewNotePage
);
router.post("/add-note", checkAuthProceed, dashboardControllers.createNewNote);
router.put("/edit-note/:id", checkAuthProceed, dashboardControllers.editNote);
router.get("/delete/:id", checkAuthProceed, dashboardControllers.deleteNote);
router.get("/search/:term", checkAuthProceed, dashboardControllers.searchNotes);
router.patch(
  "/update-profile",
  checkAuthProceed,
  upload.single("image"),
  dashboardControllers.updateProfile
);

module.exports = router;
