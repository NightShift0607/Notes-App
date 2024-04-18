const express = require("express");
const router = express.Router();
const mainControllers = require("../controllers/mainControllers");
const { checkAuthReject } = require("../middleware/checkAuth");

// Routes
router.get("/", checkAuthReject, mainControllers.homePage);
router.get("/about", mainControllers.aboutPage);
router.get("/signup", checkAuthReject, mainControllers.signupPage);
router.get("/signin", checkAuthReject, mainControllers.loginPage);
router.get("/forgot", checkAuthReject, mainControllers.forgotPage);

module.exports = router;
