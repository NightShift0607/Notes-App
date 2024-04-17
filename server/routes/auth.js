const express = require("express");
const multer = require("multer");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Routes
router.post("/signup", upload.single("image"), authControllers.register);
router.post("/signin", authControllers.login);

module.exports = router;
