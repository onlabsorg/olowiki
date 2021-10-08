<template>
  <v-app>
    <v-app-bar app flat clipped-left color="#DDDDDE">

        <v-app-bar-nav-icon @click.stop="showDrawer=!showDrawer"></v-app-bar-nav-icon>
      
        <v-toolbar-title>{{ docTitle }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon v-if="mode==='view'" @click="mode='edit'">
            <v-icon>mdi-pencil</v-icon>
        </v-btn>
      
        <v-btn icon v-if="mode === 'edit'" @click="commit(); mode='view'">
            <v-icon>mdi-check</v-icon>
        </v-btn>

        <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>
            <v-list>
                <olo-menu-item icon="mdi-content-save" title="Save"      kbshortcut="CTRL-S" @click="save"              ></olo-menu-item>
                <olo-menu-item icon="mdi-content-copy" title="Duplicate" kbshortcut=""       @click="copyItem(docPath)" ></olo-menu-item>
                <olo-menu-item icon="mdi-delete"       title="Delete"    kbshortcut=""       @click="deleteDoc(docPath)"></olo-menu-item>
                <olo-menu-item icon="mdi-download"     title="Download"  kbshortcut=""       @click="download(docPath)" ></olo-menu-item>
                <v-divider></v-divider>
                <olo-menu-item icon="mdi-help-circle"  title="About"     kbshortcut=""       @click="setHash('/help/about')"></olo-menu-item>
            </v-list>
        </v-menu>

    </v-app-bar>
    
    <v-navigation-drawer app clipped v-model="showDrawer" color="#DDDDDE" hide-overlay>
        <olo-tree 
            :store="store" 
            root="/home/"
            :active="docPath"
            @update:active="handleActiveTreeItemChange"
            @add-item="addDocTo($event)"
            @copy-item="copyItem($event)"
            @delete-item="deleteItem($event)"
            @download-item="download($event)"
            >
        </olo-tree>
    </v-navigation-drawer>

    <v-main class="background">
        <olo-document ref="document"
            :store="store" 
            :docid="hash"
            :mode="mode"
            @doc-rendered="docData = $event"
            >
        </olo-document>
    </v-main>
    
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
    
    <olo-input ref="question"></olo-input>
    
  </v-app>
</template>

<script>
import * as pathlib from 'path';
import store from './store';
import OloDocument from './components/olo-document';
import OloTree from './components/olo-tree';
import {detectKeyString} from 'key-string';

export default {
    name: 'App',

    components: {
        'olo-document': OloDocument,
        'olo-tree': OloTree,
        'olo-menu-item': () => import('./components/olo-menu-item'),
        'olo-input': () => import('./components/olo-input'),
    },

    data: () => ({
        store: store,
        hash: "/home/",
        mode: "view",
        showDrawer: true,
        docData: {__path__:"", __title__:"Loading ..."},
        activeTreeItem: [],
        message: {
            show: false,
            text: "",
            timeout: 2000,
        }
    }),
    
    computed: {
    
        docPath () {
            return this.docData ? this.docData.__path__ : this.hash.split('?')[0];
        },
        
        docTitle () {
            return this.docData && this.docData.__title__ ? this.docData.__title__ : this.docPath;
        }
    },
    
    methods: {
        
        updateHash () {
            const hash = location.hash.slice(1);            
            if (hash) {
                this.hash = hash;
            } else {
                this.setHash('/home/');
            }
        },
        
        setHash (docId) {
            location.hash = pathlib.normalize(`/${docId}`);
        },
        
        handleActiveTreeItemChange (activeItemPath) {
            if (activeItemPath.slice(0, 6) === '/home/') {
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
    
    mounted () {
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
    
    .background {
        background-color: #DDDDDE;
    }
    
    .v-navigation-drawer__border {
        width: 0px!important;
    }
    
    .olo-document {
        margin-left: 10%;
        margin-right: 10%;
    }
</style>
