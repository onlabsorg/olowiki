
const isInteger = require("lodash/isInteger");
const nunjucks = require("nunjucks");

var nodeCount = 1;
const uniqueName = () => `node${nodeCount++}`;



class NunjucksLoader extends nunjucks.Loader {

    constructor (cnode) {
        super();
        this.cnode = cnode;
    }

    getSource (path) {
        const targetNode = this.cnode.root.getNode(path);
        if (targetNode) {
            let path = targetNode.path;
            let template = targetNode.value;
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



class Node {

    constructor (hash={}) {
        this._defaultName = uniqueName();
        this._defaultValue = "";
        this._children = [];
        this._parent = null;

        this.changeCallbacks = new Set();

        const nunjucksLoader = new NunjucksLoader(this);
        this._nunjucksEnvironment = new nunjucks.Environment(nunjucksLoader);

        this.assign(hash);
    }



    // CORE PROPERTIES AND METHODS

    get name () {
        return this._name || this._defaultName;
    }

    set name (newName) {
        newName = String(newName);
        if (this.name !== newName) {
            this._assertWritable();
            if (this.parent instanceof Node) this.parent._assertNameAvailable(newName);
            const oldName = this.name;
            this._name = newName;
            this._dispatch({
                method: "set-name",
                oldValue: oldName,
                newValue: newName,
                path: [this]
            });
        }
    }

    get value () {
        return this._value || this._defaultValue;
    }

    set value (newValue) {
        if (this.value !== newValue) {
            this._assertWritable();
            const oldValue = this.value;
            this._value = newValue;
            this._dispatch({
                method: "set-value",
                oldValue: oldValue,
                newValue: newValue,
                path: [this]
            });
        }
    }

    get parent () {
        return this._parent;
    }

    get size () {
        return this._children.length;
    }

    getChild (index) {
        try {
            index = this._validateIndex(index);
            return this._children[index] || null;
        }
        catch (error) {
            return null;
        }
    }

    setChild (index, newChild) {
        index = this._validateIndex(index);
        newChild = this._validateNode(newChild);
        const oldChild = this.getChild(index);
        if (newChild !== oldChild) {
            this._assertWritable();
            oldChild._parent = null;
            newChild._parent = this;
            this._children[index] = newChild;
            this._dispatch({
                method: "set-child",
                index: index,
                oldValue: oldChild,
                newValue: newChild,
                path: [this]
            });
        };
    }

    insertChild (index, newChild) {
        index = this._validateIndex(index, +1);
        newChild = this._validateNode(newChild);
        this._assertWritable();
        newChild._parent = this;
        this._children.splice(index, 0, newChild);
        this._dispatch({
            method: "insert-child",
            index: index,
            newValue: newChild,
            path: [this]
        });
    }

    removeChild (index) {
        index = this._validateIndex(index);
        this._assertWritable();
        const oldChild = this.getChild(index);
        oldChild._parent = null;
        this._children.splice(index, 1);
        this._dispatch({
            method: "remove-child",
            index: index,
            oldValue: oldChild,
            path: [this]
        });
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

    _validateName (name, parent=null) {
        parent = parent || this.parent;
    }

    _validateNode (node) {
        if (!(node instanceof Node)) throw new TypeError("A node child must be a Node object.");
        if (node.parent !== null) throw new Error("The node has already a parent.");
        this._assertNameAvailable(node.name);
        return node;
    }

    _assertNameAvailable (name) {
        if (this.getChildByName(name) !== null) throw new Error(`A child with name "${name}" already exists.`);
    }

    _assertWritable () {
        if (this.readonly) throw new Error("Write access denied to document.");
    }



    // DERIVATE PROPERTIES AND METHODS

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

    get root () {
        return this.parent ? this.parent.root : this;
    }

    get readonly () {
        return this.parent && this.parent.readonly;
    }

    get index () {
        if (!this.parent) return undefined;
        const size = this.parent.size;
        for (let i=0; i<size; i++) {
            if (this.parent.getChild(i) === this) return i;
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

    appendChild (newChild) {
        this.insertChild(this.size, newChild);
    }

    assign (obj) {
        if (obj.name) this.name = String(obj.name);
        if (obj.value !== undefined) this.value = obj.value;

        while (this.size > 0) this.removeChild(0);
        if (Array.isArray(obj.children)) {
            for (let childObj of obj.children) {
                let childNode = (childObj instanceof Node) ? this._validateNode(childObj) : new Node(childObj);
                this.appendChild(childNode);
            }
        }
    }

    export () {
        const obj = {
            name: this.name,
            value: this.value,
            children: []
        }
        for (let child of this.children()) obj.children.push(child.export());
        return obj;
    }



    // RENDERING

    render (context={}) {
        return new Promise((resolve, reject) => {
            const template = new nunjucks.Template(this.value, this._nunjucksEnvironment, this.path);
            template.render(context, function (err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }
}



class Document extends Node {

    constructor (hash={}, readonly=false) {
        super(hash);
        this._readonly = Boolean(readonly);
    }

    get root () {
        return this;
    }

    get readonly () {
        return this._readonly;
    }

    static async create () {}

    static async load (url) {
        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                'authorization': "let-me-in",
                'X-Requested-With': "XMLHttpRequest"
            }),
        });

        switch (response.status) {

            case 200:
                var docAuth = response.headers.has('olo-Doc-Auth') ? response.headers.get('olo-Doc-Auth') : "read";
                var docContent = await response.json();
                break;

            default:
                let errorMessage = await response.text();
                throw new Error(errorMessage);
        }

        const readonly = (docAuth === "read");
        const doc = new Document(docContent, readonly);

        return doc;
    }

    static async save (doc) {}

    static async update (doc) {}
}



exports.Node = Node;
exports.Document = Document;
