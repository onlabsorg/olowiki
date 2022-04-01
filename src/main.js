
import * as olo from '@onlabsorg/olojs/browser';
window.olo = olo;

import Wiki from './wiki';

document.addEventListener("DOMContentLoaded", () => {
    olo.wiki = Wiki('#app', { 
        
        appName: "oloWiki",
        
        routes: {
            '/'      : new olo.HTTPStore(location.origin + "/docs/"),
            '/.wiki/': new olo.HTTPStore(location.origin + "/.wiki/", {extension:".olo"}),
            'http:/' : new olo.HTTPStore('http:/'),
            'https:/': new olo.HTTPStore('https:/'),
            'local:/': new olo.BrowserStore('olojs_local_store'),
            'temp:/' : new olo.MemoryStore()
        },
        
        homePath: "/index",
        
        helpPath: "/.wiki/help/index",
        
        treeRoot: "/"
    });
});


