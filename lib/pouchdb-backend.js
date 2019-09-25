const Path = require("path");
const errors = require("olojs/lib/errors");
const FlatBackend = require("olojs/lib/backends/flat-backend");
const PouchDB = require("pouchdb").default;


class PouchdbMap {
    
    constructor (name) {
        this.db = new PouchDB(name);
    }
    
    async get (key) {
        const record = await this._getRecord(key);
        return record ? record.data : "";
    }
    
    async set (key, value) {
        const record = await this._getRecord(key);
        if (record) {
            await this.db.put({
                _id: key,
                _rev: record._rev,
                data: value
            });
        } else {
            await this.db.put({
                _id: key,
                data: value
            });
        }        
    }
    
    async delete (key) {
        const record = await this._getRecord(key);
        if (record) {
            await this.db.remove(record);
        }        
    }
    
    async keys () {
        const db = await this.db.allDocs();
        return db.rows.map(row => row.id);        
    }
    
    async _getRecord (key) {
        try {
            return await this.db.get(key);           
        } catch (e) {
            return null;
        }        
    }
}


class PouchdbBackend extends FlatBackend {
   
   constructor (name) {
       const map = new PouchdbMap(name);
       super(map);
   }
}


// Exports
module.exports = PouchdbBackend;
