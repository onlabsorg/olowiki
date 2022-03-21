<template>
    <v-treeview class="olo-tree"
        dense hoverable color="black"

        :items="items"
        :load-children="loadChildren"
        
        activatable
        :active="[active]"
        @update:active="notifyActiveItemChange"
        >
        <template v-slot:prepend="{ item, open }">
            <v-icon v-if="item.children">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
                mdi-file-document-outline
            </v-icon>
        </template>
        <template v-slot:append="{ item, leaf }">
            <v-menu offset-y v-if="item.mutable">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <olo-menu-item v-if="!leaf"
                        icon="mdi-plus"
                        title="New" 
                        kbshortcut="" 
                        @click="$emit('add-item', item.id)"
                        >
                    </olo-menu-item>
                    <olo-menu-item 
                        icon="mdi-content-copy"   
                        title="Copy"
                        kbshortcut="" 
                        @click="$emit('copy-item', item.id)"
                        >
                    </olo-menu-item>
                    <olo-menu-item 
                        icon="mdi-delete"   
                        title="Delete"       
                        kbshortcut="" 
                        @click="$emit('delete-item', item.id)"  
                        >
                    </olo-menu-item>
                    <olo-menu-item 
                        icon="mdi-download" 
                        title="Download"
                        kbshortcut="" 
                        @click="$emit('download-item', item.id)"
                        >
                    </olo-menu-item>
                </v-list>
            </v-menu>
        </template>
    </v-treeview>
</template>

<script>
import * as pathlib from 'path';

import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
Vue.use(AsyncComputed);

export default {
    
    name: 'olo-tree',
    
    components: {
        'olo-menu-item': () => import('./olo-menu-item'),
    },
    
    props: ['store', 'tree', 'active'],
    
    asyncComputed: {
        
        items: {
            async get () {
                if (!this.tree) return [];
                const rootItem = createItem(this.tree);
                await this.loadChildren(rootItem);
                return rootItem.children;
            },
            default: []
        }
    },
    
    methods: {
        
        async updateTree () {
            for (let item of this.items) {
                if (item.children && item.load) await this.updateChildren(item);
            }
        },
        
        async updateChildren (item) {
            const newChildren = await item.load();
            let lastIndex = 0;
            for (let newChild of newChildren) {
                const child = item.children.find(child => child.id === newChild.id);
                if (child) {
                    lastIndex = item.children.indexOf(child);
                    if (child.children) await this.updateChildren(child);
                } else {
                    item.children.splice(lastIndex+1, 0, newChild);
                }
            }
            
            const itemsToBeDeleted = [];
            for (let child of item.children) {
                const found = newChildren.find(newChild => newChild.id === child.id);
                if (!found) itemsToBeDeleted.push(child);
            }
            for (let child of itemsToBeDeleted) {
                const index = item.children.indexOf(child);
                item.children.splice(index, 1);
            }
        },
        
        async loadChildren (item) {
            if (item.load) {
                item.children = await item.load();
            }
        },
        
        async handleStoreChange (change) {
            await this.updateTree();
            return change;
        },
         
        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        }        
    },
    
    async mounted () {
        this.store.onChange(this.handleStoreChange.bind(this));
    }
}

function createItem (itemDefinition) {
    const item = {};
    item.id = pathlib.normalize(itemDefinition.path || '/');
    item.mutable = Boolean(itemDefinition.mutable);
    item.name = String(itemDefinition.name || "");
    if (typeof itemDefinition.children === "function") {
        // TODO: unwrap should not be necessary after swan is fixed
        item.load = async () => unwrap(await itemDefinition.children(itemDefinition)).map(createItem);
        item.children = [];
    } else if (Array.isArray(itemDefinition.children)) {
        item.children = itemDefinition.children.map(createItem)
    }
    return item;
}

function unwrap (term) {
    return typeof term.unwrap === "function" ? term.unwrap() : term;
}
</script>

<style>
</style>