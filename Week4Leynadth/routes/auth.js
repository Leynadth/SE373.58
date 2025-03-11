const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const csrf = require("csurf");
const AppUsers = require("../models/AppUsers");

const router = express.Router();
const csrfProtection = csrf({ cookie: false });

// Register Route
router.post("/register", csrfProtection, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await AppUsers.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    user = new AppUsers({ name, email, password });
    await user.save();

    res.status(201).json({ message: "Registration successful! You can log in now." });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login Route
router.post("/login", csrfProtection, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication Error:", err);
      return res.status(500).json({ message: "Server error during login." });
    }
    if (!user) {
      return res.status(400).json({ message: info.message || "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Session Error:", err);
        return res.status(500).json({ message: "Error creating session" });
      }
      return res.json({ message: "Login successful!", user });
    });
  })(req, res, next);
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
