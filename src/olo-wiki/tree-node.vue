<template>
    <md-list-item md-expand :md-expanded="Boolean(state.expanded[root])"
            @contextmenu.prevent.stop="state.contextMenuPath=root">
        <md-icon>{{icon}}</md-icon>
        <span class="md-list-item-text" :class="{active:root===selected}">{{pathName(root)}}</span>
        <md-button class="md-icon-button md-list-action" v-if="state.contextMenuPath === root" 
                @click.prevent.stop="emitAdd(root)">
            <md-icon class="md-primary">add</md-icon>
        </md-button>                    
        <md-button class="md-icon-button md-list-action" v-if="state.contextMenuPath === root && deleteable" 
                @click.prevent.stop="emitDelete(root)">
            <md-icon class="md-primary">delete</md-icon>
        </md-button>                    
        <md-list slot="md-expand" class="indented-dir-tree">
            <tree-node v-for="dir in dirItems"
                    :root="dir.path" 
                    :selected="selected"
                    :change="change"
                    :state="state"
                    icon="folder"
                    :deleteable="true"
                    @add-tree-item="emitAdd"
                    @delete-tree-item="emitDelete">
            </tree-node>
            <md-list-item :href="'#'+doc.path" v-for="doc in docItems"
                    @contextmenu.prevent.stop="state.contextMenuPath=doc.path">
                <md-icon>description</md-icon>
                <span class="md-list-item-text" :class="{active:doc.path===selected}">{{doc.name}}</span>
                <md-button class="md-icon-button md-list-action" v-if="state.contextMenuPath === doc.path" 
                        @click.prevent.stop="emitDelete(doc.path)">
                    <md-icon class="md-primary">delete</md-icon>
                </md-button>                    
            </md-list-item>
        </md-list>
    </md-list-item>    
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
    
    module.exports = {   
        name: "tree-node",
         
        props: ['root', 'selected', 'change', 'state', 'icon', 'deleteable'],
        
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
                return this.childNames.filter(isDir).map(name => ({
                    name: name.slice(0,-1),
                    path: this.root + name,
                }))
            },
            docItems: function () {
                return this.childNames.filter(isDoc).map(name => ({
                    name: name,
                    path: this.root + name,
                }));                
            },
        },
        
        methods: {
            
            async refresh () {
                const dirPath = pathlib.join('/', this.root, '/');
                console.log("@dir-tree.refresh:", dirPath)
                const doc = await olonv.readDocument(dirPath);
                const docns = await doc.evaluate(doc.createContext());
                console.log("@dir-tree.refresh:", docns.children)
                this.childNames = docns.children ?
                        Array.from(docns.children).filter(isVisible).sort() : [];
            },
            
            docPath (name) {
                return this.root + name;
            },
            
            pathName (path) {
                const normPath = isDir(path) ? path.slice(0,-1) : path;
                const lastSlashPos = normPath.lastIndexOf('/');
                return normPath.slice(lastSlashPos+1);
            },
            
            emitAdd (path) {
                this.$emit('add-tree-item', path);
                this.state.contextMenuPath = "";
            },
            
            emitDelete (path) {
                this.$emit('delete-tree-item', path);
                this.state.contextMenuPath = "";
            },                        
        },
        
        mounted () {
            this.refresh();
        }
    }
</script>

<style>
    .
    .md-list-item-content {
        min-height: 40px;
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
</style>
