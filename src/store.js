import * as olo from '@onlabsorg/olojs/browser';
import * as pathlib from 'path';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';

const isDir = path => path.slice(-1) === '/';
const normalizePath = path => pathlib.normalize(`/${path}`);



class ObservableStore extends olo.Router {
    
    constructor (routes) {
        super(routes);
        this._listeners = [];
    }

    onChange (listener) {
        if (typeof listener === 'function') {
            this._listeners.push(listener);
        }
    }

    _emit (change) {
        for (let listener of this._listeners) {
            listener(change);
        }
    }
    
    async write (path, source) {
        await super.write(path, source);
        this._emit({
            op: 'SET', 
            path: pathlib.normalize(`/${path}`),
            value: source
        });
    }

    async delete (path) {
        await super.delete(path);
        this._emit({
            op: 'DEL', 
            path: pathlib.normalize(`/${path}`)
        });
    }

    async deleteAll (path) {
        await super.deleteAll(path);
        this._emit({
            op: 'DEL', 
            path: pathlib.normalize(`/${path}/`)
        });        
    }
}



export default class WikiStore extends ObservableStore {
    
    createContext (docId) {
        const context = super.createContext(docId);
        context.__oloWiki__ = {
            version: require('../package.json').version
        }
        return context;
    }
    
    async loadConfig (path="/.wiki/config") {
        const configSource = await this.read(path);
        const configContext = await this.createContext(path);
        const {data} = await this.parseDocument(configSource)(configContext);
        return data;
    }
    
    async exists (path) {
        const docSource = await this.read(path);
        return docSource !== "";
    }
    
    async assertNonExistance (path) {
        if (await this.exists(path)) {
            throw new Error(`Document '${path}' already exists.`);
        }        
    }

    async createDocument (path) {
        await this.assertNonExistance(path);
        await this.write(path, "");
    }

    async copyDocument (path1, path2) {
        path1 = normalizePath(path1);
        path2 = normalizePath(path2);
        await this.assertNonExistance(path2);
        if (path1 !== path2) {
            const doc1 = await this.read(path1);
            await this.write(path2, doc1);
        }
    }
    
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
    }

    async copy (path1, path2) {
        if (isDir(path1)) {
            await this.copyDirectory(path1, path2);
        } else {
            await this.copyDocument(path1, path2);
        }
    }

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
    }
    
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
}
