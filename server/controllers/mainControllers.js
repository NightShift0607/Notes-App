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
  const error = req.flash("error");
  res.render("signup", { error });
};

// Get - Login Page
exports.loginPage = (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("login", { error, success });
};

// Get - Forgot Page
exports.forgotPage = (req, res) => {
  const error = req.flash("error");
  const forgot = req.flash("forgot");
  res.render("forgot", { error, forgot });
};
