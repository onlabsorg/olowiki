<template>
  <v-app>
      
    <!-- Toolbar -->
    <v-app-bar app flat color="#F1F3F4">
        <v-btn icon v-if="!showNavigation" @click.stop="showNavigation=true">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon v-if="!showCommands" @click.stop="showCommands=true">
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>        
    </v-app-bar>


    <!-- Content Navigation Panel -->
    <v-navigation-drawer app floating v-model="showNavigation" hide-overlay 
            :mini-variant="showMiniNavigation && !mini"
            color="#F1F3F4">
        
        <v-toolbar elevation="0" color="#F1F3F4">    
            <v-btn icon @click.stop="mini ? showNavigation=false : showMiniNavigation=!showMiniNavigation">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-toolbar-title>{{navigationTitle}}</v-toolbar-title>
        </v-toolbar>
        
        <olo-tree v-if="!showMiniNavigation || mini"
            :store="store" 
            :root="treeRoot"
            :active="docPath"
            @update:active="handleActiveTreeItemChange"
            @add-item="addDocTo($event)"
            @copy-item="copyItem($event)"
            @delete-item="deleteItem($event)"
            @download-item="download($event)"
            >
        </olo-tree>
        
    </v-navigation-drawer>

 
    <!-- Commands Menu -->
    <v-navigation-drawer app right floating v-model="showCommands" 
            :mini-variant="showMiniCommands && !mini"
            color="#F1F3F4">
        
        <v-toolbar elevation="0" color="#F1F3F4">
            <v-btn icon v-if="mini" @click.stop="showCommands=false">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn icon v-if="!mini" @click.stop="showMiniCommands=!showMiniCommands">
                <v-icon>{{showMiniCommands && !mini ? "mdi-chevron-left" : "mdi-chevron-right"}}</v-icon>
            </v-btn>
            <v-toolbar-title>Document</v-toolbar-title>
        </v-toolbar>

        <v-list>
            <olo-menu-item icon="mdi-pencil"       title="Edit"      kbshortcut="CTRL-ENTER" @click="mode='edit'"       v-if="mode==='view'"></olo-menu-item>
            <olo-menu-item icon="mdi-check"        title="Render"    kbshortcut="CTRL-ENTER" @click="mode='view'"       v-if="mode==='edit'"></olo-menu-item>
            <olo-menu-item icon="mdi-content-save" title="Save"      kbshortcut="CTRL-S"     @click="save"              ></olo-menu-item>
            <olo-menu-item icon="mdi-content-copy" title="Duplicate" kbshortcut=""           @click="copyItem(docPath)" ></olo-menu-item>
            <olo-menu-item icon="mdi-delete"       title="Delete"    kbshortcut=""           @click="deleteDoc(docPath)"></olo-menu-item>
            <olo-menu-item icon="mdi-download"     title="Download"  kbshortcut=""           @click="download(docPath)" ></olo-menu-item>
        </v-list>
        
        <template v-slot:append>
            <v-list>
                <v-divider></v-divider>
                <olo-menu-item icon="mdi-home-outline"        title="Home"     kbshortcut="" @click="setHash(homePath)"></olo-menu-item>
                <olo-menu-item icon="mdi-help-circle-outline" title="Help"     kbshortcut="" @click="setHash(helpPath)"></olo-menu-item>
            </v-list>
        </template>
    </v-navigation-drawer>


    <!-- Main Content -->
    <v-main style="background-color: #F1F3F4">
        <olo-document ref="document" :class="mode"
            :store="store" 
            :docid="hash"
            :mode="mode"
            @doc-rendered="docData = $event"
            >
        </olo-document>
    </v-main>

    
    <!-- Toast Messageses -->
    <v-snackbar
        v-model="message.show"
        :timeout="message.timeout"
        >
        
        {{ message.text }}

        <template v-slot:action="{ attrs }">
            <v-btn
                color="blue"
                text
                v-bind="attrs"
                @click="message.show = false"
                >
                Close
            </v-btn>
        </template>
    </v-snackbar>
    
    
    <!-- Input Dialog -->
    <olo-input ref="question"></olo-input>
    
  </v-app>
</template>

<script>
import {detectKeyString} from 'key-string';

