const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String, required: true, enum: ['Hardware', 'Appliances', 'Cashier'] },
    startDate: { type: Date, required: true },
    jobTitle: { type: String, required: true },
    salary: { type: Number, required: true }
});

const Employee = mongoose.model("Employee", employeeSchema, "employees");

module.exports = Employee;
