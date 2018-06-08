
const URL = require("url");

const user = require('./user');

const Vue = require("vue/dist/vue.js");
Vue.use( require("vue-material/dist/components/MdApp").default );
Vue.use( require("vue-material/dist/components/MdToolbar").default );
Vue.use( require("vue-material/dist/components/MdContent").default );
Vue.use( require("vue-material/dist/components/MdField").default );
Vue.use( require("vue-material/dist/components/MdButton").default );
Vue.use( require("vue-material/dist/components/MdIcon").default );
Vue.use( require("vue-material/dist/components/MdMenu").default );
Vue.use( require("vue-material/dist/components/MdList").default );
Vue.use( require("vue-material/dist/components/MdDivider").default );
Vue.use( require("vue-material/dist/components/MdSnackbar").default );

require('vue-material/dist/vue-material.css');
require('vue-material/dist/theme/default.css');

require('./olo-ui.css');


module.exports = (doc, store) => Object({
    
    template: require('./olo-ui.html'),
    
    components: {
        'olo-editor': () => import(/* webpackChunkName: "olo-editor" */ './olo-editor'),
    },
    
    data: () => Object({
        
        doc: doc,
        
        rendering: "",
        
        editMode: false,
        
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
            const context = {};
            this.rendering = await this.doc.renderTemplate(context);
        },
        
        save () {
            const token = user.getToken();
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
            user.signin();
        },
        
        signout () {
            user.signout();
        }
    },
    
    mounted () {
        user.getInfo()
        .then((userInfo) => {
            this.user.id = userInfo.id;
        });
        this.render();
    }
});
