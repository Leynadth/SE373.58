require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const authRoutes = require("./routes/authentication");
const employeeRoutes = require('./routes/employeeRoutes');
const { allowedNodeEnvironmentFlags } = require('process');



//const { db } = require('./models/staff');
//const { connectDB } = require('./database/dbConnect');

const app = express();
//connectDB()

//app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.engine("handlebars", exphbs.engine({ 
    defaultLayout: "main", 
    layoutsDir: path.join(__dirname, "views", "layouts")
}));




app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use("/", require("./routes/employeeRoutes"));

app.use(express.static(path.join(__dirname, "public")));
require("./config/passport")(passport);

app.engine("handlebars", exphbs.engine({
    helpers: {
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        formatDate: function(date) {
            if (!date) return "";
            return new Date(date).toISOString().split("T")[0];
        }
    }
}));

//const mongoURI = "mongodb://localhost:27017/employees";
const mongoURI = process.env.MONGODB_URI // "mongodb+srv://Leynadth:babalonch@cluster0.gsi4i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//if (!mongoURI) {
//    console.error("ERROR: MONGODB_URI is missing");
//   process.exit(1);
//}

mongoose.connect(mongoURI);


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use(session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(passport.initialize());
app.use(passport.session());

app.get("/nodemon",(req,res)=>{
    res.sendStatus(200);
})




app.use('/', employeeRoutes);
app.use("/", authRoutes);

app.use("/auth", authRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

