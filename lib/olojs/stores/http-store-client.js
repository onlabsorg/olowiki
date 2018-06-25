const Store = require("../store");
const Document = require("../document");



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
                'Content-Type': 'text/xml'
            },
        });
        if (response.ok) {
            let xml = await response.text();
            return new Document(xml);            
        }
        else if (response.status === 404) {
            throw new Store.DocumentNotFoundError();
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
                'Content-Type': 'text/xml',                
            },
            body: String(doc)
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
}


module.exports = HTTPStoreClient;
