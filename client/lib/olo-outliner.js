const Path = require("olojs/path");
const Value = require("olojs/value");
const Change = require("olojs/change");
const Auth = require("olojs/auth");

const Model = require("model");

const OloComponent = require("olo-component");
const OloViewer = require("olo-viewer");
const OloEditor = require("olo-editor");
const OloTree = require("olo-tree");
const FontAwesome = require("/lib/themes/font-awesome");

const keyString = require("utils/key-string");

const oloOutlinerTemplate = require("olo-outliner/olo-outliner.html!text");

const OloLayout = require("olo-outliner/olo-layout");



class OloOutliner extends OloComponent {

    static get template () {
        return oloOutlinerTemplate;
    }

    constructor () {
        super();


        // INIT MAIN LAYOUT

        if (!this.hasAttribute("mode")) this.setAttribute("mode", "view");


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

        this.tree.tabIndex = 1;
        this.tree.addEventListener("keydown", event => this._handleTreeKeyDown(event));


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
        const auth = this.model.document.auth || Auth.root;
        this.$("#info").innerHTML = `
            <b>olo v0.1.0</b><br>
            user <b>${auth.user}</b> can <b>${auth.permission}</b><br>
            document <b>v${this.model.document.version}</b>
        `;
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
        return this.$("olo-layout").pushMessage(message);
    }

    dialog (title, form) {
        return this.$("olo-layout").dialog(title, form);
    }

    refreshDocument () {
        if (typeof this.model.document.sync !== "function") {
            this.pushMessage("Document refresh not implemented!").timeout(3000);
            return;
        }

        const message = this.pushMessage("Syncing ...");
        this.model.document.sync()
        .then(() => {
            message.done();
            this.pushMessage("Synced!").timeout(3000);
        })
        .catch(error => {
            this.pushMessage("Failed!").timeout(3000);
        });

    }

    commitDocument () {
        if (typeof this.model.document.save !== "function") {
            this.pushMessage("Document commit not implemented!").timeout(3000);
            return;
        }

        this.dialog("Commit", `
            <label>Release type</label>
            <select name="releasetype">
                <option>major</option>
                <option>minor</option>
                <option selected>patch</option>
            </select>
        `)
        .then(formData => {
            if (formData !== null) {
                let releaseType = formData.releasetype;
                this.model.document.commit(releaseType);
                this.updateView();

                let message = this.pushMessage("Committing ...");
                this.model.document.save()
                .then(() => {
                    message.done();
                    this.pushMessage("Committed!").timeout(3000);
                })
                .catch(error => {
                    message.done();
                    this.pushMessage("Failed!").timeout(3000);
                });
            }
        })
    }

    async shareDocument () {
        if (typeof this.model.document.share !== "function") {
            this.pushMessage("Document share not implemented!").timeout(3000);
            return;
        }

        const formData = await this.dialog("Share", `

            <label>User e-mail</label>
            <input name="email" type="email"></input>

            <label>Permission</label>
            <select name="permission">
                <option selected>read</option>
                <option>write</option>
                <option>admin</option>
            </select>

            <label>Expires in (eg. 1d, 3y, etc.)</label>
            <input name="expiration" type="text"></input>

        `);
        if (formData === null) return;

        const user = formData.email;
        const permission = formData.permission;
        const expiresIn = formData.expiration

        const message = this.pushMessage("Sharing document ...");
        try {
            var token = await this.model.document.share(user, permission, expiresIn);
            message.done();
        } catch (error) {
            var token = null;
            message.done();
            this.pushMessage("Failed!").timeout(3000);
        }

        if (token) {
             let url = `${location.origin}${location.pathname}?auth=${token}`;
             await this.dialog("Shared document link", `
                <textarea autofocus rows="4" onfocus="this.select();">${url}</textarea>
             `);
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
        this.dialog("Rename item", `
            <label>Item name:</label>
            <input name="newname" type="text" value="${oldName}"></input>
        `).then(formData => {
            if (formData !== null && formData.newname !== oldName) {
                const newName = formData.newname;
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
        if (committed) this.pushMessage(`Saved: '${this.model.path}'`).timeout(3000);
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
