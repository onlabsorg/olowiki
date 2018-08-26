
const olo = window.olo = {};

const Store = require("./client/store");
const OloWebUI = require("./olo-webui/olo-webui.js");

require("./client.css");

const Vue = require("vue/dist/vue.js");
const queryString = require('query-string');


function domReady () {
    return new Promise( (resolve, reject) => {
        document.addEventListener("DOMContentLoaded", resolve);
    });
}


async function getUser () {
    const query = queryString.parse(location.search);
    const token = query.user ? query.user : localStorage.getItem('token');

    var userId;
    const response = await fetch('/user', {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`,            
        }
    });
    if (response.ok) {
        let user = await response.json();
        return {
            id: user.id,
            token: token
        };
    } else {
        return {
            id: null,
            token: null
        }
    }    
}


function getStore (user) {
    const host = location.protocol + "//" + location.host;
    return new Store(host, user.token);
}



async function startOloWiki () {

    await domReady();
    const user = await getUser();
    const store = getStore(user);
    
    return new Vue({
        
        el: "olo-webui",
        
        components: { 
            'olo-webui': OloWebUI({
                store: store, 
                user: user,
                allowedTags: require("./client/allowed-tags"),
            })
        },
        
        data: {
            docHREF: location.href,
        },
        
        methods: {
            
            signin () {
                localStorage.setItem('callbackURL', location.origin + location.pathname);
                const anchor = document.createElement('a');
                anchor.href = "/auth/google";
                anchor.click();
            },  
            
            async signout () {
                const token = this.user.token;
                
                const response = await fetch('/auth/google/revoke', {
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${token}`,            
                    }
                });
                if (response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('query');
                    location.href = location.origin + location.pathname;
                } else {
                    let err = await response.text();
                    throw new Error(err);                    
                }
            },                  
        },
        
        async mounted () {
            window.addEventListener("hashchange", (event) => {
                this.docHREF = location.href;
            });
        }    
    });        
}

startOloWiki()
.then((olowiki) => {
    window.olo.wiki = olowiki;
    console.log("olowiki started");
})
