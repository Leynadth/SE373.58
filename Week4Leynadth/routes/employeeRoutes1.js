const express = require("express");
const router = express.Router();
const Employee = require("../models/staff");


router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find().lean();
        res.render("employeeList", { employees });
    } catch (err) {
        res.status(500).send("Error fetching employees.");
    }
});

router.get("/register", (req, res) => {
    res.render("createEmployee");
});


router.post("/employees", async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error creating employee.");
    }
});


router.get("/employees/edit/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).lean();
        if (!employee) return res.status(404).send("Employee not found.");
        res.render("modifyEmployee", { employee });
    } catch (err) {
        res.status(500).send("Error finding employee.");
    }
});


router.post("/employees/update/:id", async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error updating employee.");
    }
});


router.post("/employees/delete/:id", async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error deleting employee.");
    }
});

module.exports = router;
