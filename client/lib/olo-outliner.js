const Path = require("olojs/path");
const Value = require("olojs/value");
const Change = require("olojs/change");

const Model = require("model");

const OloComponent = require("olo-component");
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
        return this.$("#dialog");
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

    pushMessage (message) {
        const messageElt = document.createElement('span');
        messageElt.setAttribute("class", "message");
        messageElt.innerHTML = message;
        this.dialog.appendChild(messageElt)

        const done = () => this.dialog.removeChild(messageElt);
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
            messageElt.setAttribute("class", "message");
            messageElt.innerHTML = `${message}: <input type="${type}"></input>`;
            this.dialog.appendChild(messageElt);
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
                this.dialog.removeChild(messageElt);
                resolve(value);
            });
            inputElt.focus();
        });
    }

    ask (question, ...options) {
        return new Promise ((resolve, reject) => {
            const messageElt = document.createElement('span');
            messageElt.setAttribute("class", "message");
            messageElt.innerHTML = question;
            for (let option of options) {
                let button = document.createElement('button');
                button.setAttribute("style", "margin: 0 0.3em;")
                button.textContent = option;
                button.addEventListener('click', () => {
                    this.dialog.removeChild(messageElt);
                    resolve(option);
                });
                messageElt.appendChild(button);
            }
            this.dialog.appendChild(messageElt);
        });
    }

    refreshDocument () {
        if (typeof this.model.document.sync !== "function") {
            this.pushMessage("Document refresh not implemented!").timeout(1000);
            return;
        }

        const message = this.pushMessage("Syncing ...");
        this.model.document.sync()
        .then(() => {
            message.done();
            this.pushMessage("Synced!").timeout(1000);
        })
        .catch(error => {
            this.pushMessage("Failed!").timeout(1000);
        });

    }

    commitDocument () {
        if (typeof this.model.document.save !== "function") {
            this.pushMessage("Document commit not implemented!").timeout(1000);
            return;
        }

        this.ask("Commit release:", "major", "minor", "patch", "cancel")
        .then(releaseType => {
            if (releaseType === "cancel") return
            this.model.document.commit(releaseType);
            this.updateView();

            let message = this.pushMessage("Committing ...");
            this.model.document.save()
            .then(() => {
                message.done();
                this.pushMessage("Committed!").timeout(1000);
            })
            .catch(error => {
                message.done();
                this.pushMessage("Failed!").timeout(1000);
            });
        })
    }

    async shareDocument () {
        if (typeof this.model.document.share !== "function") {
            this.pushMessage("Document share not implemented!").timeout(1000);
            return;
        }

        const user = await this.input("User e-mail", "", "text");
        if (user === "") return;

        const permission = await this.ask("Granted permission", 'admin', 'write', 'read', 'none');
        if (permission === 'none') return;

        const expiresIn = await this.input("Permission expires in", "30d", "text");
        if (expiresIn === "") return;

        const message = this.pushMessage("Sharing document ...");
        try {
            var token = await this.model.document.share(user, permission, expiresIn);
            message.done();
        } catch (error) {
            var token = null;
            message.done();
            this.pushMessage("Failed!").timeout(1000);
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
        this.input("Change item name:", oldName)
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
        if (committed) this.pushMessage(`Saved: '${this.model.path}'`).timeout(1000);
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
