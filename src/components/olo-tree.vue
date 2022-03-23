<template>
    <v-treeview class="olo-tree"
        dense hoverable color="black"

        :items="items"
        :load-children="injectChildren"
        
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
            <v-menu offset-y>
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

export default {
    
    name: 'olo-tree',
    
    components: {
        'olo-menu-item': () => import('./olo-menu-item'),
    },
    
    props: ['store', 'active'],
    
    data: () => ({
        items: []
    }),
    
    watch: {
        store () {
            this.initTree();
        }
    },
    
    methods: {
        
        async initTree () {
            this.items = await this.loadChildren('/');
        },
        
        async injectChildren (item) {
            item.children = await this.loadChildren(item.id);
        },
        
        async loadChildren (path) {
            const items = await this.store.list(path);
            return items.map(item_name => ({
                name: item_name.slice(-1) == "/" ? item_name.slice(0,-1) : item_name,
                id: pathlib.join(path, item_name),
                children: item_name.slice(-1) == "/" ? [] : undefined
            })).filter(
                item => item.name && item.name[0] !== "."
            ).sort((item1, item2) => {
                if (item1.children && !item2.children) return -1;
                if (!item1.children && item2.children) return +1;
                return item1.name.localeCompare(item2.name);            
            });
        },
                
        async updateChildren (item) {
            const newChildren = await this.loadChildren(item.id);
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
        
        async handleStoreChange (change) {
            for (let item of this.items) {
                if (item.children) await this.updateChildren(item);
            }
            return change;
        },
         
        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        }        
    },
    
    async mounted () {
        await this.initTree();
        this.store.onChange(this.handleStoreChange.bind(this));
    }
}
</script>

<style>
</style>