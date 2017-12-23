
const fs = require('fs.promised');
const YAML = require('js-yaml');
const express = require('express');
const bodyParser = require('body-parser');

const errors = require("./errors");
const Change = require("./change");
const Document = require("./document");

const Auth = require("./auth");

const nodemailer = require("nodemailer");
const renderMailTemplate = (template, url) => {
    template = template.replace("{{url}}", url);
    return template;
}


class FileStore {

    constructor (path) {
        this.path = path;
    }

    _getFullPath (docPath) {
        return this.path + docPath;
    }

    async readDocument (docPath, auth) {
        auth = auth instanceof Auth ? auth : Auth.default;
        auth.assertReadable(docPath);

        const filePath = this._getFullPath(docPath);

        const fileExists = await fs.exists(filePath);
        if (!fileExists) throw new errors.DocumentNotFoundError(docPath);

        const fileText = await fs.readFile(filePath, {encoding:'utf8'});
        const docHash = YAML.load(fileText);
        const doc = new Document(docHash);

        return doc;
    }

    async writeDocument (docPath, doc, auth) {
        auth = auth instanceof Auth ? auth : Auth.default;
        auth.assertWritable(docPath, "/");

        const docHash = doc.toHash();
        const fileText = YAML.dump(docHash);
        const filePath = this._getFullPath(docPath);
        await fs.writeFile(filePath, fileText, {encoding:'utf8'});
    }

    async updateDocument (docPath, sinceVersion, changes, auth) {
        auth = auth instanceof Auth ? auth : Auth.default;
        for (let change of changes) auth.assertWritable(docPath, change.path);

        const doc = await this.readDocument(docPath, auth);
        if (doc === null) {
            throw new errors.DocumentNotFoundError(docPath);
        }
        const missingChanges = doc.delta(sinceVersion);
        doc.applyChanges(...changes);
        await this.writeDocument(docPath, doc, new Auth({pattern:"**", permission:"admin"}));
        return missingChanges;
    }

    async deleteDocument (docPath, auth) {
        auth = auth instanceof Auth ? auth : Auth.default;
        auth.assertWritable(docPath, "/");

        const filePath = this._getFullPath(docPath);
        const fileExists = await fs.exists(filePath);
        if (!fileExists) throw new errors.DocumentNotFoundError(docPath);
        await fs.unlink(filePath);
    }
}



function Router (store, options) {
    const router = express.Router();

    const mailTransport = nodemailer.createTransport(options.smtp);

    router.use(bodyParser.json());

    router.use(function (req, res, next) {
        const token = req.query.auth;
        req.auth = token ? Auth.decode(token, options.secret) || Auth.default : Auth.default;
        next();
    });

    router.get('*', function (req, res, next) {
        store.readDocument(req.path, req.auth)
        .then((doc) => {
            res.set("Content-Type", "application/json");
            res.set("ETag", doc.version);
            res.status(200).json({
                auth: req.auth.toHash(),
                doc: doc.toHash()
            });
        })
        .catch(error => handleError(error, res));
    });

    router.put('*', function (req, res, next) {
        const newDoc = new Document(req.body || {});
        store.writeDocument(req.path, newDoc, req.auth)
        .then(() => {
            res.status(200).send();
        })
        .catch(error => handleError(error, res));
    });

    router.patch('*', function (req, res, next) {

        var sinceVersion = req.get('ETag');

        var changes;
        if (!Array.isArray(req.body.changes) || req.body.changes.length === 0) {
            changes = [];
        } else {
            changes = req.body.changes.map(change => new Change(change.path, change.value, change.timestamp));
        }

        store.updateDocument(req.path, sinceVersion, changes, req.auth)
        .then((missingChanges) => {
            missingChanges = missingChanges.map(change => change.toHash());
            res.status(200).json(missingChanges);
        })
        .catch(error => handleError(error, res));
    });

    router.delete('*', function (req, res, next) {
        store.deleteDocument(req.path, req.auth)
        .then(() => {
            res.status(200).send();
        })
        .catch(error => handleError(error, res));
    });

    router.post('/rpc/share', function (req, res, next) {
        let docPath = req.body.path;
        let auth = new Auth(req.body.auth);
        let expiresIn = req.body.expiresIn;
        let authToken = auth.encode(options.secret, expiresIn);
        let url = `${req.protocol}://${req.hostname}${docPath}?auth=${authToken}`;
        mailTransport.sendMail({
            from: 'norelay@onlabs.org',
            to: auth.user,
            subject: 'olo document shared with your',
            text: renderMailTemplate(options.mailTemplates.text, url),
            html: renderMailTemplate(options.mailTemplates.html, url),
        })
        .then((info) => {
            res.status(200).json(info);
        })
        .catch(error => hanldeError(error, res));
    });

    function handleError (error, res) {
        const statusCode = error.statusCode || 500;
        const errorHash = error.toHash ? error.toHash() : {type:'Error', param:String(error)};
        res.status(statusCode).json(errorHash);
    }

    return router;
}


exports.FileStore = FileStore;
exports.Router = Router;
