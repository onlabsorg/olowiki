const Path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./user");
const OlojsHTTPServer = require("@onlabsorg/olojs/lib/http-server");
const document = require("@onlabsorg/olojs/lib/document");



module.exports = (options={}) => async function (port) {
    options = Object.create(options);
    
    const environment = options.environment || this;
    
    if (typeof options.dispatch !== "function") {
        options.dispatch = (address, subject, content) => {
            throw new Error("Dispatcher not defined.")
        }
    }
    
    options.publicPath = Path.resolve(__dirname, "../public");
    
    options.allow = async req => {
        if (req.user.id === options.owner) return true;

        const acl = await environment.loadDocument("/acl");
        if (req.method === "GET") {
            return Boolean(await document.expression.apply(acl.allow, "read", req.path, req.user.id));
        }
        if (req.method === "PUT" || req.method === "DELETE") {
            return Boolean(await document.expression.apply(acl.allow, "write", req.path, req.user.id));
        }
        return false;
    };
    
    options.router = express.Router();
    
    // Extract the Authorization bearer token payload and store it in req.user
    options.router.all(`*`, (req, res, next) => {
        const auth = req.get('Authorization');
        const token = (auth && auth.substr(0,7) === "Bearer ") ? auth.substr(7) : req.query.user;
        
        try {
            req.user = User.verifyToken(token, options.secret);
        } catch (error) {
            req.user = new User("Guest");
        } 
        
        next();                
    });

    options.router.get("/user", (req, res, next) => {
        res.status(200).json({
            id: req.user.id,
            attributes: req.user.attributes
        });
    });

    options.router.use( bodyParser.text() ); 

    options.router.post(`/user`, async (req, res, next) => {
        var emailAddress = req.body;
        try {
            let user = new User(emailAddress);
            let token = user.generateToken(options.secret);         
            let report = await options.dispatch(emailAddress, "Your olowiki token", `
               <p>You olowiki token is:</p>
               <p>${token}</p>
               <p>You can copy-paste it in the olowiki app to identify yourself as ${emailAddress}</p>
            `);
            res.status(201).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
    
    const serve = OlojsHTTPServer(options); 
    return await serve.call(environment, port);
}
