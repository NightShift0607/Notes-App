const dashboardLayout = "../views/layouts/dashboard";
const Note = require("../models/Notes");

async function getNotes(user) {
  try {
    const notes = await Note.find({ user: user._id }).sort({ updatedAt: -1 });
    return { notes, user };
  } catch (error) {
    console.log("Error in Getting Notes", error);
  }
}

// Dashboard page renderization
exports.dashboardPage = async (req, res) => {
  const { notes, user } = await getNotes(req.user);
  res.render("dashboard/home", { layout: dashboardLayout, user, notes });
};

// Add note form rendering
exports.newNotePage = async (req, res) => {
  const { notes, user } = await getNotes(req.user);
  res.render("dashboard/new-note", { layout: dashboardLayout, user, notes });
};

// View Note
exports.viewNotePage = async (req, res) => {
  const { notes, user } = await getNotes(req.user);
  const noteId = req.params.id;
  try {
    const note = await Note.findById(noteId);
    res.render("dashboard/note", {
      layout: dashboardLayout,
      user,
      notes,
      note,
    });
  } catch (error) {
    console.log(error);
  }
};
