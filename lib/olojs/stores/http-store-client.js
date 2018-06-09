const Store = require("../store");
const Document = require("../document");



class HTTPStoreClient extends Store {
    
    constructor () {
        super();
        this._cache = new Map();
    }
    
    
    async getDocument (url, token) {    
        if (this._cache.has(url)) {
            return this._cache.get(url);
        }
        
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Store.DocumentNotFoundError();
            }
            else {
                let message = await response.text();
                throw new Error(message);
            }
        }
        else {
            let html = await response.text();
            return Document.parse(html);            
        }
    }


    async setDocument (url, doc, token) {
        const response = await fetch(url, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',                
            },
            body: JSON.stringify(doc.toJSON())
        });
        if (!response.ok) {
            if (response.status === 403) {
                throw new Store.WriteAccessDeniedError();
            }
            else {
                let message = await response.text();
                throw new Error(message);
            }
        }    
    }


    clearCache () {
        this._cache.clear();
    }
}


module.exports = HTTPStoreClient;
