const dashboardLayout = "../views/layouts/dashboard";

exports.dashboardPage = (req, res) => {
  res.render("dashboard/home", { layout: dashboardLayout });
};
