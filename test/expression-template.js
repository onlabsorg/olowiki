
const engine = require("../lib/olojs/engines/expression");

async function test () {
    const context = {};
    const template = `{{x = y = 2+1}}`;
    const text = await engine.renderTemplate(template, context);
    console.log("context:", context);
    console.log("text:", text);
}

test();
