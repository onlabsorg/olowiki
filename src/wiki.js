import Vue from 'vue';
import vuetify from './plugins/vuetify'
import App from './App.vue';
import WikiStore from './store'

Vue.config.productionTip = false



export default async function (element, options={}) {
    const wiki = {};
    
    wiki.store = new WikiStore(options.routes || defaultOptions.routes);
    
    wiki.configPath = options.configPath || defaultOptions.configPath;
    wiki.config = await wiki.store.loadConfig(wiki.configPath);
    
    wiki.homePath   = wiki.config.homePath || options.homePath || defaultOptions.homePath;
    wiki.helpPath   = wiki.config.helpPath || options.helpPath || defaultOptions.helpPath;
    
    wiki.tree = wiki.config.tree || options.tree || defaultOptions.tree;
    
    wiki.vue = new Vue({
        vuetify,
        render: h => h(App, {
            props: {
                store: wiki.store,
                paths: {
                    home  : wiki.homePath,
                    help  : wiki.helpPath,
                    config: wiki.configPath,                    
                },
                tree: wiki.tree
            }
        }),
    }).$mount(element);
    
    return wiki;
}



const defaultOptions = {
    
    routes: {},
    
    homePath  : "/",
    helpPath  : "/.wiki/help/index",
    configPath: '/.wiki/config',
    
    tree: null
};