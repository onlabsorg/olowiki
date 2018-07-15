const Parser = require('../lib/olojs/parser2');
const parser = new Parser();


const xml = `
<xml>
    <title>Test document</title>
    <author id="m.delbuono@gmail.com" />
    <content>
        <!--this is a comment-->
        <h1>Header 1</h1>
        <div class="my-div" notAllowedAttr="doesntmatter">Some content</div>
        <span>Some other content</span>
        <not-allowed-tag>not rendered content</not-allowed-tag>
        <span>Hello {{name}}!</span>
        <span type="self-closing" />
        <custom />
    </content>
</xml>
`;


console.log(parser.parse(xml));
