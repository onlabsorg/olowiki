<template>
    <div class="olowiki-document">
    
        <!-- MAIN UI -->
        <olowiki-app appname="olowiki" :title="title" 
                @key="handleKeyboardCommand" 
                @logo-click="infoDialog.show = true">
            
            
            <!-- Drawer -->
            <md-list slot="drawer-item">
                <tree-node icon="home"
                        root="/home/" 
                        :selected="docPath" 
                        :change="tree_change"
                        :state="tree_state"
                        :deleteable="false"
                        @add-tree-item="showAddDialog"
                        @delete-tree-item="showDeleteDialog">
                </tree-node>
            </md-list>
            

            <!-- Viewer -->
            
            <div slot="content" v-if="stateIs('view')">
                <div class="olo-viewer" v-html="html"></div>
            </div>

            <md-button slot="button" class="md-icon-button"
                    v-if="stateIs('view')"
                    @click="save">
                    <md-icon>save</md-icon>
                </md-button>
                
            <md-button slot="button" class="md-icon-button" 
                    v-if="stateIs('view')" 
                    @click="setState('edit')">
                    <md-icon>edit</md-icon>
                </md-button>    
                            
            
            <!-- Editor -->
                        
            <olo-editor :source.sync="docSource" theme="iplastic"
                    slot="content" ref="editor" v-if="stateIs('edit')"></olo-editor>

            <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="commit">
                <md-icon>done</md-icon>
            </md-button>

            <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="setState('view')">
                <md-icon>close</md-icon>
            </md-button>
            
            
            <!-- Empty states -->
            
            <md-empty-state slot="content" v-if="stateIs('error')" md-icon="error" md-label="Error!" :md-description="errorMessage"></md-empty-state>
        </olowiki-app>


        <!-- ADD DIALOG -->
        <md-dialog :md-active.sync="addDialog.show">
            <md-dialog-title>Add a document to {{addDialog.path}}</md-dialog-title>
            <md-dialog-content>
                <md-field md-inline>
                    <label>Document name</label>
                    <md-input v-model="addDialog.name"></md-input>
                </md-field>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="createDocument(addDialog.path, addDialog.name)">
                    Create
                </md-button>
                <md-button class="md-primary" @click="addDialog.show = false">
                    Cancel
                </md-button>
            </md-dialog-actions>
        </md-dialog>   
        
                
        <!-- DELETE DIALOG -->
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
        
        
        <!-- INFO DIALOG -->
        <md-dialog :md-active.sync="infoDialog.show">
            <md-dialog-title>Info</md-dialog-title>
            <md-dialog-content>
                olowiki version {{this.version}}
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="infoDialog.show = false">OK</md-button>
            </md-dialog-actions>
        </md-dialog>   
    </div>
</template>

<script>
    const DOMPurify = require("dompurify");
    const errors = require("./errors");
    const pathlib = require('path');

    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdSubheader").default );
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdEmptyState").default );
    Vue.use( require("vue-material/dist/components/MdField").default );
    Vue.use( require("vue-material/dist/components/MdDialog").default );
    Vue.use( require("vue-material/dist/components/MdTabs").default );   
    Vue.use( require("vue-material/dist/components/MdList").default );     
    Vue.use( require("vue-material/dist/components/MdDivider").default );     
    Vue.use( require("vue-async-computed") );
    
    module.exports = {
        
        components: {
            'olowiki-app': require("./app.vue").default,  
            'olo-editor': require("olo-editor"),
            'tree-node': require('./tree-node.vue').default
        },
        
        props: ['src'],
        
        data: () => ({
            state: "view",
            errorMessage: "",
            docSource: "",
            tree_change: {},
            tree_state: {
                expanded: {
                    "/home/": true
                },
                contextMenuPath: ""
            },
            addDialog: {
                show: false,
                path: "",
                name: ""
            },
            deleteDialog: {
                show: false,
                path: ""
            },
            infoDialog: {
                show: false,
            },
            version: "0.0.0"
        }),  
        
        computed: {

            docPath () {
                return this.src.split("?")[0] || "";               
            },

            parentPath () {
                return this.docPath.split("/").slice(0,-1).join("/") + "/";
            },
            
            grandParentPath () {
                return this.docPath.split("/").slice(0,-2).join("/") + "/";
            },
            
            doc () {
                return olonv.doc = olonv.createDocument(this.src, this.docSource);
            },
            
            title () {
                if (this.docns) {
                    let title = this.docns.title;
                    if (typeof title === "string") return title;
                }
                return this.docPath;                 
            },              
        },
        
        asyncComputed: {
            
            docns: async function () {
                olonv.context = this.doc.createContext({argns: this.argns});
                return olonv.docns = await this.doc.evaluate(olonv.context);                
            },
            
            html: async function () {
                const rawHTML = await olonv.render(this.docns);
                return DOMPurify.sanitize(rawHTML);                
            }
        },
        
        watch: {
            src: function () {
                this.refresh();
            }
        },
        
        methods: {
            
            async refresh () {
                const doc = await olonv.readDocument(this.src);
                this.docSource = doc.source;
            },
            
            async save () {
                try {
                    await olonv.writeDocument(this.docPath, this.docSource);
                    this.tree_change = {
                        op: 'SET',
                        path: this.docPath
                    }
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


            // State management methods

            setState (state) {
                this.state = state;
            },
            
            stateIs (state) {
                return this.state === state;
            },
            
            stateIn (...states) {
                return states.indexOf(this.state) !== -1;
            },            
            

            // Delete dialog
            
            showAddDialog (path) {
                this.addDialog.path = path;
                this.addDialog.name = "new_document";
                this.addDialog.show = true;
            },
            
            showDeleteDialog (path) {
                this.deleteDialog.path = path;
                this.deleteDialog.show = true;
            },
            
            async createDocument (path, name) {
                const docPath = `${path}/${name}`;
                try {
                    await olonv.writeDocument(docPath, "");
                    this.tree_change = {
                        op: 'SET',
                        path: this.docPath
                    }
                    this.showMessage(`Created ${docPath}`);
                } catch (error) {
                    console.error(error);
                    this.showMessage("Create operation failed!");
                }
                this.addDialog.show = false;
            },
            
            async deleteItem (itemPath) {
                this.deleteDialog.show = false;
                try {
                    await olonv.deleteDocument(itemPath);
                    this.tree_change = {
                        op: 'DELETE',
                        path: itemPath
                    }
                    this.showMessage(`Deleted ${itemPath}`);
                } catch (error) {
                    console.error(error);
                    this.showMessage("Delete operation failed!");
                }
            },            

                        
            // Messages management methods
            
            showMessage (content) {
                this.$emit('message', content);
            },
            
            
            // Handler for click on the olo-wiki logo
            handleLogoClick (event) {
                this.showMessage("Logo click detected");
            },
            
            
            // Keyboard event handler
            
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
        
        mounted () {
            this.refresh();
            this.version = olonv.olowikiVersion;
        }
    };
</script>

<style>

    .md-list-item .active {
        font-weight: bold;
        color: #1976D2;
    }

    .olo-viewer {
        display: block;
        padding: 2em 2em 2em 2em;
    }
    .comment-dialog {
        min-width: 50em;
    }
    .comments-stack {
        display: block;
        padding: 1em 0;
        background-color: #f8f8f8;
    }

    .footer {
        color: #808080;
        font-size: 0.8em;
    }

    @media (max-width: 480px) { 
        .olo-viewer {
            padding-left: 3%;
            padding-right: 3%;
        }
    }
</style>
