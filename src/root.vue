<template>
    <div class="olowiki-root">
        <olowiki-app title="olowiki" @key="handleKeyboardCommand">
            
            <md-icon slot="logo" md-src="/olowiki.svg"></md-icon>
            <md-button slot="button" class="md-icon-button" @click="userDialog.show = true">
                <md-icon>person</md-icon>
            </md-button>
            
            <div slot="content" class="content">

                <store-card name="doc">
                    <article slot="content">
                        
                        <p> The <em>doc</em> store contains documentation about
                            <em>olowiki</em> and how to use it. If you want to 
                            learn <em>olowiki</em>, you should start with the 
                            <a href="/doc/index">/doc/index</a> document.
                            </p>
                            
                        <p> This is a static store part of this olowiki distribution,
                            which means that anyone can read the documents it contains, 
                            but it gest uptated only with new versions of the app.
                            </p>
                            
                    </article>
                </store-card>

                <store-card name="lib">
                    <article slot="content">
                        
                        <p> The <em>lib</em> store contains standard libraries
                            that you can use to develop your own documents.
                            For an overview of the <em>lib</em> content, read
                            the <a href="/lib/index">/lib/index</a> document.
                            </p>
                            
                        <p> This is a static store part of this olowiki distribution,
                            which means that anyone can read the documents it contains, 
                            but it gest uptated only with new versions of the app.
                            </p>
                            
                    </article>
                </store-card>

                <store-card name="bin">
                    <article slot="content">
                        
                        <p> The <em>bin</em> store contains standard libraries
                            that you can use to develop your own documents.
                            Unlike the <em>lib</em> store, this store doesn't
                            contain actual documents, but scripts wrapped as
                            documents.
                            </p>
                            
                        <p> This is a static store part of this olowiki distribution,
                            which means that anyone can read the documents it contains, 
                            but it gest uptated only with new versions of the app.
                            </p>
                            
                    </article>
                </store-card>

                <store-card name="users">
                    <article slot="content">
                        <p> Each user can have a folder named after his e-mail
                            address under the <em>users</em> store, where he can
                            publish his documents.
                            </p>
                        <p v-if="user !== 'Guest'"> You are currently identifying 
                            yourself as <b>{{user}}</b>, therefore your public folder is
                            <a :href="'/users/'+user+'/'">/users/{{user}}/</a>.
                            </p>

                        <p v-if="user === 'Guest'"> You are currently not identifying yourself as
                            olowiki user, therefore you don't have access to any public
                            folder.
                            </p>
                    </article>
                </store-card>

                <store-card name="local">
                    <article slot="content">
                        <p> The <em>local</em> store lives on your machine and
                            is your private offline store. Currently you get one 
                            different local store on each of your devices, but 
                            synchronization will be implemented in the future.
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
