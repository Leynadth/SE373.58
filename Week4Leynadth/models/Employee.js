const mongoose = require("mongoose");

// Mongoose Schema and Model for Employees
const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { 
        type: String,enum: ['Engineering', 'HR', 'IT'],required: true},
    startDate: { type: Date, required: true },
    jobTitle: { type: String, required: true },
    salary: { type: Number, required: true }
});

module.exports = mongoose.model("Employee", employeeSchema, "employees");
