const Store = require("../store");
const Document = require("../document");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");



function HTTPStoreServer (backend, storePath) {
    const router = express.Router();
    
    router.use( bodyParser.json() );
        
    // read document request
    router.get(`${storePath}/:subPath(*)`, (req, res, next) => {   
        backend.getDocument(req.params.subPath, req.userId)
        .then(doc => {
            res.status(200).send(doc.toHTML());
        })
        .catch(error => {
            if (error instanceof Store.DocumentNotFoundError) {
                let newDoc = new Document({
                    title: "New document",
                    author: req.userId,
                    template: `This document doesn't exist.<br>Edit and save it to create it.`
                });
                res.status(404).send(newDoc.toHTML());
            }
            else {
                res.status(500).send(error.message);
            }                    
        });                
    });
    
    // write document request
    router.put(`${storePath}/:subPath(*)`, (req, res, next) => {         
        const doc = new Document(req.body);

        backend.setDocument(req.params.subPath, doc, req.userId)
        .then(doc => {
            res.status(200).send();
        })
        .catch(error => {
            if (error instanceof Store.WriteAccessDeniedError) {
                res.status(403).send(error.message);
            }
            else {
                res.status(500).send(error.message);
            }    
        });                
    });
            
    return router;
}

module.exports = HTTPStoreServer;
