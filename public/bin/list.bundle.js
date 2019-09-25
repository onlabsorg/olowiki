(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin/list"],{

/***/ "./lib/bin-backend/list.js":
/*!*********************************!*\
  !*** ./lib/bin-backend/list.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\nconst context = olojs.Expression.createContext();\n\n\nexports.presets = {\n    \n    title: \"Binary module: list\",\n\n    join: async function (X, separator=\"\") {\n        const list = await context.list(X);\n        \n        let strList = [];\n        for (let item of list) {\n            let strItem = await context.str(item);\n            strList.push( strItem );\n        }\n        return strList.join(separator);\n    },\n\n    reverse: async function (X) {\n        const list = await context.list(X);\n        return Array.from(list).reverse();                \n    },\n\n    __call__: context.list\n};\n\n\n\nexports.body = `<p>\nFind the documentation at <a href=\"/doc/binaries/list\">/doc/binaries/list</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-backend/list.js?");

/***/ })

}]);