const YAML = require("js-yaml");


class Comment {
    
    constructor (source, doc) {
        this.source = String(source);
        this.doc = doc;
    }
    
    toString () {
        return "";
    }
    
    static createYAMLType (tagName, doc) {
        return new YAML.Type(tagName, {
            
            kind: 'scalar',
            
            resolve: data => true,
            
            construct: data => new this(data, doc),
            
            instanceOf: this,
            
            represent: comment => comment.source
        });
    }
}


module.exports = Comment;
