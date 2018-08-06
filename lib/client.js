
const olo = window.olo = {};

const Store = require("./client/store");
const auth = require('./client/auth');
const OloWebUI = require("./client/olo-webui.js");
const oloWebUIComponent = OloWebUI({
    
    store: new Store(), 
    
    auth: auth,
    
    allowedTags: {
        '*': [ 'http:', 'https:', 'ftp:', 'mailto:', 'class', 'style', 'id', 'slot' ],

        // headers
        'h1': [],
        'h2': [],
        'h3': [],
        'h4': [],
        'h5': [],
        'h6': [],

        // lists
        'ul': [],
        'ol': [ 'type', 'start' ],
        'li': [],
        'dl': [],
        'dt': [],
        'dd': [],

        // tables
        'table': [],
        'thead': [],
        'tbody': [],
        'tfoot': [],
        'caption': [],
        'col': [],
        'colgroup': [],
        'tr': [],
        'th': [],
        'td': [],

        // misc block tags
        'p': [],
        'blockquote': [],
        'pre': [],
        'div': [],
        'br': [ '<>' ],
        'hr': [ '<>' ],

        // inline tags
        'b': [],
        'i': [],
        'strong': [],
        'em': [],
        'code': [],
        'a': [ 'href', 'name', 'target' ],
        'img': [ 'src', 'alt', 'height', 'width' , '<>' , "http:"],   
        'span': [],     
    }
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
