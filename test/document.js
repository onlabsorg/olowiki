
const Document = require('../lib/olojs/document');


const doc = new Document(null, "", `
title: "Test Document"
author: "m.delbuono@gmail.com"
greet: "Hello"
subject: "main template"
sub:
    subject: "sub template"
    tpt: !template "{{greet}} {{this.subject}}!"
view: !template |
    {{greet}} {{this.subject}}!
    {{sub.tpt(globals)}}
`);




console.log("\nDATA:");
console.log(doc.data);

console.log("\nSTRING:");
console.log(String(doc));

console.log("\nRENDER:");
console.log(doc.render());
