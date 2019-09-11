const Path = require("path");
const errors = require("olojs/lib/errors");
const localForage = require("localforage");



/**
*  ## olojs.MemoryStore class
*
*  The `MemoryStore` class implement an in-memory olojs store interface.
*/
class LocalStore {
   
   constructor (name) {
       this.backend = localForage.createInstance({name:name});
   }
   
   async read (path) {
       path = Path.join("/", path);
       
       if (path.slice("-1") === "/") {
           let items = await this._readContainer(path) || [];
           return `<% items = ${JSON.stringify(items)} %>`;
       } else {
           return await this._readDocument(path) || "";
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
   
           
   async _readDocument (path) {        
       return await this.backend.getItem(path) || "";
   }


   async _readContainer (path) {
       if (path === "/") return await this._getRootItems();

       if (path.slice(-1) !== "/") path += "/";
       const items = [];
       await this.backend.iterate((value, fullPath) => {
           if (fullPath.indexOf(path) === 0) {
               let subPath = fullPath.slice(path.length);
               let slashIndex = subPath.indexOf("/");
               if (slashIndex === -1) {
                   items.push( subPath );
               } else {
                   items.push( subPath.slice(0, slashIndex+1) )
               }
           }           
       });
       return items;
   }
   
   async _getRootItems () {
       const items = [];
       await this.backend.iterate((value, path) => {
           let names = path.split("/");
           let rootName = names[1] + (names.length > 2 ? "/" : "");
           if (items.indexOf(rootName) === -1) items.push(rootName);
       });   
       return items;     
   }
   
   async _writeDocument (path, content) {
       await this.backend.setItem(path, content);            
   }
   
       
   async _deleteDocument (path) {
       await this.backend.removeItem(path);            
   }
   
   async _deleteContainer (path) {
       const pathsToBeRemoved = [];
       await this.backend.iterate((value, docPath) => {
           if (docPath.indexOf(path) === 0) {
               pathsToBeRemoved.push(docPath);
           }
       });
       for (let docPath of pathsToBeRemoved) {
           await this._deleteDocument(docPath);           
       }
   }
}


// Exports
module.exports = LocalStore;
