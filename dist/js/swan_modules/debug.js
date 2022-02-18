(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["swan_modules/debug"],{

/***/ "./node_modules/@onlabsorg/swan-js/lib/modules/debug.js":
/*!**************************************************************!*\
  !*** ./node_modules/@onlabsorg/swan-js/lib/modules/debug.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n *  debug module\n *  ============================================================================\n *  The debug module provides functions for debugging swan code.\n */\n\n\n\nmodule.exports = types => {\n    const debug = {};\n    \n    \n    /**\n     *  debug.log: Term t -> Text id\n     *  ------------------------------------------------------------------------\n     *  The log function writes the passed item to the javascript console.\n     */\n    let logCount = 0;\n    debug.log = (...values) => {\n        const term = new types.Tuple(...values).normalize();\n        \n        logCount++;\n        console.log(`Log ${logCount}:`, term);\n        return `[[Log ${logCount}]]`;\n    }\n    \n    \n    return debug;\n}\n\n\n\n//# sourceURL=webpack:///./node_modules/@onlabsorg/swan-js/lib/modules/debug.js?");

/***/ })

}]);