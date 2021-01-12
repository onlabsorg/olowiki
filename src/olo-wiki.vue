<template>
    <div class="olowiki-document">
    
        <!-- MAIN UI -->
        <olowiki-app appname="olowiki" :title="title"
                @key="handleKeyboardCommand" 
                @logo-click="infoDialog.show = true"
                @drawer-context-menu="console.log('@olo-wiki.vue: detected drawer-context-menu event')">
            
            
            <!-- Drawer -->
            <dir-tree slot="drawer-item"
                    root="/" 
                    :selected="doc.path" 
                    :change="tree_change"
                    :state="tree_state"
                    :store="store"
                    @tree-context-menu="showTreeContextMenu">
            </dir-tree>
            

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
                        
            <olo-editor :source.sync="doc.source" theme="iplastic"
                    slot="content" ref="editor" v-if="stateIs('edit')"></olo-editor>

            <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="commit">
                <md-icon>done</md-icon>
            </md-button>

            <md-button slot="button" v-if="stateIs('edit')" class="md-icon-button control" @click="setState('view')">
                <md-icon>close</md-icon>
            </md-button>
            
            
            <!-- Empty states -->
            
            <md-empty-state slot="content" v-if="stateIs('error')" md-icon="error" md-label="Error!" :md-description="errorMessage"></md-empty-state>
            
            
            <!-- Context Menu -->
            
            <md-list-item slot="context-menu-item" >
                <span class="md-list-item-text">New</span>
            </md-list-item>
            <md-list-item slot="context-menu-item" >
                <span class="md-list-item-text">Command 2</span>
            </md-list-item>
            <md-list-item slot="context-menu-item" >
                <span class="md-list-item-text">Command 3</span>
            </md-list-item>
        </olowiki-app>


        <!-- ADD DIALOG -->
        <md-dialog :md-active.sync="addDialog.show">
            <md-dialog-title>Create a new document</md-dialog-title>
            <md-dialog-content>
                <md-field md-inline>
                    <label>Document name</label>
                    <md-input v-model="addDialog.path"></md-input>
                </md-field>
            </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" @click="createDocument(addDialog.path)">
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
        
        
        <!-- NAVIGATION CONTEXT MENU -->
        <context-menu v-if="treeContextMenu.show"
                :x="treeContextMenu.x" :y="treeContextMenu.y" 
                @context-menu-blur="hideTreeContextMenu">
            <md-list-item slot="context-menu-item" v-if="treeContextMenu.isDir" 
                    @click="showAddDialog(treeContextMenu.path)">
                <span class="md-list-item-text">New</span>
            </md-list-item>
            <md-list-item slot="context-menu-item" 
                    @click="showDeleteDialog(treeContextMenu.path)">
                <span class="md-list-item-text">Delete</span>
            </md-list-item>
        </context-menu>
        
    </div>
</template>

<script>

    const olojs = require("@onlabsorg/olojs/browser");
    require("@onlabsorg/olojs/src/olo-viewer.css");

    const DOMPurify = require("dompurify");
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
            'olo-editor': require("./olo-editor/index"),
            'dir-tree': require('./dir-tree.vue').default,
            'context-menu': require('./context-menu.vue').default,
        },
        
        props: ['store', 'src'],
        
        data: () => ({
            version: require('../package.json').version,
            doc: {
                path: "",
                source: "",
                context: olojs.document.createContext(),
                namespace: {},
                text: ""
            },
            state: "view",
            errorMessage: "",
            tree_change: {},
            tree_state: {
                expanded: {},
                highlighted: "",
            },
            treeContextMenu: {
                show: false,
                isDir: false,
                path: "",
                x: 0,
                y: 0
            },
            drawerContextMenu: {
                show: false,
                path: "",
                x: 0,
                y: 0
            },
            addDialog: {
                show: false,
                path: "",
            },
            deleteDialog: {
                show: false,
                path: ""
            },
            infoDialog: {
                show: false,
            },            
        }),  
        
        computed: {

            parentPath () {
                return this.doc.path.split("/").slice(0,-1).join("/") + "/";
            },
            
            grandParentPath () {
                return this.doc.path.split("/").slice(0,-2).join("/") + "/";
            },
            
            title () {
                const title = this.doc.namespace.title;
                return typeof title === "string" ? title : this.doc.path;
            },              

            html () {
                return DOMPurify.sanitize(this.doc.text);                
            }
        },
        
        watch: {
            "src": function () {
                this.refresh();
            },
        },
        
        methods: {
            
            async refresh () {
                this.doc.context = this.store.createContext(this.src);
                if (this.doc.path !== this.doc.context.__path__) {
                    this.doc.path = this.doc.context.__path__;
                    this.doc.source = await this.store.read(this.doc.path);
                }
                const evaluate = olojs.document.parse(this.doc.source);
                this.doc.namespace = await evaluate(this.doc.context);
                this.doc.text = await this.doc.context.str(this.doc.namespace);                
            },
            
            async save () {
                try {
                    await this.store.write(this.doc.path, this.doc.source);
                    this.tree_change = {
                        op: 'SET',
                        path: this.doc.path
                    }
                    this.showMessage("Saved");
                } catch (error) {
                    if (error instanceof store.constructor.WriteAccessDeniedError) {
                        this.showMessage("Not saved: write access denied");
                    } else {
                        this.showMessage("Not saved: an error occurred while saving");
                    }
                }
            },
            
            commit () {
                this.$refs.editor.commit();
                this.setState("view");
                this.refresh();
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
                console.log("@olo-wiki.vue: showing add dialog");
                this.addDialog.path = pathlib.join(path, "new_document");
                this.addDialog.show = true;
            },
            
            showDeleteDialog (path) {
                this.deleteDialog.path = path;
                this.deleteDialog.show = true;
            },
            
            showTreeContextMenu (event) {
                this.tree_state.highlighted = event.path;
                this.treeContextMenu.path = event.path;
                this.treeContextMenu.isDir = event.path.slice(-1) === '/';
                this.treeContextMenu.x = event.x;
                this.treeContextMenu.y = event.y;
                this.treeContextMenu.show = true;
            },
            
            hideTreeContextMenu () {
                this.tree_state.highlighted = "";
                this.treeContextMenu.show = false;
            },
            
            async createDocument (path) {
                const docPath = pathlib.normalize(`/${path}`);
                try {
                    await this.store.write(docPath, "");
                    this.tree_change = {
                        op: 'SET',
                        path: docPath
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
                    await this.store.delete(itemPath);
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
                
                if (this.treeContextMenu.show) switch (event.keyString) {
                    case "Esc":
                        this.hideTreeContextMenu();
                        break;
                    
                    default:
                        break;                    
                }
                
                else if (this.stateIs('view')) switch (event.keyString) {
                    
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
    
    .md-dialog .md-dialog-container {
        min-width: 40%;
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
