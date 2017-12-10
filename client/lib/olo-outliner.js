const Path = require("olojs/path");
const Value = require("olojs/value");
const Change = require("olojs/change");

const model = require("model");

const OloComponent = require("olo-component");
const OloOutlinerDialog = require("olo-outliner/olo-outliner-dialog");
const OloViewer = require("olo-viewer");
const OloEditor = require("olo-editor");
const OloTree = require("olo-tree");
const FontAwesome = require("/lib/themes/font-awesome");

const keyString = require("utils/key-string");

const Split = require("olo-outliner/Split");
const oloOutlinerTemplate = require("olo-outliner/olo-outliner.html!text");

const YAML = require("js-yaml");



class OloOutliner extends OloComponent {

    static get template () {
        return oloOutlinerTemplate;
    }

    constructor () {
        super();

        this.addEventListener('olo-tree-node-selected', event => {
            const modelAttr = Path.parse(event.detail.path).toString();
            this.viewer.setAttribute("model", modelAttr);
        });

        this._initLayout();

        this.$("nav").tabIndex = 1;
        this.$("nav").addEventListener("keydown", event => {
            event.targetComponent = "tree";
        });

        this.viewer.tabIndex = 1;
        this.viewer.addEventListener("keydown", event => {
            event.targetComponent = "viewer";
        });

        this.editor.tabIndex = 1;
        this.editor.addEventListener("keydown", event => {
            event.targetComponent = "editor";
        });

        this.addEventListener("keydown", event => {
            event.keyString = keyString(event);
            if (event.keyString === "ctrl-enter") this.editTemplate();
        });
    }

    _initLayout () {

        function elementStyle (dimension, size, gutterSize) {
            return {
                'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)'
            }
        }

        function gutterStyle (dimension, gutterSize) {
            return {
                'flex-basis':  gutterSize + 'px'
            }
        }

        this._mainSplitOptions = {
            sizes: [25, 75],
            gutterSize: 6,
            minSize: 200,
            elementStyle: elementStyle,
            gutterStyle: gutterStyle,
            onDragEnd: () => {this._mainSplitOptions.sizes = this._mainSplit.getSizes()}
        }

        this._mainSplit = Split([this.$("nav"), this.$("#content")], this._mainSplitOptions);
    }

    get dialog () {
        return this.$("olo-outliner-dialog");
    }

    get tree () {
        return this.$("olo-tree");
    }

    get viewer () {
        return this.$("olo-viewer");
    }

    get editor () {
        return this.$("olo-editor");
    }

    addButton (faIconName, onClick) {
        const button = document.createElement("span");
        button.setAttribute("class", `control fa fa-${faIconName}`);
        button.setAttribute("aria-hidden", true);
        this.$("#controls").appendChild(button);
        button.addEventListener("click", onClick);
    }

    async editTemplate () {
        console.log(this.editor.getMode());
        const templatePath = Path.parse(this.viewer.modelPath, '__template__');
        const oldTemplate = model.getModel(templatePath) || "";

        this.editor.setMode("markdown");
        const newTemplate = await this._edit(oldTemplate);
        if (newTemplate === null) return;

        model.setModel(templatePath, newTemplate);
    }

    async editDocument () {
        const doc = model.getDocument();
        const oldDocHash = doc.get("/");
        const oldYAML = YAML.dump(oldDocHash);

        this.editor.setMode("yaml");
        const newYAML = await this._edit(oldYAML);
        if (newYAML === null) return;

        const newDocHash = YAML.load(newYAML);
        const changes = Change.diff(oldDocHash, newDocHash);
        doc.applyChanges(...changes);
    }

    _edit (text) {
        return new Promise((resolve, reject) => {
            this.$("#content").classList.add("edit");
            this.editor.value = text;

            const done = (retval) => {
                this.$("#content").classList.remove("edit");
                this.editor.removeEventListener("keydown", onKeyDown);
                this.editor.removeEventListener("focusout", onFocusOut);
                this.viewer.focus();
                resolve(retval);
            }

            const onKeyDown = event => {
                const keyStr = keyString(event);
                switch (keyStr) {
                    case "ctrl-enter":
                        event.stopPropagation();
                        done(this.editor.value);
                        break;
                    case "esc":
                        event.stopPropagation();
                        done(null);
                        break;
                }
            }
            this.editor.addEventListener("keydown", onKeyDown);

            const onFocusOut = event => {
                done(this.editor.value);
            }
            this.editor.addEventListener("focusout", onFocusOut);

            this.editor.focus();
        });
    }
}

module.exports = OloOutliner.register("olo-outliner");
