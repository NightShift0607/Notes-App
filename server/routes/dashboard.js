const express = require("express");
const router = express.Router();
const dashboardControllers = require("../controllers/dashboardControllers");

router.get("/dashboard", dashboardControllers.dashboardPage);

module.exports = router;
