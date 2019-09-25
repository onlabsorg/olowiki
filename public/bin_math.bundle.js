(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin_math"],{

/***/ "./lib/bin-backend/math.js":
/*!*********************************!*\
  !*** ./lib/bin-backend/math.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nconst olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\nconst isNumber = __webpack_require__(/*! lodash/isNumber */ \"./node_modules/lodash/isNumber.js\");\nconst isString = __webpack_require__(/*! lodash/isString */ \"./node_modules/lodash/isString.js\");\n\nconst context = olojs.Expression.createContext();\n\nexports.presets = {\n\n    title: \"Binary module: math\",\n\n    PI: Math.PI,\n    sin: Math.sin,\n    cos: Math.cos,\n    tan: Math.tan,\n    asin: Math.asin,\n    acos: Math.acos,\n    atan: Math.atan,\n\n    int: async function (value) {\n        return isNumber(value) ? Math.round(value) : context.NOTHING;    \n    },\n\n    hex: function (numStr) {\n        return isString(numStr) ? Number(`0x${numStr}`) || context.NOTHING : context.NOTHING;\n    },\n\n    oct: function (numStr) {\n        return isString(numStr) ? Number(`0o${numStr}`) || context.NOTHING : context.NOTHING;\n    },\n\n    bin: function (numStr) {\n        return isString(numStr) ? Number(`0b${numStr}`) || context.NOTHING : context.NOTHING;\n    },\n\n    min: (...nums) => Math.min(...nums),\n\n    max: (...nums) => Math.max(...nums),\n};\n\nexports.body = `<p>\nFind the documentation at <a href=\"/doc/binaries/math\">/doc/binaries/math</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-backend/math.js?");

/***/ })

}]);