
const URL = require("url");
const keyString = require("./utils/key-string");

const Store = require("../olojs/store");
const errors = require("../olojs/errors");

const YAML = require("js-yaml");

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


module.exports = (store, auth) => Object({
    
    template: require('./olo-webui.html'),
    
    components: {
        'olo-viewer': require("./olo-viewer"),
        'olo-editor': () => import(/* webpackChunkName: "olo-editor" */ './olo-editor'),
    },
    
    props: ['href'],
    
    data: () => Object({
        
        doc: store.createDocument(location.href, {}),
        
        html: "",
        
        user: {
            id: null,
            token: null
        },
        
        appInfo: {},
        
        editMode: false,
        
        editorContent: {
            type: "html",
            value: "",
        },
        
        showAppMenu: false,
        
        message: {
            show: false,
            text: "",
        }
    }),
    
    computed: {
        
        readOnly: function () {
            return this.doc.author && this.doc.author !== "undefined" && this.doc.author !== this.user.id            
        },
        
        editorLanguage: function () {
            if (this.editMeta) {
                return "yaml";
            } 
            else switch (this.doc.doctype) {
                case "markdown": return "markdown";
                case "mustache": return "mustache";
                default:         return "html";
            }            
        }
    },
    
    watch: {
        
        "doc.template": function () {
            this.render();
        },
        
        "doc.title": function () {
            document.head.querySelector("title").innerHTML = this.doc.title;
        },
        
        "editMode": function (newMode, oldMode) {            
            this.applyChanges(oldMode);
            
            if (newMode === "template") {
                switch (this.doc.doctype) {
                    case "markdown": this.editorContent.doctype = "markdown"; break;
                    case "mustache": this.editorContent.doctype = "mustache"; break;
                    default:         this.editorContent.doctype = "html"; break;
                }            
                this.editorContent.value = this.doc.template;
            }
            else if (newMode === "settings") {
                this.editorContent.doctype = "yaml";
                let meta = this.doc.toJSON();
                delete meta.template;
                this.editorContent.value = YAML.dump(meta, {
                    indent: 4,
                });                
            }
            else {
                this.render();
            }
            
        }
    },    
    
    methods: {
        
        async load () {
            
            try {
                this.doc = await store.readDocument(location.href, auth.getToken());
            } 
            catch (error) {
                if (error instanceof errors.DocumentNotFoundError) {
                    this.doc = store.createEmptyDocument(location.href, this.user.id);
                    
                } else {
                    this.doc = store.createErrorDocument(location.href, error);
                    this.message.text = "Server error (see console).";
                    this.message.show = true;                    
                }                
            }
        },
        
        async render () {
            if (this.editMode) return;
            const context = {};
            const content = await this.doc.render(context, auth.getToken());
            this.html = String(content);
        },
        
        applyChanges (editMode) {
            if (!editMode) {
                return;
            }
            else if (editMode === "template") {
                this.doc.template = this.editorContent.value;
            }
            else if (editMode === "settings") {
                let meta = Object(YAML.load(this.editorContent.value));
                let keys = Object.keys(this.doc.toJSON());
                for (let key of keys) {
                    if (key !== "template") this.doc[key] = meta[key];
                }                
            }            
        },
        
        save () {
            const token = auth.getToken();
            const url = URL.parse(location.href);
            this.applyChanges(this.editMode);
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
