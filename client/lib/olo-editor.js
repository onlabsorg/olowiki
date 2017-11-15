const ace = require("./olo-editor/ace-shadowDOM-shim");

const OloComponent = require("olo-component");
const oloEditorTemplate = require("./olo-editor/olo-editor.html!text");


class OloEditor extends OloComponent {

    static get template () {
        return oloEditorTemplate;
    }

    constructor () {
        super();
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

        session.on("change", (event) => this._handleContentChange(event));
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

    updateView () {
        const oldContent = this.aceEditor.getValue();
        const newContent = (this.model === null) ? "" : this.model.value;
        if (newContent !== oldContent) {
            this.aceEditor.setValue(newContent, -1);
        }
        this.aceEditor.setReadOnly(this.model && this.model.readonly);
    }

    _handleContentChange (event) {
        const oldTemplate = (this.model === null) ? "" : this.model.value;
        const newTemplate = this.aceEditor.getValue();
        if (this.model && newTemplate !== oldTemplate) this.model.value = newTemplate;
    }

    focus () {
        this.aceEditor.focus();
    }
}


module.exports = OloEditor.register("olo-editor");
