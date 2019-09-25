(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/bin/text"],{

/***/ "./lib/bin-backend/text.js":
/*!*********************************!*\
  !*** ./lib/bin-backend/text.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const olojs = __webpack_require__(/*! olojs */ \"./lib/olojs/index.js\");\nconst context = olojs.Expression.createContext();\n\nexports.presets = {\n\n    title: \"Binary module: text\",\n\n    ucase: async function (X) {\n        const str = await context.str(X);\n        return str.toUpperCase();\n    },    \n\n    lcase: async function (X) {\n        const str = await context.str(X);\n        return str.toLowerCase();\n    },    \n\n    trim: async function (X) {\n        const str = await context.str(X);\n        return str.trim();\n    },    \n\n    split: async function (X, divider) {\n        const str = await context.str(X);\n        divider = await context.str(divider);\n        return str.split(divider);\n    },\n\n    render: async function (template) {\n        template = await context.str(template.trim());\n        const values = [];\n        var text = template.replace(/{([A-Z_a-z][[A-Z_a-z0-9]*)}/g, (match, name) => {\n            values.push(this[name]);\n            return `{${values.length-1}}`;\n        });\n        for (let i=0; i<values.length; i++) {\n            let stringValue = await context.str(values[i]);\n            text = text.replace(`{${i}}`, stringValue);\n        }\n        return text;\n    },\n\n    __call__: context.str,    \n}\n\nexports.body = `<p>\nFind the documentation at <a href=\"/doc/binaries/text\">/doc/binaries/text</a>\n</p>`;\n\n\n//# sourceURL=webpack:///./lib/bin-backend/text.js?");

/***/ })

}]);