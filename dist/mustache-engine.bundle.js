(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["mustache-engine"],{

/***/ "./lib/olojs/engines/mustache.js":
/*!***************************************!*\
  !*** ./lib/olojs/engines/mustache.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const expression = __webpack_require__(/*! ../utils/expression */ \"./lib/olojs/utils/expression.js\");\nconst mustache = __webpack_require__(/*! mustache */ \"./node_modules/mustache/mustache.js\");\nconst assignIn = __webpack_require__(/*! lodash/assignIn */ \"./node_modules/lodash/assignIn.js\");\n\n\nexports.renderTemplate = async function (template, context) {\n    assignIn(context, this.builtins);\n    return mustache.render(template, context);\n}    \n\nexports.builtins = {\n    \n    eval: function () {\n        return function (expr, render) {\n            return expression.eval(expr, this);\n        }\n    }    \n}\n\n\n//# sourceURL=webpack:///./lib/olojs/engines/mustache.js?");

/***/ })

}]);