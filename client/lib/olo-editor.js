const ace = require("./olo-editor/ace-shadowDOM-shim");

const model = require("model");

const OloElement = require("olo-element");
const oloEditorTemplate = require("./olo-editor/olo-editor.html!text");



class OloEditor extends OloElement {

    constructor () {
        super();
        this.shadowRoot.innerHTML = oloEditorTemplate;

        this.aceEditor = ace.edit(this.$("#editor"), this.$("#header"));

        this.aceEditor.$blockScrolling = Infinity;
        this.aceEditor.setFontSize("11pt");
        this.aceEditor.setReadOnly(false);

        var session = this.aceEditor.getSession();
        session.setUseSoftTabs(true);
        session.setTabSize(4);
        session.setUseWrapMode(false);

        this.setMode("handlebars");
        this.setTheme("iplastic");
    }

    setMode (mode) {
        this.aceEditor.getSession().setMode(`ace/mode/${mode}`);
    }

    getMode () {
        return this.aceEditor.getSession().$modeId.substr(9);
    }

    setTheme (theme) {
        this.aceEditor.setTheme(`ace/theme/${theme}`);
    }

    get value () {
        return this.aceEditor.getValue();
    }

    set value (newValue) {
        newValue = String(newValue);
        this.aceEditor.setValue(newValue, -1);
    }

    focus () {
        this.aceEditor.focus();
    }
}


module.exports = OloEditor.register("olo-editor");
