exports.dashboardPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard/dashboard");
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
};
