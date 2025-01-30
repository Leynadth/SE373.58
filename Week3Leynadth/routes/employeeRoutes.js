const express = require("express");
const router = express.Router();
const Staff = require("../models/staff");
// Display
router.get("/", async (req, res) => {
    try {
        const team = await Staff.find().lean();
        res.render("staffList", { team });
    } catch (err) {
        res.status(500).send("Could not fetch records.");
    }
});
// Register
router.get("/register", (req, res) => {
    res.render("registerStaff");
});
// Add
router.post("/create", async (req, res) => {
    try {
        const newMember = new Staff(req.body);
        await newMember.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error saving staff record.");
    }
});
// Modify
router.get("/modify/:id", async (req, res) => {
    try {
        const staffMember = await Staff.findById(req.params.id).lean();
        if (!staffMember) {
            return res.status(404).send("Staff member not found.");
        }
        res.render("editStaff", { staffMember });
    } catch (err) {
        res.status(500).send("Error retrieving staff data.");
    }
});
// Update
router.put("/update/:id", async (req, res) => {
    try {
        const updatedMember = await Staff.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedMember) {
            return res.status(404).send("Staff member not found.");
        }
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error updating staff information.");
    }
});
// Delete
router.post("/delete/:id", async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error deleting record.");
    }
});
module.exports = router;
