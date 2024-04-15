// Post - Signup
exports.register = (req, res) => {
  req.flash("error", "Please fill out all fields");
  res.redirect("/signup");
};

// Post - Signin
exports.login = (req, res) => {
  //   req.flash("error", "Please fill out all fields");
  res.redirect("/signin");
};
