
import * as olo from '@onlabsorg/olojs/browser';

import App from './App';

App({
    
    routes: {
        '/'      : new olo.HTTPStore(String(new URL('/docs', location.href))),
        'about:/': new olo.HTTPStore(String(new URL('/about', location.href)), {extension:".olo"}),
        'http:/' : new olo.HTTPStore('http:/'),
        'https:/': new olo.HTTPStore('https:/'),
        'local:/': new olo.BrowserStore('olojs_local_store'),
        'temp:/' : new olo.MemoryStore()
    },
    
    about: "about:/index"
});
