<template>
    <v-text-field 
        :class="{'olo-omnibar':true, 'focused': focus}"
        :value="value"
        @change="$emit('input', $event)"
        @focus="focus = true"
        @blur="focus = false"
        :background-color="focus ? '#F8FAFD' : '#E8EAED'"
        :filled="!focus"
        :outlined="focus"
        flat solo>
    </v-text-field>
</template>

<script>
    export default {        
        name: "olo-omnibar",
        
        props: ['value'],
        
        data: () => ({
            focus: false
        }),
        
        computed: {},
        
        watch: {},
        
        methods: {}
    }
</script>

<style>

    .olo-omnibar.v-text-field input {
        font-size: 1.3em !important;
        color: #616161 !important;
        text-align: center !important;
        padding-left: 100px !important;
        padding-right: 100px !important;
    }
    
    .olo-omnibar.v-text-field.focused input {
        color: #212121 !important;
    }

</style>