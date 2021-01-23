const olojs = require("@onlabsorg/olojs/browser");
require("@onlabsorg/olojs/src/olo-viewer.css");
require('./olo-wiki.css');

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

const TreeNodeComponent = require('../olo-tree/olo-tree-node');

module.exports = store => ({

    template: require('./olo-wiki.html'),

    components: {
        'olo-app': require("../olo-app/olo-app"),
        'context-menu': require('../olo-app/context-menu.vue').default,
        'olo-editor': require("../olo-editor/index"),
        'olo-tree-node': TreeNodeComponent(store),
    },

    props: ['src'],

    data: () => ({
        store: store,
        version: require('../../package.json').version,
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
            expanded: {'/':true},
            highlighted: "",
        },
        bookmarks: {
            state: {
                expanded: {},
                highlighted: ""
            },
            items: []
        },
        navigationContextMenu: {
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
            this.doc.context = store.createContext(this.src);
            if (this.doc.path !== this.doc.context.__path__) {
                this.doc.path = this.doc.context.__path__;
                this.doc.source = await store.read(this.doc.path);
            }
            const evaluate = olojs.document.parse(this.doc.source);
            this.doc.namespace = await evaluate(this.doc.context);
            this.doc.text = await this.doc.context.str(this.doc.namespace);
        },

        async save () {
            try {
                await store.write(this.doc.path, this.doc.source);
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

        showBookmarksContextMenu (event) {
            this.bookmarks.state.highlighted = event.path;
            this.tree_state.highlighted = "";
            this.showNavigationContextMenu(event);
        },

        showTreeContextMenu (event) {
            this.tree_state.highlighted = event.path;
            this.bookmarks.state.highlighted = "";
            this.showNavigationContextMenu(event);
        },

        showNavigationContextMenu (event) {
            this.navigationContextMenu.path = event.path;
            this.navigationContextMenu.isDir = event.path.slice(-1) === '/';
            this.navigationContextMenu.x = event.x;
            this.navigationContextMenu.y = event.y;
            this.navigationContextMenu.show = true;
        },

        hideNavigationContextMenu () {
            this.tree_state.highlighted = "";
            this.bookmarks.state.highlighted = "";
            this.navigationContextMenu.show = false;
        },

        isPinned (path) {
            return this.bookmarks.items.indexOf(path) !== -1;
        },

        pin (path) {
            if (!this.isPinned(path)) {
                this.bookmarks.items.push(path);
            }
        },

        unpin (path) {
            if (this.isPinned(path)) {
                const pos = this.bookmarks.items.indexOf(path);
                this.bookmarks.items.splice(pos, 1);
            }
        },

        async createDocument (path) {
            const docPath = pathlib.normalize(`/${path}`);
            try {
                await store.write(docPath, "");
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
                await store.delete(itemPath);
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

            if (this.navigationContextMenu.show) switch (event.keyString) {
                case "Esc":
                    this.hideNavigationContextMenu();
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
});
