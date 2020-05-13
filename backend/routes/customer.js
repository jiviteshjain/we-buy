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

async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i);
    }
}

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

        const start = async() => {
            await asyncForEach(query, async (p) => {
                let usedQuan = 0;
                let rating = 0;
                let ratingCount = 0;
                Order.find({
                    "productId": p._id
                }, (error2, query2) => {
                    if (!error2) {
                        for (o of query2) {
                            usedQuan += o.quantity;
                            if (o.rating != 0) {
                                rating += o.rating;
                                ratingCount++;
                            }
                        }
                    }
                });
                p.remQuan = Math.max(0, p.quantity - usedQuan);
                p.rating = (ratingCount === 0) ? 0 : rating / ratingCount;
            });
            console.log(query);

            if (req.body.search && !isEmpty(req.body.search)) {
                const searcher = new FuzzySearch(query, ['name', 'vendorId.name'], {
                    caseSensitive: false,
                    sort: true
                });
                query = searcher.search(req.body.search)
            }

            res.json(query);
        };
        start();

        // for (let p of query) {
        //     let usedQuan = 0;
        //     let rating = 0;
        //     let ratingCount = 0;
        //     Order.find({
        //         "productId": p._id
        //     }, (error, query2) => {
        //         if (!error) {
        //             for (o of query2) {
        //                 usedQuan += o.quantity;
        //                 if (o.rating != 0) {
        //                     rating += o.rating;
        //                     ratingCount++;
        //                 }
        //             }
        //         }
        //     });
        //     p.remQuan = Math.max(0, p.quantity - usedQuan);
        //     p.rating = (ratingCount === 0) ? 0 : rating / ratingCount;
        // }
        // console.log(query);

        // if (req.body.search && !isEmpty(req.body.search)) {
        //     const searcher = new FuzzySearch(query, ['name', 'vendorId.name'], {caseSensitive: false, sort: true});
        //     query = searcher.search(req.body.search)
        // }

        // res.json(query);
    });

}));

router.post("/product/details", protect((req, res, result) => {
    if (!req.body.productId || isEmpty(req.body.productId)) {
        res.status(401).json({error: "Product ID missing"});
        return;
    }

    Product.find({"_id": req.body.productId}).populate('vendorId').lean().exec((error,query) => {
        if (query.length == 0) {
            res.status(401).json({error: "Product ID not found"});
            return;
        }

        const prod = query[0];
        if (result.type == conf.USER_TYPE_VEND) {
            if (prod.vendorId._id != result.id) {
                res.status(403).json({error: "Forbidden"});
                return;
            }
        }

        prod.orders = [];
        let usedQuan = 0;
        let rating = 0;
        let ratingCount = 0;
        Order.find({
            "productId": prod._id
        }).populate("customerId").lean().exec((error, query2) => {
            console.log(error)
            // console.log(query2)
            if (!error) {
                for (let o of query2) {
                    console.log(o)
                    usedQuan += o.quantity;
                    console.log(usedQuan)
                    if (o.rating != 0) {
                        rating += o.rating;
                        ratingCount++;
                    }
                    prod.orders.push(o);
                }
                console.log("cjshd")
                console.log(usedQuan)
                prod.remQuan = Math.max(0, prod.quantity - usedQuan);
                console.log(prod.remQuan)
                prod.rating = (ratingCount === 0) ? 0 : rating / ratingCount;
                res.json(prod);
                return;
            }
        });
        
    });
}));

router.post("/product/order", protect((req, res, result) => {
    console.log(req.body);
    if (result.type != conf.USER_TYPE_CUST) {
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    
    if (!req.body.productId || isEmpty(req.body.productId)) {
        res.status(401).json({ error: "Product ID missing" });
        return;
    }
    


    if (!req.body.quantity || isEmpty(req.body.quantity)) {
        res.status(401).json({ error: "Invalid quantity" });
        return;
    }
    
    const customerId = result.id;
    const productId = req.body.productId;
    let quantity = parseInt(req.body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(401).json({ error: "Invalid quantity" });
        return;
    }

    Product.findOne({"_id": productId}, (error, product) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        if (product == null) {
            res.status(401).json({error: "Product not found"});
            return;
        }

        if (product.state != conf.PROD_TYPE_WAIT) {
            res.status(401).json({error: "Product unavailable for ordering"});
            return;
        }

        let usedQuan = 0;
        Order.find({
            "productId": productId
        }, (error, query2) => {
            if (!error) {
                for (o of query2) {
                    usedQuan += o.quantity;
                }
                let remQuan = Math.max(0, product.quantity - usedQuan);

                quantity = Math.min(quantity, remQuan);

                if (remQuan - quantity <= 0) {
                    product.state = conf.PROD_TYPE_PLACE;
                    product.save();
                    // console.log(err)
                }

                const newOrder = new Order({
                    customerId: customerId,
                    productId: productId,
                    quantity: quantity
                });

                newOrder.save().then(order => res.json(order)).catch(err => console.log(err));
            }
        });
        

    });
}));

