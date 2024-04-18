const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const upload = require("../middleware/imageUpload");
const passport = require("../middleware/authPassport");

// Routes
router.post("/signup", upload.single("image"), authControllers.signup);

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureFlash: true,
    failureRedirect: "/signin",
  }),
  (req, res) => {
    req.flash("error", "User not Found");
    res.redirect("/signin");
  }
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureFlash: true,
    failureRedirect: "/signin",
  })
);

router.get("/logout", authControllers.logout);

module.exports = router;
