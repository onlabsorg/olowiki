
const JWT = require('jsonwebtoken');
const DEFAULT_OPTIONS = {};


class User {
    
    constructor (id, ...attributes) {
        this.id = id;
        this.attributes = attributes;
    }
    
    hasAttribute (attrName) {
        return this.attributes.indexOf(attrName) !== -1;
    }
    
    generateToken (secret, options=DEFAULT_OPTIONS) {
        const payload = {
            id: this.id,
            attributes: this.attributes
        };
        return JWT.sign(payload, secret, options);
    }
    
    static verifyToken (token, secret) {
        const payload = JWT.verify(token, secret);
        return new this(payload.id, ...payload.attributes);
    }
}

function Middleware (ownerId, secret) {
    
    return function (req, res, next) {
        
        const auth = req.get('Authorization');
        const token = (auth && auth.substr(0,7) === "Bearer ") ? auth.substr(7) : req.query.user;
        
        try {
            req.user = User.verifyToken(token, secret);
        } catch (error) {
            req.user = new User("Guest");
        } 
        
        req.user.isOwner = function () {
            return this.id === ownerId;
        }
        
        next();                
    }
}

const authorization = {
    
    "public": function (action, path, user) {
        if (user.isOwner()) return true;
        if (action === "read") return true;
        return false;
    },
    
    "private": function (action, path, user) {
        if (user.isOwner()) return true;
        return false;        
    },
    
    "multiuser": function (action, path, user) {
        if (user.isOwner()) return true;
        if (action === "read") return true;
        const rootPathName = path.slice(1).split("/")[0];
        if (rootPathName === user.id) return true;
        return false;
    }
};

module.exports = {User, Middleware, authorization};
