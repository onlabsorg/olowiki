
const YAML = require("js-yaml");
const model = require("model");

const OloComponent = require("olo-component");
const OloOutliner = require("olo-outliner");

const testDocObj = require("test/test-doc.yaml!text");
model.memory.createDocument(YAML.load(testDocObj))
.then((testDoc) => {
    document.querySelector("olo-root").document = testDoc;
});
