const express = require("express");
const router = express.Router();
const dashboardControllers = require("../controllers/dashboardControllers");
const { checkAuthProceed } = require("../middleware/checkAuth");

router.get("/dashboard", checkAuthProceed, dashboardControllers.dashboardPage);

module.exports = router;
