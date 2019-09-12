(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin_markdown"],{

/***/ "./lib/bin-store/markdown.js":
/*!***********************************!*\
  !*** ./lib/bin-store/markdown.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\nconst marked = __webpack_require__(/*! marked */ \"./node_modules/marked/lib/marked.js\");\n\n\nexports.__call__ = async function (source) {\n    source = await olojs.context.str(source);\n    return marked(source);\n}\n\n\nexports.toString = () => exports.__text__;\n\nexports.title = \"Binary module: markdown\";\nexports.__text__ = `<p>\nFind the documentation at <a href=\"/doc/binaries/markdown\">/doc/binaries/markdown</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-store/markdown.js?");

/***/ })

}]);