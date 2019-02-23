
const Path = require("./tools/path");
const parser = require("./parser");



class Document {
    
    constructor (source, context={}) {
        this.source = String(source);
        this.context = Object(context);
    }
    
    get (path) {
        const data = parser.parse(this.source);
        return Path.from(path).lookup(data);
    }
    
    async evaluate (path, ...args) {
        const data = parser.parse(this.source);
        const target = Path.from(path).lookup(data);

        if (target instanceof parser.Type) {
            const context = Object.create(this.context);
            context.doc = data;
            context.parent = Path.from(path).parent.lookup(data);
            return await target.call(context, ...args);
        } 
        else {
            return target;    
        }        
    }
    
    toString () {
        return this.source;
    }
}


module.exports = Document;
