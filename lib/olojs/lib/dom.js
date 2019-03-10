/**
 *  The `olojs.dom` module defines a Document Object Model for `olo` documents.
 *
 *  - License: MIT
 *  - Author: Marcello Del Buono <m.delbuono@onlabs.org>
 */
 

// Dependencies
const isNumber = require("lodash/isNumber");
const isPositiveNumber = n => isNumber(n) && n >= 0;
const PositiveNumber = (n, defaultval) => isPositiveNumber(n) ? n : defaultval;

const errors = require("./errors");

const Context = require("./context");
const DEFAULT_CONTEXT = new Context();

const DEFAULT_EXPRESSION = "self";


/**
 *  # dom.Node class
 *
 *  A node is a tree item with a name, a value and a list of subordinate nodes.
 *  If the node N1 contains the node N2 as subordinate, then N1 is called the
 *  parent node of N2 and N2 is called a child node of N1.
 *
 *  A child can be identified by a node identifier `n` in the form of a number, 
 *  a node name or a Node instance:
 *
 *  - If `n` is a positive number, it refers to the child with index `n` (1 is
 *    the first child)
 *  - If `n` is a negative number, it refers to the `n-th` child counting from
 *    the end of the list (-1 is the last child).
 *  - If `n` is a string, it refers to the first child having that name
 *  - If `n` is a Node isntance, it refers to the child `n`
 */
class Node {
    
    /**
     *  ## dom.Node.constructor
     *
     *  Usage:
     *
     *  ```
     *  node = new Node(name, value, children)
     *  ```
     *
     *  - `name` is a string allowing letters (a..z, A..Z), numbers (0..9) and
     *    undersoce (_) but not starting with a number
     *  - `value` is a string without restrictions
     *  - `children` is an optional array of nodes
     */
    constructor (name, value, childNodes=[], options={}) {
        
        this.name = name;       // see node.name setter
        this.value = value;     // see node.value setter
        
        this._parent = null;    // a new node is initially orphan
        
        // the child list is implemented as an internal array
        this._children = [];
        for (let node of childNodes) {
            this.appendChild(node);
        }
        
        // The node._options object contains information about spaces and
        // empty lines. It is could be defined through the `options` parameter
        // but it is mainly meant to be used to render the exact same source
        // passed to the node parser.
        this._options = {
            spacesBeforeColon: PositiveNumber(options.spacesBeforeColon, 0),
            spacesAfterColon: PositiveNumber(options.spacesAfterColon, 1),
            trailingSpaces: PositiveNumber(options.trailingSpaces, 0),
            childListIndent: PositiveNumber(options.childListIndent, 4), 
            emptyLinesAfter: options.emptyLinesAfter ? options.emptyLinesAfter.map(length => PositiveNumber(length, 0)) : []
        }
    }
    
    
    /**
     *  ## dom.Node.prototype.index read-only property
     *
     *  ```
     *  i = node.index
     *  ```
     *
     *  This will assign to i the position that node has in its parent child-list.
     *  The first child node has index 1.
     *  If the node has no parent, i will be 0.
     */
    get index () {
        return this.parent ? this.parent._getChildIndex(this) : 0;
    }
    
    
    /**
     *  ## dom.Node.prototype.name read-write property
     *  
     *  Usage:
     *  ```
     *  name = node.name
     *  node.name = newName
     *  ``` 
     *
     *  A valid name can contain letters (a..z, A..Z), numbers (0..9) or 
     *  undersocre (_) but it cannot start with a number.
     *
     *  If trying to assign a non-valid string, an exception will be raised.
     */
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
    

    /**
     *  ## dom.Node.prototype.value read-write property
     *  
     *  Usage:
     *  ```
     *  value = node.value
     *  node.value = newValue
     *  ``` 
     *
     *  The node value can be any one-line string. 
     *
     *  If trying to assign a multiline text, the new-line characters will be
     *  escaped.
     */
    get value () {
        return this._value;
    }
    
    set value (newValue) {
        this._value = newValue.split("\n").join("\\n").trim();
    }


