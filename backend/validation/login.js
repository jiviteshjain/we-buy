const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};
    
    // Convert empty fields to an empty string so we can use validator
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // check email
    if (Validator.isEmpty(data.email)) {
        errors.email = "We'll need your email, please?";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "That doesn't seem like a valid email address :(";
    }

    // check password
    if (Validator.isEmpty(data.password)) {
        errors.password = "We know it's a secret, but you can let us in on it!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};