const fontAwesomeURL = require("font-awesome/css/font-awesome.min.css!path");

class FontAwesome extends HTMLElement {

    constructor () {
        super();
        const linkElt = document.createElement('link');
        linkElt.rel = "stylesheet";
        linkElt.href = fontAwesomeURL;
        this.appendChild(linkElt);
    }
}

customElements.define("font-awesome", FontAwesome);

module.exports = FontAwesome;
