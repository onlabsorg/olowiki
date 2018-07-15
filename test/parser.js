
const parser = require('../lib/olojs/parser');


const xml = `
<title>Test document</title>
<author id="m.delbuono@gmail.com" />
<content>
    <!--comment-->
    <h1>Header 1</h1>
    <div class="my-div" notallowedattr="doesntmatter">Some content</div>
    <span>Some other content</span>
    <not-allowed-tag>not rendered content</not-allowed-tag>
    <span>Hello {{name}}!</span>
    <span type="self-closing" />
    <custom />
</content>
`;


class CustomTag extends parser.Tag {
    toString () {
        return `<custom>THIS IS A CUSTOM TAG</custom>`;
    }
}

class CustomComment extends parser.Comment {
    toString () {
        return `<!--CUSTOM COMMENT:-->${super.toString()}`;
    }
}

class CustomText extends parser.Text {
    toString () {
        return super.toString().toUpperCase();
    }
}


const nodes = parser.parse(xml, {
    // Text: CustomText,
    // Comment: CustomComment,
    UnknownTag: parser.VoidTag,
    tags: {
        'title': parser.Tag,
        'author': parser.Tag,
        'content': parser.Tag,
        'h1': parser.Tag,
        'div': parser.Tag,
        'span': parser.Tag,
        'custom': CustomTag,
    }
});

console.log(String(nodes));
console.log(nodes.toHTML());
console.log();
nodes.render({name:"world"})
.then(() => console.log(String(nodes)));
