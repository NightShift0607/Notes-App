const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Local Passport Startegy

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const result = await User.findOne({ email: username });
      if (result) {
        const user = result;
        const chkPassword = user.password;
        bcrypt.compare(password, chkPassword, (err, result) => {
          if (err) {
            // if error is found while comparing the passwords
            return cb(err);
          } else {
            if (result) {
              // everything is alright
              return cb(null, user);
            } else {
              // if password is incorrect
              return cb(null, false, { message: "Incorrect Password!" });
            }
          }
        });
      } else {
        // When no user is found on email
        return cb(null, false, { message: "Incorrect Email!" });
      }
    } catch (error) {
      console.log(error);
      return res.status(502).json({ message: "Server Error" });
    }
  })
);

// Session Establishment

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

module.exports = passport;
