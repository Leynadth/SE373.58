const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/employees", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("CONNECTED TO DATABASE");
    } catch (err) {
        console.error("CONNECTION FAILED", err);
        process.exit(1);
    }
};

module.exports = { connectDB };
