(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin_math"],{

/***/ "./lib/bin-store/math.js":
/*!*******************************!*\
  !*** ./lib/bin-store/math.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nconst olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\nconst isNumber = __webpack_require__(/*! lodash/isNumber */ \"./node_modules/lodash/isNumber.js\");\nconst isString = __webpack_require__(/*! lodash/isString */ \"./node_modules/lodash/isString.js\");\n\n\nexports.PI = Math.PI;\nexports.sin = Math.sin;\nexports.cos = Math.cos;\nexports.tan = Math.tan;\nexports.asin = Math.asin;\nexports.acos = Math.acos;\nexports.atan = Math.atan;\n\nexports.int = async function (value) {\n    return isNumber(value) ? Math.round(value) : NOTHING;    \n}\n\nexports.hex = function (numStr) {\n    return isString(numStr) ? Number(`0x${numStr}`) || NOTHING : NOTHING;\n}\n\nexports.oct = function (numStr) {\n    return isString(numStr) ? Number(`0o${numStr}`) || NOTHING : NOTHING;\n}\n\nexports.bin = function (numStr) {\n    return isString(numStr) ? Number(`0b${numStr}`) || NOTHING : NOTHING;\n}\n\nexports.min = (...nums) => Math.min(...nums);\n\nexports.max = (...nums) => Math.max(...nums);\n\nexports.toString = () => exports.__text__;\n\nexports.title = \"Binary module: math\";\nexports.__text__ = `<p>\nFind the documentation at <a href=\"/doc/binaries/math\">/doc/binaries/math</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-store/math.js?");

/***/ })

}]);