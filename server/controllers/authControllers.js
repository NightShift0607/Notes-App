const User = require("../models/User");

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
    console.log("Done");
  }
  const result = await User.create({
    userName: username,
    firstName: fName,
    lastName: lName,
    email: email,
    password: password,
    profileImage: `/uploads/${file.filename}`,
  });
  return res.status(201).json({ message: "Successfully created account!" });
};

// Post - Signin
exports.login = (req, res) => {
  // req.flash("error", "Please fill out all fields");
  res.redirect("/signin");
};
