
const URL = require("url");
const keyString = require("./utils/key-string");

const Store = require("../olojs/store");
const Document = require("../olojs/document");
const newDocumentTemplate = require("./new-document.xml");
const errorDocumentTemplate = require("./error-document.xml");

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

require('./olo-document.css');


module.exports = (store, auth) => Object({
    
    template: require('./olo-document.html'),
    
    components: {
        'olo-sandbox': require("./olo-sandbox"),
        'olo-editor': () => import(/* webpackChunkName: "olo-editor" */ './olo-editor'),
    },
    
    props: ['href'],
    
    data: () => Object({
        
        doc: {
            title: "",
            author: null,
            public: false,
            readOnly: true,            
            template: "",
            html: ""
        },
        
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
    
    watch: {
        
        "doc.title": function () {
            if (!this._doc) return;
            this._doc.title = this.doc.title;
        },
        
        "doc.author": function () {
            if (!this._doc) return;
            this._doc.author = this.doc.author;
        },
        
        "doc.public": function () {
            if (!this._doc) return;
            this._doc.public = this.doc.public;
        },
        
        "doc.template": function () {
            if (!this._doc) return;
            this._doc.template = this.doc.template;
            this.render();
        },
        
        "editMode": function () {
            this.render();
        }
    },    
        
    methods: {
        
        async load () {
            try {
                this._doc = await store.readDocument(this.href, auth.getToken());
            } 
            catch (error) {
                if (error instanceof Store.DocumentNotFoundError) {
                    let xml = newDocumentTemplate.replace("{{author}}", this.user.id);
                    this._doc = new Document(xml);
                } else {
                    let xml = errorDocumentTemplate.replace("{{error}}", error);
                    this._doc = new Document(xml);
                    this.message.text = "Server error (see console).";
                    this.message.show = true;                    
                }                
            }
            document.head.querySelector("title").innerHTML = this._doc.title;
            this.doc.readOnly = this._doc.author && this._doc.author !== "undefined" && this._doc.author !== this.user.id;
            this.doc.title = this._doc.title;
            this.doc.author = this._doc.author;
            this.doc.public = this._doc.public;
            this.doc.template = this._doc.template;            
            
        },
        
        async render () {
            if (!this._doc) return;
            if (this.editMode) return;
            const context = {};
            const content = await this._doc.render(context);
            this.doc.html = content.toString(false);
        },
        
        save () {
            const token = auth.getToken();
            const url = URL.parse(location.href);
            store.writeDocument(url.pathname, this._doc, token)
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
                    if (!this.doc.readOnly) {
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
