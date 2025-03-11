const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

router.get("/register", (request, response) => {
    response.render("register", { layout: "main" }); // Ensure it uses the main layout
});

router.post("/register", async (request, response) => {
    const { username, contactEmail, password } = request.body;

    if (!username || !contactEmail || !password) {
        request.flash("error_msg", "Please fill in all fields");
        return response.redirect("/auth/register");
    }

    const userExists = await User.findOne({ contactEmail });
    if (userExists) {
        request.flash("error_msg", "Email already in use");
        return response.redirect("/auth/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
    const newUser = new User({ username, contactEmail, password: hashedPassword });

    await newUser.save();
    request.flash("success_msg", "You are now registered! Please log in.");
    response.redirect("/auth/login");
});

router.get("/login", (request, response) => {
    response.render("login", { layout: "main" }); // Ensure it uses the main layout
});

/*router.post("/login", (request, response, next) => {
    passport.authenticate("local", {
        successRedirect: "/userdashboard",
        failureRedirect: "/auth/login",
        failureFlash: true
    })(request, response, next);
});*/

router.post("/login", (request, response, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            return next(err);
        }
        if (!user) {
            request.flash("error_msg", info.message || "Invalid credentials");
            return response.redirect("/auth/login");
        }
        request.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            return response.redirect("/userdashboard");
        });
    })(request, response, next);
});

router.get("/logout", (request, response) => {
    request.logout(function(err) {
        if (err) return next(err);
        request.flash("success_msg", "You have logged out.");
        response.redirect("/auth/login");
    });
});

module.exports = router;
