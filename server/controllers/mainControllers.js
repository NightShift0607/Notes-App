// Get - Homepage
exports.homePage = (req, res) => {
  res.render("index");
};

// Get - About Page
exports.aboutPage = (req, res) => {
  res.render("about");
};

// Get - Signup Page
exports.signupPage = (req, res) => {
  let error = req.flash("error");
  res.render("signup", { error });
};

// Get - Login Page
exports.loginPage = (req, res) => {
  let error = req.flash("error");
  res.render("login", { error });
};
