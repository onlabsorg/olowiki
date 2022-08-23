<template>
    <div>
        <v-treeview class="olo-tree-root"
            dense hoverable color="black"
            :items="rootItem"
            activatable :active="[active]" @update:active="notifyActiveItemChange"
            >
            <template v-slot:prepend="{}">
                <v-icon>mdi-home-outline</v-icon>
            </template>
            <template v-slot:label="{item}">
                {{mini ? "" : item.name}}
            </template>
        </v-treeview>
        <v-treeview class="olo-tree" :class="{hidden: mini}"
            dense hoverable color="black"
            :items="children"
            activatable :active="[active]" @update:active="notifyActiveItemChange"
            >
            <template v-slot:prepend="{ item }">
                <v-icon v-if="item.children">
                    mdi-file-document-multiple-outline
                </v-icon>
                <v-icon v-else>
                    mdi-file-document-outline
                </v-icon>
            </template>
        </v-treeview>
    </div>
</template>

<script>
import * as pathlib from 'path';

export default {

    name: 'olo-tree',

    props: ['toc', 'store', 'root', 'active', 'mini'],

    data: () => ({}),

    computed: {
        
        children () {
            return this.createChildren(this.rootId, this.toc || [])
        },
        
        rootItem () {
            return [{
                name: "Home",
                id: this.rootId 
            }]
        },
        
        rootId () {
            return pathlib.normalize(`/${this.root}/`);
        }         
    },

    watch: {
        store () { this.updateTOC() },
        root  () { this.updateTOC() }
    },

    methods: {

        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        },
        
        createChildren (parentPath, toc) {
            let count = 0;
            
            return toc.map(item => {
                
                if (typeof item === "string") {
                    return this._createChild(parentPath, item);
                }
                
                if (item && typeof item === "object") {
                    return this._createChild(parentPath, item.name, item.target, item.children);
                }
                
                return this._createChild(parentPath, `Undefined Item ${count++}`);
            });            
        },
        
        _createChild (parentPath, name, target, children) {
            const child = {};
            
            child.name = String(name);
                        
            const relativeId = typeof target === 'string' ? target : child.name.toLowerCase().replaceAll(' ','_');
            child.id = this.store.normalizePath( this.store.resolvePath(parentPath, relativeId) );
            
            if (Array.isArray(children)) {
                child.id += "/";
                child.children = this.createChildren(child.id, children);
            }
            
            return child;
        }
    }
}
</script>

<style>

    .olo-tree-root .v-treeview-node__level {
        display: none;
    }
    
    .olo-tree.hidden {
        display: none;
    }
</style>
