const pathlib = require('path');
const ObservableStore = require('observable-store');

const isDir = path => path.slice(-1) === '/';
const normalizePath = path => pathlib.normalize(`/${path}`);

const FileSaver = require('file-saver');
const JSZip = require('jszip');


module.exports = store => {
    const wikiStore = ObservableStore(store);
    Object.assign(wikiStore, WikiStoreMixins);
    return wikiStore;
}


const WikiStoreMixins = {
    
    createContext (docId) {
        const context = Object.getPrototypeOf(this).createContext(docId);
        context.__olowiki__ = {
            version: require('../package.json').version
        }
        return context;
    },
    
    async exists (path) {
        const docSource = await this.read(path);
        return docSource !== "";
    },
    
    async assertNonExistance (path) {
        if (await this.exists(path)) {
            throw new Error(`Document '${path}' already exists.`);
        }        
    },
    
    async createDocument (path) {
        await this.assertNonExistance(path);
        await this.write(path, "");
    },
    
    async copyDocument (path1, path2) {
        path1 = normalizePath(path1);
        path2 = normalizePath(path2);
        await this.assertNonExistance(path2);
        if (path1 !== path2) {
            const doc1 = await this.read(path1);
            await this.write(path2, doc1);
        }
    },
    
    async copyDirectory (path1, path2) {
        path1 = normalizePath(`${path1}/`);
        path2 = normalizePath(`${path2}/`);
        const childNames = await this.list(path1);
        for (let childName of childNames) {
            const subPath1 = pathlib.join(path1, childName);
            const subPath2 = pathlib.join(path2, childName);
            if (isDir(childName)) {
                await this.copyDirectory(subPath1, subPath2);
            } else {
                await this.copyDocument(subPath1, subPath2);
            }
        }        
    },
    
    async copy (path1, path2) {
        if (isDir(path1)) {
            await this.copyDirectory(path1, path2);
        } else {
            await this.copyDocument(path1, path2);
        }
    },
    
    async download (path) {
        if (path.slice(-1) === '/') {
            const zip = new JSZip();
            await this._zipDir(path, zip);
            const blob = await zip.generateAsync({type:'blob'});
            FileSaver.saveAs(blob, `${pathlib.basename(path.slice(0,-1))}.zip`);
        } else {
            const source = await this.read(path);
            var blob = new Blob([source], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, `${pathlib.basename(path)}.olo`);
        }
    },
    
    async _zipDir (path, zip) {
        const entries = await this.list(path);
        for (let entry of entries) {
            if (entry.slice(-1) === '/') {
                await this._zipDir(path+entry, zip.folder(entry.slice(0,-1)))
            } else {
                zip.file(`${entry}.olo`, await this.read(path+entry));
            }
        }
    }
};
