const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAddProductInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.price = !isEmpty(data.price) ? data.price : "";
    data.quantity = !isEmpty(data.quantity) ? data.quantity : "";

    // check name
    if (Validator.isEmpty(data.name)) {
        errors.name = "What is this thing called?";
    }

    if (Validator.isEmpty(data.price)) {
        errors.price = "You know you can earn some cash in the process.";
    } else if (!Validator.isDecimal(data.price, {force_decimal: false, decimal_digits: '0,', locale: 'en-IN'})) {
        errors.price = "That's not a number."
    }

    if (Validator.isEmpty(data.quantity)) {
        errors.quantity = "This can't be left empty.";
    } else if (!Validator.isInt(data.quantity, {min: 1})) {
        errors.quantity = "That's not a number."
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}