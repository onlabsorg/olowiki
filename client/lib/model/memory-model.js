
const abstractModel = require("./abstract-model");


class Node extends abstractModel.Node {

    constructor () {
        super();
        this._children = [];
    }

    __getName__ () {
        return this._name;
    }

    __setName__ (newName) {
        const oldName = this.name;
        this._name = newName;
        this._dispatch({
            method: "set-name",
            oldValue: oldName,
            newValue: newName,
            path: [this]
        });
    }

    __getValue__ () {
        return this._value;
    }

    __setValue__ (newValue) {
        const oldValue = this.value;
        this._value = newValue;
        this._dispatch({
            method: "set-value",
            oldValue: oldValue,
            newValue: newValue,
            path: [this]
        });
    }

    __getChildCount__ () {
        return this._children.length;
    }

    __getChild__ (index) {
        return this._children[index] || null;
    }

    __setChild__ (index, newChild) {
        const oldChild = this.getChild(index);
        this._children[index] = newChild;
        this._dispatch({
            method: "set-child",
            index: index,
            oldValue: oldChild,
            newValue: newChild,
            path: [this]
        });
    }

    __insertChild__ (index, newChild) {
        this._children.splice(index, 0, newChild);
        this._dispatch({
            method: "insert-child",
            index: index,
            newValue: newChild,
            path: [this]
        });
    }

    __removeChild__ (index) {
        const oldChild = this.getChild(index);
        this._children.splice(index, 1);
        this._dispatch({
            method: "remove-child",
            index: index,
            oldValue: oldChild,
            path: [this]
        });
    }

    static create (obj={}) {
        const node = new this();
        node.assign(obj);
        return node;
    }
}


class Document extends abstractModel.Document {

    constructor () {
        super();
        this._root = this.createNode();
        this._root._parent = this;
        this._readonly = false;
    }

    __getRoot__ () {
        return this._root;
    }

    __isReadOnly__ () {
        return this._readonly;
    }

    __createNode__ () {
        return new Node();
    }
}



async function createDocument (obj={}) {
    const doc = new Document();
    doc.root.assign(obj);
    return doc;
}



exports.Node = Node;
exports.Document = Document;
exports.createDocument = createDocument;
