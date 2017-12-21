const ace = require("./olo-editor/ace-shadowDOM-shim");
const YAML = require("js-yaml");

const Change = require("olojs/change");
const Model = require("model");

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
        var content;
        if (!this.model) {
            content = "";
        } else if (this.model.type() === "Object") {
            content = YAML.dump(this.model.get());
        } else {
            content = String(this.model.get());
        }
        this.aceEditor.setValue(content, -1);
    }

    commit () {
        if (!this.model) return false;

        const oldValue = this.model.get("/");
        if (this.model.type() === "Object") {
            var newValue = YAML.load(this.aceEditor.getValue());
            var changes = Change.diff(oldValue, newValue);
            if (changes.length === 0) return false;
            this.model.applyChanges(...changes);
        } else {
            var newValue = this.aceEditor.getValue();
            if (oldValue === newValue) return false;
            this.model.set('/', newValue);
        }
        return true;
    }

    focus () {
        this.aceEditor.focus();
    }
}


module.exports = OloEditor.register("olo-editor");
