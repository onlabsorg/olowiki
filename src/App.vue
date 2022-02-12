<template>
  <v-app>
      
    <!-- Toolbar -->
    <v-app-bar app flat color="#FFFFFF">

        <v-btn icon @click.stop="showDrawer=true" v-if="!showDrawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn icon @click.stop="showCommands=true" v-if="!showCommands">
            <v-icon>mdi-view-list</v-icon>
        </v-btn>

    </v-app-bar>


    <!-- Content Navigation Panel -->
    <v-navigation-drawer app v-model="showDrawer" hide-overlay>
        
        <v-toolbar dark elevation="0">    
            <v-toolbar-title>Content</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showDrawer=false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        
        <olo-tree v-if="!config.items"
            :store="store" 
            root="/"
            :active="docPath"
            @update:active="handleActiveTreeItemChange"
            @add-item="addDocTo($event)"
            @copy-item="copyItem($event)"
            @delete-item="deleteItem($event)"
            @download-item="download($event)"
            >
        </olo-tree>
        
        <olo-index v-if="config.items"
            :items="config.items"
            :active="docPath"
            @update:active="handleActiveTreeItemChange"
            >
        </olo-index>
        
    </v-navigation-drawer>


    <!-- Commands Menu -->
    <v-navigation-drawer app right v-model="showCommands" hide-overlay>
        
        <v-toolbar dark elevation="0">
            <v-toolbar-title>Document</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showCommands=false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
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
                <olo-menu-item icon="mdi-cog-outline" title="Settings" kbshortcut="" @click="setHash('/.wiki/config')"    ></olo-menu-item>
                <olo-menu-item icon="mdi-help-circle" title="Help"     kbshortcut="" @click="setHash('/.wiki/help/index')"></olo-menu-item>
            </v-list>
        </template>
    </v-navigation-drawer>


    <!-- Main Content -->
    <v-main>
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
import OloDocument from './components/olo-document';
import {detectKeyString} from 'key-string';

export default {
    name: 'App',
    
    props: ['store'],

    components: {
        'olo-document': OloDocument,
        'olo-tree': () => import('./components/olo-tree'),
        'olo-index': () => import('./components/olo-index'),
        'olo-menu-item': () => import('./components/olo-menu-item'),
        'olo-input': () => import('./components/olo-input'),
    },

    data: () => ({
        hash: "",
        mode: "view",
        showDrawer: false,
        showCommands: false,
        docData: {__path__:"", __title__:"Loading ..."},
        activeTreeItem: [],
        message: {
            show: false,
            text: "",
            timeout: 2000,
        },
        config: {}
    }),
    
    computed: {
    
        docPath () {
            return this.docData ? this.docData.__path__ : this.hash.split('?')[0];
        }
    },
    
    methods: {
        
        updateHash () {
            const hash = location.hash.slice(1);            
            if (hash) {
                this.hash = this.store.normalizePath(hash);
                if (this.hash !== hash) this.setHash(this.hash);
            } else {
                this.setHash('/');
            }
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
        this.config = await this.store.loadConfig();
        document.body.addEventListener("keydown", 
                this.handleKeyboardCommand.bind(this), true);
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
