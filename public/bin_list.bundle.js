(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin_list"],{

/***/ "./lib/bin-store/list.js":
/*!*******************************!*\
  !*** ./lib/bin-store/list.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\n\nexports.join = async function (X, separator=\"\") {\n    const list = await olojs.context.list(X);\n    \n    let strList = [];\n    for (let item of list) {\n        let strItem = await olojs.context.str(item);\n        strList.push( strItem );\n    }\n    return strList.join(separator);\n}\n\nexports.reverse = async function (X) {\n    const list = await olojs.context.list(X);\n    return Array.from(list).reverse();                \n}\n\nexports.__call__ = olojs.context.list;\n\nexports.toString = () => exports.__text__;\n\nexports.title = \"Binary module: list\";\nexports.__text__ = `<p>\nFind the documentation at <a href=\"/doc/binaries/list\">/doc/binaries/list</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-store/list.js?");

/***/ })

}]);