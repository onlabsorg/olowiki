const express = require("express");
const bodyParser = require("body-parser");
const Path = require("path");

const errors = require("olojs/lib/errors");

const mimeTypes = require("./mime-types");





function HTTPStoreServer (backend, auth) {
    const router = express.Router();
    
    router.use( bodyParser.text({type:mimeTypes.DOCUMENT}) );    
    
    // read document request
    router.get(`*`, async (req, res, next) => {       
        if (req.get('Content-Type') !== mimeTypes.DOCUMENT) {
            next();
            return;
        }
        
        const canRead = await auth.read(req.get('Authorization'), req.path);
        if (!canRead) {
            res.status(403).send("Read access denied.");
            return;
        }

        try {
            let source = await backend.read(req.path);
            res.status(200).send(source);
            
        } catch (error) {
            
            if (error instanceof errors.ReadAccessDenied) {
                res.status(403).send("Read access denied!");
                
            } else  if (error instanceof errors.DocumentNotFound) {
                res.status(404).send("Not found!");
                
            } else {
                res.status(500).send(error.message);
            }
        }
    });
    
    // write document request
    router.put(`*`, async (req, res, next) => { 
        
        if (req.get('Content-Type') !== mimeTypes.DOCUMENT) {
            next();
            return;
        }
        
        const canWrite = await auth.write(req.get('Authorization'), req.path);
        if (!canWrite) {
            res.status(403).send("Write access denied!");
            return;
        }
        
        try {
            await backend.write(req.path, req.body);
            res.status(200).send("Updated!");
            
        } catch (error) {
            
            if (error instanceof errors.WriteAccessDenied) {
                res.status(403).send("Write access denied!");
                
            } else {
                res.status(500).send(error.message);
            }
        }        
    });
    
    // delete document request
    router.delete('*', async (req, res, next) => {
        if (req.get('Content-Type') !== mimeTypes.DOCUMENT) {
            next();
            return;
        }
        
        const canWrite = await auth.write(req.get('Authorization'), req.path);
        if (!canWrite) {
            res.status(403).send("Write access denied!");
            return;
        }
        
        try {
            await backend.delete(req.path);
            res.status(200).send("Deleted!");
            
        } catch (error) {
            
            if (error instanceof errors.WriteAccessDenied) {
                res.status(403).send("Write access denied!");
                
            } else {
                res.status(500).send(error.message);
            }
        }        
    });
            
    return router;
}


module.exports = HTTPStoreServer;
