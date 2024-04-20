const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
const sendEmail = require("../utils/email");

async function saveToken(user, passwordResetToken, passwordResetExpires) {
  await User.findOneAndUpdate(
    { _id: user._id },
    {
      passwordResetToken: passwordResetToken,
      passwordResetExpires: passwordResetExpires,
    }
  );
}

// Post - Sign Up
exports.signup = async (req, res, cb) => {
  const { username, fName, lName, email, password } = req.body;
  const file = req.file;

  if (
    !req.body ||
    !username ||
    !fName ||
    !lName ||
    !email ||
    !password ||
    !file
  ) {
    req.flash("error", "Please fill out all fields");
    return res.redirect("/signup");
  } else {
    try {
      const result = await User.findOne({ email: email });
      if (result) {
        req.flash("error", "Account Already Exist on this email! Please Login");
        return res.redirect("/signup");
      }
    } catch (error) {
      console.log(error);
      return res.status(502).json({ message: "Server Error" });
    }
  }
  // Password Hashing
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const result = await User.create({
      userName: username,
      firstName: fName,
      lastName: lName,
      email: email,
      password: hashedPassword,
      profileImage: `/uploads/${file.filename}`,
    });
    const user = result;
    req.login(user, (err) => {
      if (err) {
        return cb(err);
      }
      res.redirect("/dashboard");
    });
  } catch (error) {
    console.log(error);
    return res.status(502).json({ message: "Server Error" });
  }
};

// Get - Logout
exports.logout = (req, res, cb) => {
  req.logout((err) => {
    if (err) {
      cb(err);
    }
    res.redirect("/signin");
  });
};

exports.forgotPassword = async (req, res) => {
  // Getting User based on email posted
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "No account found with that Email address!");
    return res.redirect("/forgot");
  }

  // Generating the random reset token and saving the encrypted form in database
  const resetToken = Math.floor(Math.random() * 899999 + 100000).toString();

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, passwordResetToken);

  const passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await saveToken(user, passwordResetToken, passwordResetExpires);

  // Send it to user's email

  const message = `Forgot Your Password? Copy and paste this OPT given below to reset your password.\n\nOTP (One Time Password): ${resetToken}\n\nIf you didn't forget your password, please ignore this email! `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset OPT (valid for 10 min)",
      message,
    });

    req.flash("forgot", "verify");
    return res.redirect("/forgot");
  } catch (error) {
    console.log(error);
    passwordResetToken = null;
    passwordResetToken = null;
    await saveToken(user, passwordResetToken, passwordResetExpires);
    return res
      .status(500)
      .json({ message: "There was error sending email, Try again later!" });
  }
};

exports.verifyToken = async (req, res) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    });

    if (!user) {
      req.flash("error", "OPT is invalid or expired!");
      req.flash("forgot", "verify");
      return res.redirect("/forgot");
    }

    // If token not expired, and there is user, proceed to next route
    req.flash("forgot", "reset");
    res.cookie("userId", user._id);
    return res.redirect("/forgot");
  } catch (error) {
    console.log(error);
    return res.status(502).json({ message: "Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    req.flash("error", "Please fill out all fields!");
    req.flash("forgot", "reset");
    return res.redirect("/forgot");
  } else {
    if (password != confirmPassword) {
      req.flash("error", "Passwords do not match!");
      req.flash("forgot", "reset");
      return res.redirect("/forgot");
    }
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await User.findOneAndUpdate(
    { _id: req.cookies.userId },
    {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    }
  );
  res.clearCookie("userId");
  req.flash("success", "Your Password has been reset successfully.");
  return res.redirect("/signin");
};
