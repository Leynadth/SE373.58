const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee"); // Updated to Employee model
const { isAuthenticated } = require("./auth"); // Import authentication middleware

// Get all employees
router.get("/userdashboard", isAuthenticated, async (req, res) => {
    try {
        const employees = await Employee.find().lean(); // Get employees
        res.render("userdashboard", {
            layout: "main",
            user: req.user, // Ensure user data is passed
            employees // Pass employees list
        });
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).send("Error loading dashboard");
    }
});


// Get a single employee by ID
router.get("/employees/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch employee" });
    }
});

// Add a new employee
router.post("/addemployee", async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ error: "Failed to add employee" });
    }
});

// Update an employee
router.put("/updateemployee/:id", async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ error: "Failed to update the employee" });
    }
});

// Delete an employee
router.delete("/deleteemployee/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete employee" });
    }
});

// Route for adding an employee (Render view)
router.get("/addemployee", isAuthenticated, (req, res) => {
    res.render("addemployee", {
        title: "Add an Employee",
        message: "Please add an employee."
    });
});

module.exports = router;
