const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const AppUsers = require("../models/AppUsers");

// Local Strategy for User Authentication
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find user in database
        const user = await AppUsers.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize User into Session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User from Session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await AppUsers.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
