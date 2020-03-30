const Path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./user");
const OlojsBackendEnvironment = require("@onlabsorg/olojs/lib/environment/backend-environment");

class OlowikiBackendEnvironment extends OlojsBackendEnvironment {
    
    constructor (config={}) {
        config = Object.create(config);
        if (typeof config.dispatch !== "function") {
            config.dispatch = (address, subject, content) => {
                throw new Error("Dispatcher not defined.")
            }
        }
        config.publicPath = Path.resolve(__dirname, "../public");
        config.allow = req => {
            if (req.user.id === this.owner) return true;
            if (req.method === "GET") return true;
            if (req.method === "PUT" || req.method === "DELETE") {
                let userHomeMatch = req.path.match(/^\/users\/(.*)\/.*$/);
                if (userHomeMatch && userHomeMatch[1] === req.user.id) return true;
            }
            return false;
        };
        super(config);
    }
     
    createMiddleware (router) {
        if (!router) router = express.Router();   
        
        // Extract the Authorization bearer token payload and store it in req.user
        router.all(`*`, (req, res, next) => {
            const auth = req.get('Authorization');
            const token = (auth && auth.substr(0,7) === "Bearer ") ? auth.substr(7) : req.query.user;
            
            try {
                req.user = User.verifyToken(token, this.secret);
            } catch (error) {
                req.user = new User("Guest");
            } 
            
            next();                
        });

        router.get("/user", (req, res, next) => {
            res.status(200).json({
                id: req.user.id,
                attributes: req.user.attributes
            });
        });

        router.use( bodyParser.text() ); 

        router.post(`/user`, async (req, res, next) => {
            var emailAddress = req.body;
            try {
                let user = new User(emailAddress);
                let token = user.generateToken(this.secret);         
                let report = await this.dispatch(emailAddress, "Your olowiki token", `
                   <p>You olowiki token is:</p>
                   <p>${token}</p>
                   <p>You can copy-paste it in the olowiki app to identify yourself as ${emailAddress}</p>
                `);
                res.status(201).send();
            } catch (error) {
                res.status(500).send(error.message);
            }
        });
            
        return super.createMiddleware(router);
    }
}

module.exports = OlowikiBackendEnvironment;
