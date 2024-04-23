const express = require("express");
const router = express.Router();
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

module.exports = router;
