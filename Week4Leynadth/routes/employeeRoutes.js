const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authHandler = require("passport");
const Employee = require("../models/staff");

router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find().lean();
        res.render("employeeList", { layout: "main", employees }); // Fixed view rendering
    } catch (err) {
        res.status(500).send("Error fetching employees");
    }
});


router.post("/addEmployee", verifyUserSession, async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error adding employee");
    }
});

router.get("/addEmployee", verifyUserSession, (req, res) => {
    res.render("addEmployee", { layout: "main" });
});

router.get("/editEmployee/:id", verifyUserSession, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).lean();
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        res.render("updateEmployee", { layout: "main", employee });
    } catch (err) {
        res.status(500).send("Error loading update page");
    }
});

router.put("/updatEmployee/:id", verifyUserSession, async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedEmployee) {
            return res.status(404).send("Employee not found");
        }
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error updating employee");
    }
});

router.post("/deleteEmployee/:id", verifyUserSession, async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error deleting employee");
    }
});

router.get("/userdashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/login");
    }
    res.render("userdashboard", { layout: "main", user: req.user });
});




function verifyUserSession(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
}

module.exports = router;