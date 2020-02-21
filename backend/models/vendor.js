const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    currentRating: {
        type: String,
        default: "0",
    },
    numberRatings: {
        type: Number,
        default: 0,
        min: 0
    }
});

module.exports = mongoose.model("Vendor", VendorSchema)