(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["olo-editor"],{

/***/ "./lib/client/olo-editor.html":
/*!************************************!*\
  !*** ./lib/client/olo-editor.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = \"<ace-editor v-model=\\\"doc.template\\\"\\n            @init=\\\"initEditor\\\"\\n            lang=\\\"html\\\"\\n            theme=\\\"chrome\\\"\\n            :options=\\\"editorOptions\\\">\\n        </ace-editor>\\n\";\n\n//# sourceURL=webpack:///./lib/client/olo-editor.html?");

/***/ }),

/***/ "./lib/client/olo-editor.js":
/*!**********************************!*\
  !*** ./lib/client/olo-editor.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nmodule.exports = {\n\n    template: __webpack_require__(/*! ./olo-editor.html */ \"./lib/client/olo-editor.html\"),\n\n    props: ['doc'],\n\n    data: () => Object({\n        editorOptions: {\n            fontSize: \"12pt\",\n            showLineNumbers: false,\n            showGutter: false\n        }\n    }),\n\n    components: {\n        'ace-editor': __webpack_require__(/*! vue2-ace-editor */ \"./node_modules/vue2-ace-editor/index.js\"),\n    },\n    \n    methods: {\n        initEditor () {\n            __webpack_require__(/*! brace/ext/language_tools */ \"./node_modules/brace/ext/language_tools.js\") //language extension prerequsite...\n            __webpack_require__(/*! brace/mode/html */ \"./node_modules/brace/mode/html.js\")\n            __webpack_require__(/*! brace/theme/chrome */ \"./node_modules/brace/theme/chrome.js\")\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./lib/client/olo-editor.js?");

/***/ })

}]);