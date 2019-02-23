<template>
    <olo-webui class="olo-wiki" :message="message" logo="/olowiki.svg" @key-command="handleKeyCommand">

        <!-- CONTENT -->
        
        <oloml-viewer slot="content" 
                      :source="source" 
                      :path="fragmentPath"
                      v-if="mode === 'view'">
                  </oloml-viewer>    
        
        <oloml-editor slot="content" 
                      v-model="source" 
                      width="100%" height="100%" 
                      theme="chrome" 
                      v-if="mode === 'edit'">
                  </oloml-editor>

        <md-empty-state slot="content"
                        md-icon="error_outline"
                        md-label="Error!"
                        :md-description="errorMessage"
                        v-if="mode === 'error'">
                    </md-empty-state>

        <md-empty-state slot="content"
                        md-icon="devices_other"
                        md-label="Not found"
                        md-description="This document doesn't exist yet."
                        v-if="mode === 'notFound'">
                        
            <md-button class="md-primary md-raised">Create document</md-button>
        </md-empty-state>
                

        <!-- MENU -->
                
        <md-button slot="menu-item" class="md-icon-button" @click="showInfo = true">
            <md-icon>info</md-icon>
            <md-tooltip md-direction="left">Info</md-tooltip>
        </md-button>

        <md-button slot="menu-item" class="md-icon-button" @click="showUserDialog">
            <md-icon>person</md-icon>
            <md-tooltip md-direction="left">{{userId || 'Not logged in'}}</md-tooltip>
        </md-button>

        <md-button slot="menu-item" class="md-icon-button" :disabled="!changed || !editable" @click="save" v-if="mode==='view' || mode==='edit'">
            <md-icon>save</md-icon>
            <md-tooltip md-direction="left">Save [ctrl-s]</md-tooltip>
        </md-button>
        
        <md-button slot="menu-item" class="md-icon-button" @click="toggleEdit" v-if="mode === 'view'">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="left">Edit [ctrl-enter]</md-tooltip>
        </md-button>
        
        <md-button slot="menu-item" class="md-icon-button" @click="toggleEdit" v-if="mode === 'edit'">
            <md-icon>done</md-icon>
            <md-tooltip md-direction="left">Done editing [ctrl-enter]</md-tooltip>
        </md-button>

        
        <!-- USER DIALOG -->
        
        <md-dialog :md-active.sync="userDialog.show">
            
            <md-dialog-title>User</md-dialog-title>
            
            <md-content class="dialog-content">
                <md-field>
                    <label>e-mail address</label>
                    <md-input v-model="userDialog.email" placeholder="e-mail"></md-input>
                </md-field>
                <md-field>
                    <label>Identity token</label>
                    <md-textarea v-model="userDialog.token" placeholder="token"></md-textarea>
                </md-field>
                <md-switch v-model="userDialog.save" class="md-primary">Save the token on this computer</md-switch>
            </md-content>
            
            <md-dialog-actions>
                <md-button class="md-primary" @click="generateToken">Generate Toekn</md-button>
                <md-button class="md-primary" @click="applyUser">Apply</md-button>
                <md-button class="md-primary" @click="userDialog.show = false">Close</md-button>
            </md-dialog-actions>
        </md-dialog>



        <!-- INFO` DIALOG -->
        
        <md-dialog :md-active.sync="showInfo">
            
            <md-dialog-title>Info</md-dialog-title>
            
            <md-content class="dialog-content">olowiki {{version}}</md-content>
            
            <md-dialog-actions>
                <md-button @click="showInfo = false">Cancel</md-button>
            </md-dialog-actions>
        </md-dialog>
    </olo-webui>
</template>



<script>
    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdSnackbar").default );
    Vue.use( require("vue-material/dist/components/MdCard").default );
    Vue.use( require("vue-material/dist/components/MdDialog").default );
    Vue.use( require("vue-material/dist/components/MdMenu").default );
    Vue.use( require("vue-material/dist/components/MdList").default );
    Vue.use( require("vue-material/dist/components/MdTooltip").default );
    Vue.use( require("vue-material/dist/components/MdField").default );
    Vue.use( require("vue-material/dist/components/MdSwitch").default );
    Vue.use( require("vue-material/dist/components/MdEmptyState").default );

    const store = require("./store");
    const errors = require("olo-store/lib/errors");

    module.exports = {
        
        components: {
            'olo-webui':      require("olo-webui"),
            'oloml-editor':   require("oloml-editor"), //() => import(/* webpackChunkName: "olo-editor" */ 'olo-editor'),
            'oloml-viewer':   require("oloml-viewer"),
        },
        
        props: ['href', 'version'],
        
        data: () => Object({
            userId: null,
            userToken: "",
            source: null,
            changed: false,
            errorMessage: "",
            mode: "view",
            message: {
                show: false,
                text: ""
            },
            userDialog: {
                show: false,
                email: "",
                token: "",
                save: true
            },
            showInfo: false,
        }),
        
        computed: {
            
            uri () {
                const purl = new URL(this.href);
                return purl.origin + purl.pathname;
            },
            
            fragmentPath () {
                const purl = new URL(this.href);
                return purl.hash ? purl.hash.substr(1) : "";                
            },
            
            editable () {
                return true;
            },
        }, 
        
        watch: {
            
            href: function (oldHRef, newHRef) {
                this.load();
            },
            
            source: function (oldSource, newSource) {
                if (oldSource !== null) this.changed = true;
            }            
        },    
        
        methods: {
            
            async load () {
                try {
                    this.source = await store.read(this.uri);
                    this.changed = false;
                } catch (error) {
                    if (error instanceof errors.FileNotFoundError) {
                        this.mode = "notFound";
                    } else {
                        this.renderError(error);
                    }
                }
            },
            
            async save () {
                if (!this.changed) return;
                try {
                    await store.write(this.uri, this.source);
                    this.changed = false;
                    this.showMessage("Saved.");
                } catch (error) {
                    this.showMessage(String(error));
                }                            
            },
            
            renderError (error) {
                this.errorMessage = error.message;
                this.mode = "error";
            },
            
            showMessage (text) {
                this.message.text = text;
                this.message.show = true;
            },
            
            async showUserDialog () {
                this.userDialog.email = this.userId || "";
                this.userDialog.token = this.userToken || "";
                this.userDialog.show = true
            },
            
            async generateToken () {
                this.userDialog.token = await store.generateToken(this.userDialog.email);
                this.userDialog.email = await store.verifyToken(this.userDialog.token);
            },
            
            async applyUser () {
                this.userId = this.userDialog.email;
                this.userToken = this.userDialog.token;
                if (this.userDialog.save) {
                    await store.storeToken(this.userDialog.token);
                } else {
                    await store.destroyToken();
                }
                this.userDialog.show = false;
            },
            
            toggleEdit () {
                if (this.mode === 'view') this.mode = 'edit';
                else if (this.mode = 'edit') this.mode = 'view';
            },
            
            handleKeyCommand (keyString, event) {
                switch (keyString) {
                    
                    case 'ctrl-s':
                        this.save();
                        event.stopPropagation();
                        event.preventDefault();
                        break;

                    case 'ctrl-enter':
                        this.toggleEdit();
                        event.stopPropagation();
                        event.preventDefault();
                        break;

                    default:
                        console.log('pressed', keyString);
                        break;
                }
            }
        },
        
        async mounted () {        
            this.userToken = await store.retrieveToken() || null;
            this.userId = this.userToken ? await store.verifyToken(this.userToken) : ""
            await this.load();
        }        
    };
</script>


<style scoped>
    .olo-wiki *[slot="logo"] img {
        background-color: transparent;
    }

    .olo-wiki .oloml-viewer {}

    .olo-wiki .oloml-editor {}

    .olo-wiki .error-card {
        margin: 1em;    
    }
    
    .md-dialog {
        min-width: 70%;
    }
    
    .dialog-content {
        font-size: 16px;
        font-family: inherit;
        padding: 24px;
    }
</style>
