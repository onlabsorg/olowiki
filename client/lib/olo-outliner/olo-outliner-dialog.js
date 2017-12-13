const OloElement = require("olo-element");
const oloOutlinerDialogTemplate = require("./olo-outliner-dialog.html!text");

const keyString = require("utils/key-string");


class OloOutlinerDialog extends OloElement {

    constructor () {
        super();
        this.shadowRoot.innerHTML = oloOutlinerDialogTemplate;
    }

    pushMessage (message) {
        const messageElt = document.createElement('span');
        messageElt.setAttribute("slot", "message");
        messageElt.innerHTML = message;
        this.appendChild(messageElt)

        const done = () => this.removeChild(messageElt);
        const timeout = (time=1500) => new Promise((resolve, reject) => {
            setTimeout(() => {
                done();
                resolve();
            }, time);
        });

        return {done:done, timeout:timeout};
    }

    input (message, startVal="", type="text") {
        return new Promise ((resolve, reject) => {
            const messageElt = document.createElement('span');
            messageElt.setAttribute("slot", "message");
            messageElt.innerHTML = `${message}: <input type="${type}"></input>`;
            this.appendChild(messageElt);
            const inputElt = messageElt.querySelector("input");
            inputElt.value = startVal;
            inputElt.addEventListener("keydown", event => {
                if (keyString(event) === "esc") {
                    inputElt.value = startVal;
                    inputElt.dispatchEvent(new CustomEvent('change'));
                }
            });
            inputElt.addEventListener('change', () => {
                var value = inputElt.value;
                this.removeChild(messageElt);
                resolve(value);
            });
            inputElt.focus();
        });
    }

    ask (question, ...options) {
        return new Promise ((resolve, reject) => {
            const messageElt = document.createElement('span');
            messageElt.setAttribute("slot", "message");
            messageElt.innerHTML = question;
            for (let option of options) {
                let button = document.createElement('button');
                button.setAttribute("style", "margin: 0 0.3em;")
                button.textContent = option;
                button.addEventListener('click', () => {
                    this.removeChild(messageElt);
                    resolve(option);
                });
                messageElt.appendChild(button);
            }
            this.appendChild(messageElt);
        });
    }
}


module.exports = OloOutlinerDialog.register('olo-outliner-dialog');
