
const Change = require("./change");
const Document = require("./document");
const errors = require("./errors");
const Auth = require("./auth");



class Store {

    constructor (host) {
        this.host = host || "";
    }

    _getURL (path, authToken) {
        var url = this.host + path;
        if (authToken)  url += "?auth=" + authToken;
        return url;
    }

    async readDocument (docPath, authToken) {
        const response = await fetch(this._getURL(docPath, authToken), {
            method: "GET",
            headers: new Headers({
                'X-Requested-With': "XMLHttpRequest"
            }),
        });

        switch (response.status) {

            case 200:
                let responseHash = await response.json();
                let doc = new Document(responseHash.doc);
                doc._auth = new Auth(responseHash.auth);
                return doc;

            default:
                await this._handleError(response);
        }
    }

    async updateDocument (docPath, sinceVersion, changes, authToken) {
        const response = await fetch(this._getURL(docPath, authToken), {
            method: "PATCH",
            headers: new Headers({
                'ETag': sinceVersion,
                'Content-Type': "application/json",
                'X-Requested-With': "XMLHttpRequest"
            }),
            body: JSON.stringify({
                changes: changes.map(change => change.toHash())
            })
        });

        switch (response.status) {

            case 200:
                let missingChanges = await response.json();
                missingChanges = missingChanges.map(change => new Change(change.path, change.value, change.timestamp));
                return missingChanges;

            default:
                await this._handleError(response);
        }
    }

    async writeDocument (docPath, doc, authToken) {
        const response = await fetch(this._getURL(docPath, authToken), {
            method: "PUT",
            headers: new Headers({
                'Content-Type': "application/json",
                'X-Requested-With': "XMLHttpRequest"
            }),
            body: JSON.stringify(doc.toHash())
        });

        switch (response.status) {

            case 200:
                return;

            default:
                await this._handleError(response);
        }
    }

    async deleteDocument (docPath, authToken) {
        const response = await fetch(this._getURL(docPath, authToken), {
            method: "DELETE",
            headers: new Headers({
                'X-Requested-With': "XMLHttpRequest"
            }),
        });

        switch (response.status) {

            case 200:
                return;

            default:
                await this._handleError(response);
        }
    }

    async _handleError (response) {
        const errorHash = await response.json();
        const ErrorType = errors[errorHash.type] || Error;
        throw new ErrorType(errorHash.param);
    }
}



async function RemoteDocument (store, docPath, authToken) {
    const doc = await store.readDocument(docPath, authToken);

    var serverVersion = doc.version;

    doc.beforeRead = function (path) {
        this._auth.assertReadable(docPath, path);
    }

    doc.beforeChange = function (change) {
        this._auth.assertWritable(docPath, change.path);
    }

    doc.beforeCommit = function (releaseType) {
        this._auth.assertWritable(docPath, "/");
    }

    doc.sync = async function () {
        const changes = this.delta(serverVersion);
        const missingChanges = await store.updateDocument(docPath, serverVersion, changes, authToken);
        doc.applyChanges(...missingChanges);
        serverVersion = doc.verson;
    }

    doc.save = async function () {
        await store.writeDocument(docPath, this, authToken);
        serverVersion = this.version;
    }

    return doc;
}


exports.Store = Store;
exports.RemoteDocument = RemoteDocument;
