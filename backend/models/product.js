const mongoose = require("mongoose");
const conf = require("../config");

const ReviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }
});

const ProductSchema = new mongoose.Schema({
    vendorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    name : {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    reviews: {
        type: [ReviewSchema]
    },
    image: {
        data: Buffer,
        contentType: String
    },
    state: {
        type: String,
        enum: [conf.PROD_TYPE_WAIT, conf.PROD_TYPE_PLACE, conf.PROD_TYPE_DISPATCH, conf.PROD_TYPE_CANCEL],
        required: true
    }
});

module.exports = mongoose.model("Product", ProductSchema);