const pathlib = require('path');

const normalizePath = path => pathlib.normalize(`/${path}`);


module.exports = function (targetStore) {
    const store = Object.create(targetStore);
    const listeners = [];

    store.onChange = (listener) => {
        if (typeof listener === 'function') {
            listeners.push(listener);
        }
    }

    const emit = change => {
        for (let listener of listeners) {
            listener(change);
        }
    }
    
    store.write = async (path, source) => {
        await targetStore.write(path, source);
        emit({
            op: 'SET', 
            path: normalizePath(path),
            value: source
        });
    };

    store.delete = async (path) => {
        await targetStore.delete(path);
        emit({
            op: 'DEL', 
            path: normalizePath(path)
        });
    };

    store.deleteAll = async (path) => {
        await targetStore.deleteAll(path);
        emit({
            op: 'DEL', 
            path: normalizePath(`${path}/`)
        });        
    };
    
    return store;
}
