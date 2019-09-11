const express = require("express");
const bodyParser = require("body-parser");
const errors = require("olojs/lib/errors");
const mimeTypes = require("./mime-types");



function HTTPStoreServer (backend, allow) {
    const router = express.Router();
    
    router.use( bodyParser.text({type:mimeTypes.DOCUMENT}) );    
    
    // read document request
    router.get(`*`, async (req, res, next) => {       
        if (req.get('Content-Type') !== mimeTypes.DOCUMENT) {
            next();
            return;
        }
        
        if (!allow("read", req.path, req.user)) {
            res.status(403).send();                
            return;
        }
        
        try {
            let source = await backend.read(req.path);
            res.status(200).send(source);
            
        } catch (error) {
            if (error instanceof errors.ReadAccessDenied) {
                res.status(403).send(error.message);                
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
        
        if (!allow("write", req.path, req.user)) {
            res.status(403).send();                
            return;
        }        
        
        try {
            await backend.write(req.path, req.body);
            res.status(200).send("Updated!");
            
        } catch (error) {
            
            if (error instanceof errors.WriteAccessDenied) {
                res.status(403).send(error.message);
                
            } else if (error instanceof errors.WriteOperationNotAllowed) {
                res.status(405).send(error.message);            
                
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
        
        if (!allow("delete", req.path, req.user)) {
            res.status(403).send();                
            return;
        }
                
        try {
            await backend.delete(req.path);
            res.status(200).send("Deleted!");
            
        } catch (error) {
            
            if (error instanceof errors.WriteAccessDenied) {
                res.status(403).send(errors.message);
                
            } else {
                res.status(500).send(error.message);
            }
        }        
    });
            
    return router;
}


module.exports = HTTPStoreServer;
