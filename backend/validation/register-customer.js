const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterCustomerInput(data) {
    let errors = {};

    // convert empty fields to empty strings so we can use validator
    data.name = !isEmpty(data.name) ? data.name : "";
    data.address = !isEmpty(data.address) ? data.address : "";
    data.phone = !isEmpty(data.phone) ? data.phone : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    // check name
    if (Validator.isEmpty(data.name)) {
        errors.name = "We'd love to know your name!";
    }

    // check address
    if (Validator.isEmpty(data.address)) {
        errors.address = "Where do your demons hide?";
    }

    // check phone
    if (Validator.isEmpty(data.phone)) {
        errors.phone = "Now we can't dial that :/";
    } else if (!Validator.isMobilePhone(data.phone, "en-IN", {strictMode: true})) {
        errors.phone = "Please provide your Indian mobile number as +91-XXXXXXXXXX."
    }

    // check Email
    if (Validator.isEmpty(data.email)) {
        errors.email = "We'll need your email, please?";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "That doesn't seem like a valid email address :(";
    }

    // check password
    if (Validator.isEmpty(data.password)) {
        errors.password = "We know it's a secret, but you can let us in on it!";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "This has to be the same as that.";
    }

    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = "Between 6 and 30 characters, please.";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "This has to be the same as that.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};