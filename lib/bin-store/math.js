
const olojs = require("olojs");
const isNumber = require("lodash/isNumber");
const isString = require("lodash/isString");


exports.PI = Math.PI;
exports.sin = Math.sin;
exports.cos = Math.cos;
exports.tan = Math.tan;
exports.asin = Math.asin;
exports.acos = Math.acos;
exports.atan = Math.atan;

exports.int = async function (value) {
    return isNumber(value) ? Math.round(value) : NOTHING;    
}

exports.hex = function (numStr) {
    return isString(numStr) ? Number(`0x${numStr}`) || NOTHING : NOTHING;
}

exports.oct = function (numStr) {
    return isString(numStr) ? Number(`0o${numStr}`) || NOTHING : NOTHING;
}

exports.bin = function (numStr) {
    return isString(numStr) ? Number(`0b${numStr}`) || NOTHING : NOTHING;
}

exports.min = (...nums) => Math.min(...nums);

exports.max = (...nums) => Math.max(...nums);

exports.toString = () => exports.__text__;

exports.title = "Binary module: math";
exports.__text__ = `<p>
Find the documentation at <a href="/doc/binaries/math">/doc/binaries/math</a>
</p>`;
