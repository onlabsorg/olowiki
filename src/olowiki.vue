<template>
    <div class="olowiki-document">
    
        <olowiki-app appname="olowiki" :title="title" @key="handleKeyboardCommand"  @logo-click="appDialog.show = true">
            
            <md-icon slot="logo" md-src="/olowiki.svg"></md-icon>
            
            <md-list slot="drawer-item">
                
                <md-list-item :href="'#'+grandParentPath" :disabled="parentPath === '/'">
                    <md-icon>arrow_upward</md-icon>
                    <span class="md-list-item-text">Up</span>
                </md-list-item>
                
                <md-list-item v-for="item in siblings" :href="item.href">
                    <md-icon v-if="item.isContainer">folder</md-icon>
                    <md-icon v-else>description</md-icon>
                    <span class="md-list-item-text" :class="{active:item.href === `#${docPath}`}">
                        {{item.name}}
                    </span>
                    <md-button class="md-icon-button md-list-action" :disabled="parentPath === '/'" 
                            @click.prevent="showDeleteDialog(item)">
                        <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>

            <!-- view state -->
                
            <md-button slot="button" v-if="stateIs('view')" class="md-icon-button" @click="save">
                <md-icon>save</md-icon>
            </md-button>
                
            <md-button slot="button" v-if="stateIs('view')" class="md-icon-button" @click="setState('edit')">
                <md-icon>edit</md-icon>
            </md-button>    
            
            <div slot="content" class="olo-viewer" ref="viewer" v-if="stateIs('view')" v-html="html"></div>
            
            
            <!-- edit state -->
                        
            <olo-editor :source.sync="docSource" theme="chrome"
                    slot="content" ref="editor" v-if="stateIs('edit')"></olo-editor>

            <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="commit">
                <md-icon>done</md-icon>
            </md-button>

            <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="setState('view')">
                <md-icon>close</md-icon>
            </md-button>
            
            
            <!-- empty states -->
            
            <md-empty-state slot="content" v-if="stateIs('error')" md-icon="error" md-label="Error!" :md-description="errorMessage"></md-empty-state>
                        
        </olowiki-app>
        
        <md-dialog :md-active.sync="appDialog.show">
            <md-dialog-title>olowiki</md-dialog-title>
            <md-tabs>
                <md-tab md-label="Info" md-icon="info">
                    <p>This is olowiki v{{version}}, a minimalistic wiki based on 
                        <a href="https://github.com/onlabsorg/olojs/blob/master/README.md">olojs</a>,
                        a distributed content management framework.</p>
                    <md-dialog-actions>
                        <md-button class="md-primary" href="#/index" @click="appDialog.show = false">Read more</md-button>
                        <md-button class="md-primary" @click="appDialog.show = false">Close</md-button>
                    </md-dialog-actions>
                </md-tab>
                <md-tab md-label="User" md-icon="person">
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
                        <md-button class="md-primary" @click="appDialog.show = false">Close</md-button>
                    </md-dialog-actions>
                </md-tab>
                <md-tab md-label="Request Token" md-icon="email">
                    <p>Fill in your e-mail address and send a token to yourself.</p>
                    <md-field>
                        <label>e-mail</label>
                        <md-input v-model="appDialog.email" type="email"></md-input>
                    </md-field>
                    <md-dialog-actions>
                        <md-button class="md-primary" @click="requestToken">Send</md-button>
                        <md-button class="md-primary" @click="appDialog.show = false">Close</md-button>
                    </md-dialog-actions>
                </md-tab>
            </md-tabs>
        </md-dialog>  
        
        <md-dialog :md-active.sync="deleteDialog.show">
            <md-dialog-title>Delete {{deleteDialog.path}}</md-dialog-title>
            <md-dialog-content>
                <p>Do you want to <strong>permanently</strong> delete this resource?</p>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="deleteItem(deleteDialog.path)">Yes</md-button>
                <md-button class="md-primary" @click="deleteDialog.show = false">No</md-button>
            </md-dialog-actions>
        </md-dialog>              
    </div>
    
</template>

