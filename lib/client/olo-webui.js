
const URL = require("url");
const keyString = require("./utils/key-string");

const Store = require("../olojs/store");
const errors = require("../olojs/errors");

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
Vue.use( require("vue-material/dist/components/MdTooltip").default );

require('vue-material/dist/vue-material.css');
require('vue-material/dist/theme/default.css');

require('./olo-webui.css');


module.exports = (store, auth) => Object({
    
    template: require('./olo-webui.html'),
    
    components: {
        'olo-viewer': require("./olo-viewer"),
        'olo-editor': () => import(/* webpackChunkName: "olo-editor" */ './olo-editor'),
    },
    
    props: ['href'],
    
    data: () => Object({
        
        doc: store.createDocument({}),
        
        html: "",
        
        user: {
            id: null,
            token: null
        },
        
        appInfo: {},
        
        editMode: false,
        
        showAppMenu: false,
        
        message: {
            show: false,
            text: "",
        }
    }),
    
    computed: {
        readOnly: function () {
            return this.doc.author && this.doc.author !== "undefined" && this.doc.author !== this.user.id            
        }
    },
    
    watch: {
        
        "doc.template": function () {
            this.render();
        },
        
        "doc.title": function () {
            document.head.querySelector("title").innerHTML = this.doc.title;
        },
        
        "editMode": function () {
            this.render();
        }
    },    
    
    methods: {
        
        async load () {
            
            try {
                this.doc = await store.readDocument(this.href, auth.getToken());
            } 
            catch (error) {
                if (error instanceof errors.DocumentNotFoundError) {
                    this.doc = store.createEmptyDocument(this.user.id);
                    
                } else {
                    this.doc = store.createErrorDocument(error);
                    this.message.text = "Server error (see console).";
                    this.message.show = true;                    
                }                
            }
        },
        
        async render () {
            if (this.editMode) return;
            const context = {};
            const content = await this.doc.render(context);
            this.html = String(content);
        },
        
        save () {
            const token = auth.getToken();
            const url = URL.parse(location.href);
            store.writeDocument(url.pathname, this.doc, token)
            .then(() => {
                this.message.text = "Document saved";
                this.message.show = true;
            })
            .catch((err) => {
                this.message.text = String(err);
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
    
    async mounted () {
                
        const userInfo = await auth.getInfo()
        this.user.id = userInfo.id;
        
        const infoResponse = await fetch("/info");
        this.appInfo = await infoResponse.json();
        
        await this.load();
        
        document.body.addEventListener("keydown", (event) => {
            const keyStr = keyString(event);
            switch (keyStr) {
                
                case "ctrl-s":
                    event.preventDefault();
                    if (!this.readOnly) {
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
