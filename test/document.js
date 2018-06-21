
const Document = require('../lib/olojs/document');


const doc = new Document(`
<title>Test document</title>
<author id="m.delbuono@gmail.com" />
<content>
    <h1>Header 1</h1>
    <div class="my-div" notallowedattr="doesntmatter">Some content</div>
    <span>Some other content</span>
    <not-allowed-tag />
    <span>Hello {{name}}!</span>
</content>
`);

console.log(String(doc));
console.log();
doc.render({name:"world"})
.then(html => console.log(html));
