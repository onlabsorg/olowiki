
const queryString = require('query-string');
const URL = require("url");

const Vue = require("vue/dist/vue.js");

const VueMaterial = require("vue-material/dist/vue-material.min.js");
Vue.use(VueMaterial.default);

require('vue-material/dist/vue-material.css');
require('vue-material/dist/theme/default.css');

require('./olo-ui.css');


module.exports = (doc, store) => Object({
    
    template: require('./olo-ui.html'),
    
    components: {
        'ace-editor': () => import(/* webpackChunkName: "editor" */ 'vue2-ace-editor'),
    },
    
    data: () => Object({
        
        doc: doc,
        
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
    }),
    
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
            this.rendering = await this.doc.renderTemplate(scope);
        },
        
        save () {
            const token = getToken();
            const url = URL.parse(location.href);
            store.setDocument(url.pathname, this.doc, token)
            .then(() => {
                this.message.text = "Document saved";
                this.message.show = true;
            })
            .catch((err) => {
                console.dir(err);
                this.message.text = String(err);
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
            localStorage.setItem('callbackURL', location.origin + location.pathname);
            const anchor = document.createElement('a');
            anchor.href = "/auth/google";
            anchor.click();
        },
        
        async signout () {
            const token = getToken();
            
            const response = await fetch('/auth/google/revoke', {
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${token}`,            
                }
            });
            if (!response.ok) {
                let err = await response.text();
                throw new Error(err);
            }
            location.href = location.origin + location.pathname;
        },
        
        initEditor () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')                
            require('brace/theme/chrome')
        }
    },
    
    mounted () {
        getUser()
        .then((user) => {
            this.user.id = user.id;
        });
        this.render();
    }
});



function getToken () {
    const query = queryString.parse(location.search);
    return query.user;
}


async function getUser () {
    const token = getToken();
    
    const response = await fetch('/user', {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`,            
        }
    });
    if (!response.ok) {
        let err = await response.text();
        throw new Error(err);
    }
    else {
        let user = await response.json();
        return user;
    }
}
