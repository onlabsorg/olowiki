const olojs = require("@onlabsorg/olojs/browser");
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

require("./olo-viewer.css");
require('./olo-wiki.css');

module.exports = olojsStore => {

    const store = Object.create(olojsStore);
    const storeCallbacks = [];

    store.onChange = callback => {
        storeCallbacks.push(callback);
    }

    store.emit = change => {
        for (let callback of storeCallbacks) {
            callback(change);
        }
    }

    return {

        template: require('./olo-wiki.html'),

        components: {
            'olo-app': require("../olo-app/olo-app"),
            'olo-editor': require("../olo-editor/index"),
            'olo-tree-node': TreeNodeComponent(store),
            'context-menu': require('../olo-app/context-menu.vue').default,
        },

        props: ['src'],

        data: () => ({
            store: store,
            version: require('../../package.json').version,
            state: "view",
            errorMessage: "",
            doc: {
                path: "",
                source: "",
                context: olojs.document.createContext(),
                namespace: {},
                text: ""
            },
            nav: {
                treeState: {
                    expanded: {'/':true},
                    highlighted: "",
                },
                bookmarksState: {
                    expanded: {},
                    highlighted: ""
                },
                bookmarks: [],
            },
            navContextMenu: {
                show: false,
                isDir: false,
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
                    store.emit({op:'SET', path:this.doc.path});
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
                this.addDialog.path = pathlib.join(path, "new_document");
                this.addDialog.show = true;
            },

            showDeleteDialog (path) {
                this.deleteDialog.path = path;
                this.deleteDialog.show = true;
            },

            showBookmarksContextMenu (event) {
                this.nav.bookmarksState.highlighted = event.path;
                this.nav.treeState.highlighted = "";
                this.showNavigationContextMenu(event);
            },

            showTreeContextMenu (event) {
                this.nav.treeState.highlighted = event.path;
                this.nav.bookmarksState.highlighted = "";
                this.showNavigationContextMenu(event);
            },

            showNavigationContextMenu (event) {
                this.navContextMenu.path = event.path;
                this.navContextMenu.isDir = event.path.slice(-1) === '/';
                this.navContextMenu.x = event.x;
                this.navContextMenu.y = event.y;
                if (this.navContextMenu.show) {
                    this.navContextMenu.preventHide = true
                } else {
                    this.navContextMenu.show = true;
                }
            },

            hideNavigationContextMenu () {
                if (this.navContextMenu.preventHide) {
                    this.navContextMenu.preventHide = false;
                } else {
                    this.nav.treeState.highlighted = "";
                    this.nav.bookmarksState.highlighted = "";
                    this.navContextMenu.show = false;
                }
            },

            isPinned (path) {
                return this.nav.bookmarks.indexOf(path) !== -1;
            },

            pin (path) {
                if (!this.isPinned(path)) {
                    this.nav.bookmarks.push(path);
                }
            },

            unpin (path) {
                if (this.isPinned(path)) {
                    const pos = this.nav.bookmarks.indexOf(path);
                    this.nav.bookmarks.splice(pos, 1);
                }
            },

            async createDocument (path) {
                const docPath = pathlib.normalize(`/${path}`);
                try {
                    await store.write(docPath, "");
                    store.emit({op:'SET', path:docPath});
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
                    if (itemPath.slice(-1) === '/') {
                        await store.deleteAll(itemPath);
                        const matchingBookmarks = this.nav.bookmarks.filter(
                                docPath => docPath.indexOf(itemPath) === 0);
                        for (let docPath of matchingBookmarks) {
                            this.unpin(docPath);
                        }
                    } else {
                        await store.delete(itemPath);
                        this.unpin(itemPath);
                    }
                    store.emit({op:'DELETE', path:itemPath});
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

                if (this.navContextMenu.show) switch (event.keyString) {
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
    };
};
