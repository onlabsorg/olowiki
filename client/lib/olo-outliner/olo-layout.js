
const OloElement = require("olo-element");
const oloLayoutTemplate = require("./olo-layout.html!text");

const Split = require("./Split");
const keyString = require("utils/key-string");


class OloLayout extends OloElement {

    constructor () {
        super();
        this.shadowRoot.innerHTML = oloLayoutTemplate;

        const splitOptions = {
            sizes: [25, 75],
            gutterSize: 2,
            minSize: 200,
            elementStyle: function (dimension, size, gutterSize) {
                return {
                    'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)'
                }
            },
            gutterStyle: function gutterStyle (dimension, gutterSize) {
                return {
                    'flex-basis':  gutterSize + 'px'
                }
            },
            onDragEnd: () => {splitOptions.sizes = this._split.getSizes()}
        }

        this._split = Split([this.$("#menu"), this.$("#content")], splitOptions);

        this.$("#dialog").style.display = "none";
        this.$("#dialog-background").style.display = "none";
    }

    pushMessage (message) {
        const messageElt = document.createElement('div');
        messageElt.setAttribute("class", "snackbar");
        messageElt.innerHTML = message;
        this.$("#snackbars").appendChild(messageElt);

        const done = () => this.$("#snackbars").removeChild(messageElt);
        const timeout = (time=1500) => new Promise((resolve, reject) => {
            setTimeout(() => {
                done();
                resolve();
            }, time);
        });

        return {done:done, timeout:timeout};
    }

    async dialog (title, form) {
        this.$("#dialog").style.display = "block";
        this.$("#dialog-background").style.display = "block";
        this.$("#dialog-title").innerHTML = title;
        this.$("form").innerHTML = form;

        return new Promise((resolve, reject) => {

            let submit = () => {
                const formData = {};
                const formFields = this.$("form").elements;
                for (let i=0; i<formFields.length; i++) {
                    let formField = formFields[i];
                    formData[formField.name] = formField.value;
                }
                close();
                resolve(formData);
            }

            let cancel = () => {
                close();
                resolve(null);
            }

            let onKeyDown = event => {
                const keyStr = keyString(event);
                switch (keyStr) {
                    case "enter":
                        event.preventDefault();
                        submit();
                        break;
                    case "esc":
                        cancel();
                        break;
                }
            }

            let close =(formData) => {
                this.$("#dialog").removeEventListener('keydown', onKeyDown);
                this.$("#dialog-cancel-button").removeEventListener('click', cancel);
                this.$("#dialog-submit-button").removeEventListener('click', submit);
                this.$("#dialog").style.display = "none";
                this.$("#dialog-background").style.display = "none";        
            }

            this.$("#dialog").addEventListener('keydown', onKeyDown);
            this.$("#dialog-cancel-button").addEventListener('click', cancel);
            this.$("#dialog-submit-button").addEventListener('click', submit);
        });
    }
}


module.exports = OloLayout.register("olo-layout");
