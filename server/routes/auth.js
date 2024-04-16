const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const User = require("../models/User");

// Routes
router.post("/signup", authControllers.register);
router.post("/signin", authControllers.login);

module.exports = router;