export default {
    name: 'App',
    
    props: ['appName', 'store', 'homePath', 'helpPath', 'treeRoot'],

    components: {
        'olo-document'  : () => import('./components/olo-document'  ),
        'olo-tree'      : () => import('./components/olo-tree'      ),
        'olo-menu-item' : () => import('./components/olo-menu-item' ),
        'olo-input'     : () => import('./components/olo-input'     ),
    },

    data: () => ({
        hash: "",
        mode: "view",
        showNavigation: null,
        showMiniNavigation: true,
        showCommands: null,
        showMiniCommands: true,
        docData: {__path__:"", __title__:"Loading ..."},
        activeTreeItem: [],
        message: {
            show: false,
            text: "",
            timeout: 2000,
        },
    }),
    
    computed: {
        
        docPath () {
            return this.docData ? this.docData.__path__ : this.hash.split('?')[0];
        },
        
        navigationTitle () {
            return this.appName || "Content";
        },
        
        mini () {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return true;
                case 'sm': return true;
                case 'md': return true;
                case 'lg': return false;
                case 'xl': return false;
                default  : return false;
            }
        }
    },
    
    methods: {
        
        setHash (docId) {
            location.hash = this.store.normalizePath(docId);
        },
        
        commit () {
            this.$refs.document.commit();
        },
        
        async save () {
            try {
                await this.$refs.document.save();
                this.showMessage(`Saved to ${this.docPath}`);
            } catch (e) {
                this.showMessage(`Failed to save to ${this.docPath}`);
                console.error(e);
            }
        },
        
        async addDocTo (dirPath) {
            const docPath = await this.askQuestion("Enter the path of the new document.", dirPath);
            if (docPath) {
                try {
                    await this.store.createDocument(docPath);
                    this.showMessage(`Created ${docPath}`);
                } catch (e) {
                    this.showMessage(`Failed to create ${docPath}`);
                    console.error(e);
                }
            }
        },
        
        async copyItem (itemPath) {
            const newItemPath = await this.askQuestion("Enter the path of document copy.", itemPath);
            if (newItemPath) {
                try {
                    await this.store.copy(itemPath, newItemPath);
                    this.showMessage(`Copied ${itemPath} to ${newItemPath}`);
                } catch (e) {
                    this.showMessage(`Failed to copy ${itemPath} to ${newItemPath}`);
                    console.error(e);
                }
            }
        },
        
        async deleteDoc (docPath) {
            try {
                if (docPath === this.docPath) {
                    await this.$refs.document.delete();
                } else {
                    await this.store.delete(docPath);
                }
                this.showMessage(`Deleted ${docPath}`);
            } catch (e) {
                this.showMessage(`Failed to delete ${docPath}`);
                console.error(e);
            }
        },
        
        async deleteItem (itemPath) {
            if (itemPath.slice(-1) === '/') {
                try {
                    await this.store.deleteAll(itemPath);
                    this.showMessage(`Deleted ${itemPath}`);
                } catch (e) {
                    this.showMessage(`Failed to delete ${itemPath}`);
                    console.error(e);
                }
            } else {
                await this.deleteDoc(itemPath);
            }
        },
        
        async download (path) {
            await this.store.download(path);
        },
        
        showMessage (text, timeout=2000) {
            this.message.text = text;
            this.message.timeout = timeout;
            this.message.show = true;
            console.log("[olowiki message]", text);
        },
        
        async askQuestion (question, proposedAnswer="") {
            return await this.$refs.question.ask(question, proposedAnswer);
        },
        
        handleActiveTreeItemChange (activeItemPath) {
            if (activeItemPath.slice(0, 1) === '/') {
                this.setHash(activeItemPath);
            }
        },
        
        handleHashChange () {
            if (location.hash) {
                const hash = location.hash.slice(1);
                this.hash = this.store.normalizePath(hash);
                if (this.hash !== hash) this.setHash(this.hash);                
            } else {
                location.hash = this.homePath;
            }
        },
        
        handleKeyboardCommand (event) {
            const keyString = detectKeyString(event);

            if (this.mode === 'view') switch (keyString) {

                case "Ctrl+S":
                    event.preventDefault();
                    this.save();
                    break;

                case "Ctrl+Return":
                    this.mode = 'edit';
                    break;

                default:
                    break;
            }

            else if (this.mode === 'edit') switch (keyString) {

                case "Ctrl+S":
                    event.preventDefault();
                    this.save();
                    break;

                case "Ctrl+Return":
                    this.mode = 'view';
                    this.commit();
                    break;

                default:
                    break;
            }
        }
    },
    
    async mounted () {
        
        // Setup the keyboard listener
        document.body.addEventListener("keydown", 
                this.handleKeyboardCommand.bind(this), true);
                
        // Bind the hash to the active document
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
        this.handleHashChange();
    }
};
</script>

<style>

    html { 
        overflow-y: auto 
    }
</style>
