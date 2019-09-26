<template>
    <div class="olowiki-root">
        <olowiki-app title="olowiki" @key="handleKeyboardCommand">
            
            <md-icon slot="logo" md-src="/olowiki.svg"></md-icon>
            <md-button slot="button" class="md-icon-button" @click="userDialog.show = true">
                <md-icon>person</md-icon>
            </md-button>
            
            <div slot="content" class="content">

                <store-card name="doc" title="Documentation">
                    <article slot="content">
                        
                        <p> The <em>doc</em> store contains documentation about
                            this <em>olowiki</em> node. If you want to know about
                            the purpose of this node or how to contribute to it, 
                            you should start with reading <a href="/doc/index">/doc/index</a>.
                            If you instead want to knwo what <em>olowiki</em> is
                            and how it works, see <a href="/man/index">/man/index</a>.
                            </p>
                            
                        <p> This is a public store, which means that anyone can 
                            read the documents it contains, but only the owner
                            of the node can update them.
                            </p>
                            
                    </article>
                </store-card>

                <store-card name="lib" title="Public library">
                    <article slot="content">
                        
                        <p> The <em>lib</em> store contains the documents publicly
                            offered by this node. These documents can be used by
                            anyone (contributors or not, or evan by other nodes)
                            as they are or as building blocks for new documents. 
                            </p>
                            
                        <p> This is a public store, which means that anyone can 
                            use the documents it contains, but only the owner
                            of the node can update them.
                            </p>
                            
                    </article>
                </store-card>

                <store-card name="users" title="Contributions">
                    <article slot="content">
                        <p> This store contains the documents contributed to this
                            node by its team members. Document contributions can
                            be spontaneous or planned within projects aimed to
                            produce a public library. </p>
                            
                        <p v-if="user !== 'Guest'"> You are currently identifying 
                            yourself as <b>{{user}}</b>, and your personal public 
                            container is <a :href="'/users/'+user+'/'">/users/{{user}}/</a>.
                            The documents you put in there can be read by anyone
                            but modifyied only by you.
                            </p>

                        <p v-if="user === 'Guest'"> This node is open to anyone 
                            who wants to contribute: all you need to do to become 
                            a contributor is obtain an identity token by clicking on
                            the top-right user icon. With your token you will be
                            able to access your own public container under this
                            store.
                            </p>
                    </article>
                </store-card>

                <store-card name="local" title="Private">
                    <article slot="content">
                        <p> The <em>local</em> store lives on your machine and
                            is your private offline store. Currently you get one 
                            different local store on each of your devices, but 
                            synchronization will be implemented in the future.
                            </p>
                    </article>
                </store-card>

                <store-card name="bin" title="Standard library">
                    <article slot="content">
                        
                        <p> The <em>bin</em> store contains standard libraries
                            that you can use to develop your own documents. All the
                            node implementing <em>olowiki</em> share the same <em>bin</em>
                            store, ensuring compatibility between stores.
                            </p>
                            
                        <p> This is a static store part of the olowiki distribution,
                            which means that anyone can read the documents it contains, 
                            but it gest uptated only with new versions of the app.
                            </p>
                            
                    </article>
                </store-card>

                <store-card name="man" title="Manual">
                    <article slot="content">
                        
                        <p> The <em>man</em> store contains documentation about
                            <em>olowiki</em> and how to use it. If you want to 
                            learn <em>olowiki</em>, you should start with the 
                            <a href="/man/index">/man/index</a> document.
                            </p>
                            
                        <p> This is a static store part of this olowiki distribution,
                            which means that anyone can read the documents it contains, 
                            but it gest uptated only with new versions of the app.
                            </p>
                            
                    </article>
                </store-card>

                <div class="appinfo footer">
                    <p><b>olo-wiki</b> version {{version}}</p>
                    <p>Copyright (C) 2019 <a href="mailto:m.delbuono@gmail.com">Marcello Del Buono</a></p>
                </div>
                
            </div>            


        </olowiki-app>
        
        <md-dialog :md-active.sync="userDialog.show">
            <md-dialog-title>User</md-dialog-title>
            <md-tabs>
                <md-tab md-label="Token">
                    <p v-if="user !== 'Guest'"> You are currently identifying yourself as <b>{{user}}</b>
                        via the following token.
                        </p>
                    <p v-if="user === 'Guest'"> You are currently not identifying 
                        yourself as olowiki user; paste below your identity 
                        token and save it on this machine, or request one.
                        </p>
                    <md-field>
                        <label>Token</label>
                        <md-textarea v-model="token"></md-textarea>
                        </md-field>
                    <md-dialog-actions>
                        <md-button class="md-primary" @click="storeToken">Save Token</md-button>
                        <md-button class="md-primary" @click="clearToken">Clear Token</md-button>
                        <md-button class="md-primary" @click="userDialog.show = false">Close</md-button>
                    </md-dialog-actions>
                </md-tab>
                <md-tab md-label="Request Token">
                    <p>Fill in your e-mail address and send a token to yourself.</p>
                    <md-field>
                        <label>e-mail</label>
                        <md-input v-model="userDialog.email" type="email"></md-input>
                    </md-field>
                    <md-dialog-actions>
                        <md-button class="md-primary" @click="requestToken">Send</md-button>
                        <md-button class="md-primary" @click="userDialog.show = false">Close</md-button>
                    </md-dialog-actions>
                </md-tab>
            </md-tabs>
        </md-dialog>
    </div>        
