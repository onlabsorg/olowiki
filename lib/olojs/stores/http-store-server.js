const Store = require("../store");
const errors = require("../errors");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const docMimeType = "application/x-yaml";




function HTTPStoreServer (backend, storePath, auth) {
    const router = express.Router();
    
    router.use( bodyParser.text({type:docMimeType}) );
        
    // read document request
    router.get(`${storePath}/:subPath(*)`, (req, res, next) => {   
        
        if (req.get('Content-Type') !== docMimeType) {
            next();
            return;
        }
        
        backend.readDocument(req.params.subPath)
        .then(doc => {
            if (doc === null) {
                res.status(404).send("Document not found.");                
            }
            else if (!auth.read(doc, req.oloUser)) {
                res.status(403).send("Read access denied.");
            } 
            else {
                res.status(200).send(String(doc));
            }
        })
        .catch(error => {
            res.status(500).send(error.message);
            console.log(error);
        });                
    });
    
    // write document request
    router.put(`${storePath}/:subPath(*)`, (req, res, next) => {         
        if (req.get('Content-Type') !== docMimeType) {
            next();
            return;
        }
        
        backend.readDocument(req.params.subPath)
        .then((doc) => {
            if (doc === null && !auth.create(req.params.subPath, req.oloUser)) {
                res.status(403).send("Write access denied.");
            }
            else if (!auth.write(doc, req.oloUser)) {
                res.status(403).send("Write access denied.");
            } 
            else {
                doc.load(req.body);
                doc.set('author', req.oloUser.id);

                backend.writeDocument(req.params.subPath, doc)
                .then(doc => {
                    res.status(200).send();
                })
                .catch(error => {
                    res.status(500).send(error.message);
                });                                
            }
        });
    });
            
    return router;
}


module.exports = HTTPStoreServer;
