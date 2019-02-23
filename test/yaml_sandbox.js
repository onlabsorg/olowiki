
const stripIndent = require("strip-indent");

const YAML = require("yaml");


const source = stripIndent(`
    # This is a yaml document
    
    x: 10   # this is x
    dict:
        # dictionary
        y: 20
        z: 30
    `);

const doc = YAML.parseDocument(source);

console.log(String(doc));
