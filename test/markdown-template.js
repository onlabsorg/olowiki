
const engine = require("../lib/olojs/engines/markdown");

async function test () {
    const context = {text:"Hello World!"};
    const template = `*{{text}}*`;
    const text = await engine.renderTemplate(template, context);
    console.log("context:", context);
    console.log("text:", text);
}

test();
