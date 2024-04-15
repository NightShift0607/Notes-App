const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");

// Routes
router.post("/signup", authControllers.register);
router.post("/signin", authControllers.login);

module.exports = router;
