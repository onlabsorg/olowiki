
const store = require('./client/store');

const Document = require("./client/document");
const doc = Document.parse(window.document);

const Vue = require("Vue");
const OloDocument = require('./client/view/olo-document');

const rootElt = document.createElement('div');
rootElt.id = "app";
rootElt.innerHTML = require("./client.html!text");
document.body.appendChild(rootElt);

const vue = new Vue({
    
    el: "#app",
    
    data: {
        
        user: {
            id: null,
            token: null
        },
        
        loginDialog: {
            show: false,
            userId: null,
            password: null
        },
        
        signupDialog: {
            show: false,
            userId: null,
            password: null
        },

        preferencesDialog: {
            show: false,
        },
        
        snackbars: {
            showLoggedIn: false,
            showLoginFailed: false,
        }
    },
    
    components: {
        'olo-document': OloDocument(doc)
    },
    
    methods: {
        
        signin () {
            store.signin();
        },
        
        signout () {
            store.signout();
        },
        
        applyPreferences () {
            console.log("Applying preferences:", this.preferencesDialog);
            this.preferencesDialog.show = false;
        }
    },
    
    mounted () {
        store.getUser()
        .then((user) => {
            this.user.id = user.id;
        });
    }
});


window.olo = {
    document: doc,
    vue: vue
}