    /**
     *  ## dom.Node.prototype.cardinality read-only property
     *
     *  Returns the number of children of the node.
     */
    get cardinality () {
        return this._children.length;
    }
    
    
    /**
     *  ## dom.Node.prototype.parent read-only property
     *
     *  Returns the parent node of this node or `null` if this node has no parent.
     */    
    get parent () {
        return this._parent || null;
    }
    
    
    // Given a node identifier `n` in the form of a number, a node name or a Node
    // instance, returns the index of the first child matching `n`. 
    _getChildIndex (n) {
        const len = this._children.length;
        
        if (isNumber(n)) {
            if (n < 0) n = len + 1 + n;
            if (0 < n && n <= len) return n;
            return 0;
        }
        
        if (typeof n === "string") {
            for (let index=1; index<=len; index++) {
                if (this._children[index-1].name === n) return index;
            }
            return 0;
        }
        
        if (n instanceof Node) {
            for (let index=1; index<=len; index++) {
                if (this._children[index-1] === n) return index;
            }
            return 0;
        }
    }
        

    /**
     *  ## dom.Node.prototype.getChild(n) method
     *
     *  Given a child identifier `n` corresponding to the i-th child, it
     *  returns the matching child.
     *
     *  If `n` doesn't match any child, it returns `null`;
     */
    getChild (n) {
        const index = this._getChildIndex(n);
        return this._children[index-1] || null;
    }
    

    /**
     *  ## dom.Node.prototype.appendChild(node) method
     *
     *  Appebds the `node` as last item of the child list.
     *
     *  If the parameter is not a `Node` instance or it is not orphan, it throws 
     *  `errors.ValueError`.
     */
    appendChild (node) {
        node = assertOrphanNode(node);
        this._children.push(node);
        node._parent = this;
    }

    
    /**
     *  ## dom.Node.prototype.insertChild(node, n) method
     *
     *  Inserts the `Node` instance given as parameter before the item corresponding
     *  tho node identifier `n`.
     *
     *  If the parameter is not a `Node` instance or it is not orphan, it throws 
     *  `errors.ValueError`.
     *
     *  If no child matches `n`, it fails silently.
     */
    insertChild (node, n) {
        node = assertOrphanNode(node);
        const index = this._getChildIndex(n);
        if (index > 0) {
            this._children.splice(index-1, 0, node);            
            node._parent = this;
        }
    }
    

    /**
     *  ## dom.Node.prototype.deleteChild(n) method
     *
     *  Removes the child corresponding tho node identifier `n` and returns the
     *  removed node.
     *
     *  The removed node is then orphan.
     *
     *  If no child matches `n`, it fails silently.
     */
    removeChild (n) {
        const index = this._getChildIndex(n);
        if (index === 0) return null;
        const removedNode = this._children.splice(index-1, 1)[0];
        removedNode._parent = null;
        return removedNode;
    }

    
    //  This method serializes the pair name-value in the forma "name: value".
    stringifyRootLine () {
        return this.name +
               (this.name ? spaces(this._options.spacesBeforeColon) + ":" + spaces(this._options.spacesAfterColon) : "") +
               this.value  +
               spaces(this._options.trailingSpaces);
    }

    
    //  This method serializes the direct children and all their desendants
    //  as an indented list of "name: value" pairs.
    stringifyChildList () {
        const nodeSources = [];
        for (let node of this._children) {
            let nodeSource = node.stringify();
            nodeSources.push( nodeSource );
        }
        const emptyLines = this._options.emptyLinesAfter.map(n => spaces(n));
        return emptyLines.concat(nodeSources).join("\n");
    }

    
    //  This method serializes the Node istance and all its desendants
    //  as an indented list of "name: value" pairs.
    stringify () {
        const rootLineSource = this.stringifyRootLine();
        var childListSource = this.stringifyChildList();
        if (childListSource) {
            childListSource = indentBlock(childListSource, this._options.childListIndent);
            return rootLineSource + "\n" + childListSource;
        } else {
            return rootLineSource; 
        }
    }
    
    
    /**
     *  ## dom.Node.prototype.toString() method
     *
     *  Serializes the Node istance and all its desendants as an indented list 
     *  of "name: value" pairs.
     */
    toString () {
        return this.stringify();
    }


