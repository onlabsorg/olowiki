const URL = require("url");

const errors = require("olojs/lib/errors");
const mimeTypes = require("./mime-types");


class HTTPStoreClient {
    
    constructor (storeURL, authorizationHeader) {
        this.storeURL = storeURL;
        this.authorizationHeader = authorizationHeader;
    }
    
    async read (path) {
        const url = this._resolveURL(path);
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Authorization': this.authorizationHeader,
                'Content-Type': mimeTypes.DOCUMENT
            },
        });
        switch (response.status) {
            case 200:
                return await response.text();
            case 403: 
                throw new errors.ReadAccessDenied(utl);
            case 404: 
                throw new errors.DocumentNotFound(url);
            default:
                let message = await response.text();
                throw new Error(message);
        }            
    }
    
    async write (path, source) {
        const url = this._resolveURL(path);
        const response = await fetch(url, {
            method: 'put',
            headers: {
                'Authorization': this.authorizationHeader,
                'Content-Type': mimeTypes.DOCUMENT                
            },
            body: String(source)
        });
        switch (response.status) {
            case 200:
            case 201:
                break;
            case 403:
                throw new errors.WriteAccessDenied(url);
            default:
                let message = await response.text();
                throw new Error(message);
        }            
    }
    
    async delete (path) {
        const url = this._resolveURL(path);
        const response = await fetch(url, {
            method: 'delete',
            headers: {
                'Authorization': this._authorizationHeader,
                'Content-Type': mimeTypes.DOCUMENT                
            }
        });
        switch (response.status) {
            case 200:
                break;
            case 403:
                throw new errors.WriteAccessDenied(url);
            default:
                let message = await response.text();
                throw new Error(message);
        }            
    }
    
    _resolveURL (path) {
        return this.storeURL + path;
    }
}

module.exports = HTTPStoreClient;
