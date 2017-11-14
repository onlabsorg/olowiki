
const gload = require("utils/google-api-loader");
const abstractModel = require("./abstract-model");



const nodes = new WeakMap();
const getNode = (gnode) => nodes.get(gnode) || new Node(gnode);

class Node extends abstractModel.Node {

    constructor (gnode) {
        super();

        gnode.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, (event) => {
            const change = {};

            if (event.property === "name") change.method = "set-name";
            else if (event.proptery === "template") change.method = "set-template";
            else return;

            change.oldValue = event.oldValue;
            change.newValue = event.newValue;

            change.path = [this];

            this._dispatch(change);
        });

        gnode.get("children").addEventListener(gapi.drive.realtime.EventType.VALUES_SET, (event) => {
            for (let i=0; i<event.newValues.length; i++) {
                let change = {
                    method: "set-child",
                    index: event.index + i,
                    oldValue: getNode(event.oldValues[i]),
                    newValue: getNode(event.newValues[i]),
                    path: [this]
                }
                this._dispatch(change);
            }
        });

        gnode.get("children").addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, (event) => {
            for (let i=0; i<event.values.length; i++) {
                let change = {
                    method: "insert-child",
                    index: event.index + i,
                    newValue: getNode(event.values[i]),
                    path: [this]
                }
                this._dispatch(change);
            }
        });

        gnode.get("children").addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, (event) => {
            for (let i=0; i<event.values.length; i++) {
                let change = {
                    method: "remove-child",
                    index: event.index + i,
                    oldValue: getNode(event.values[i]),
                    path: [this]
                }
                this._dispatch(change);
            }
        });

        nodes.set(gnode, this);

        this._gnode = gnode;
    }

    __getName__ () {
        return this._gnode.get("name");
    }

    __setName__ (newName) {
        this._gnode.set("name", newName);
    }

    __getTemplate__ () {
        return this._gnode.get("template");
    }

    __setTemplate__ (newTemplate) {
        this._gnode.set("template", newTemplate);
    }

    __getChildCount__ () {
        return this._gnode.get("children").length;
    }

    __getChild__ (index) {
        const gchild = this._gnode.get("children").get(index);
        return gchild ? getNode(gchild) : null;
    }

    __setChild__ (index, newChild) {
        this._gnode.get("children").set(index, newChild._gnode);
    }

    __insertChild__ (index, newChild) {
        this._gnode.get("children").insert(index, newChild._gnode);
    }

    __removeChild__ (index) {
        this._gnode.get("children").remove(index);
    }
}



class Document extends abstractModel.Document {

    constructor (gdoc) {
        super();
        this._gdoc = gdoc;
    }

    __getRoot__ () {
        const groot = this._gdoc.getModel().getRoot();
        if (!groot.has("children")) groot.set("children", this._gdoc.getModel().createList());
        const root = getNode(groot);
        root._document = this;
        root._parent = this;
        return root;
    }

    __isReadOnly__ () {
        return this._gdoc.getModel().isReadOnly;
    }

    __createNode__ () {
        const gnode = this._gdoc.getModel().createMap();
        gnode.set("children", this._gdoc.getModel().createList());
        const node = new Node(gnode);
        return node;
    }
}



async function createDocument (obj={}) {
    if (!(window.gapi && gapi.drive && gapi.drive.realtime)) await gload('auth:client,drive-realtime,drive-share');
    const gdoc = gapi.drive.realtime.newInMemoryDocument();
    const doc = new Document(gdoc);
    doc.root.assign(obj);
    return doc;
}



exports.Node = Node;
exports.Document = Document;
exports.createDocument = createDocument;
