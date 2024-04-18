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

// Google Passport Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const newUser = {
        userName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        password: profile.id,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ password: newUser.password });
        if (user) {
          cb(null, user);
        } else {
          try {
            user = await User.create(newUser);
            cb(null, user);
          } catch (error) {
            cb(null, false, {
              message:
                "The email registered with google account already exists in our database! Please Login!",
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// Persist user data after sucessful authentication
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// Retrive user data from session
passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

module.exports = passport;
