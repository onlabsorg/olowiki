const stripIndent = require("strip-indent");
const isNumber = require("lodash/isNumber");
const errors = require("./errors");



const DEFAULT_LIST_OPTIONS = {
    indent: 0,
    leadingEmptyLines: []
}

const DEFAULT_NODE_OPTIONS = {
    spacesBeforeColon: 0,
    spacesAfterColon: 1,
    trailingSpaces: 0,
}



class Node {
    
    constructor (name, value, options=DEFAULT_NODE_OPTIONS) {
        this.name = name;
        this.value = value;
        this._parent = null;
        this._children = new List({indent:4, leadingEmptyLines:[]});
        this._options = options;
    }
    
    get index () {
        const parent = this.parent;
        return parent ? parent._children.getIndexOf(this) : 0;
    }
    
    get name () {
        return this._name;
    }
    
    set name (newName) {
        if (newName === "" || newName.match(/^([A-Za-z_][A-Za-z_0-9]*)$/)) {
            this._name = newName;
        } else {
            throw new Error("Invalid node name!");
        }
    }
    
    get value () {
        return this._value;
    }
    
    set value (newValue) {
        this._value = newValue.split("\n").join("\\n").trim();
    }

    get cardinality () {
        return this._children.length;
    }
    
    get parent () {
        return this._parent || null;
    }
        
    getChild (index) {
        return this._children.get(index);
    }
    
    appendChild (node) {
        this._children.append(node);
        node._parent = this;
    }
    
    stringifyRootLine () {
        return this.name +
               (this.name ? spaces(this._options.spacesBeforeColon) + ":" + spaces(this._options.spacesAfterColon) : "") +
               this.value +
               spaces(this._options.trailingSpaces);
    }
    
    stringifyChildList () {
        return this._children.stringify();
    }
    
    stringify () {
        const rootLineSource = this.stringifyRootLine();
        var childListSource = this.stringifyChildList();
        if (childListSource) {
            childListSource = childListSource.replace(/^.*$/gm, line => {
                if (line.match(/^\s*$/)) return line;
                else return spaces(this._children._options.indent) + line;
            });
            return rootLineSource + "\n" + childListSource;
        } else {
            return rootLineSource; 
        }
    }
    
    toString () {
        this.stringify();
    }
    
    async evaluate (context) {}
    
    static parse (nodeSource) {
        const nodeOptions = Object.create(DEFAULT_NODE_OPTIONS);
        
        // Split apart the root line from the child lines
        const nodeMatch = nodeSource.match(/^(\S.*)((?:\n\s.*|\n)*)$/);
        if (!nodeMatch) {
            throw new errors.SyntaxError();
        }
        const rootLineSource = nodeMatch[1];
        const childSource = nodeMatch[2];        
        
        // Extract name and value from the root line
        // and save the spacing in the node options.
        const rootLineMatch = rootLineSource.match(/^([A-Za-z_][A-Za-z_0-9]*)(\s*\:\s*)(.*)$/);
        if (rootLineMatch) {
            var nodeName = rootLineMatch[1];
            nodeOptions.spacesBeforeColon = spacesBefore(rootLineMatch[2]);
            nodeOptions.spacesAfterColon = rootLineSource[2].length - nodeOptions.spacesBeforeColon - 1;
            var nodeValue = rootLineMatch[3];
        } else {
            var nodeName = "";
            var nodeValue = rootLineSource;
        }
        
        // Create and return the Node instance
        const node = new this(nodeName, nodeValue, nodeOptions);
        node._children = List.parse(childSource);
        for (let child of node._children) {
            child._parent = node;
        }
        node._options.childListOptions = node._children._options;
        return node;
    }
}



class List {
    
    constructor (options=DEFAULT_LIST_OPTIONS) {
        this._options = options;
        this._nodes = [];
    }
    
    _assertNode (obj) {
        if (obj instanceof Node) {
            return obj;
        } else {
            throw new errors.TypeError(obj, Node);
        }
    }
    
    _normalizeIndex (index) {
        if (isNumber(index)) {
            if (index < 0) index = this.length + index;
        } else {
            let key = index;
            for (index=this.length-1; index>=0; index--) {
                if (this._nodes[index].name === key) break;
            }
        }
        return index;        
    }    
    
    get length () {
        return this._nodes.length;
    }
    
    get (index) {
        index = this._normalizeIndex(index);
        return this._nodes[index] || null;
    }
    
    getIndexOf (node) {
        return this._nodes.indexOf(node);
    }
    
    append (node) {
        node = this._assertNode(node);
        this._nodes.push(node);
    }
    
    stringify () {
        const nodeSources = [];
        for (let node of this) {
            let nodeSource = node.stringify();
            nodeSources.push( nodeSource );
        }
        return this._options.leadingEmptyLines.concat(nodeSources).join("\n");
    }
    
    toString () {
        this.stringify();
    }
    
    *[Symbol.iterator] () {
        for (let node of this._nodes) yield node;
    }
    
    static parse (listSource, parent=null) {
        const listOptions = Object.create(DEFAULT_LIST_OPTIONS);
        
        // Strip off the list minimum indentation
        listOptions.indent = getBlockIndent(listSource);
        listSource = stripBlockIndent(listSource, listOptions.indent);
        
        // Trims away the leading empty lines
        const listMatch = listSource.match(/^((?:\s*\n)*)(.*)$/s)
        listOptions.leadingEmptyLines = listMatch[1].split("\n");
        const trimmedListSource = listMatch[2];

        // Create a List instance and adds the child nodes
        const list = new List(listOptions);
        for (let nodeSource of splitListSource(trimmedListSource)) {
            let node = Node.parse(nodeSource);
            list.append(node);            
        }
        return list;
    }
}


class NodeProxy {}


class Document extends List {}




/**
 *
 *  Parsing Helpers
 *
 */
 
function getBlockIndent (str) {
    const match = str.match(/^[ \t]*(?=\S)/gm);
    return match ? Math.min.apply(Math, match.map(x => x.length)) : 0;
}

function stripBlockIndent (str, indent) {
    const re = new RegExp(`^[ \\t]{${indent}}`, 'gm');
    return indent > 0 ? str.replace(re, '') : str;    
}

function spaces (count) {
    return " ".repeat(count);
}

function isEmpty (line) {
    return Boolean( line.match(/^\s*$/) );
}

function spacesBefore (str) {
    return str.search(/\S|$/);
}

function* splitListSource (listSource) {
    if (listSource === "") return;

    const listSourceMatch = listSource.match(/^(\S.*(?:\n\s.*|\n\s*)*)((?:.*\n?)*)$/);
    if (listSourceMatch) {
        yield listSourceMatch[1];
        for (let siblingNodeSource of splitListSource(listSourceMatch[2])) {
            yield siblingNodeSource;
        }
    } else {
        throw new errors.SyntaxError();
    }
}



module.exports = {Node, NodeProxy, Document};
