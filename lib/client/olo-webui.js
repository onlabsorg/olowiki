
const URL = require("url");
const keyString = require("./utils/key-string");

const Store = require("../olojs/store");
const errors = require("../olojs/errors");

const Vue = require("vue/dist/vue.js");
Vue.use( require("vue-material/dist/components/MdApp").default );
Vue.use( require("vue-material/dist/components/MdToolbar").default );
Vue.use( require("vue-material/dist/components/MdDialog").default );
Vue.use( require("vue-material/dist/components/MdTabs").default );
Vue.use( require("vue-material/dist/components/MdContent").default );
Vue.use( require("vue-material/dist/components/MdButton").default );
Vue.use( require("vue-material/dist/components/MdIcon").default );
Vue.use( require("vue-material/dist/components/MdSnackbar").default );
Vue.use( require("vue-material/dist/components/MdTooltip").default );

require('vue-material/dist/vue-material.css');
require('vue-material/dist/theme/default.css');

require('./olo-webui.css');
require('./olo-editor.css');


function OloWebUI (options) {
    
    const store = options.store;
    const auth = options.auth;
    
    var doc = store.createDocument(location.href, "", undefined);
    
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
            
            allowedTags: options.allowedTags,
            
            editMode: false,
            
            user: {
                id: null,
                token: null
            },
            
            appInfo: {
                version: "0.0.0"
            },
            
            dialog: {
                show: false,
                tabId: "info"
            },
            
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
            },
            
            "dialog.show": function () {
                if (this.dialog.show) this.dialog.tabId = "info";
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
                doc.updateContent(this.docData.source);
            },
            
            async render () {
                if (this.editMode) return;
                
                this.docData.title = doc.data.title;
                
                const path = location.hash ? location.hash.substr(1) : "render";
                this.docData.html = await doc.render(path);
            },
            
            save () {
                if (this.editMode) return;
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
            
            dialogTabChanged (tabId) {
                this.dialog.tabId = tabId;
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
            
            window.addEventListener("hashchange", (event) => {
                this.render();
            });
            
            this.render();
        }
    }
    
    return oloWebUIComponent;
}

module.exports = OloWebUI;
