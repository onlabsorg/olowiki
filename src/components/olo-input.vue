<template>
    <v-dialog olo-input
        v-model="show" 
        max-width="60%" 
        @keydown="handleKeydown"
        >
        
        <v-card>
        
            <v-card-title></v-card-title>
            
            <v-card-text> 
                <v-text-field ref="input"
                    autofocus
                    filled 
                    outlined 
                    persistent-hint
                    :hint="question"
                    v-model="text"
                    >
                </v-text-field>
            </v-card-text>        
        
        </v-card>
    </v-dialog>
</template>

<script>
    export default {        
        name: "olo-input",        
        
        data: () => ({
            show: false,
            question: "",
            text: "",
            answer: "",
            callback: () => {}
        }),
        
        watch: {
            
            show () {
                if (!this.show) {
                    this.callback(this.answer);
                }                
            }
        },
        
        methods: {
            
            ask (question, defaultAnswer="") {
                this.question = question;
                this.text = defaultAnswer;
                this.answer = "";
                this.show = true;
                return new Promise((resolve) => {
                    this.callback = resolve;
                });
            },
            
            handleKeydown (event) {
                if (event.key === 'Enter') {
                    this.answer = this.text;
                    this.show = false;
                }
            }
        }
    }
</script>

<style>
    .v-dialog__content {
        align-items: start !important;
    }
</style>