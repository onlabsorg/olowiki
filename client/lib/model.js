
const isInteger = require("lodash/isInteger");

const nunjucks = require("nunjucks");



class Loader extends nunjucks.Loader {

    constructor (cnode) {
        super();
        this.cnode = cnode;
    }

    getSource (path) {
        const targetNode = this.cnode.root.getNode(path);
        if (targetNode) {
            let path = targetNode.path;
            let template = targetNode.template;
            return {src:template, path:path, noCache:true};
        }
        else {
            return null;
        }
    }

    isRelative (nodePath) {
        return (nodePath.indexOf('./') === 0 || nodePath.indexOf('../') === 0 || nodePath[0] !== "/");
    }

    resolve (from, to) {
        return from + "/" + to;
    }
}



const config = {
    context: {}
};



var nodeCount = 1;

class Node {

    constructor (obj={}) {
        this._name = obj.name === undefined ? `node${nodeCount++}` : String(obj.name);
        this._template = obj.template !== undefined ? String(obj.template) : "";
        this._parent = null;
        this._children = [];
        if (Array.isArray(obj.children)) {
            for (let childObj of obj.children) {
                let childNode = (childObj instanceof Node) ? this._validateNode(childObj) : new Node(childObj);
                this._children.push(childNode);
                childNode._parent = this;
            }
        }
        this.beforeChangeCallbacks = new Set();
        this.afterChangeCallbacks = new Set();

        this._templateLoader = new Loader(this);
        this._templateEnvironment = new nunjucks.Environment(this._templateLoader);
    }

    get name () {
        return this._name;
    }

    set name (newName) {
        const change = {
            method: "set-name",
            oldValue: this.name,
            newValue: String(newName),
            path: [this]
        }

        if (change.oldValue === change.newValue) return;

        this._dispatch(change, "beforeChangeCallbacks");
        this._name = change.newValue;
        this._dispatch(change, "afterChangeCallbacks");
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
        return this._template;
    }

    set template (newTemplate) {
        const change = {
            method: "set-template",
            oldValue: this.template,
            newValue: String(newTemplate),
            path: [this]
        }

        if (change.oldValue === change.newValue) return;

        this._dispatch(change, "beforeChangeCallbacks");
        this._template = change.newValue;
        this._dispatch(change, "afterChangeCallbacks");
    }

    get size () {
        return this._children.length;
    }

    getChild (index) {
        try {
            index = this._validateIndex(index);
            return this._children[index];
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
            if (!node) return null;
            if (name === "..") {
                node = node.parent;
            }
            else if (name !== "." && name !== "") {
                node = node.getChildByName(name);
            }
        }

        return node;
    }

    setChild (index, node) {
        index = this._validateIndex(index);
        node = this._validateNode(node);
        const change = {
            method: "set-child",
            index: index,
            oldValue: this.getChild(index),
            newValue: node,
            path: [this]
        }

        if (change.newValue === change.oldValue) return;

        this._dispatch(change, "beforeChangeCallbacks");
        this._children[change.index] = change.newValue;
        change.oldValue._parent = null;
        change.newValue._parent = this;
        this._dispatch(change, "afterChangeCallbacks");
    }

    insertChild (index, node) {
        index = this._validateIndex(index, +1);
        node = this._validateNode(node);
        const change = {
            method: "insert-child",
            index: index,
            value: node,
            path: [this]
        }
        this._dispatch(change, "beforeChangeCallbacks");
        this._children.splice(change.index, 0, change.value);
        change.value._parent = this;
        this._dispatch(change, "afterChangeCallbacks");
    }

    appendChild (node) {
        this.insertChild(this.size, node);
    }

    removeChild (index) {
        index = this._validateIndex(index);
        const change = {
            method: "remove-child",
            index: index,
            oldValue: this.getChild(index),
            path: [this]
        }
        this._dispatch(change, "beforeChangeCallbacks");
        this._children.splice(change.index, 1);
        change.oldValue._parent = null;
        this._dispatch(change, "afterChangeCallbacks");
    }

    get parent () {
        return this._parent;
    }

    get index () {
        if (!this.parent) return undefined;
        const index = this.parent._children.indexOf(this);
        return index >= 0 ? index : undefined;
    }

    get root () {
        return this.parent ? this.parent.root : this;
    }

    get readonly () {
        return this.parent && this.parent.readonly;
    }

    render () {
        return new Promise((resolve, reject) => {
            const template = new nunjucks.Template(this.template, this._templateEnvironment, this.path);
            template.render(config.context, function (err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    _dispatch (change, callbacks) {
        for (let callback of this[callbacks]) {
            if (callback instanceof Function) {
                callback(change);
            }
        }
        if (this.parent) {
            let changePath = change.path;
            change.path = [this.parent].concat(changePath);
            this.parent._dispatch(change, callbacks);
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
        return node;

    }
}



class Document extends Node {

    constructor (obj, readonly=false) {
        super(obj);
        if (readonly) this.beforeChangeCallbacks.add(throwWriteAccessDenied);
    }

    get readonly () {
        return this.beforeChangeCallbacks.has(throwWriteAccessDenied);
    }
}

function throwWriteAccessDenied () {
    throw new Error("Write access denied to document.");
}



exports.config = config;
exports.Node = Node;
exports.Document = Document;
