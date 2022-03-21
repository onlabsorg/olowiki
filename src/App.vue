<template>
  <v-app>
      
    <!-- Toolbar -->
    <v-app-bar app flat color="#F1F3F4">
    </v-app-bar>


    <!-- Content Navigation Panel -->
    <v-navigation-drawer app floating v-model="showNavigation" hide-overlay 
            :mini-variant="showMiniNavigation" permanent
            color="#F1F3F4">
        
        <v-toolbar elevation="0" color="#F1F3F4">    
            <v-btn icon @click.stop="showMiniNavigation=!showMiniNavigation">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-toolbar-title>{{navigationTitle}}</v-toolbar-title>
        </v-toolbar>
        
        <olo-tree v-if="!showMiniNavigation"
            :store="store" 
            :tree="config.tree"
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
            :mini-variant="showMiniCommands" permanent 
            color="#F1F3F4">
        
        <v-toolbar elevation="0" color="#F1F3F4">
            <v-btn icon @click.stop="showMiniCommands=!showMiniCommands">
                <v-icon>{{showMiniCommands ? "mdi-chevron-left" : "mdi-chevron-right"}}</v-icon>
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
                <olo-menu-item icon="mdi-cog-outline" title="Settings" kbshortcut="" @click="setHash(configPath)     "></olo-menu-item>
                <olo-menu-item icon="mdi-help-circle" title="Help"     kbshortcut="" @click="setHash(config.helpPath)"></olo-menu-item>
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
import DefaultConfig from './default-config';

export default {
    name: 'App',
    
    props: ['store', 'configPath'],

    components: {
        'olo-document'  : () => import('./components/olo-document'  ),
        'olo-tree'      : () => import('./components/olo-tree'      ),
        'olo-menu-item' : () => import('./components/olo-menu-item' ),
        'olo-input'     : () => import('./components/olo-input'     ),
    },

    data: () => ({
        hash: "",
        mode: "view",
        config: {},
        showNavigation: true,
        showMiniNavigation: true,
        showCommands: true,
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
            if (this.config && this.config.tree && this.config.tree.name) {
                return this.config.tree.name || "Content";
            } else {
                return "Content"
            }
        }
    },
    
    methods: {
        
        async updateConfig () {
            const configSource = await this.store.read(this.configPath);
            const configContext = await this.store.createContext(this.configPath);
            const {data} = await this.store.parseDocument(configSource)(configContext);
            this.config = Object.assign({}, DefaultConfig(this.store), data);
        },
        
        updateHash () {
            const hash = location.hash.slice(1);            
            this.hash = this.store.normalizePath(hash);
            if (this.hash !== hash) this.setHash(this.hash);
        },
        
        setHash (docId) {
            location.hash = this.store.normalizePath(docId);
        },
        
        handleActiveTreeItemChange (activeItemPath) {
            if (activeItemPath.slice(0, 1) === '/') {
                this.setHash(activeItemPath);
            }
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
        // Load the configuration file
        await this.updateConfig();
        
        // Setup the keyboard listener
        document.body.addEventListener("keydown", 
                this.handleKeyboardCommand.bind(this), true);
                
        // Bind the hash to the active document
        window.addEventListener('hashchange', this.updateHash.bind(this));
        this.updateHash();
    }
};
</script>

<style>

    html { 
        overflow-y: auto 
    }
</style>
