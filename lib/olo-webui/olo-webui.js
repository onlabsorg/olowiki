
const URL = require("url");
const keyString = require("./utils/key-string");

const Store = require("../olojs/store");
const errors = require("../olojs/errors");

const Vue = require("vue/dist/vue.js");
Vue.use( require("vue-material/dist/components/MdApp").default );
Vue.use( require("vue-material/dist/components/MdToolbar").default );
Vue.use( require("vue-material/dist/components/MdDrawer").default );
Vue.use( require("vue-material/dist/components/MdList").default );
Vue.use( require("vue-material/dist/components/MdSubheader").default );
Vue.use( require("vue-material/dist/components/MdDivider").default );
Vue.use( require("vue-material/dist/components/MdContent").default );
Vue.use( require("vue-material/dist/components/MdButton").default );
Vue.use( require("vue-material/dist/components/MdIcon").default );
Vue.use( require("vue-material/dist/components/MdSnackbar").default );

require('vue-material/dist/vue-material.css');
require('vue-material/dist/theme/default.css');

require('./olo-webui.css');
require('./olo-editor.css');


function OloWebUI (options) {
    
    const store = options.store;
    var doc = store.createDocument(location.pathname, "", undefined);
    
    const oloWebUIComponent = {
    
        template: require('./olo-webui.html'),
        
        components: {
            'olo-viewer': require("./olo-viewer"),
            'olo-editor': () => import(/* webpackChunkName: "olo-editor" */ './olo-editor'),
        },
        
        props: ['href', 'userid'],
        
        data: () => Object({
            
            value: null,
            
            docSource: "",
            
            docTitle: "",
            
            allowedTags: options.allowedTags,
            
            editMode: false,
            
            sourceLanguage: "yaml",
            
            appInfo: {
                version: "0.0.0"
            },
            
            showNavigation: false,
            
            message: {
                show: false,
                text: "",
            }
        }),
        
        computed: {
            
            docURL: function () {
                const url = document.createElement('a');
                url.href = this.href;
                return url;
            },
            
            docPath: function () {
                return this.docURL.pathname;
            },
            
            docSubPath: function () {
                const url = this.docURL;
                return url.hash ? url.hash.substr(1) : undefined;
            },
            
            readOnly: function () {
                const author = doc.get("author");
                return author && author !== "undefined" && author !== this.useId;
            },            
        },
        
        watch: {
            
            "editMode": function () {
                if (this.editMode) {
                    this.docSource = doc.dump( this.docSubPath );
                }
                else {
                    doc.load( this.docSource, this.docSubPath );
                    this.render();
                }
            },
            
            "docSubPath": function (newDocSubPath, oldDocSubPath) {
                if (this.editMode) {
                    doc.load( this.docSource, oldDocSubPath );
                    this.docSource = doc.dump( newDocSubPath );
                } else {
                    this.render();
                }
            }            
        },    
        
        methods: {
            
            async load () {
                
                try {
                    doc = await store.readDocument(this.docPath);
                } 
                catch (error) {
                    if (error instanceof errors.DocumentNotFoundError) {
                        doc = store.createEmptyDocument(this.docPath);
                        doc.set("author", this.userid);
                        
                    } else {
                        doc = store.createErrorDocument(this.docPath, error);
                        this.showMessage("Server error (see console).");
                    }                
                }
            },
            
            async render () {
                if (this.editMode) return;
                this.docTitle = doc.get("title");  
                try {
                    this.value = await doc.evaluate( this.docSubPath || "index" );
                }          
                catch (error) {
                    this.value = error;
                }
            },
            
            save () {
                if (this.editMode) {
                    doc.load(this.docSource);
                }
                
                store.writeDocument(this.docPath, doc)
                .then(() => {
                    this.showMessage("Document saved");
                })
                .catch((err) => {
                    this.showMessage(err.message);
                });
            },
            
            showMessage (message) {
                this.message.text = String(message);
                this.message.show = true;                                
            },
            
            signin () {
                this.$emit('signin');
            },
            
            signout () {
                this.$emit('signout');
            }
        },
        
        async mounted () {
                    
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
