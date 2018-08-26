const errors = require("../errors");
const Store = require("../store");

const URL = require("url");

const docMimeType = "application/x-yaml";


class HTTPStoreClient extends Store {
    
    constructor (host="", httpAuthorizationHeader="") {
        super(host);
        this.httpAuthorizationHeader = httpAuthorizationHeader;
        this._cache = new Map();
    }
    
    get host () {
        return this.rootPath;
    }
    
    
    async readDocument (path) {   
        const url = this.resolvePath(path);
        
        if (this._cache.has(url)) {
            return this._cache.get(url);
        }
        
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Authorization': this.httpAuthorizationHeader,
                'Content-Type': docMimeType
            },
        });
        switch (response.status) {
            case 200:
                let docSource = await response.text();
                return this.createDocument(path, docSource);            
            case 403: 
                throw new errors.ReadAccessDeniedError();
            case 404: 
                throw new errors.DocumentNotFoundError();
            default:
                let message = await response.text();
                throw new Error(message);
        }
    }


    async writeDocument (path, doc) {
        const url = this.resolvePath(path);
        
        const response = await fetch(url, {
            method: 'put',
            headers: {
                'Authorization': this.httpAuthorizationHeader,
                'Content-Type': docMimeType                
            },
            body: String(doc)
        });
        switch (response.status) {
            case 200:
                break;
            case 403:
                throw new errors.WriteAccessDeniedError();
            default:
                let message = await response.text();
                throw new Error(message);
        }
    }
}


module.exports = HTTPStoreClient;
