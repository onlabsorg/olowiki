const errors = require("../errors");
const Store = require("../store");



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
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            let docData = await response.json();
            return this.createDocument(url, docData);
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
                'Content-Type': 'application/json',                
            },
            body: JSON.stringify(doc)
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
