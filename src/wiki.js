import Vue from 'vue';
import vuetify from './plugins/vuetify'
import App from './App.vue';
import WikiStore from './store'

Vue.config.productionTip = false



export default async function (element, options={}) {
    const wiki = {};
    
    wiki.store = new WikiStore(options.routes || defaultOptions.routes);
    
    wiki.configPath = options.configPath || defaultOptions.configPath;

    wiki.vue = new Vue({
        vuetify,
        render: h => h(App, {
            props: {
                store: wiki.store,
                configPath: wiki.configPath,
            }
        }),
    }).$mount(element);
    
    return wiki;
}



const defaultOptions = {
        
    routes: {},
    
    configPath: '/.wiki/config',
    
};