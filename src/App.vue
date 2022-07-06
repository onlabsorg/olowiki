<template>
  <v-app>

    <!-- Toolbar -->
    <v-app-bar app flat color="#F1F3F4">
        <v-btn icon v-if="!navigation.show" @click.stop="navigation.show=true">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <olo-omnibar v-model="docId"></olo-omnibar>
        <v-spacer></v-spacer>
        <v-btn icon v-if="!commands.show" @click.stop="commands.show=true">
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
    </v-app-bar>


    <!-- Content Navigation Panel -->
    <v-navigation-drawer app floating ref="navigation"
            v-model="navigation.show" hide-overlay
            :mini-variant="navigation.mini && !smallScreen"
            :width="navigation.width"
            color="#F1F3F4">

        <v-toolbar elevation="0" color="#F1F3F4">
            <v-btn icon @click.stop="smallScreen ? navigation.show=false : navigation.mini=!navigation.mini">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-toolbar-title>Book</v-toolbar-title>
        </v-toolbar>

        <olo-tree
            :store="store"
            :root="treeRoot"
            :active="docPath" @update:active="handleActiveTreeItemChange"
            :mini="navigation.mini && !smallScreen"
            >
        </olo-tree>

        <template v-slot:append>
            <v-list>
                <v-divider></v-divider>
                <olo-menu-item icon="mdi-help-circle-outline" title="Help"     kbshortcut="" @click="docId=helpPath"></olo-menu-item>
            </v-list>
        </template>

    </v-navigation-drawer>


    <!-- Commands Menu -->
    <v-navigation-drawer app right floating v-model="commands.show"
            :mini-variant="commands.mini && !smallScreen"
            color="#F1F3F4">

        <v-toolbar elevation="0" color="#F1F3F4">
            <v-btn icon v-if="smallScreen" @click.stop="commands.show=false">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn icon v-if="!smallScreen" @click.stop="commands.mini=!commands.mini">
                <v-icon>{{commands.mini && !smallScreen ? "mdi-chevron-left" : "mdi-chevron-right"}}</v-icon>
            </v-btn>
            <v-toolbar-title>Page</v-toolbar-title>
        </v-toolbar>

        <v-list>
            <olo-menu-item icon="mdi-pencil"       title="Edit"      kbshortcut="CTRL-ENTER" @click="mode='edit'"       v-if="mode==='view'"></olo-menu-item>
            <olo-menu-item icon="mdi-check"        title="Render"    kbshortcut="CTRL-ENTER" @click="mode='view'"       v-if="mode==='edit'"></olo-menu-item>
            <olo-menu-item icon="mdi-content-save" title="Save"      kbshortcut="CTRL-S"     @click="save"              ></olo-menu-item>
            <olo-menu-item icon="mdi-content-copy" title="Duplicate" kbshortcut=""           @click="copyDoc(docPath)"  ></olo-menu-item>
            <olo-menu-item icon="mdi-delete"       title="Delete"    kbshortcut=""           @click="deleteDoc(docPath)"></olo-menu-item>
            <olo-menu-item icon="mdi-download"     title="Download"  kbshortcut=""           @click="download(docPath)" ></olo-menu-item>
        </v-list>

    </v-navigation-drawer>


    <!-- Main Content -->
    <v-main style="background-color: #F1F3F4">
        <olo-document ref="document" :class="mode"
            :store="store"
            :path="docId"
            :mode="mode"
            :presets="context"
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

    props: ['store', 'homePath', 'helpPath', 'treeRoot', 'context'],

    components: {
        'olo-document'  : () => import('./components/olo-document' ),
        'olo-tree'      : () => import('./components/olo-tree'     ),
        'olo-menu-item' : () => import('./components/olo-menu-item'),
        'olo-input'     : () => import('./components/olo-input'    ),
        'olo-omnibar'   : () => import('./components/olo-omnibar'  )
    },

    data: () => ({
        docId: "",  // two-way bound to location.hash
        mode: "view",
        navigation: {
            show: null,
            mini: true,
            width: 256,
            minWidth: 256,
            borderSize: 3
        },
        commands: {
            show: null,
            mini: true,
        },
        docData: {__path__:"", __title__:"Loading ..."},
        message: {
            show: false,
            text: "",
            timeout: 2000,
        },
    }),

    computed: {

        docPath () {
            return this.docId.split('?')[0];
        },

        smallScreen () {
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

    watch: {

        docId () {
            // Bind the page URI hash to the docId property, while a hashchange
            // event handler takes care of binding docId to the hash.
            location.hash = this.store.normalizePath( this.docId );
        }
    },

    methods: {
        
        logEvent (event) {
            console.log(event);
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

        async copyDoc (docPath) {
            const newDocPath = await this.askQuestion("Enter the path of document copy.", docPath);
            if (newDocPath) {
                try {
                    await this.store.copy(docPath, newDocPath);
                    this.showMessage(`Copied ${docPath} to ${newDocPath}`);
                } catch (e) {
                    this.showMessage(`Failed to copy ${docPath} to ${newDocPath}`);
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
                this.docId = activeItemPath;
            }
        },

        handleHashChange () {
            // Bind the docId property to the page URI hash, while a docId
            // watcher takes care of binding the hash to docId.
            const docId = location.hash ? location.hash.slice(1) : this.homePath;
            this.docId = this.store.normalizePath(docId);
        },

        handleMouseOverNavigationBorder () {},

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
        },

        initNavigation () {
            const navigationElt = this.$refs.navigation.$el;
            const borderElt = navigationElt.querySelector(".v-navigation-drawer__border");

            borderElt.style.width = this.navigation.borderSize + "px";

            const minSize = this.navigation.borderSize;

            const resize = event => {
                if (event.clientX >= this.navigation.minWidth) {
                    navigationElt.style.width = event.clientX + "px";
                }
            }

            borderElt.addEventListener('mouseover', () => {
                document.body.style.cursor = this.navigation.mini ? "" : "ew-resize";
            });

            borderElt.addEventListener('mouseout', () => {
                document.body.style.cursor = "";
            });

            borderElt.addEventListener('mousedown', event => {
                if (event.offsetX < minSize && !this.navigation.mini) {
                    navigationElt.style.transition = "initial";
                    borderElt.style.backgroundColor = "#919191";
                    document.addEventListener('mousemove', resize, false);
                }
              },
              false
            );

            document.addEventListener('mouseup', () => {
                navigationElt.style.transition = "";
                borderElt.style.backgroundColor = "";
                document.removeEventListener('mousemove', resize, false);
                if (!this.navigation.mini) {
                    this.navigation.width = Number(navigationElt.style.width.slice(0,-2));
                }
              },
              false
            );
        }
    },

    async mounted () {

        // Setup the keyboard listener
        document.body.addEventListener("keydown",
                this.handleKeyboardCommand.bind(this), true);

        // Bind the hash to the active document
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
        this.handleHashChange();

        // Initialize the navigation drawer events
        this.initNavigation();
    }
};
</script>

<style>

    html {
        overflow-y: auto
    }

    .v-app-bar .v-toolbar__content {
        padding: 0 !important;
    }

    .v-app-bar .olo-omnibar {
        align-self: stretch;
        margin: 8px 0;
        width: 100%;
        border-radius: 8px;
    }
    
</style>
