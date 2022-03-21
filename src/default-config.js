const pathlib = require('path');

export default store => ({

    homePath: '/',
    
    helpPath: '/.wiki/help/index',
    
    tree: {
        name: 'oloWiki',
        path: '/',
        mutable: true,            
        children: self => loadChildren(store, self.path) 
    }
});


async function loadChildren (store, path) {
    const items = await store.list(path);
    return items.map(item_name => ({
        name: item_name.slice(-1) == "/" ? item_name.slice(0,-1) : item_name,
        path: pathlib.join(path, item_name),
        mutable: true,
        children: item_name.slice(-1) == "/" ? self => loadChildren(store, self.path) : undefined
    })).filter(
        item => item.name && item.name[0] !== "."
    ).sort((item1, item2) => {
        if (item1.children && !item2.children) return -1;
        if (!item1.children && item2.children) return +1;
        return item1.name.localeCompare(item2.name);            
    });
}