(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin/markdown"],{

/***/ "./lib/bin-backend/markdown.js":
/*!*************************************!*\
  !*** ./lib/bin-backend/markdown.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\nconst marked = __webpack_require__(/*! marked */ \"./node_modules/marked/lib/marked.js\");\nconst context = olojs.Expression.createContext();\n\n\nexports.presets = {\n\n    title: \"Binary module: markdown\",\n    \n    __call__: async function (source) {\n        source = await context.str(source);\n        return marked(source);\n    }\n}\n\n\nexports.body = `<p>\nFind the documentation at <a href=\"/doc/binaries/markdown\">/doc/binaries/markdown</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-backend/markdown.js?");

/***/ })

}]);