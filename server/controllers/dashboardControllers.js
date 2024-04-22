const dashboardLayout = "../views/layouts/dashboard";
const Note = require("../models/Notes");
const mongoose = require("mongoose");

exports.dashboardPage = async (req, res) => {
  try {
    const user = req.user;
    const notes = await Note.find({ user: user._id }).sort({ updatedAt: -1 });
    res.render("dashboard/home", { layout: dashboardLayout, user, notes });
  } catch (error) {
    console.log("Error in Dashboard Page", error);
  }
};
