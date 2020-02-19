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
const Order = require("../models/order");

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

// view all products route
// @route GET vendor/product/list
// @desc List all products of the vendor
// @access protected
router.get("/product/list", protect((req, res, result) => {
    // ensure authorized user is a vendor
    if (result.type != conf.USER_TYPE_VEND) {
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    const vendorId = result.id;

    Product.find({"vendorId": vendorId}).lean().exec((error, query) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        // console.log(query);

        for (let p of query) {
            let usedQuan = 0;
            let rating = 0;
            let ratingCount = 0;
            Order.find({"productId": p._id}, (error,query2) => {
                if (!error) {
                    for (o of query2) {
                        usedQuan += o.quantity;
                        if (o.rating != -1) {
                            rating += o.rating;
                            ratingCount++;
                        }
                    }
                }
            });
            p.remQuan = Math.max(0, p.quantity - usedQuan);
            p.rating = (ratingCount === 0) ? 0 : rating/ratingCount;
        }
        console.log(query);

        res.json(query);
    });
}));

module.exports = router;