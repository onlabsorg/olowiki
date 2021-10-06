<template>
    <v-list-item @click="$emit('click', $event)">
        <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
            <v-list-item-action-text>{{ kbshortcut }}</v-list-item-action-text>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
export default {
    name: "olo-menu-item",
    props: ['icon', 'title', 'action', 'kbshortcut']
}
</script>

<style>
</style>