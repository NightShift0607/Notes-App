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
  return res.render("dashboard/home", { layout: dashboardLayout, user, notes });
};

// Add note form rendering
exports.newNotePage = async (req, res) => {
  const { notes, user } = await getNotes(req.user);
  return res.render("dashboard/new-note", {
    layout: dashboardLayout,
    user,
    notes,
  });
};

// View Note
exports.viewNotePage = async (req, res) => {
  const { notes, user } = await getNotes(req.user);
  const noteId = req.params.id;
  try {
    const note = await Note.findById(noteId).where({ user: user });
    return res.render("dashboard/note", {
      layout: dashboardLayout,
      user,
      notes,
      note,
    });
  } catch (error) {
    console.log(error);
  }
};

//  Create new Note
exports.createNewNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.redirect("/");
  }
  try {
    const result = await Note.create({
      user: req.user,
      title: title,
      content: content,
    });
    return res.redirect(`/dashboard/note/${result._id}`);
  } catch (error) {
    console.log(error);
  }
};

// Edit Note
exports.editNote = async (req, res) => {
  const noteId = req.params.id;
  try {
    await Note.findByIdAndUpdate(
      { _id: noteId },
      {
        title: req.body.title,
        content: req.body.content,
      }
    ).where({ user: req.user });
    return res.redirect(`/dashboard/note/${noteId}`);
  } catch (error) {
    console.log(error);
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  const noteId = req.params.id;
  try {
    await Note.findByIdAndDelete(noteId).where({ user: req.user });
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};
