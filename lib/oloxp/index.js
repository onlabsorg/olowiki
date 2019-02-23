const parser = require("./lib/parser");
const expression = require("./lib/expression");

exports.parse = parser.parse;
exports.compile = expression.compile;
exports.evaluate = expression.evaluate;
