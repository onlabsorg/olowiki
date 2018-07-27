const Store = require("../store");
const errors = require("../errors");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const docMimeType = "application/x-yaml";




function HTTPStoreServer (backend, storePath) {
    const router = express.Router();
    
    router.use( bodyParser.text({type:docMimeType}) );
        
    // read document request
    router.get(`${storePath}/:subPath(*)`, (req, res, next) => {   
        if (req.get('Content-Type') !== docMimeType) {
            next();
            return;
        }
        
        backend.readDocument(req.params.subPath, req.userId)
        .then(doc => {
            res.status(200).send(String(doc));
        })
        .catch(error => {
            if (error instanceof errors.DocumentNotFoundError) {
                res.status(404).send("File not found.");
            }
            else {
                res.status(500).send(error.message);
            }                    
        });                
    });
    
    // write document request
    router.put(`${storePath}/:subPath(*)`, (req, res, next) => {         
        if (req.get('Content-Type') !== docMimeType) {
            next();
            return;
        }
        
        const doc = backend.createDocument(req.params.subPath, req.body);

        backend.writeDocument(req.params.subPath, doc, req.userId)
        .then(doc => {
            res.status(200).send();
        })
        .catch(error => {
            if (error instanceof errors.WriteAccessDeniedError) {
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
