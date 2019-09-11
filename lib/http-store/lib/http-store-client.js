
const Path = require("path");
const errors = require("olojs/lib/errors");
const mimeTypes = require("./mime-types");


class HTTPStoreClient {
    
    constructor (storeURL, options={}) {
        this.storeURL = storeURL;
        this.authorizationHeader = options.auth;
        if (options.cache) this._cache = new Map();
    }
    
    async read (path) {
        const url = this._resolveURL(path);

        if (this._cache && this._cache.has(url)) {
            return this._cache.get(url);
        }        
        
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Authorization': this.authorizationHeader,
                'Content-Type': mimeTypes.DOCUMENT
            },
        });
        switch (response.status) {
            case 200:
                let source = await response.text();
                this._updateCache(url, source);
                return source;
            case 403: 
                throw new errors.ReadAccessDenied(path);
            default:
                let message = await response.text();
                throw new Error(message);
        }            
    }
    
    _updateCache (url, source) {
        if (this._cache && url.slice(-1) !== "/") {
            this._cache.set(url, source);
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
                this._updateCache(url, source);
                break;
            case 403:
                throw new errors.WriteAccessDenied(path);
            case 405:
                throw new errors.WriteOperationNotAllowed(path);
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
                'Authorization': this.authorizationHeader,
                'Content-Type': mimeTypes.DOCUMENT                
            }
        });
        switch (response.status) {
            case 200:
                this._updateCache(url, "");
                break;
            case 403:
                throw new errors.WriteAccessDenied(path);
            default:
                let message = await response.text();
                throw new Error(message);
        }            
    }
    
    _resolveURL (path) {
        return this.storeURL + Path.join("/", path);
    }
}

module.exports = HTTPStoreClient;
