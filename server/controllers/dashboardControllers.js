const bcrypt = require("bcrypt");
const dashboardLayout = "../views/layouts/dashboard";
const Note = require("../models/Notes");
const User = require("../models/User");
const fs = require("fs");
const saltRounds = 10;

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
  const error = req.flash("error");
  return res.render("dashboard/home", {
    layout: dashboardLayout,
    user,
    notes,
    error,
  });
};

// Add note form rendering
exports.newNotePage = async (req, res) => {
  const { notes, user } = await getNotes(req.user);
  const error = req.flash("error");
  return res.render("dashboard/new-note", {
    layout: dashboardLayout,
    user,
    notes,
    error,
  });
};

// View Note
exports.viewNotePage = async (req, res) => {
  const { notes, user } = await getNotes(req.user);
  const error = req.flash("error");
  const noteId = req.params.id;
  try {
    const note = await Note.findById(noteId).where({ user: user });
    return res.render("dashboard/note", {
      layout: dashboardLayout,
      user,
      notes,
      note,
      error,
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

// Search Note
exports.searchNotes = async (req, res) => {
  let searchTerm = req.params.term;
  const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  try {
    const result = await Note.find({
      title: { $regex: new RegExp(searchNoSpecialChars, "i") },
    }).where({ user: req.user });
    return res.json(result);
  } catch (error) {
    console.log(error);
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const file = req.file;
  const user = req.user;
  if (file) {
    try {
      // saving old image name to delete it
      const oldFile = `./public${user.profileImage}`;
      await User.findByIdAndUpdate(user._id, {
        profileImage: `/uploads/${file.filename}`,
      });
      // To delete the old image
      fs.unlink(oldFile, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    } catch (error) {
      console.log("Error Uploading Image", error.message);
      req.flash("error", "Error Uploading Image");
    }
  }
  if (username) {
    try {
      await User.findByIdAndUpdate(user._id, {
        userName: username,
      });
    } catch (error) {
      console.log("Error Updating Display Name", error.message);
      req.flash("error", "Error Updating Display Name");
    }
  }
  if (password && confirmPassword) {
    if (password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      try {
        await User.findByIdAndUpdate(user._id, {
          password: hashedPassword,
        });
      } catch (error) {
        console.log("Error Uploading Image", error.message);
      }
    } else {
      req.flash("error", "Please Enter Correct Password");
    }
  }
  return res.redirect("/dashboard");
};
