
const YAML = require("js-yaml");
const model = require("model");

const OloComponent = require("olo-component");
const testDoc = new model.Document(YAML.load(require("test/test-doc.yaml!text")));
OloComponent.config.rootModel = testDoc;

const OloOutliner = require("olo-outliner");
