<template>
    <md-list>
        
        <md-list-item v-for="dir in dirItems" v-bind:class="{highlighted:state.highlighted==dir.path}"
                md-expand :md-expanded="Boolean(state.expanded[dir.path])"
                @contextmenu.prevent.stop="emitTreeContextMenu({path:dir.path, x:$event.clientX, y:$event.clientY})">
            <md-icon>folder</md-icon>
            <span class="md-list-item-text" :class="{active:dir.path===selected}">{{pathName(dir.path)}}</span>
            <dir-tree slot="md-expand" class="indented-dir-tree"
                    :root="dir.path" 
                    :selected="selected" 
                    :change="change"
                    :state="state"
                    @tree-context-menu="emitTreeContextMenu"
                    >
            </dir-tree>
        </md-list-item>
        
        <md-list-item :href="'#'+doc.path" v-for="doc in docItems" v-bind:class="{highlighted:state.highlighted==doc.path}"
                @contextmenu.prevent.stop="emitTreeContextMenu({path:doc.path, x:$event.clientX, y:$event.clientY})">
            <md-icon>description</md-icon>
            <span class="md-list-item-text" :class="{active:doc.path===selected}">{{doc.name}}</span>
        </md-list-item>
    </md-list>
</template>

<script>
    const pathlib = require('path');
    
    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdList").default );     
    
    const isDir = name => name.slice(-1) === '/';
    const isDoc = name => !isDir(name);
    const isHidden = name => name[0] === '.';
    const isVisible = name => name[0] !== '.';   
    const compareItemsByName = (item1, item2) => item1.name.localeCompare(item2.name);
    
    module.exports = {   
        name: "dir-tree",
         
        props: ['root', 'selected', 'change', 'state'],
        
        data: () => ({
            childNames: [],
        }),
        
        watch: {
            
            root: function () {
                this.refresh();
            },
            
            change: function () {
                if (this.change.path.indexOf(this.root) === 0) {
                    this.refresh();
                }
            }
        },
        
        computed: {
            dirItems: function () {
                return this.childNames.filter(isDir).filter(isVisible).map(name => ({
                    isDir: true,
                    name: name.slice(0,-1),
                    path: this.root + name,
                })).sort(compareItemsByName);
            },
            docItems: function () {
                return this.childNames.filter(isDoc).filter(isVisible).map(name => ({
                    isDir: false,
                    name: name,
                    path: this.root + name,
                })).sort(compareItemsByName);
            },
        },
        
        methods: {
            
            async refresh () {
                const dirPath = pathlib.normalize(`/${this.root}/`);
                this.childNames = await olonv.listEntries(dirPath);
            },
            
            docPath (name) {
                return this.root + name;
            },
            
            pathName (path) {
                const normPath = isDir(path) ? path.slice(0,-1) : path;
                const lastSlashPos = normPath.lastIndexOf('/');
                return normPath.slice(lastSlashPos+1);
            },
            
            emitTreeContextMenu (data) {
                this.$emit('tree-context-menu', data);
            }       
        },
        
        mounted () {
            this.refresh();
        }
    }
</script>

<style>
    .md-list-item-content {
        min-height: 32px;
    }
    .md-list-item-content>.md-icon:first-child {
        margin-right: 8px;
    }
    .indented-dir-tree {
        margin-left: 16px;
    }
    .md-list-item-expand {
        border: none;
    }
    i.md-list-expand-icon {
        display: none;
    }
    .md-list-item.highlighted {
        border: 1px dashed #1976D2;
    }
</style>
