
const olo = window.olo = {};

const Store = require("./client/store");
const auth = require('./client/auth');
const OloWebUI = require("./client/olo-webui.js");
const oloWebUIComponent = OloWebUI({
    
    store: new Store(), 
    
    auth: auth,
    
});

require("./client.css");

const Vue = require("vue/dist/vue.js");
document.addEventListener("DOMContentLoaded", event => {
    olo.webui = new Vue({
        el: "olo-webui",
        components: { 
            'olo-webui': oloWebUIComponent 
        }        
    });    
});        
