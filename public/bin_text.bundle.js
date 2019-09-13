(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin_text"],{

/***/ "./lib/bin-store/text.js":
/*!*******************************!*\
  !*** ./lib/bin-store/text.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\n\n\nexports.ucase = async function (X) {\n    const str = await olojs.context.str(X);\n    return str.toUpperCase();\n}    \n\nexports.lcase = async function (X) {\n    const str = await olojs.context.str(X);\n    return str.toLowerCase();\n}    \n\nexports.trim = async function (X) {\n    const str = await olojs.context.str(X);\n    return str.trim();\n}     \n\nexports.split = async function (X, divider) {\n    const str = await olojs.context.str(X);\n    divider = await olojs.context.str(divider);\n    return str.split(divider);\n}\n\nexports.render = async function (template) {\n    template = await olojs.context.str(template.trim());\n    const values = [];\n    var text = template.replace(/{([A-Z_a-z][[A-Z_a-z0-9]*)}/g, (match, name) => {\n        values.push(this[name]);\n        return `{${values.length-1}}`;\n    });\n    for (let i=0; i<values.length; i++) {\n        let stringValue = await olojs.context.str(values[i]);\n        text = text.replace(`{${i}}`, stringValue);\n    }\n    return text;\n}\n\nexports.__call__ = olojs.context.str;\n\nexports.toString = () => exports.__text__;\n\nexports.title = \"Binary module: text\";\nexports.__text__ = `<p>\nFind the documentation at <a href=\"/doc/binaries/text\">/doc/binaries/text</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-store/text.js?");

/***/ })

}]);