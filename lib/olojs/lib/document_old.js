
const isNumber = require("lodash/isNumber");

const Expression = require("./expression");
const DEFAULT_EXPRESSION = 'self';

const Context = require("./context");
const DEFAULT_CONTEXT = new Context();



class Item {
    
    constructor (sourceLine) {
        this._indent = sourceLine.search(/\S|$/);   // Number of leading spaces
        this._source = sourceLine.trim();
        this._spacesAfter = sourceLine.length - this._source.length - this._indent;
        
        let match = this._source.match(/^([A-Za-z_][A-Za-z_0-9]*)\s*\:(.*)$/);
        if (match) {
            this.name = match[1];
            this.expression = new Expression( match[2].trim() || DEFAULT_EXPRESSION );
        } else {
            this.name = undefined;
            this.expression = new Expression( this._source || DEFAULT_EXPRESSION );
        }
    }
    
    async evaluate (context=DEFAULT_CONTEXT) {
        return await this.expression.evaluate(context);
    }
    
    toString () {
        return " ".repeat(this._indent) + this._source;
    }
}


class Node {
    
    constructor (item, children=[]) {
        this.item = item;
        this._spacesAfter = 0;
        this.children = new List(this);
        for (let child of children) {
            this.children.push(child);
        }
    }
    
    get name () {
        return this.item.name;
    }
    
    get expression () {
        return this.item.expression;
    }
    
    async evaluate (context=DEFAULT_CONTEXT) {
        const nodeContext = Object.create(context);
        nodeContext.self = new NodeProxy(this, context);
        return await this.item.evaluate(nodeContext);
    }
    
    toString () {
        var source = String(this.item) + "\n";
        source += "\n".repeat(this._spacesAfter);
        source += String(this.children);
        return source;
    }
}


class List extends Array {
    
    constructor (parent=null) {
        super();
        this._spacesBefore = 0;
        this._parent = parent;
    }
    
    push (node) {
        
        let newNodeIsEmpty = node.item._source === '';
        if (newNodeIsEmpty) {
            this._pushSpace();
            return;
        } 
        
        let lastNode = this.get(-1);
        
        if (!lastNode) {
            this._append(node);

        } else {
            let thisIndent = this[0].item._indent;
            if (node.item._indent === thisIndent) {
                this._append(node);
                
            } else if (node.item._indent > thisIndent) {
                lastNode.children.push(node);
                
            } else {
                throw new Error("Indentation error.");
                
            }            
        }
    }
    
    _append (node) {
        super.push(node);
        node._parent = this._parent;
    }
    
    _pushSpace () {
        let lastNode = this.get(-1);
        if (lastNode) {
            if (lastNode.children.length > 0) {
                lastNode.children._pushSpace();
            } else {
                lastNode._spacesAfter += 1;
            }
        } else {
            this._spacesBefore += 1;
        }
    }
    
    get (key) {
        if (isNumber(key)) {
            let index = key < 0 ? this.length + key : key;
            return this[index];
        } else {
            for (let node of this) {
                if (node.name === key) return node;
            }
        }
        return undefined;
    }
    
    toString () {
        var source = "\n".repeat(this._spacesBefore);
        for (let node of this) {
            source += String(node);
        }
        return source;
    }
}


class NodeProxy {
    
    constructor (node, context) {
        this._node = node;
        this._context = context;
    }
    
    get name () {
        return this._node.name;
    }
    
    get index () {
        const parentNode = this._node._parent;
        if (parentNode instanceof Node) {
            return parentNode.children.indexOf(this._node);
        } else {
            return undefined;
        }
    }
    
    get parent () {
        const parentNode = this._node._parent;
        return parentNode ? parentNode.evaluate(this._context) : null;
    }
    
    async get (name) {
        const childNode = this._node.children.get(name);
        if (childNode === undefined) return undefined;
        return await childNode.evaluate(this._context);
    }
    
    __len__ () {
        return this._node.children.length;
    }
    
    async __get__ (name) {
        return await this.get(name);
    }
    
    toString () {
        return String(this._node.children);
    }
}





class Document extends NodeProxy {
    
    constructor (source, context=DEFAULT_CONTEXT) {
        const rootNode = new Node(null);
        source.split("\n").map(sourceLine => {
            let item = new Item(sourceLine);
            let node = new Node(item);
            rootNode.children.push(node);
        });        
        
        const docContext = Object.create(context);        

        super(rootNode, docContext);
        docContext.root = this;
        docContext.globals = docContext;
    }
}


Document.Item = Item;
Document.Node = Node;
Document.List = List;
Document.NodeProxy = NodeProxy;


module.exports = Document;
