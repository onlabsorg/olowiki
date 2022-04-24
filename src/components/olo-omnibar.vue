<template>
    <div class="olo-omnibar" :class="{focused: focus}">
        <input ref="input" type="text">
    </div>
</template>

<script>
    export default {        
        name: "olo-omnibar",
        
        props: ['value'],
        
        data: () => ({
            focus: false
        }),
        
        computed: {},
        
        watch: {
            
            value () {
                this.updateInput();
            }
        },
        
        methods: {
            
            updateInput () {
                if (this.$refs.input.value !== this.value) {
                    this.$refs.input.value = this.value;
                }                
            },
            
            handleInputChange () {
                this.$emit('input', this.$refs.input.value);
                this.$refs.input.blur();
            },
            
            handleInputFocus () {
                this.focus = true;
            },
            
            handleInputBlur () {
                this.focus = false;
            }
        },
        
        mounted () {            
            this.$refs.input.addEventListener('change', this.handleInputChange.bind(this));
            this.$refs.input.addEventListener('focus', this.handleInputFocus.bind(this));
            this.$refs.input.addEventListener('blur', this.handleInputBlur.bind(this));
            this.updateInput();
        }
    }
</script>

<style>

    .olo-omnibar {
        display: flex;
        align-items: stretch;
        width: 100%;
        background-color: #E8EAED;
        padding: 8px 18px;
    }

    .olo-omnibar.focused {
        background-color: #FBFBFF;
        border: 2px solid #1976D2;
    }

    .olo-omnibar input {
        width: 100%;
        font-size: 1.5em !important;
        color: #616161 !important;
        text-align: center !important;
        padding-left: 100px !important;
        padding-right: 100px !important;
        outline: none;
    }

    .olo-omnibar.focused input {
        color: #212121 !important;
    }
</style>