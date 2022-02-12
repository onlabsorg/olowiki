<template>
    <v-treeview class="olo-tree"
        dense hoverable color="black"

        :items="items"
        
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
    </v-treeview>
</template>

<script>

export default {
    
    name: 'olo-index',
    
    props: ['items', 'active'],
    
    data: () => ({}),
    
    methods: {
        
        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        }
    }
}
</script>

<style>
</style>