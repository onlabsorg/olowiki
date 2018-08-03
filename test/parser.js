
const parser = require('../lib/olojs/oloxp/parser');

const ast = parser.parse("1+2+3");

console.log(ast);
