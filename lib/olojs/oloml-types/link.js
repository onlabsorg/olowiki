const oloml = require("../oloml");
const Path = require("path");


class Link extends oloml.ScalarType {
    
    constructor (data, options) {
        super(data, options);
        if (!this.options.basePath) this.options.basePath = "/";
        if (typeof this.options.loadDocument !== "function") {
            this.options.loadDocument = (path) => Object({
                data: {}
            });
        }
    }
    
    async evaluate (scope, ...args) {
        const context = this.Context({}, scope, ...args);
        const docPath = Path.join("/", this.options.basePath, this.data);
        const doc = await this.options.loadDocument(docPath);
        return doc.data;
    }    
}

module.exports = Link;