    /**
     *  ## dom.Node.prototype.parseChildList(source) method
     *
     *  Updates the child list with the list of node obtained by parsing the 
     *  source text passed as parameter.
     */
    parseChildList (source) {
        const sourceLines = source.split("\n");
        
        const nodes = [];
        var lastNode = this;
        for (let sourceLine of sourceLines) {
            let node = parseNode(sourceLine);
            if (node.name === "" && node.value === "") {    // empy line
                lastNode._options.emptyLinesAfter.push(node.__leadingSpaces);
                delete node.__leadingSpaces;
            } else {
                nodes.push(node);
                lastNode = node;
            }
        }
        
        // Group the nodes under their parent, based on the indentation
        while (this.cardinality > 0) {
            this.removeChild(1);
        }
        for (let node of nodes) {
            placeDescendant(this, node);
        }
        
        // Define the child-list indentation
        assignChildListIndent(this);        
    }

    
    /**
     *  ## dom.Node.prototype.evaluate(context) asynchronous method
     *
     *  Extends `context` with a `self` object (which is the `context.Node` 
     *  wrapper of the node iself) and returns whatever the result of 
     *  `context.eval(node.value)` is.
     */
    async evaluate (context=DEFAULT_CONTEXT) {
        const nodeContext = Object.create(context);
        nodeContext.self = nodeContext.Node(this);
        const expression = this.value || DEFAULT_EXPRESSION;
        return await nodeContext.eval(expression);
    }
    
    
    /**
     *  ## dom.Node.prototype.evaluateExpression(expression, context) asynchronous method
     *
     *  Extends `context` with the `self` and `root` objects (which both are the 
     *  `context.Node` wrapper of the node iself) and returns whatever the result 
     *  of `context.eval(node.value)` is.
     */
    async evaluateExpression (expression, context=DEFAULT_CONTEXT) {
        const nodeContext = Object.create(context);
        nodeContext.root = nodeContext.self = nodeContext.Node(this);
        return await nodeContext.eval(expression);
        
    }    
}



/**
 *  # dom.parse(source) function
 *
 *  Given a source text containing an outline of `name: value` items, returns a
 *  node having the descendants hierarchy outlined in the source.
 *
 *  The retruned node has name `"root"` and value `""`.
 */
function parse (source) {
    const root = new Node('root', '', []);
    root.parseChildList(source);
    return root;
}



// Helper function
function assertOrphanNode (node) {
    if (node instanceof Node) {
        if (node.parent) throw new errors.ValueError("The node you are trying to attach is not parent-less.");
        return node;
    } else {
        throw new errors.TypeError(node, Node);
    }
}
  
// Parsing helper function
function spacesBefore (str) {
    return str.search(/\S|$/);
}

// Parsing helper function
function parseNode (line) {
    const node = new Node("", "");
    node.__leadingSpaces = spacesBefore(line);
    const trimmedLine = line.trim();
    node._options.trailingSpaces = line.length - node.__leadingSpaces - trimmedLine.length;
    const lineMatch = trimmedLine.match(/^([A-Za-z_][A-Za-z_0-9]*)(\s*\:\s*)(.*)$/);
    if (lineMatch) {
        node.name = lineMatch[1];
        node.value = lineMatch[3];
        node._options.spacesBeforeColon = spacesBefore(lineMatch[2]);
        node._options.spacesAfterColon = lineMatch[2].length - node._options.spacesBeforeColon - 1;
    } else {
        node.name = "";
        node.value = trimmedLine;
        node._options.spacesBeforeColon = 0;
        node._options.spacesAfterColon = 1;
    }
    return node;    
}

// Parsing helper method
function placeDescendant (anchestor, descendant) {
    const lastChild = anchestor.getChild(-1);
    
    if (!lastChild || descendant.__leadingSpaces === lastChild.__leadingSpaces) {
        anchestor.appendChild(descendant);
    }    

    else if (descendant.__leadingSpaces > lastChild.__leadingSpaces) {
        placeDescendant(lastChild, descendant);
    }
    
    else {
        throw new errors.SyntaxError();
    }        
}

// Parsing helper method
function assignChildListIndent (node) {
    let parentIndent = node.__leadingSpaces || 0;
    delete node.__leadingSpaces;
    
    if (node.cardinality === 0) {
        node._options.childListIndent = 4;
    }
    else {
        node._options.childListIndent = node.getChild(1).__leadingSpaces - parentIndent;
        for (let n=1; n<=node.cardinality; n++) {
            let child = node.getChild(n);
            assignChildListIndent(child);
        }
    }

    node._options.emptyLinesAfter = node._options.emptyLinesAfter.map(emptyLineLength => 
            Math.max(emptyLineLength - parentIndent - node._options.childListIndent, 0));        
}

// Serialization helper function
function indentBlock (text, indent) {
    return text.replace(/^.*$/gm, line => spaces(indent) + line);
}

// Serialization helper function
function spaces (count) {
    return " ".repeat(count);
}


// Exports
module.exports = {Node, parse};
