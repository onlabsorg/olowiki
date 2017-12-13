const Path = require("olojs/path");
const Value = require("olojs/value");
const Change = require("olojs/change");

const Model = require("model");

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

        this.addEventListener('olo-tree-item-click', event => {
            const modelAttr = Path.parse(event.detail.path).toString();
            this.setAttribute("model", modelAttr);
        });


        const splitOptions = {
            sizes: [25, 75],
            gutterSize: 6,
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
        this._split = Split([this.$("nav"), this.$("#content")], splitOptions);


        this.tabIndex = 1;
        this.addEventListener("keydown", event => this._handleKeyDown(event));

        this.dialog.addEventListener("keydown", event => event.stopPropagation());
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

    _handleKeyDown (event) {
        event.keyString = keyString(event);
        switch (event.keyString) {

            case "enter":
                this._editItemName();
                break;

            case "ctrl-enter":
                this.editTemplate();
                break;

            case "ctrl-shift-enter":
                this.editDocument();
                break;

            case "up":
                this._selectPreviousItem();
                break;

            case "down":
                this._selectNextItem();
                break;

            case "left":
                var selectedPath = this.tree.selectedPath;
                if (String(selectedPath) !== String(this.tree.modelPath)) {
                    this.tree.collapse(selectedPath);
                }
                break;

            case "right":
                var selectedPath = this.tree.selectedPath;
                if (String(selectedPath) !== String(this.tree.modelPath)) {
                    this.tree.expand(selectedPath);
                }
                break;
        }
    }

    _editItemName () {
        const selectedPath = this.tree.selectedPath;
        this.dialog.input("Change item name:", selectedPath.leaf)
        .then(newName => {
            if (newName !== selectedPath.leaf) {
                const doc = model.getDocument();
                const modelValue = model.getModel(selectedPath);
                doc.delete(`/data/${selectedPath}`);
                doc.set(`/data/${selectedPath}/../${newName}`, modelValue);
                this.tree.selectedPath = `/${selectedPath}/../${newName}`;
            }
        });
    }

    _selectPreviousItem () {
        const selectedPath = Path.parse(this.tree.selectedPath);
        if (String(selectedPath) === String(this.tree.modelPath)) return;

        const previousSibling = this.tree.getPreviousSiblingPath(selectedPath);
        if (previousSibling) {
            var previousItemPath = previousSibling;
            while (!this.tree.isCollapsed(previousItemPath)) {
                let previousItemChildPaths = this.tree.getChildPaths(previousItemPath);
                if (previousItemChildPaths.length === 0) break;
                previousItemPath = previousItemChildPaths.pop();
            }
            this.tree.selectedPath = previousItemPath;
        } else {
            this.tree.selectedPath = selectedPath.parent;
        }
    }

    _selectNextItem () {
        const selectedPath = this.tree.selectedPath;

        if (!this.tree.isCollapsed(selectedPath)) {
            let childPaths = this.tree.getChildPaths(selectedPath);
            if (childPaths.length > 0) {
                this.tree.selectedPath = childPaths[0];
                return;
            }
        }

        const nextSiblingPath = this.tree.getNextSiblingPath(selectedPath);
        if (nextSiblingPath) {
            this.tree.selectedPath = nextSiblingPath;
        } else {
            var parentPath = selectedPath;
            while (String(parentPath) !== String(this.tree.modelPath)) {
                let nextItemPath = this.tree.getNextSiblingPath(parentPath);
                if (nextItemPath) {
                    this.tree.selectedPath = nextItemPath;
                    return;
                }
                parentPath = parentPath.parent;
            }
        }
    }
}

module.exports = OloOutliner.register("olo-outliner");
