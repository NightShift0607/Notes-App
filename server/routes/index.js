const express = require("express");
const router = express.Router();
const mainControllers = require("../controllers/mainControllers");

// Routes
router.get("/", mainControllers.homePage);
router.get("/about", mainControllers.aboutPage);
router.get("/signup", mainControllers.signupPage);

module.exports = router;
