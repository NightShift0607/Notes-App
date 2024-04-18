exports.checkAuthProceed = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin");
  }
};

exports.checkAuthReject = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};
