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
                let value = this.value;
                if (value.slice(0, 10) === '/.schemes/') {
                    value = value.slice(10).replace('/', ":/");
                }
                if (this.$refs.input.value !== value) {
                    this.$refs.input.value = value;
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

    .olo-omnibar input {
        width: 100%;
        font-size: 1.5em !important;
        color: #727272 !important;
        text-align: center !important;
        padding-left: 100px !important;
        padding-right: 100px !important;
        outline: none;
    }

    .olo-omnibar:hover {
        background-color: #D7D9DC;
    }

    .olo-omnibar:hover input {
        font-weight: 600;
    }

    .olo-omnibar.focused {
        background-color: #FBFBFF;
        border: 2px solid #1976D2;
    }

    .olo-omnibar.focused input {
        font-weight: 600;
        color: #212121 !important;
    }
</style>
