const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { connectDB } = require("./database/dbConnect");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();
app.use("/", employeeRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
