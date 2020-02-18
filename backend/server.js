const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const conf = require("./config");
const authRouter = require("./routes/auth");
const vendorRouter = require("./routes/vendor");

const app = express();
const PORT = conf.EXPRESS_PORT;

// INIT


app.use(cors());

// bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// connect to mongoDB
mongoose.connect(conf.MONGO_URI, {
    useNewUrlParser: true
});
const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB database connection established succesfully.");
})

// passport middleware
app.use(passport.initialize());
require("./passport-conf")(passport);

// ROUTES
// auth
app.use("/auth", authRouter);
app.use("/vendor", vendorRouter);

app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
});