(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./lib/olowiki-binaries/index.js":
/*!***************************************!*\
  !*** ./lib/olowiki-binaries/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nconst modules = {\n    \"math\": () => __webpack_require__.e(/*! import() | /bin_math */ \"/bin_math\").then(__webpack_require__.t.bind(null, /*! ./math */ \"./lib/olowiki-binaries/math.js\", 7)),\n    \"text\": () => __webpack_require__.e(/*! import() | /bin_text */ \"/bin_text\").then(__webpack_require__.t.bind(null, /*! ./text */ \"./lib/olowiki-binaries/text.js\", 7)),\n    \"list\": () => __webpack_require__.e(/*! import() | /bin_list */ \"/bin_list\").then(__webpack_require__.t.bind(null, /*! ./list */ \"./lib/olowiki-binaries/list.js\", 7)),\n    \"markdown\": () => __webpack_require__.e(/*! import() | /bin_markdown */ \"/bin_markdown\").then(__webpack_require__.t.bind(null, /*! ./markdown */ \"./lib/olowiki-binaries/markdown.js\", 7)),\n}\n\nexports.require = async function (name) {\n    if (typeof modules[name] === \"function\") {\n        modules[name] = await modules[name]();\n    }\n    return modules[name];    \n}\n\n\n//# sourceURL=webpack:///./lib/olowiki-binaries/index.js?");

/***/ })

}]);