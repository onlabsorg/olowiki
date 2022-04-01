import Vue from 'vue';
import vuetify from './plugins/vuetify'
import App from './App.vue';
import WikiStore from './store'

Vue.config.productionTip = false



export default async function (element, options={}) {
    const wiki = {};
    const props = {};
    
    wiki.store = props.store = new WikiStore(options.routes || defaultOptions.routes);

    for (let optionName of Object.keys(defaultOptions)) {
        if (optionName !== 'routes') {
            wiki[optionName] = props[optionName] = options[optionName] || defaultOptions[optionName];
        }
    }
    
    console.log(props)
    
    wiki.vue = new Vue({
        vuetify,
        render: h => h(App, {props}),
    }).$mount(element);
    
    return wiki;
}



const defaultOptions = {
    
    appName: "olowiki",
        
    routes: {},
    
    homePath: "/",
    
    helpPath: "./wiki/help/index",
    
    treeRoot: "/"
};