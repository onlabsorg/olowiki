
const Change = require("./change");
const Document = require("./document");
const errors = require("./errors");



class HTTPStore {

    constructor (host) {
        this.host = host || "";
    }

    _getURL (path) {
        return this.host + path;
    }

    async readDocument (docPath, user) {
        const response = await fetch(this._getURL(docPath), {
            method: "GET",
            headers: new Headers({
                'Authorization': user,
                'X-Requested-With': "XMLHttpRequest"
            }),
        });

        switch (response.status) {

            case 200:
                let docHash = await response.json();
                let userName = response.headers.get("X-olo-user-name");
                return new Document(docHash, userName);

            default:
                await this._handleError(response);
        }
    }

    async updateDocument (docPath, sinceVersion, changes, user) {
        const response = await fetch(this._getURL(docPath), {
            method: "PATCH",
            headers: new Headers({
                'Authorization': user,
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

    async writeDocument (docPath, doc, user) {
        const response = await fetch(this._getURL(docPath), {
            method: "PUT",
            headers: new Headers({
                'Authorization': user,
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

    async deleteDocument (docPath, user) {
        const response = await fetch(this._getURL(docPath), {
            method: "DELETE",
            headers: new Headers({
                'Authorization': user,
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



class Client {

    constructor (store, auth) {
        this.store = store;
        this.auth = auth;
    }

    async loadDocument (path) {
        const client = this;
        const doc = await this.store.readDocument(path, this.auth);

        var serverVersion = doc.version;

        doc.sync = async function () {
            const changes = this.delta(serverVersion);
            const missingChanges = await client.store.updateDocument(path, serverVersion, changes, client.auth);
            doc.applyChanges(...missingChanges);
            serverVersion = doc.verson;
        }

        doc.store = async function () {
            await client.storeDocument(path, this);
            serverVersion = doc.version;
        }

        return doc;
    }

    async storeDocument (path, doc) {
        await this.store.writeDocument(path, doc, this.auth);
    }

    async deleteDocument (path) {
        await this.store.deleteDocument(path, this.auth);
    }
}


exports.HTTPStore = HTTPStore;
exports.Client = Client;
