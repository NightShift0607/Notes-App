const express = require("express");
const router = express.Router();
const mainControllers = require("../controllers/mainControllers");

// Routes
router.get("/", mainControllers.homepage);

module.exports = router;
