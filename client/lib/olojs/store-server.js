
const fs = require('fs.promised');
const YAML = require('js-yaml');
const express = require('express');
const bodyParser = require('body-parser');

const errors = require("./errors");
const Change = require("./change");
const Document = require("./document");



class FileStore {

    constructor (path) {
        this.path = path;
    }

    _getFullPath (docPath) {
        return this.path + docPath;
    }

    async readDocument (docPath, userName) {
        const filePath = this._getFullPath(docPath);

        const fileExists = await fs.exists(filePath);
        if (!fileExists) throw new errors.DocumentNotFoundError(docPath);

        const fileText = await fs.readFile(filePath, {encoding:'utf8'});
        const docHash = YAML.load(fileText);
        const doc = new Document(docHash, userName);

        // throw an error if the user has no read permission
        doc.assertReadable('/');

        return doc;
    }

    async writeDocument (docPath, doc, userName) {
        var oldDoc;
        try {
            oldDoc = await this.readDocument(docPath, userName);
            oldDoc.assertWritable();
        } catch (error) {
            if (error instanceof errors.DocumentNotFoundError) {
                let canCreate = await this.canCreate(docPath, userName);
                if (!canCreate) throw new errors.WritePermissionError(docPath);
            } else {
                throw error;
            }
        }

        const docHash = doc.toHash();
        if (!docHash.owner) docHash.owner = userName;
        const fileText = YAML.dump(docHash);
        const filePath = this._getFullPath(docPath);
        await fs.writeFile(filePath, fileText, {encoding:'utf8'});
    }

    async updateDocument (docPath, sinceVersion, changes, userName) {
        const doc = await this.readDocument(docPath, userName);
        const missingChanges = doc.delta(sinceVersion);
        doc.applyChanges(...changes);
        await this.writeDocument(docPath, doc, 'root');
        return missingChanges;
    }

    async deleteDocument (docPath, userName) {
        const doc = await this.readDocument(docPath, userName);
        if (doc === null) throw new errors.DocumentNotFoundError(docPath);

        doc.assertWritable();

        const filePath = this._getFullPath(docPath);
        await fs.unlink(filePath);
    }

    async canCreate (docPath, userName) {
        return userName === 'root';
    }
}



function Router (store) {
    const router = express.Router();

    router.use(bodyParser.json());

    router.get('*', function (req, res, next) {
        store.readDocument(req.path, req.userName)
        .then((doc) => {
            res.set("Content-Type", "application/json");
            res.set("ETag", doc.version);
            res.set("X-olo-user-name", doc.userName);
            res.status(200).json(doc.toHash());
        })
        .catch((error) => {
            const statusCode = error.statusCode || 500;
            const errorHash = error.toHash ? error.toHash() : {type:'Error', param:String(error)};
            res.status(statusCode).json(errorHash);
        });
    });

    router.put('*', function (req, res, next) {
        const newDoc = new Document(req.body || {});
        store.writeDocument(req.path, newDoc, req.userName)
        .then(() => {
            res.status(200).send();
        })
        .catch((error) => {
            const statusCode = error.statusCode || 500;
            const errorHash = error.toHash ? error.toHash() : {type:'Error', param:String(error)};
            res.status(statusCode).json(errorHash);
        });
    });

    router.patch('*', function (req, res, next) {

        var sinceVersion = req.get('ETag');

        var changes;
        if (!Array.isArray(req.body.changes) || req.body.changes.length === 0) {
            changes = [];
        } else {
            changes = req.body.changes.map(change => new Change(change.path, change.value, change.timestamp));
        }

        store.updateDocument(req.path, sinceVersion, changes, req.userName)
        .then((missingChanges) => {
            missingChanges = missingChanges.map(change => change.toHash());
            res.status(200).json(missingChanges);
        })
        .catch((error) => {
            const statusCode = error.statusCode || 500;
            const errorHash = error.toHash ? error.toHash() : {type:'Error', param:String(error)};
            res.status(statusCode).json(errorHash);
        });
    });

    router.delete('*', function (req, res, next) {
        store.deleteDocument(req.path, req.userName)
        .then(() => {
            res.status(200).send();
        })
        .catch((error) => {
            const statusCode = error.statusCode || 500;
            const errorHash = error.toHash ? error.toHash() : {type:'Error', param:String(error)};
            res.status(statusCode).json(errorHash);
        });
    });

    return router;
}


exports.FileStore = FileStore;
exports.Router = Router;
