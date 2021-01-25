const pathlib = require('path');

const Vue = require("vue/dist/vue");
Vue.use( require("vue-material/dist/components/MdButton").default );
Vue.use( require("vue-material/dist/components/MdIcon").default );
Vue.use( require("vue-material/dist/components/MdList").default );
require('./olo-tree-node.css');

const isDir = name => name.slice(-1) === '/';
const isDoc = name => !isDir(name) && name !== "";
const isHidden = name => name[0] === '.';
const isVisible = name => name[0] !== '.';
const compareItemsByName = (item1, item2) => item1.name.localeCompare(item2.name);

module.exports = store => ({
    name: "olo-tree-node",

    template: require('./olo-tree-node.html'),

    props: ['path', 'icon', 'name', 'selected', 'state'],

    data: () => ({
        childNames: null,
    }),

    computed: {

        dirItems () {
            if (!this.childNames) return [];
            return this.childNames.filter(isDir).map(name => ({
                isDir: true,
                name: name.slice(0,-1),
                path: this.path + name,
            })).sort(compareItemsByName);
        },

        docItems () {
            if (!this.childNames) return [];
            return this.childNames.filter(isDoc).map(name => ({
                isDir: false,
                name: name,
                path: this.path + name,
            })).sort(compareItemsByName);
        },

        childItems () {
            return this.dirItems.concat(this.docItems);
        },

        nodeIcon () {
            return this.icon || (this.isDir ? "folder" : "description");
        },

        nodeName () {
            if (this.name) {
                return this.name;
            } else {
                const normPath = this.isDir ? this.path.slice(0,-1) : this.path;
                const lastSlashPos = normPath.lastIndexOf('/');
                return normPath.slice(lastSlashPos+1);
            }
        },

        isDir () {
            return isDir(this.path);
        },

        isExpanded () {
            return Boolean(this.state.expanded[this.path]);
        },
    },

    watch: {

        path: function () {
            this.updateChildNames();
        },

        isExpanded: function () {
            if (!this.childNames) this.updateChildNames();
        },
    },

    methods: {

        async updateChildNames () {
            if (this.isExpanded) {
                const nodePath = pathlib.normalize(`/${this.path}/`);
                const childNames = await store.list(nodePath);
                this.childNames = childNames.filter(isVisible);
            }
        },

        emitTreeContextMenu (data) {
            this.$emit('tree-context-menu', data);
        }
    },

    mounted () {
        store.onChange(change => {
            if (change.path.indexOf(this.path) === 0) {
                this.updateChildNames();
            }
        });
        this.updateChildNames();
    }
});
