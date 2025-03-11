const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true,
  },
  position: {
    type: String,
    required: [true, "Employee position is required"],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, "Employee salary is required"],
    min: [0, "Salary must be a positive number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
