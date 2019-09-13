const Path = require("path");
const errors = require("olojs/lib/errors");
const PouchDB = require("pouchdb").default;



class PouchdbStore {
   
   constructor (name) {
       this.db = new PouchDB(name)
   }
   
   async read (path) {
       path = Path.join("/", path);
       
       if (path.slice("-1") === "/") {
           return await this._readContainer(path);
       } else {
           return await this._readDocument(path);
       }
   }   
   
   async write (path, content) {
       path = Path.join("/", path);
       
       if (path.slice(-1) === "/") {
           throw new errors.WriteOperationNotAllowed(path);
       } else {
           await this._writeDocument(path, String(content));
       }
   }
   
   async delete (path) {
       path = Path.join("/", path);        
       
       if (path.slice(-1) === "/") {
           await this._deleteContainer(path);
       } else {
           await this._deleteDocument(path);
       }
   }
   
   async _list () {
       const db = await this.db.allDocs();
       return db.rows.map(row => row.id);
   }
   
   async _getDocument (path) {
       try {
           return await this.db.get(path);           
       } catch (e) {
           return null;
       }
   }
   
   async _readDocument (path) {
       const doc = await this._getDocument(path);
       return doc ? doc.source : "";                  
   }
   
   async _readContainer (path) {
       const docPaths = await this._list();
       const items = [];
       if (path === "/") {
           for (let docPath of docPaths) {
                let names = docPath.split("/");
                let rootName = names[1] + (names.length > 2 ? "/" : "");
                if (items.indexOf(rootName) === -1) items.push(rootName);
           };   
       } else {
           if (path.slice(-1) !== "/") path += "/";
           for (let docPath of docPaths) {
               if (docPath.indexOf(path) === 0) {
                   let subPath = docPath.slice(path.length);
                   let slashIndex = subPath.indexOf("/");
                   if (slashIndex === -1) {
                       items.push( subPath );
                   } else {
                       items.push( subPath.slice(0, slashIndex+1) )
                   }
               }           
           };   
       }
       return `<% items = ${JSON.stringify(items)} %>`;
   }   
   
   async _writeDocument (path, content) {
       const doc = await this._getDocument(path);
       if (doc) {
           await this.db.put({
               _id: path,
               _rev: doc._rev,
               source: content
           });
       } else {
           await this.db.put({
               _id: path,
               source: content
           });
       }
   }
   
   async _deleteDocument (path) {
       const doc = await this._getDocument(path);
       if (doc) {
           await this.db.remove(doc);
       }
   }
   
   async _deleteContainer (path) {
       const docPaths = await this._list();
       for (let docPath of docPaths) {
           if (docPath.indexOf(path) === 0) {
               await this._deleteDocument(docPath);
           }
       }
   }
}


// Exports
module.exports = PouchdbStore;
