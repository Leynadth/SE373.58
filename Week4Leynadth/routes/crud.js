const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized access" });
}

// Get all employees
router.get("/employees", ensureAuthenticated, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new employee
router.post("/employees", ensureAuthenticated, async (req, res) => {
  try {
    const { name, position, salary } = req.body;

    if (!name || !position || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEmployee = new Employee({ name, position, salary });
    await newEmployee.save();

    res.status(201).json({ message: "Employee added successfully" });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an employee
router.put("/employees/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { name, position, salary } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, position, salary },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully", updatedEmployee });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an employee
router.delete("/employees/:id", ensureAuthenticated, async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