router.post("/order/list", protect((req, res, result) => {
    if (result.type != conf.USER_TYPE_CUST) {
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    if (req.body.orderId && !isEmpty(req.body.orderId)) {
        Order.findOne({
                "_id": req.body.orderId
            }).populate("customerId").populate({
                path: "productId",
                populate: {
                    path: "vendorId"
                }
            }).lean().exec((error, query) => {
            if (!error) {
                if (query == null) {
                    res.status(401).json({error: "Order ID invalid"});
                    return;
                }
                if (query.customerId._id != result.id) {
                    res.status(403).json({error: "Forbidden"});
                }

                if (query.productId.state == conf.PROD_TYPE_WAIT) {
                    let usedQuan = 0;
                    Order.find({
                        "productId": query.productId._id
                    }, (error2, query2) => {
                        if (!error2) {
                            for (o of query2) {
                                usedQuan += o.quantity;
                            }
                            query.remQuan = Math.max(0, query.productId.quantity - usedQuan);
                            res.json(query);
                            return;
                            
                        }
                    });
                } else {
                    res.json(query);
                    return;
                }

            } else {
                res.status(500).json(error);
            }
        });
    } else {
        Order.find().populate({path: "productId", populate: {path: "vendorId"}}).populate("customerId").lean().exec((error, query) => {
            if (!error) {
                query = query.filter(prod => prod.customerId._id == result.id);
                res.json(query);
            } else {
                res.status(500).json(error);
            }
        });
    }
}));

router.post("/order/edit", protect((req, res, result) => {
    if (result.type != conf.USER_TYPE_CUST) {
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    if (!req.body.orderId || isEmpty(req.body.orderId)) {
        res.status(401).json({quantity: "Order ID missing"});
        return;
    }
    if (!req.body.quantity || isEmpty(req.body.quantity)) {
        res.status(401).json({
            quantity: "Quantity cannot be empty"
        });
        return;
    }

    Order.findOne({
                "_id": req.body.orderId
            }).populate("customerId").populate({
                path: "productId",
                populate: {
                    path: "vendorId"
                }
            }).exec((error, query) => {
            if (!error) {
                if (query == null) {
                    res.status(401).json({error: "Order ID invalid"});
                    return;
                }
                if (query.customerId._id != result.id) {
                    res.status(403).json({error: "Forbidden"});
                }

                if (query.productId.state == conf.PROD_TYPE_WAIT) {
                    let usedQuan = 0;
                    Order.find({
                        "productId": query.productId._id
                    }, (error2, query2) => {
                        if (!error2) {
                            for (o of query2) {
                                usedQuan += o.quantity;
                            }
                            let remQuan = Math.max(0, query.productId.quantity - usedQuan);
                            let oldOrderQuan = query.quantity;
                            let newOrderQuan = req.body.quantity;
                            console.log("qwerty")
                            console.log(newOrderQuan);

                            if (newOrderQuan <= oldOrderQuan) {
                                query.quantity = newOrderQuan;
                                query.save();
                                res.end();
                                return;
                            } else {
                                query.quantity = newOrderQuan;
                                query.save();

                                remQuan -= (newOrderQuan - oldOrderQuan);
                                if (remQuan < 0) {
                                    res.status(401).json({quantity: "Not enough product available"});
                                    return;
                                } else if (remQuan == 0) {
                                    Product.findByIdAndUpdate({"_id": query.productId._id}, {"state": console.PROD_TYPE_PLACE}, (err, query3) => {
                                        // console.log(done)
                                        res.end();
                                        return;
                                    });
                                }
                            }
                            
                        }
                    });
                } else {
                    res.status(401).json({error: "Order not editable"});
                    return;
                }

            } else {
                res.status(500).json(error);
            }
        });
    
    
}));

router.post("/order/rate/vendor", protect((req, res, result) => {
    if (result.type != conf.USER_TYPE_CUST) {
        res.status(403).json({ error: "Forbidden" });
        return;
    }

    if (!req.body.vendorId || isEmpty(req.body.vendorId)) {
        res.status(401).json({vendorRating: "Vendor ID missing"});
        return;
    }

    if (!req.body.rating || isEmpty(req.body.rating)) {
        res.status(401).json({
            vendorRating: "Rating cannot be empty"
        });
        return;
    }

    let vendorRating = parseInt(req.body.rating);
    if (!Number.isInteger(vendorRating) || vendorRating < 1 || vendorRating > 5) {
        res.status(401).json({
            vendorRating: "Rating must be between 1 and 5"
        });
    }

    Vendor.findOne({"_id": req.body.vendorId}, (error, query) => {
        if (!error) {
            if (query == null) {
                res.status(401).json({vendorRating: "Vendor ID does not exist"});
                return;
            }

            let rating = parseFloat(query.currentRating);
            let num = query.numberRatings;
            console.log("---")
            console.log(rating)
            console.log(num)
            rating = ((rating * num) + vendorRating) / (num + 1);
            num++;
            console.log(rating)
            console.log(num)
            query.currentRating = `${rating}`;
            query.numberRatings = num;
            query.save();
            res.end();
        }
    });
}));

router.post("/order/rate/product", protect((req, res, result) => {
    if (result.type != conf.USER_TYPE_CUST) {
        res.status(403).json({
            error: "Forbidden"
        });
        return;
    }

    if (!req.body.orderId || isEmpty(req.body.orderId)) {
        res.status(401).json({
            productRating: "Order ID missing"
        });
        return;
    }

    if (!req.body.productRating || isEmpty(req.body.productRating)) {
        res.status(401).json({
            productRating: "Rating cannot be empty"
        });
        return;
    }

    let productRating = parseInt(req.body.productRating);
    if (!Number.isInteger(productRating) || productRating < 1 || productRating > 5) {
        res.status(401).json({
            productRating: "Rating must be between 1 and 5"
        });
    }

    if (!req.body.productReview || isEmpty(req.body.productReview)) {
        res.status(401).json({
            productReview: "Review cannot be empty"
        });
        return;
    }

    Order.findOne({"_id": req.body.orderId}, (error, query) => {
        if (!error) {
            if (query == null) {
                res.status(401).json({productRating: "Order ID does not exist"});
                return;
            }

            query.rating = productRating;
            query.review = req.body.productReview;
            query.save();
            console.log("test")
            res.end();
        }
    });


}));

module.exports = router;