
const Expression = require("./expression");
const Outline = require('./outline');

const Context = require("./context");
const DEFAULT_CONTEXT = new Context();


class NodeProxy {
    
    constructor (node, context=DEFAULT_CONTEXT) {
        this._targetNode = node; 
        this._targetNode.proxy = this;
        
        this._contextPrototype = context;
        this._context = Object.create( this._contextPrototype );
        this._context.self = this;
    }
    
    get name () {
        return this._targetNode.name;
    }
    
    get index () {
        return this._targetNode.index;
    }
    
    get parent () {
        const parentNode = this._targetNode.getParent();
        if (!parentNode) return null;
        return parentNode.proxy || new NodeProxy(parentNode, this._contextPrototype);
    }
    
    async _evaluate () {
        if (this._targetNode.value === "") {
            var value = this;
        } else {
            let expression = new Expression( this._targetNode.value );
            var value = await expression.evaluate( this._context );                    
        }
        return value;
    }
    
    async __get__ (key) {
        const child = this._targetNode.getChild(key);
        if (!child) return null;                
        const childProxy = child.proxy || new NodeProxy(child, this._contextPrototype);
        return await childProxy._evaluate();
    }
    
    async __len__ () {
        return this._targetNode.countChildren();
    }
    
    async __str__ () {
        return this._targetNode.content;
    }
}


class Document extends NodeProxy{
    
    constructor (source, context=DEFAULT_CONTEXT) {
        const root = new Outline(source);
        context = Object.create(context);
        super(root, context);
        context.root = this;
    }
}


module.exports = Document;
