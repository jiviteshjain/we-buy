const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conf = require("../config");
const protect = require("../utils");

// load input validation
const validateAddProductInput = require("../validation/add-product");

// load models
const Vendor = require("../models/vendor");
const Product = require("../models/product");

const router = express.Router();

// add product route
// @route POST vendor/product/add
// @desc Add new product
// @access Protected

router.post("/product/add", protect((req, res, result) => {
    
    // ensure authorized user is a vendor
    if (result.type != conf.USER_TYPE_VEND) {
        res.status(403).json({error: "Forbidden"});
        return;
    }

    // check input
    const {errors, isValid} = validateAddProductInput(req.body);

    if (!isValid) {
        return res.status(400).json({errors});
    }

    const vendorId = result.id;

    // same (as well as different) vendors can add two products of the same name
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        vendorId: vendorId,
        state: conf.PROD_TYPE_WAIT
    });

    newProduct
        .save()
        .then(product => res.json(product))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}));

module.exports = router;