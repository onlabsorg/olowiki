
const Document = require('../lib/olojs/document');


const doc = new Document(null, "", `
title: Sabdbox
author: m.delbuono@gmail.com
public: true
section:
    name: Section A
    render: !<!template> '"{{this.name}}", authored by {{author}}'
render: !<!template> |
    <h1>"{{this.title}}", authored by {{author}}.</h1>
    <b>{{section.render()}}</b><br>
    {{section.name}}
`);




console.log("\nDATA:");
console.log(doc.data);

console.log("\nSTRING:");
console.log(String(doc));

console.log("\nRENDER:");
console.log(doc.render());
