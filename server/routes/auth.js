const express = require("express");
const multer = require("multer");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();
const User = require("../models/User");
const saltRounds = 10;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Local Passport Startegy

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const result = await User.findOne({ email: username });
      if (result) {
        const user = result;
        const chkPassword = user.password;
        bcrypt.compare(password, chkPassword, (err, result) => {
          if (err) {
            // if error is found while comparing the passwords
            return cb(err);
          } else {
            if (result) {
              // everything is alright
              return cb(null, user);
            } else {
              // if password is incorrect
              return cb(null, false, { message: "Incorrect Password!" });
            }
          }
        });
      } else {
        // When no user is found on email
        return cb(null, false, { message: "Incorrect Email!" });
      }
    } catch (error) {
      console.log(error);
      return res.status(502).json({ message: "Server Error" });
    }
  })
);

// Routes

// Signup Route

router.post("/signup", upload.single("image"), async (req, res, cb) => {
  const { username, fName, lName, email, password } = req.body;
  const file = req.file;

  if (
    !req.body ||
    !username ||
    !fName ||
    !lName ||
    !email ||
    !password ||
    !file
  ) {
    req.flash("error", "Please fill out all fields");
    return res.redirect("/signup");
  } else {
    try {
      const result = await User.findOne({ email: email });
      if (result) {
        req.flash("error", "Account Already Exist on this email! Please Login");
        return res.redirect("/signup");
      }
    } catch (error) {
      console.log(error);
      return res.status(502).json({ message: "Server Error" });
    }
  }
  // Password Hashing
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const result = await User.create({
      userName: username,
      firstName: fName,
      lastName: lName,
      email: email,
      password: hashedPassword,
      profileImage: `/uploads/${file.filename}`,
    });
    const user = result;
    req.login(user, (err) => {
      if (err) {
        return cb(err);
      }
      res.redirect("/dashboard");
    });
  } catch (error) {
    console.log(error);
    return res.status(502).json({ message: "Server Error" });
  }
});

// Signin Route

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

// Logout Route

router.get("/logout", (req, res, cb) => {
  req.logout((err) => {
    if (err) {
      cb(err);
    }
    res.redirect("/signin");
  });
});

// Session Establishment

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

module.exports = router;
