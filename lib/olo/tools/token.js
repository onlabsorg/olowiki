const jwt = require("jsonwebtoken");


exports.verify = function (token, secret) {
    return jwt.verify(token, secret);
}

exports.sign = function (payload, secret) {
    return jwt.sign(payload, secret);
}
