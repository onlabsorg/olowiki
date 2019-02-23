
const stripIndent = require("strip-indent");
const isNumber = require("lodash/isNumber");

class Node {
    
    constructor (line) {
        this._spacesBefore = line.search(/\S|$/);
        const trimmedLine = line.trim();
        let match = trimmedLine.match(/^([A-Za-z_][A-Za-z_0-9]*)(\s*\:\s*)(.*)$/);                
        if (match) {
            this._name = match[1];
            this._separator = match[2];
            this._value = match[3];
        } else {
            this._name = "";
            this._separator = "";
            this._value = trimmedLine;            
        }
        this._spacesAfter = line.length - trimmedLine.length - this._spacesBefore;
        this._emptyNodesBeforeChildren = [];
        this._children = [];
    }
    
    get index () {
        const parent = this.getParent();
        return parent ? parent._children.indexOf(this) : 0;
    }
    
    get name () {
        return this._name;
    }
    
    set name (newName) {
        if (!newName.match(/^([A-Za-z_][A-Za-z_0-9]*)$/)) {
            throw new Error("Invalid node name!");
        }
        this._name = newName;
        if (this._separator === "") this._separator = ": ";
    }
    
    get value () {
        return this._value;
    }
    
    set value (newValue) {
        this._value = newValue.split("\n").join("\\n").trim();
    }

    _normalizeIndex (index) {
        if (isNumber(index)) {
            if (index < 0) index = this.countChildren() + index;
        } else {
            let key = index;
            for (index=this.countChildren()-1; index>=0; index--) {
                if (this._children[index].name === key) break;
            }
        }
        return index;        
    }
    
    getChild (index) {
        index = this._normalizeIndex(index);
        return this._children[index];
    }
    
    countChildren () {
        return this._children.length;
    }
    
    getParent () {
        return this._parent;
    }
    
    _push (newNode) {
        const lastChild = this.getChild(-1);
                
        if (newNode.name === "" && newNode.value === "") {    
            if (lastChild) lastChild._push(newNode);
            else this._emptyNodesBeforeChildren.push(newNode);
        } 
        
        else if (!lastChild || lastChild._spacesBefore === newNode._spacesBefore) {
            this._children.push(newNode);  
            newNode._parent = this;        
        }
        
        else if (newNode._spacesBefore > lastChild._spacesBefore) {
            lastChild._push(newNode);
        }
        
        else {
            throw new Error("Indentation error!");
        }            
    }
    
    _getTrimmedLine () {
        return this._name + this._separator + this._value;
    }
    
    _getLine () {
        return " ".repeat(this._spacesBefore) + this._getTrimmedLine() + " ".repeat(this._spacesAfter);
    }
    
    *_getLines (childrenOnly=false) {
        if (!childrenOnly) {
            yield this._getLine();
        }
        for (let emptyNode of this._emptyNodesBeforeChildren) {
            for (let line of emptyNode._getLines()) yield line;
        }
        for (let child of this._children) {
            for (let line of child._getLines()) yield line;
        }
    }
    
    get content () {
        const subLines = Array.from( this._getLines(true) );
        return stripIndent( subLines.join("\n") );
    }
    
    toString () {
        return Array.from(this._getLines()).join("\n");
    }
}


class Outline extends Node {
    
    constructor (source="") {
        super("root:");
        const lines = source.split("\n");
        for (let line of lines) {
            let node = new Node(line);
            this._push(node);
        }
    }
    
    toString () {
        return Array.from(this._getLines(true)).join("\n");
    }    
}


module.exports = Outline;
