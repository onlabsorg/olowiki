const olojs = require('@onlabsorg/olojs/browser');
const pathlib = require('path');
const WikiStore = require('./wiki-store');
const DOMPurify = require("dompurify");
const {detectKeyString} = require("key-string");

const Vue = require('vue/dist/vue');
Vue.use( require("vue-material/dist/components/MdApp").default );
Vue.use( require("vue-material/dist/components/MdSubheader").default );
Vue.use( require("vue-material/dist/components/MdToolbar").default );
Vue.use( require("vue-material/dist/components/MdContent").default );
Vue.use( require("vue-material/dist/components/MdButton").default );
Vue.use( require("vue-material/dist/components/MdIcon").default );
Vue.use( require("vue-material/dist/components/MdField").default );
Vue.use( require("vue-material/dist/components/MdSnackbar").default );
Vue.use( require("vue-material/dist/components/MdDrawer").default );
Vue.use( require("vue-material/dist/components/MdDialog").default );



// Load the styles
require('vue-material/dist/vue-material.css');
require('vue-material/dist/theme/default.css');    
require('./wiki.css');
require('./typography.css');


// The main export is a function that instantiates a wiki app in the browser.
// - options.element: HTMLElement || css-selector, is the element that will contain the wiki app
// - options.homeStore: olojs.Store, is the wiki store that will be mounted at `/home`
// - options.editorFontSize: Number, the size of the editor characters in pt. Defaults to 'chrome'.
// - options.editorTheme: String, the ace theme to be applied to the editor. Defaults to 12.
module.exports = options => new Vue({
        
    el: options.element,
    
    template: require('./wiki.html'),
    
    components: {
        'vue-olo-editor': require('vue-olo-editor'),
        'vue-olo-tree-node-list': require('vue-olo-tree'),
        'context-menu': require('./context-menu.vue').default,
        'confirm-dialog': require('./confirm-dialog.vue').default,
        'prompt-dialog': require('./prompt-dialog.vue').default
    },
    
    data: {
        
        // documents store
        store: WikiStore(options.store),
        
        // app
        appName: options.appName || "wiki",
        appVersion: require('../package.json').version,
        appHomePage: options.appHomePage || "/",

        // navigation 
        showDrawer: true,
        treeRootPath: options.treeRootPath ? pathlib.normalize(`/${options.treeRootPath}/`) : '/',
        treeState: {
            selected: "",
            highlighted: "",
            expanded: {}
        },
        navContextMenu: {
            show: false,
            isDir: false,
            path: "",
            x: 0,
            y: 0
        },

        // content
        docId: "",
        docSource: "",
        docNamespace: {},
        docText: "Loading...",            
        mode: "view",
        editor: {
            content: "",
            fontsize: Number(options.editorFontSize) || 12,
            theme: options.editorTheme || "chrome"
        },

        // dialogs
        message: {
            show: false,
            content: "",
            duration: 3000
        },
        addDialog: {
            show: false,
            path: "",
        },
        copyDialog: {
            show: false,
            path1: "",
            path2: ""
        },
        deleteDialog: {
            show: false,
            path: ""
        },
    },
    
    computed: {
        
        // 2) when docId changes, update docContext
        docContext () {
            return this.store.createContext(this.docId);
        },
        
        // 3) when docContext changes, update docPath
        docPath () {
            return this.docContext.__path__;
        },
        
        // 5) when a document is rendered, update docHTML (= viewer content)
        docHTML () {
            return DOMPurify.sanitize(this.docText);
        },
    },
    
    watch: {
        
        // 4) when docPath changes, a new document is loaded and rendered
        async docPath () {
            const docSource = await this.store.read(this.docPath); 
            await this.render(docSource);
        },
        
        // when the docSource changes, update the text editor content
        docSource () {
            this.editor.content = this.docSource;
        }
    },
    
    methods: {
        
        async render (docSource) {
            
            // update docSource,
            this.docSource = docSource;
            
            // evaluate the document source in the current docContext
            const evaluate = olojs.document.parse(this.docSource);
            this.docNamespace = await evaluate(this.docContext);
            
            // render the document namespace to text
            this.docText = await this.docContext.str(this.docNamespace);
        },
        
        async save () {
            try {
                console.log(this.docPath);
                await this.store.write(this.docPath, this.docSource);
                this.showMessage("Saved");
            } catch (error) {
                this.reportError(error);
            }                
        },
                    
        async createDocument (path) {        
            path = pathlib.normalize(`/${path}`);        
            try {
                await this.store.createDocument(path);
                this.showMessage(`Created ${path}`);
            } catch (error) {
                this.reportError(error);
            }
        },
        
        async copyItem (path1, path2) {
            path1 = pathlib.normalize(`/${path1}`);
            path2 = pathlib.normalize(`/${path2}`);
            try {
                await this.store.copy(path1, path2);
                this.showMessage(`Copied ${path1} to ${path2}`);
            } catch (error) {
                this.reportError(error);
            }
        },
        
        async deleteItem (itemPath) {  
            itemPath = pathlib.normalize(`/${itemPath}`);            
            try {
                if (itemPath.slice(-1) === '/') {
                    await this.store.deleteAll(itemPath);
                } else {
                    await this.store.delete(itemPath);
                }
                this.showMessage(`Deleted ${itemPath}`);
            } catch (error) {
                this.reportError(error);
            }
        },
        
        async download (path) {
            await this.store.download(path);
        },
        
        reportError (error) {
            const isStoreError = 
                    error instanceof olojs.Store.ReadPermissionDeniedError ||
                    error instanceof olojs.Store.WritePermissionDeniedError ||
                    error instanceof olojs.Store.ReadOperationNotAllowedError ||
                    error instanceof olojs.Store.WriteOperationNotAllowedError;
            this.showMessage( isStoreError ? String(error) : "Unknown Error!" );
            console.error(error);
        },
        
        quitEditing () {
            this.editor.content = this.docSource;
            this.mode = 'view';
        },
        
        async commit () {
            this.mode = 'view';
            await this.render(this.editor.content);
        },
        
        showMessage (content) {
            this.message.content = content;
            this.message.show = true;
        },
        
        showAddDialog (path) {
            this.addDialog.path = pathlib.join(path, "new_document");
            this.addDialog.show = true;
        },
        
        showCopyDialog (path) {
            this.copyDialog.path1 = path;
            this.copyDialog.path2 = path;
            this.copyDialog.show = true;
        },

        showDeleteDialog (path) {
            this.deleteDialog.path = path;
            this.deleteDialog.show = true;
        },
        
        handleTreeNodeClick (event) {
            if (event.path.slice(-1) !== '/') {
                location.hash = event.path;
            }              
        },
        
        handleTreeContextMenu (event) {
            this.navContextMenu.path = event.path;
            this.navContextMenu.isDir = event.path.slice(-1) === '/';
            this.navContextMenu.x = event.x;
            this.navContextMenu.y = event.y;
            this.navContextMenu.show = true;
        },
        
        handleDrawerContextMenu (event) {
            this.navContextMenu.path = '/';
            this.navContextMenu.isDir = true;
            this.navContextMenu.x = event.clientX;
            this.navContextMenu.y = event.clientY;
            this.navContextMenu.show = true;
        },
        
        // 1) when the hash changes, the docId gets updated
        handleHashChange () {
            this.docId = normalizeId(location.hash.slice(1));
        },

        handleKeyboardCommand (event) {
            const keyString = detectKeyString(event);

            if (this.navContextMenu.show) switch (keyString) {
                case "Esc":
                    this.navContextMenu.show = false;
                    break;

                default:
                    break;
            }

            else if (this.mode === 'view') switch (keyString) {

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
                    this.docSource = this.editor.content;
                    this.save();
                    break;

                case "Ctrl+Return":
                    this.commit();
                    break;

                case "Esc":
                    this.quitEditing();
                    break;

                default:
                    break;
            }
        }
    },
    
    mounted () {
        document.body.addEventListener("keydown", 
                event => this.handleKeyboardCommand(event), true);
        this.$el.querySelector('.md-drawer.md-app-drawer').addEventListener('contextmenu', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.handleDrawerContextMenu(event);
        });
        window.addEventListener('hashchange', () => this.handleHashChange());
        this.handleHashChange();
    },
});


function normalizeId (id) {
    const uriMatch = id.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/(.*)$/);
    if (uriMatch && uriMatch[1]) {
        return pathlib.normalize(`${uriMatch[1]}:/${uriMatch[2]}`);
    } else {
        return pathlib.normalize(`/${id}`);
    }
}

