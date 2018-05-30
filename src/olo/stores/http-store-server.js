const Store = require("../store");
const Document = require("../document");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const jwt = require("jsonwebtoken");


function HTTPStoreServer (backend, storePath, jwtKey) {
    const router = express.Router();
    
    router.use( bodyParser.json() );
    
    router.all(`*`, (req, res, next) => {
        req.olo = req.olo || {};
        
        const auth = req.get('Authorization');
        
        var token = null;
        if (auth && auth.substr(0,7) === "Bearer ") {
            token = auth.substr(7);
        } else {
            token = req.query.user;
        }
        
        try {
            req.olo.user = jwt.verify(token, jwtKey) || {};            
        } catch (error) {
            req.olo.user = {};
        }
        
        next();
        
    });
    
    // read document request
    router.get(`${storePath}/:subPath(*)`, (req, res, next) => {         
        backend.getDocument(req.params.subPath, req.olo.user.id)
        .then(doc => {
            res.status(200).send(doc.toHTML());
        })
        .catch(error => {
            res.status(500).send(error);        
        });                
    });
    
    // write document request
    router.put(`${storePath}/:subPath(*)`, (req, res, next) => {         
        const doc = new Document(req.body);
        
        backend.setDocument(req.params.subPath, doc, req.olo.user.id)
        .then(doc => {
            res.status(200).send();
        })
        .catch(error => {
            res.status(500).send(error);        
        });                
    });
            
    return router;
}

module.exports = HTTPStoreServer;
