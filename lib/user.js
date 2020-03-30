
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

module.exports = User;
