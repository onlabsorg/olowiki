
const JWT = require('jsonwebtoken');


class PublicAuth {
    
    async read (authorizationHeader, path) {
        return true;
    }
    
    async write (authorizationHeader, path) {
        return true;
    }
}


class ReadOnlyAuth {
    
    async read (authorizationHeader, path) {
        return true;
    }
    
    async write (authorizationHeader, path) {
        return false;
    }
}



class JWTAuth {
    
    constructor (key) {
        this.key = key;
    }
    
    async read (authorizationHeader, path) {
        const user = this.verify(authorizationHeader);
    }
    
    async write (authorizationHeader, path) {
        const user = this.verify(authorizationHeader);        
    }
    
    verify (authorizationHeader) {
        if (!authorizationHeader) return null;
        if (authorizationHeader.substr(0,7) !== "Bearer ") return null;
        const token = authorizationHeader.substr(7);
        try {
            return JWT.verify(token, this.key);
        } catch (error) {
            return null;
        }
    }
    
    sign (user, expiresIn="28 days") {
        return JWT.sign(user, this.key, {expiresIn});
    }
}

module.exports = {PublicAuth, ReadOnlyAuth};
