(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["markdown-engine"],{

/***/ "./lib/olojs/engines/markdown.js":
/*!***************************************!*\
  !*** ./lib/olojs/engines/markdown.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const engine = __webpack_require__(/*! ../engine */ \"./lib/olojs/engine.js\");\nconst marked = __webpack_require__(/*! marked */ \"./node_modules/marked/lib/marked.js\");\n\nexports.renderTemplate = async function (template, context) {\n    const markup = await engine.renderTemplate(template, context);\n    return marked(markup, this.options);\n}    \n\nexports.options = {};\n\n\n//# sourceURL=webpack:///./lib/olojs/engines/markdown.js?");

/***/ })

}]);