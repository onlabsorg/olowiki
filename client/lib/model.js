
const Path = require("olojs/path");
const Document = require("olojs/document");


var currentDocument = new Document({
    committed: {
        data: {}
    }
});


exports.getDocument = function () {
    return currentDocument;
}


exports.setDocument = function (newDocument) {
    if (newDocument instanceof Document) {
        let oldDocument = currentDocument;
        currentDocument = newDocument;
        for (let callback of this.documentChangeCallbacks) {
            if (typeof callback === "function") callback(oldDocument, newDocument);
        }
    }
}


exports.getModel = function (path) {
    const fullPath = Path.parse('data', path);
    return currentDocument.get(fullPath);
}


exports.documentChangeCallbacks = new Set();
