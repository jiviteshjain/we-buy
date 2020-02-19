const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conf = require("../config");
const protect = require("../utils");
const FuzzySearch = require("fuzzy-search");
const isEmpty = require("is-empty");

const Vendor = require("../models/vendor");
const Product = require("../models/product");
const Order = require("../models/order");

const router = express.Router();

// search products route
// @route POST customer/product/list
// @desc Search products
// @access Protected
router.post("/product/list", protect((req, res, result) => {

    if (result.type != conf.USER_TYPE_CUST) {
        res.status(403).json({error: "Forbidden"});
        return;
    }

    Product.find({
        "state": conf.PROD_TYPE_WAIT
    }).populate('vendorId').lean().exec((error, query) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        // console.log(query);

        for (let p of query) {
            let usedQuan = 0;
            let rating = 0;
            let ratingCount = 0;
            Order.find({
                "productId": p._id
            }, (error, query2) => {
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
            p.rating = (ratingCount === 0) ? 0 : rating / ratingCount;
        }
        console.log(query);

        if (req.body.search && !isEmpty(req.body.search)) {
            const searcher = new FuzzySearch(query, ['name', 'vendorId.name'], {caseSensitive: false, sort: true});
            query = searcher.search(req.body.search)
        }

        res.json(query);
    });

}));

module.exports = router;