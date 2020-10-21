<template>
    <md-list>        
        <md-list-item md-expand v-for="dir in dirItems"
                @contextmenu.prevent.stop="contextMenuPath=dir.path">
            <md-icon>folder</md-icon>
            <span class="md-list-item-text" :class="{active:dir.path===selected}">{{dir.name}}</span>
            <md-button class="md-icon-button md-list-action" v-if="contextMenuPath === dir.path" 
                    @click.prevent.stop="emitAdd(dir.path)">
                <md-icon class="md-primary">note_add</md-icon>
            </md-button>                    
            <md-button class="md-icon-button md-list-action" v-if="contextMenuPath === dir.path" 
                    @click.prevent.stop="emitDelete(dir.path)">
                <md-icon class="md-primary">delete</md-icon>
            </md-button>                    
            <dir-tree slot="md-expand" class="indented-dir-tree" 
                    :root="dir.path" 
                    :selected="selected"
                    :change="change"
                    @add-tree-item="emitAdd"
                    @delete-tree-item="emitDelete">
            </dir-tree>
        </md-list-item>
    
        <md-list-item :href="'#'+doc.path" v-for="doc in docItems"
                @contextmenu.prevent.stop="contextMenuPath=doc.path">
            <md-icon>description</md-icon>
            <span class="md-list-item-text" :class="{active:doc.path===selected}">{{doc.name}}</span>
            <md-button class="md-icon-button md-list-action" v-if="contextMenuPath === doc.path" 
                    @click.prevent.stop="emitDelete(doc.path)">
                <md-icon class="md-primary">delete</md-icon>
            </md-button>                    
        </md-list-item>
    </md-list>
</template>

        

<script>
    const pathlib = require('path');
    
    const Vue = require("vue/dist/vue");
    Vue.use( require("vue-material/dist/components/MdButton").default );
    Vue.use( require("vue-material/dist/components/MdIcon").default );
    Vue.use( require("vue-material/dist/components/MdList").default );     
    Vue.use( require("vue-material/dist/components/MdCard").default );     
    
    const isDir = name => name.slice(-1) === '/';
    const isDoc = name => !isDir(name);
    const isHidden = name => name[0] === '.';
    const isVisible = name => name[0] !== '.';     
    
    module.exports = {   
        name: "dir-tree",
         
        props: ['root', 'selected', 'change'],
        
        data: () => ({
            childNames: [],
            contextMenuPath: ''
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
                const doc = await olonv.readDocument(dirPath);
                const docns = await doc.evaluate(doc.createContext());
                this.childNames = Array.from(docns.children).filter(isVisible).sort();
            },
            
            docPath (name) {
                return this.root + name;
            },
            
            emitAdd (path) {
                this.$emit('add-tree-item', path);
                this.contextMenuPath = "";
            },
            
            emitDelete (path) {
                this.$emit('delete-tree-item', path);
                this.contextMenuPath = "";
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
