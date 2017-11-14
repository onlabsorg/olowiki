const isInteger = require("lodash/isInteger");


var nodeCount = 1;
function uniqueName () {
    return `node${nodeCount++}`;
}

class Node {

    constructor () {
        this._defaultName = uniqueName();
        this._defaultTemplate = "";
        this._parent = null;
        this.changeCallbacks = new Set();
    }

    assign (obj) {
        if (obj.name) this.name = String(obj.name);
        if (obj.template) this.template = String(obj.template);

        while (this.size > 0) this.removeChild(0);
        if (Array.isArray(obj.children)) {
            const Node = this.constructor;
            for (let childObj of obj.children) {
                let childNode = (childObj instanceof Node) ? this._validateNode(childObj) : this.document.createNode(childObj);
                this.appendChild(childNode);
            }
        }
    }

    export () {
        const obj = {
            name: this.name,
            template: this.template,
            children: []
        }
        for (let child of this.children()) obj.children.push(child.export());
        return obj;
    }

    get name () {
        return this.__getName__() || this._defaultName;
    }

    set name (newName) {
        newName = String(newName);
        if (this.name !== newName) {
            this._assertWritable();
            this.__setName__(newName);
        }
    }

    get path () {
        const root = this.root;
        var node = this;
        var path = "";
        while (node !== root) {
            path = path ? `${node.name}/${path}` : node.name;
            node = node.parent;
        }
        return "/" + path;
    }

    get template () {
        return this.__getTemplate__() || this._defaultTemplate;
    }

    set template (newTemplate) {
        newTemplate = String(newTemplate);
        if (this.template !== newTemplate) {
            this._assertWritable();
            this.__setTemplate__(newTemplate);
        }
    }

    get size () {
        return this.__getChildCount__();
    }

    getChild (index) {
        try {
            index = this._validateIndex(index);
            return this.__getChild__(index);
        }
        catch (error) {
            return null;
        }
    }

    * children () {
        for (let i=0; i<this.size; i++) {
            yield this.getChild(i);
        }
    }

    getChildByName (name) {
        for (let child of this.children()) {
            if (child.name === name) return child;
        }
        return null;
    }

    getNode (path) {
        var node = path[0] === "/" ? this.root : this;
        const pathArray = path.split("/");

        for (let name of pathArray) {
            if (!node || node instanceof Document) return null;
            if (name === "..") {
                node = node.parent;
            }
            else if (name !== "." && name !== "") {
                node = node.getChildByName(name);
            }
        }

        return node;
    }

    setChild (index, newChild) {
        index = this._validateIndex(index);
        newChild = this._validateNode(newChild);
        const oldChild = this.getChild(index);
        if (newChild !== oldChild) {
            this._assertWritable();
            oldChild._parent = null;
            newChild._parent = this;
            this.__setChild__(index, newChild);
        };
    }

    insertChild (index, newChild) {
        index = this._validateIndex(index, +1);
        newChild = this._validateNode(newChild);
        this._assertWritable();
        newChild._parent = this;
        this.__insertChild__(index, newChild);
    }

    appendChild (newChild) {
        this.insertChild(this.size, newChild);
    }

    removeChild (index) {
        index = this._validateIndex(index);
        this._assertWritable();
        const oldChild = this.getChild(index);
        oldChild._parent = null;
        this.__removeChild__(index);
    }

    get document () {
        return this._document;
    }

    get parent () {
        return this._parent;
    }

    get index () {
        if (!this.parent) return undefined;
        const size = this.parent.size;
        for (let i=0; i<size; i++) {
            if (this.parent.getChild(i) === this) return i;
        }
    }

    get root () {
        return this.parent ? this.parent.root : this;
    }

    get readonly () {
        return this.parent && this.parent.readonly;
    }

    _dispatch (change) {

        for (let callback of this.changeCallbacks) {
            if (callback instanceof Function) {
                callback(change);
            }
        }

        const parent = this.parent;
        if (parent && parent._dispatch) {
            let changePath = change.path;
            change.path = [parent].concat(changePath);
            parent._dispatch(change);
            change.path = changePath;
        }
    }

    _validateIndex (index, overflow=0) {
        const size = this.size;
        index = Number(index);
        if (!isInteger(index)) throw new TypeError("Index must be an integer.");
        if (index < 0) index = size + index;
        if (0 <= index && index < size+overflow) return index;
        throw new RangeError("Index out of range");
    }

    _validateNode (node) {
        if (!(node instanceof Node)) throw new TypeError("A node child must be a Node object.");
        if (node.parent !== null) throw new Error("The node has already a parent.");
        if (node.document !== this.document) throw new Error("The node doesn't belog to this document.");
        return node;
    }

    _assertWritable () {
        if (this.readonly) throw new Error("Write access denied to document.");
    }


    // VIRTUAL METHODS

    __getName__ () {}

    __setName__ () {}

    __getTemplate__ () {}

    __setTemplate__ () {}

    __getChildCount__ () {}

    __getChild__ (index) {}
}



class Document {

    get root () {
        return this.__getRoot__();
    }

    get readonly () {
        return this.__isReadOnly__();
    }

    createNode (obj={}) {
        const node = this.__createNode__();
        node._document = this;
        node.assign(obj);
        return node;
    }


    // VIRTUAL METHODS

    __getRoot__ () {}

    __isReadOnly__ () {}

    __createNode__ () {}

}



exports.Node = Node;
exports.Document = Document;
