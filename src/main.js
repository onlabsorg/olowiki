
const Vue = require("vue/dist/vue.js");
const domReady = require("./tools/dom-ready");

async function start () {

    await domReady();
    
    const view = new Vue({
        
        el: "olo-wiki",
        
        components: { 
            'olo-wiki': require("./olo-wiki.vue").default,
        },
        
        data: {
            href: location.href,
            version: await getAppVersion()
        },
        
        async mounted () {
            window.addEventListener("hashchange", (event) => {
                this.href = location.href;
            });
        }
    });
}


async function getAppVersion () {
    const response = await fetch("/version");
    return await response.text();
}



start()
.then(()=>{
    console.log("olowiki ready!");
})
.catch((error) => {
    throw error;
});
