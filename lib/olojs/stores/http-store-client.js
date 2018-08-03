const errors = require("../errors");
const Store = require("../store");

const docMimeType = "application/x-yaml";


class HTTPStoreClient extends Store {
    
    constructor () {
        super();
        this._cache = new Map();
    }
    
    
    async readDocument (url, token) {    
        if (this._cache.has(url)) {
            return this._cache.get(url);
        }
        
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': docMimeType
            },
        });
        if (response.ok) {
            let docSource = await response.text();
            return this.createDocument(url, docSource, token);
        }
        else if (response.status === 404) {
            throw new errors.DocumentNotFoundError();
        }
        else {
            let message = await response.text();
            throw new Error(message);
        }
    }


    async writeDocument (url, doc, token) {
        const response = await fetch(url, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': docMimeType                
            },
            body: String(doc)
        });
        if (!response.ok) {
            if (response.status === 403) {
                throw new errors.WriteAccessDeniedError();
            }
            else {
                let message = await response.text();
                throw new Error(message);
            }
        }    
    }
}


module.exports = HTTPStoreClient;
