const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conf = require("../config")

// load input validation
const validateRegisterVendorInput = require("../validation/register-vendor")
const validateRegisterCustomerInput = require("../validation/register-customer")
const validateLoginInput = require("../validation/login");

// load models
const Vendor = require("../models/vendor")
const Customer = require("../models/customer")

const router = express.Router();

// vendor registration route
// @route POST auth/register/vendor
// @desc Register vendor
// @access Public
router.post("/register/vendor", (req, res) => {
    
    // check input validation
    console.log(req)
    const {errors, isValid} = validateRegisterVendorInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // check already exists and if not, create
    Vendor.findOne({email: req.body.email}).then(vendor => {
        if (vendor) {
            return res.status(400).json({email: "We know you. This email already exists."});
        } else {
            const newVendor = new Vendor({
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password
            });

            // hash passwords before storing in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newVendor.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    newVendor.password = hash;
                    newVendor
                        .save()
                        .then(vendor => res.json(vendor))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});


// customer registration route
// @route POST auth/register/customer
// @desc Register customer
// @access Public
router.post("/register/customer", (req, res) => {

    // check input validation
    const {
        errors,
        isValid
    } = validateRegisterCustomerInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // check already exists and if not, create
    Customer.findOne({
        email: req.body.email
    }).then(cust => {
        if (cust) {
            return res.status(400).json({
                email: "We know you. This email already exists."
            });
        } else {
            const newCust = new Customer({
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password
            });

            // hash passwords before storing in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newCust.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    newCust.password = hash;
                    newCust
                        .save()
                        .then(cust => res.json(cust))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

function userFound(type, password, user, res) {
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            // user authenticated
            // create JWT token
            const jwtPayload = {
                id: user.id,
                name: user.name,
                type: type
            };
            jwt.sign(jwtPayload, conf.SECRET_OR_KEY, {
                    expiresIn: conf.TOKEN_EXPIRY
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                });
        } else {
            res.status(400).json({
                password: "That password's incorrect :O"
            })
        }
    });
}

// login route
// @route POST auth/login
// @desc Login and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // check validation
    const {errors, isValid} = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // find vendor/customer by email
    Vendor.findOne({email}).then((user) => {
       if (!user) {
           Customer.findOne({email}).then((user2) => {
               if (user2) {
                   userFound(conf.USER_TYPE_CUST, password, user2, res);
               } else {
                   res.status(404).json({
                       email: "We don't thing we know you."
                   });
               }
           });
       } else {
           userFound(conf.USER_TYPE_VEND, password, user, res);
       }
   });
    
});

module.exports = router