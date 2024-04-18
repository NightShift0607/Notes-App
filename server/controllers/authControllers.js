const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Post - Sign Up
exports.signup = async (req, res, cb) => {
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
};

// Get - Logout
exports.logout = (req, res, cb) => {
  req.logout((err) => {
    if (err) {
      cb(err);
    }
    res.redirect("/signin");
  });
};
