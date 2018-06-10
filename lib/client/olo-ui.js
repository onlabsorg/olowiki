
const URL = require("url");
const keyString = require("./utils/key-string");

const auth = require('./auth');

const Vue = require("vue/dist/vue.js");
Vue.use( require("vue-material/dist/components/MdApp").default );
Vue.use( require("vue-material/dist/components/MdToolbar").default );
Vue.use( require("vue-material/dist/components/MdDrawer").default );
Vue.use( require("vue-material/dist/components/MdSubheader").default );
Vue.use( require("vue-material/dist/components/MdContent").default );
Vue.use( require("vue-material/dist/components/MdField").default );
Vue.use( require("vue-material/dist/components/MdButton").default );
Vue.use( require("vue-material/dist/components/MdIcon").default );
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
        
        user: {
            id: null,
            token: null
        },
        
        saved: true,
        
        readOnly: true,
        
        editMode: false,
        
        showMenu: false,
        
        message: {
            show: false,
            text: "",
        }
    }),
    
    watch: {
        doc: {
            handler () {
                this.saved = false;
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
            const token = auth.getToken();
            const url = URL.parse(location.href);
            store.setDocument(url.pathname, this.doc, token)
            .then(() => {
                this.saved = true;
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
            auth.signin();
        },
        
        signout () {
            auth.signout();
        }
    },
    
    mounted () {
        
        auth.getInfo()
        .then((userInfo) => {
            this.user.id = userInfo.id;
            this.readOnly = doc.author !== userInfo.id;
        });
        
        document.body.addEventListener("keydown", (event) => {
            const keyStr = keyString(event);
            switch (keyStr) {
                case "ctrl-s":
                    event.preventDefault();
                    if (!(this.saved || this.readOnly)) {
                        this.save();
                    }
                    break;
                case "ctrl-e":
                    event.preventDefault();
                    this.editMode = !this.editMode;
                    break;
                case "alt-ctrl-r":
                    this.reload();
                    break;
            }
        });
        
        this.render();
    }
});
