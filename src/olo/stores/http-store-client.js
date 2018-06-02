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
        const html = await response.text();
        return Document.parse(html);
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
            const err = await response.text();
            throw new Error(err);
        }    
    }


    clearCache () {
        this._cache.clear();
    }
}


module.exports = HTTPStoreClient;
