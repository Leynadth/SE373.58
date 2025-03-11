require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const { allowedNodeEnvironmentFlags } = require("process");
const Employee = require("./models/Employee"); // Updated to Employee model

const app = express();
const PORT = process.env.PORT || 3000;

// Passport Configuration
require("./config/passport")(passport);

// Set Handlebars as our templating engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Sets our static resources folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware body-parser parses JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Setup Express-Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Setup Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Setup Flash messaging
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Required Route Router Example
app.use("/", require("./routes/auth").router);
app.use("/", require("./routes/crud"));

// MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/employeedb"
//const mongoURI = process.env.MONGO_URI; //|| "mongodb://localhost:27017/employeedb"
mongoose.connect(mongoURI);
const db = mongoose.connection;


// Check for connection
db.on("error", console.error.bind(console, "MongoDB Connection error"));
db.once("open", () => {
    console.log("Connected to MongoDB Database");
});

// Log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Example message
let message = "Wouldn't you like to be a pepper too??";

function tellTheMessage() {
    console.log(message);
}

// Handlebars examples
//app.get("/hbsindex", (req, res) => {
 //   res.render("home", {
  //      title: "Welcome to the Handlebars Site",
        message: "This is our page using the template engine"
    //});
//});


app.use((req, res, next) => {
    res.locals.user = req.user || null; // Makes user available in Handlebars
    next();
});
// Home route
app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

// JSON data route (updated for employees)
app.get("/json", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "employees.json"));
});

// Example route
app.get("/nodemon", (req, res) => {
    res.sendStatus(500);
});

// Creates Listener on port 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

module.exports = app;
