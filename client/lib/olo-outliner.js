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



class OloOutliner extends OloComponent {

    static get template () {
        return oloOutlinerTemplate;
    }

    constructor () {
        super();


        // INIT MAIN LAYOUT

        if (!this.hasAttribute("mode")) this.setAttribute("mode", "view");

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


        // INIT VIEWER

        this.viewer.tabIndex = 1;
        this.viewer.addEventListener("keydown", event => this._handleViewerKeyDown(event));


        // INIT EDITOR

        this.editor.tabIndex = 1;
        this.editor.addEventListener("keydown", event => this._handleEditorKeyDown(event));


        // INIT TREE

        this.addEventListener('olo-tree-item-click', event => {
            const modelAttr = Path.parse(event.detail.path).toString();
            this.setAttribute("model", modelAttr);
        });

        this.$("nav").tabIndex = 1;
        this.$("nav").addEventListener("keydown", event => this._handleTreeKeyDown(event));


        // INIT HEADER

        this.$("#button-edit").addEventListener("click", event => this._setEditMode(event.shiftKey));
        this.$("#button-done").addEventListener("click", event => this._setViewMode());
        this.$("#button-refresh").addEventListener("click", event => this.refreshDocument());
        this.$("#button-commit").addEventListener("click", event => this.commitDocument());
        this.$("#button-share").addEventListener("click", event => this.shareDocument());
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        if (attrName === "model" && this.getAttribute("mode") === "edit") {
            this._saveTemplate();
        }
        super.attributeChangedCallback(attrName, oldVal, newVal);
    }

