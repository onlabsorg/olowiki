<template>
    <v-treeview class="olo-tree"
        dense hoverable color="black"

        :items="children"

        activatable
        :active="[active]"
        @update:active="notifyActiveItemChange"
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
</template>

<script>
import * as pathlib from 'path';

export default {

    name: 'olo-tree',

    props: ['store', 'root', 'active'],

    data: () => ({
        toc: [],
    }),

    computed: {

        children () {
            return Children('/', this.toc);
        }
    },

    watch: {
        store () { this.updateTOC() },
        root  () { this.updateTOC() }
    },

    methods: {

        async updateTOC () {
            const {data} = await this.store.load(this.root);
            this.toc = Array.isArray(data._toc) ? data._toc : [];
        },

        async handleStoreChange () {
            await this.updateTOC();
        },

        notifyActiveItemChange (activeItems) {
            this.$emit('update:active', activeItems[0] || "");
        }
    },

    async mounted () {
        await this.updateTOC();
        this.store.onChange(this.handleStoreChange.bind(this));
    }
}

const Children = (path, toc) => toc.map(item => {
    const child = {
        name: item.name,
        id: pathlib.join(path, item.name) + (item.children ? "/" : "")
    };
    if (Array.isArray(item.children)) {
        child.children = Children(child.id, item.children);
    }
    return child;
});
</script>

<style>
</style>