</template>

<script>
    const olojs = require("olojs");
    const client = require("../lib/client");

    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdCard").default );
    Vue.use( require("vue-material/dist/components/MdContent").default );
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdField").default );
    Vue.use( require("vue-material/dist/components/MdDialog").default );
    Vue.use( require("vue-material/dist/components/MdTabs").default );
    // Vue.use( require('vue-async-computed').default );

    module.exports = {
        
        components: {
            'olowiki-app': require("./app.vue").default,            
            'store-card': require("./store-card.vue").default
        },
        
        data: () => ({
            token: client.getToken(),
            user: "Guest",
            userDialog: {
                show: false,
                email: ""
            }
        }),  
        
        computed: {
            
            version () {
                const metaElt = document.querySelector(`head meta[name="version"]`);
                return metaElt ? metaElt.getAttribute("content") : "unknown";
            },
            
            rsStore () {
                return client.rsStore;
            }                    
        },
        
        // asyncComputed: {},
                
        methods: {
            
            showMessage (content) {
                this.$emit('message', content);
            },
            
            async requestToken () {
                const userId = this.userDialog.email;
                this.userDialog.show = false;
                try {
                    await client.requestToken(userId);
                } catch (error) {
                    this.showMessage(`Failed: ${error.message}`);
                }
                this.showMessage(`Identification token sent to ${userId}`);
            },

            storeToken () {
                client.setToken(this.token);
                this.updateUser();
                this.showMessage("Identity token stored on this machine.")
            },

            clearToken () {
                client.setToken("");
                this.token = "";
                this.updateUser();
                this.showMessage("Identity token removed from this machine.")                
            },
            
            async updateUser () {
                this.user = await client.getUser();
            },
            
            handleKeyboardCommand (event) {
                switch (event.keyString) {}
            }            
        },
        
        mounted () {
            this.updateUser();
        }
    };
</script>

<style>
    .olowiki-app .md-app-scroller, .olowiki-app .md-content {
        background-color: #F5F5F5;
    }

    .olowiki-root div.content {
        margin: 2em 10% 2em 10%;
    }

    .store-card {
        margin-bottom: 1em;
    }
    
    .olowiki-root #remotestorage-widget {
        position: static;
    }
    
    .olowiki-root .rs-widget {
        box-shadow: none;
    }

    .olowiki-root .footer {
        font-size: 0.8em;
        text-align: center;
        color: rgba(21, 21, 21, 0.5);
        padding: 1em;
    }    

    .olowiki-root .footer p {
        margin: 0.4em 0 0.4em 0;
    }

</style>
