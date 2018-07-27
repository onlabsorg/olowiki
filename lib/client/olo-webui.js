
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
require('./olo-editor.css');


function OloWebUI (options) {
    
    const store = options.store;
    const auth = options.auth;
    
    var doc = store.createDocument(location.href, "");
    
    const oloWebUIComponent = {
    
        template: require('./olo-webui.html'),
        
        components: {
            'olo-viewer': require("./olo-viewer"),
            'olo-editor': () => import(/* webpackChunkName: "olo-editor" */ './olo-editor'),
        },
        
        props: ['href'],
        
        data: () => Object({
            
            docData: {
                title: "",
                html: "",
                source: ""
            },
            
            editMode: false,
            
            user: {
                id: null,
                token: null
            },
            
            appInfo: {},
            
            showAppMenu: false,
            
            message: {
                show: false,
                text: "",
            }
        }),
        
        computed: {
            
            readOnly: function () {
                return doc.author && doc.author !== "undefined" && doc.author !== this.user.id            
            },            
        },
        
        watch: {
            
            "editMode": function (newMode, oldMode) {            
                if (this.editMode) {
                    this.docData.source = String(doc);
                }
                else {
                    this.applyChanges();
                    this.render();
                }
            }
        },    
        
        methods: {
            
            async load () {
                
                try {
                    doc = await store.readDocument(location.href, auth.getToken());
                } 
                catch (error) {
                    if (error instanceof errors.DocumentNotFoundError) {
                        doc = store.createEmptyDocument(location.href, this.user.id);
                        
                    } else {
                        doc = store.createErrorDocument(location.href, error);
                        this.message.text = "Server error (see console).";
                        this.message.show = true;                    
                    }                
                }
            },
            
            applyChanges () {
                doc = store.createDocument(doc.url, this.docData.source)
            },
            
            async render () {
                if (this.editMode) return;
                const content = await doc.render();
                this.docData.html = String(content);
                this.docData.title = doc.data.title;
            },
            
            save () {
                const token = auth.getToken();
                const url = URL.parse(location.href);
                this.applyChanges();
                store.writeDocument(url.pathname, doc, token)
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
                        
                }
            });
            
            this.render();
        }
    }
    
    return oloWebUIComponent;
}

module.exports = OloWebUI;
