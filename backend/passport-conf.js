const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const conf = require("./config")

const Vendor = require("./models/vendor");
const Customer = require("./models/customer");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = conf.SECRET_OR_KEY;
module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            Vendor.findById(jwt_payload.id)
                .then(vendor => {
                    if (vendor) {
                        return done(null, vendor);
                    }
                })
                .catch(err => console.log(err));
            Customer.findById(jwt_payload.id)
                .then(cust => {
                    if (cust) {
                        return done(null, cust);
                    }
                })
                .catch(err => console.log(err));
            return done(null, false)
        })
    );
};