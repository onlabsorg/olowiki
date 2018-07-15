
const engine = require("../lib/olojs/engines/mustache");

async function test () {
    const context = {text: "Hello World!", x: 10};
    const template = `{{text}} {{#eval}}x+1{{/eval}}`;
    const text = await engine.renderTemplate(template, context);
    console.log("context:", context);
    console.log("text:", text);
}

test();
