
const olojs = require("olojs");
const isNumber = require("lodash/isNumber");
const isString = require("lodash/isString");

const context = olojs.Expression.createContext();

exports.presets = {

    title: "Binary module: math",

    PI: Math.PI,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,

    int: async function (value) {
        return isNumber(value) ? Math.round(value) : context.NOTHING;    
    },

    hex: function (numStr) {
        return isString(numStr) ? Number(`0x${numStr}`) || context.NOTHING : context.NOTHING;
    },

    oct: function (numStr) {
        return isString(numStr) ? Number(`0o${numStr}`) || context.NOTHING : context.NOTHING;
    },

    bin: function (numStr) {
        return isString(numStr) ? Number(`0b${numStr}`) || context.NOTHING : context.NOTHING;
    },

    min: (...nums) => Math.min(...nums),

    max: (...nums) => Math.max(...nums),
};

exports.body = `<p>
Find the documentation at <a href="/doc/binaries/math">/doc/binaries/math</a>
</p>`;