    updateView () {
        const auth = this.model.document.auth;
        this.$("footer").innerHTML = auth ?
                `version: ${this.model.document.version} | user: ${auth.user} | permission: ${auth.permission} | pattern: ${auth.pattern}`:
                `version: ${this.model.document.version} | user: undefined`;
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

    refreshDocument () {
        if (typeof this.model.document.sync !== "function") {
            this.dialog.pushMessage("Document refresh not implemented!").timeout(1000);
            return;
        }

        const message = this.dialog.pushMessage("Syncing ...");
        this.model.document.sync()
        .then(() => {
            message.done();
            this.dialog.pushMessage("Synced!").timeout(1000);
        })
        .catch(error => {
            this.dialog.pushMessage("Failed!").timeout(1000);
        });

    }

    commitDocument () {
        if (typeof this.model.document.save !== "function") {
            this.dialog.pushMessage("Document commit not implemented!").timeout(1000);
            return;
        }

        this.dialog.ask("Commit release:", "major", "minor", "patch", "cancel")
        .then(releaseType => {
            if (releaseType === "cancel") return
            this.model.document.commit(releaseType);
            this.updateView();

            let message = this.dialog.pushMessage("Committing ...");
            this.model.document.save()
            .then(() => {
                message.done();
                this.dialog.pushMessage("Committed!").timeout(1000);
            })
            .catch(error => {
                message.done();
                this.dialog.pushMessage("Failed!").timeout(1000);
            });
        })
    }

    async shareDocument () {
        if (typeof this.model.document.share !== "function") {
            this.dialog.pushMessage("Document share not implemented!").timeout(1000);
            return;
        }

        const user = await this.dialog.input("User e-mail", "", "text");
        if (user === "") return;

        const permission = await this.dialog.ask("Granted permission", 'admin', 'write', 'read', 'none');
        if (permission === 'none') return;

        const expiresIn = await this.dialog.input("Permission expires in", "30d", "text");
        if (expiresIn === "") return;


        const message = this.dialog.pushMessage("Sharing document ...");
        try {
            var token = await this.model.document.share(user, permission, expiresIn);
            message.done();
        } catch (error) {
            var token = null;
            message.done();
            this.dialog.pushMessage("Failed!").timeout(1000);
        }

        if (token) {
            let url = `${location.origin}${location.pathname}?auth=${token}`;
            window.prompt("Shared URL (Ctrl+C, Enter)", url);
        }
    }

    _handleViewerKeyDown (event) {
        event.keyString = keyString(event);
        switch (event.keyString) {

            case "ctrl-enter":
                this._setEditMode();
                break;

            case "ctrl-shift-enter":
                this._setEditMode(true);
                break;
        }
    }

    _handleEditorKeyDown (event) {
        event.keyString = keyString(event);
        switch (event.keyString) {

            case "ctrl-enter":
                this._setViewMode();
                break;
        }
    }

    _handleTreeKeyDown (event) {
        event.keyString = keyString(event);
        switch (event.keyString) {

            case "enter":
                this._editItemName();
                break;

            case "ctrl-enter":
                var mode = this.getAttribute("mode");
                if (mode === "view") this._setEditMode();
                else if (mode === "edit") this._setViewMode();
                break;

            case "ctrl-shift-enter":
                this._setEditMode(true);
                break;

            case "up":
                this._selectPreviousItem();
                break;

            case "down":
                this._selectNextItem();
                break;

            case "left":
                var selectedPath = this.tree.model.path;
                if (String(selectedPath) !== String(this.tree.modelPath)) {
                    this.tree.collapse(selectedPath);
                }
                break;

            case "right":
                var selectedPath = this.tree.model.path;
                if (String(selectedPath) !== String(this.tree.modelPath)) {
                    this.tree.expand(selectedPath);
                }
                break;
        }
    }

    _editItemName () {
        const oldName = this.model.path.leaf;
        this.dialog.input("Change item name:", oldName)
        .then(newName => {
            if (newName !== oldName) {
                const parentModel = this.model.getSubModel("..");
                const modelValue = parentModel.get(oldName);
                parentModel.delete(oldName);
                parentModel.set(newName, modelValue);
                this.setAttribute("model", `${parentModel.path}/${newName}`);
            }
        });
    }

    _selectPreviousItem () {
        const selectedPath = this.model.path;
        if (String(selectedPath) === "/") return;

        const previousSibling = this.tree.getPreviousSiblingPath(selectedPath);
        if (previousSibling) {
            var previousItemPath = previousSibling;
            while (!this.tree.isCollapsed(previousItemPath)) {
                let previousItemChildPaths = this.tree.getChildPaths(previousItemPath);
                if (previousItemChildPaths.length === 0) break;
                previousItemPath = previousItemChildPaths.pop();
            }
            this.setAttribute("model", String(previousItemPath));
        } else {
            this.setAttribute("model", String(selectedPath.parent));
        }
    }

    _selectNextItem () {
        const selectedPath = this.model.path;

        if (!this.tree.isCollapsed(selectedPath)) {
            let childPaths = this.tree.getChildPaths(selectedPath);
            if (childPaths.length > 0) {
                this.setAttribute("model", String(childPaths[0]));
                return;
            }
        }

        const nextSiblingPath = this.tree.getNextSiblingPath(selectedPath);
        if (nextSiblingPath) {
            this.setAttribute("model", String(nextSiblingPath));
        } else {
            var parentPath = selectedPath;
            while (String(parentPath) !== "/") {
                let nextItemPath = this.tree.getNextSiblingPath(parentPath);
                if (nextItemPath) {
                    this.setAttribute("model", String(nextItemPath));
                    return;
                }
                parentPath = parentPath.parent;
            }
        }
    }

    _saveTemplate () {
        const committed = this.editor.commit();
        if (committed) this.dialog.pushMessage(`Saved: '${this.model.path}'`).timeout(1000);
    }

    _setViewMode () {
        if (this.getAttribute("mode") === "edit") {
            this._saveTemplate();
            this.setAttribute("mode", "view");
            this.viewer.focus();
        }
    }

    _setEditMode (struct=false) {
        if (this.getAttribute("mode") === "view") {
            const modelAttr = struct ? "." : "./__template__";
            this.editor.setAttribute("model", modelAttr);
            this.setAttribute("mode", "edit");
            this.editor.updateView();
            this.editor.focus();
        }
    }
}

module.exports = OloOutliner.register("olo-outliner");
