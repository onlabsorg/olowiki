<template>
    <v-treeview class="olo-tree"
        dense hoverable color="black"

        :items="children"
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
    
    props: ['store', 'root', 'active'],
    
    data: () => ({
        children: []
    }),
    
    computed: {
        
        id () {
            return this.root;
        }
    },
    
    watch: {
        store () { this.injectChildren(this) },
        root  () { this.injectChildren(this) }
    },
    
    methods: {
        
        async injectChildren (item) {
            item.children = await this.loadChildren(item.id);
        },
        
        async loadChildren (path) {
            const items = await this.store.list(path);
            return items.map(item_name => ({
                name: item_name.slice(-1) == "/" ? item_name.slice(0,-1) : item_name,
                id: pathlib.join(path, item_name),
                children: item_name.slice(-1) == "/" ? [] : undefined
                }))
                .filter( item => item.name && item.name[0] !== ".")
                .sort(compareItems);
        },
        
        async updateChildren (item, change) {
            if (change.path.indexOf(this.store.normalizePath(`${item.id}/`)) !== 0) return;
            const newChildren = await this.loadChildren(item.id);
            for (let newChild of newChildren) {
                const child = item.children.find(child => child.id === newChild.id);
                if (child) {
                    if (child.children) await this.updateChildren(child, change);
                } else {
                    for (var pos=0; pos<item.children.length; pos++) {
                        if (compareItems(item.children[pos], newChild) !== -1) break;
                    }
                    item.children.splice(pos, 0, newChild);
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
            await this.updateChildren(this, change);
        },
         
        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        }        
    },
    
    async mounted () {
        await this.injectChildren(this);
        this.store.onChange(this.handleStoreChange.bind(this));
    }
}

function compareItems (item1, item2) {
    if (item1.children && !item2.children) return -1;
    if (!item1.children && item2.children) return +1;
    return item1.name.localeCompare(item2.name);                
}
</script>

<style>
</style>