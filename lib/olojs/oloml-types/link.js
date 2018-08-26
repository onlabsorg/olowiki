const oloml = require("../oloml");
const Path = require("path");


class Link extends oloml.ScalarType {
    
    async evaluate (scope, ...args) {
        const docPath = Path.join(this.options.path, this.data);
        const doc = await this.options.store.readDocument(docPath);
        return doc.data;
    }    
}

module.exports = Link;
