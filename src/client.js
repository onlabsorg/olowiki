
const store = require('./client/store');
const OloDOM = require('./client/engine/dom');
const engine = require('./client/engine');

engine.config.elements.import = {
    allowedAttributes: [ 'href', 'name' ],
    beforeRendering: async function (scope) {
        const targetDoc = await store.read(this.attributes.href);
        const targetScope = {};
        await engine.render(targetDoc.template, targetScope);
        scope[this.attributes.name] = targetScope;
    }
};


const Vue = require("Vue");
const VueMaterial = require("vue-material/dist/vue-material.min.js");
Vue.use(VueMaterial.default);

const rootElt = document.createElement('div');
rootElt.id = "app";
rootElt.innerHTML = require("./client.html!text");
document.body.appendChild(rootElt);

const vue = new Vue({
    
    el: "#app",
    
    components: {
        'ace-editor': require('vue2-ace-editor'),
    },
    
    data: {
        
        doc: engine.parseDocument(document.documentElement.innerHTML),
        
        rendering: "",
        
        editMode: false,
        
        editorOptions: {
            fontSize: "12pt",
            showLineNumbers: false,
            showGutter: false
        },
        
        user: {
            id: null,
            token: null
        },
        
        message: {
            show: false,
            text: "",
        }
    },
    
    watch: {
        doc: {
            handler () {
                this.render();
            },
            deep: true
        }
    },    
    
    methods: {
        
        async render () {
            const scope = {};
            const html = await engine.render(this.doc.template, scope);
            this.rendering = html;
        },
        
        save () {
            console.log("Saving document ...");
            store.write(location.pathname, this.doc)
            .then(() => {
                this.message.text = "Document saved";
                this.message.show = true;
            });
        },
        
        reload () {
            store.clearCache();
            this.render()
            .then(() => {
                this.message.text = "Document reloaded";
                this.message.show = true;
            });
        },
        
        signin () {
            store.signin();
        },
        
        signout () {
            store.signout();
        },
        
        initEditor () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')                
            require('brace/theme/chrome')
        }
    },
    
    mounted () {
        store.getUser()
        .then((user) => {
            this.user.id = user.id;
        });
        this.render();
    }
});



module.exports = window.olo = {OloDOM, engine, store, vue};