<script>
    const errors = require("./errors");

    const olonv = require("./olowiki-environment");
    olonv.document = {};

    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdSubheader").default );
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdEmptyState").default );
    Vue.use( require("vue-material/dist/components/MdField").default );
    Vue.use( require("vue-material/dist/components/MdDialog").default );
    Vue.use( require("vue-material/dist/components/MdTabs").default );   
    Vue.use( require("vue-material/dist/components/MdList").default );     
    Vue.use( require("vue-async-computed") );
    
    module.exports = {
        
        components: {
            'olowiki-app': require("./app.vue").default,            
            'olo-editor': require("olo-editor")
        },
        
        props: ['src'],
        
        data: () => Object({
            state: "view",
            errorMessage: "",
            docPath: "",
            docSource: "",
            siblings: [],
            argns: {},
            token: olonv.getToken(),
            user: "Guest",
            appDialog: {
                show: false,
                email: ""
            },
            deleteDialog: {
                show: false,
                path: ""
            }            
        }),  
        
        computed: {
            version: function () {
                const metaElt = document.querySelector(`head meta[name="version"]`);
                return metaElt ? metaElt.getAttribute("content") : "unknown";
            },
            
            parentPath () {
                return this.docPath.split("/").slice(0,-1).join("/") + "/";
            },
            
            grandParentPath () {
                return this.docPath.split("/").slice(0,-2).join("/") + "/";
            },
            
            title () {
                if (this.docNS) {
                    let title = this.docNS.title;
                    if (typeof title === "string") return title;
                }
                return this.docPath;                 
            },   
        },
        
        asyncComputed: {
            
            docNS: async function () {
                const context = olonv.createContext(this.docPath, {argns:this.argns});
                const evaluate = olonv.parseDocument(this.docSource);
                olonv.document.namespace = await evaluate(context);
                return olonv.document.namespace;
            },
            
            html: async function () {
                return await olonv.stringifyDocumentExpression(this.docNS);
            },            
        },
        
        watch: {
            src: async function (newSrc, oldSrc) {
                await this.refresh();
                await this.updateSiblings();
            },
        },
        
        methods: {
            
            async refresh (forceReload=false) {
                try {
                    let [docPath, argns] = olonv.parseURI(this.src);
                    if (docPath.slice(-1) === "/") {
                        this.docPath = docPath + "index";                        
                    }
                    if (docPath !== this.docPath || forceReload) {
                        this.docPath = docPath;
                        this.docSource = await olonv.readDocument(this.docPath);
                    }
                } catch (error) {
                    console.error(error);
                    this.setState("error");
                    this.errorMessage = error.message;
                    this.docSource = "";                                        
                }
            },
            
            async save () {
                try {
                    await olonv.writeDocument(this.docPath, this.docSource);
                    await this.updateSiblings();
                    this.showMessage("Saved");
                } catch (error) {
                    if (error instanceof errors.WriteAccessDenied) {
                        this.showMessage("Not saved: write access denied");
                    } else {
                        this.showMessage("Not saved: an error occurred while saving");
                    }
                }
            },
            
            commit () {
                this.$refs.editor.commit();
                this.setState("view");
            },
            
            showMessage (content) {
                this.$emit('message', content);
            },

            setState (state) {
                this.state = state;
            },
            
            stateIs (state) {
                return this.state === state;
            },
            
            stateIn (...states) {
                return states.indexOf(this.state) !== -1;
            },
            
            async requestToken () {
                const userId = this.appDialog.email;
                this.appDialog.show = false;
                try {
                    await olonv.requestToken(userId);
                } catch (error) {
                    this.showMessage(`Failed: ${error.message}`);
                }
                this.showMessage(`Identification token sent to ${userId}`);
            },

            storeToken () {
                olonv.setToken(this.token);
                this.updateUser();
                this.showMessage("Identity token stored on this machine.")
            },

            clearToken () {
                olonv.setToken("");
                this.token = "";
                this.updateUser();
                this.showMessage("Identity token removed from this machine.")                
            },
            
            async updateUser () {
                this.user = await olonv.getUser();
                console.log(this.user);
            },     
            
            async updateSiblings () {
                const parentContainer = await olonv.loadDocument(this.parentPath);
                const itemPaths = parentContainer.items || [];
                const containers = [];
                const documents = [];
                const itemNames = new Set();
                for (let itemPath of itemPaths) {
                    let item = this.parseContainerItem(itemPath);
                    if (!itemNames.has(item.name)) {
                        itemNames.add(item.name);
                        if (item.isContainer) containers.push(item);
                        else documents.push(item);
                    }
                }
                this.siblings = containers.concat(documents).filter(sib => sib.name[0] !== ".");
            },               

            parseContainerItem (itemPath) {
                const item = {};
                item.isContainer = itemPath.indexOf("/") !== -1;
                item.name = itemPath.split('/')[0];
                item.href = `#${this.parentPath}${item.name}` + (item.isContainer ? "/" : "");
                return item;
            },
            
            showDeleteDialog (item) {
                this.deleteDialog.path = item.href.slice(1);
                this.deleteDialog.show = true;
            },
            
            async deleteItem (itemPath) {
                this.deleteDialog.show = false;
                try {
                    await olonv.deleteDocument(itemPath);
                    await this.refresh(true);
                    await this.updateSiblings();
                    this.showMessage(`Deleted ${itemPath}`);
                } catch (error) {
                    console.error(error);
                    this.showMessage("Delete operation failed!");
                }
            },            

            handleKeyboardCommand (event) {
                if (this.stateIs('view')) switch (event.keyString) {
                    
                    case "Ctrl+S":
                        event.preventDefault();
                        this.save();
                        break;
                        
                    case "Ctrl+Return":
                        this.setState('edit');
                        break;

                    case "Esc":
                        if (this.stateIs('edit')) {
                            this.setState('view');
                        }
                        break;
                    
                    default:
                        break;
                }

                else if (this.stateIs('edit')) switch (event.keyString) {
                    
                    case "Ctrl+S":
                        event.preventDefault();
                        this.$refs.editor.commit();
                        this.save();
                        break;
                        
                    case "Ctrl+Return":
                        this.commit();
                        break;

                    case "Esc":
                        this.setState('view');
                        break;
                    
                    default:
                        break;                        
                }
            }
        },
        
        async mounted () {
            await this.updateUser();
            await this.refresh();
            await this.updateSiblings();
        }
    };
</script>

<style>
    @import "typography.css";

    .md-list-item .active {
        font-weight: bold;
        color: #1976D2;
    }

    .olo-viewer {
        display: block;
        padding: 2em 2em 2em 2em;
    }
    
    @media (max-width: 480px) { 
        .olo-viewer {
            padding-left: 3%;
            padding-right: 3%;
        }
    }    

    .olo-viewer .error {
        font-family: monospace;
        color: yellow;
        background-color: red;
        padding-left: 1em;
        padding-right: 1em;
    }
            
</style>
