const bcrypt = require("bcrypt");
const User = require("../models/User");
const saltRounds = 10;

// Post - Signup
exports.register = async (req, res) => {
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
      if (!result) {
        try {
          const result = await User.findOne({ userName: username });
          if (result) {
            req.flash(
              "error",
              "Username already exists! Please select a different one."
            );
            return res.redirect("/signup");
          }
        } catch (error) {
          console.log(error);
          return res.status(502).json({ message: "Server Error" });
        }
      } else {
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
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(502).json({ message: "Server Error" });
  }
};

// Post - Signin
exports.login = (req, res) => {
  // req.flash("error", "Please fill out all fields");
  res.redirect("/signin");
};
