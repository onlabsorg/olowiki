


class OloElement extends HTMLElement {

    static register (tag) {
        customElements.define(tag, this);
        return this;
    }



    // LIFE CYCLE

    constructor () {
        super();
        this.attachShadow({mode: 'open'});
    }



    // SERVICE METHODS

    dispatch (eventName, eventDetail) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: eventDetail
        }));
    }

    $ (selector) {
        return this.shadowRoot.querySelector(selector);
    }
}



module.exports = OloElement.register('olo-element');
