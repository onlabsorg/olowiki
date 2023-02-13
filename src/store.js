import * as olo from '@onlabsorg/olojs/browser';
import * as pathlib from 'path';
import * as FileSaver from 'file-saver';

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
}



export default class WikiStore extends ObservableStore {
    
    async exists (path) {
        const docSource = await this.read(path);
        return docSource !== "";
    }
    
    async assertNonExistance (path) {
        if (await this.exists(path)) {
            throw new Error(`Document '${path}' already exists.`);
        }        
    }

    async copy (path1, path2) {
        path1 = normalizePath(path1);
        path2 = normalizePath(path2);
        await this.assertNonExistance(path2);
        if (path1 !== path2) {
            const doc1 = await this.read(path1);
            await this.write(path2, doc1);
        }
    }

    async download (path) {
        const source = await this.read(path);
        var blob = new Blob([source], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${pathlib.basename(path)}.olo`);
    }
}
