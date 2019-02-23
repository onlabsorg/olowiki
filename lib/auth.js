const express = require('express');
const bodyParser = require('body-parser');
const JWT = require('jsonwebtoken');


function Auth (route, secret) {
    const router = express.Router();

    router.use( bodyParser.text() );
    
    router.post(`${route}/token`, (req, res, next) => {
        var userId = req.body;
        try {
            var token = JWT.sign(userId, secret);            
        } catch (error) {
            res.status(500).send(error.message);
            return;
        }
        res.status(201).send(token);
    });
    
    router.all(`*`, (req, res, next) => {  
        const auth = req.get('Authorization');
        if (auth && auth.substr(0,7) === "Bearer ") {
            req.userToken = auth.substr(7);
        } else {
            req.userToken = req.query.user;
        }
        
        if (req.userToken) {
            try {
                req.userId = JWT.verify(req.userToken, secret) || "";
            } catch (error) {
                req.userId = "";
            } 
        } else {
            req.userId = "";
        }
        
        next();        
    });    
    
    router.get(`${route}/verify`, (req, res, next) => {
        res.status(200).send(req.userId);
    });
    
    return router;
}

module.exports = Auth;
