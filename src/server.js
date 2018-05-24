

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");


function Server (store, storePath) {
    const router = express.Router();
    const fullStorePath = store.getFullPath(storePath);
    
    router.use( bodyParser.json() );
    
    router.all(`*`, (req, res, next) => {
        req.olo = {};
        
        const auth = req.get('Authorization');
        
        var token = null;
        if (auth && auth.substr(0,7) === "Bearer ") {
            token = auth.substr(7);
        } else {
            token = req.query.user;
        }
        
        try {
            req.olo.user = store.verifyToken(token) || {};            
        } catch (error) {
            req.olo.user = {};
        }
        
        next();
        
    });
    
    router.get('/user', (req, res, next) => {
        res.status(200).json(req.olo.user);
    });
    
    // read document request
    router.get(`${storePath}/:subPath(*)`, [
        
        // return an empty document if req.path doesn't exist
        (req, res, next) => {
            if (store._fileExists(req.params.subPath)) {
                next();
                
            } else {
                const author = req.olo.user.id;
                const docHTML = store.renderEmptyDocument(author);
                res.status(200).send(docHTML);
                
            }
        },
        
        // send the document to the client, if it exists
        (req, res, next) => {         
            store._readFile(req.params.subPath).then(html => {
                res.status(200).send(html);

            }).catch(error => {
                res.status(500).send(error);
                                
            });                
        }
    ]);
    
    // write document request
    router.put(`${storePath}/:subPath(*)`, [
        
        // throw permission error if the user is undefined
        (req, res, next) => {
            if (!req.olo.user.id) {
                res.status(403).send();
                
            } else {
                next();
                
            }
        },
        
        // create a new file if req.path doesn't exist
        (req, res, next) => {
            const docData = req.body;
            
            if (!store._fileExists(req.params.subPath)) {
                store.writeDocument(req.params.subPath, docData).then(() => {
                    res.status(200).send();
                
                }).catch((err) => {
                    console.log(1, err);
                    res.status(500).send(err);
                
                });            

            } else {
                next();

            }
        },
        
        // the document exists, overwrite it if req.olo.user is the owner
        (req, res, next) => {
            store.readDocumentData(req.params.subPath)
            .then(oldDocData => {
                const newDocData = req.body;
                if (req.olo.user.id !== newDocData.author) {
                    res.status(400).send();
                    
                } else if (req.olo.user.id !== oldDocData.author) {
                    res.status(403).send();
                    
                } else {
                    store.writeDocument(req.params.subPath, newDocData).then(() => {
                        res.status(200).send();
                        
                    }).catch((err) => {
                        res.status(500).send(err);
                        
                    }); 
                                                   
                }
                
            }).catch(err => {
                res.status(500).send(err);
                
            });                
        }
    ]);
    
    return router;
}

module.exports = Server;
