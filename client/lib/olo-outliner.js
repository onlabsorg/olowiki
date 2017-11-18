const store = require("store");
const OloComponent = require("olo-component");
const OloRoot = require("olo-root");
const OloViewer = require("olo-viewer");
const OloEditor = require("olo-editor");
const OloTree = require("olo-tree");
const FontAwesome = require("/lib/themes/font-awesome");

const keyString = require("utils/key-string");

const Split = require("olo-outliner/Split");
const oloOutlinerTemplate = require("olo-outliner/olo-outliner.html!text");

class OloOutliner extends OloRoot {

    static get template () {
        return oloOutlinerTemplate;
    }

    static get observedAttributes () {
        return super.observedAttributes.concat("layout");
    }

    constructor () {
        super();
        this.addEventListener('olo-node-selected', (event) => this._updateOutlinerView(event.detail.oloNode));

        this.addEventListener('keydown', (event) => this._handleKeyDown(event));

        this._activeElement;

        this.$("nav").tabIndex = 1;
        this.$("nav").addEventListener('keydown', (event) => this._handleTreeKeyDown(event));
        this.$("nav").addEventListener('focusin', (event) => {this._activeElement = this.$("nav")});

        this.viewer.tabIndex = 1;
        this.viewer.addEventListener('keydown', (event) => this._handleViewerKeyDown(event));
        this.viewer.addEventListener('focusin', (event) => {this._activeElement = this.viewer});

        this.editor.tabIndex = 1;
        this.editor.addEventListener('keydown', (event) => this._handleEditorKeyDown(event));
        this.editor.addEventListener('focusin', (event) => {this._activeElement = this.editor});

        this.tree.select();


        // LAYOUT

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

        this._contentSplitOptions = {
            sizes: [60, 40],
            gutterSize: 6,
            minSize: 200,
            elementStyle: elementStyle,
            gutterStyle: gutterStyle,
            onDragEnd: () => {this._contentSplitOptions.sizes = this._contentSplit.getSizes()}
        }

        this._mainSplit = Split([this.$("nav"), this.$("#content")], this._mainSplitOptions);

        this._updateLayout();
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal);
        if (attrName === "layout") this._updateLayout(oldVal, newVal);
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

    _updateLayout (oldLayout, newLayout) {
        oldLayout = oldLayout || "viewer-only";
        newLayout = newLayout || "viewer-only";

        switch (newLayout) {
            case "viewer-only":
                if (this._contentSplit) {
                    this._contentSplit.destroy();
                    this._contentSplit = null;
                }
                if (this._activeElement !== this.$("nav")) this.viewer.focus();
                break;
            case "editor-only":
                if (this._contentSplit) {
                    this._contentSplit.destroy();
                    this._contentSplit = null;
                }
                if (this._activeElement !== this.$("nav")) this.editor.focus();
                break;
            case "vertical":
                if (this._contentSplitOptions.direction === "horizontal" && this._contentSplit) this._contentSplit.destroy();
                this._contentSplitOptions.direction = "vertical";
                this._contentSplit = Split([this.viewer, this.editor], this._contentSplitOptions);
                break;
            case "horizontal":
                if (this._contentSplitOptions.direction === "vertical" && this._contentSplit) this._contentSplit.destroy();
                this._contentSplitOptions.direction = "horizontal";
                this._contentSplit = Split([this.viewer, this.editor], this._contentSplitOptions);
                break;
        }
    }

    _updateOutlinerView (oloNode) {
        const contentElt = this.$("olo-root");
        const contentModel = oloNode.model;
        const contentModelPath = contentModel.path;
        this.viewer.setAttribute("model", contentModelPath);
        this.editor.setAttribute("model", contentModelPath);
    }

    _handleTreeKeyDown (event) {
        const selectedNode = this.tree.selectedNode;
        if (selectedNode === null) return;

        const keyStr = keyString(event);

        if (selectedNode.editable) switch(keyStr) {

            case "enter":
                selectedNode.commit();
                this.$("nav").focus();
                break;

            case "esc":
                selectedNode.cancel();
                this.$("nav").focus();
                break;
        }
        else switch (keyStr) {

            case "up":
                const previousNode = selectedNode.prevItem;
                if (previousNode) previousNode.select();
                event.stopPropagation();
                break;

            case "down":
                const nextNode = selectedNode.nextItem;
                if (nextNode) nextNode.select();
                event.stopPropagation();
                break;

            case "left":
                selectedNode.collapsed = true;
                event.stopPropagation();
                break;

            case "right":
                selectedNode.collapsed = false;
                event.stopPropagation();
                break;

            case "ctrl-x":
                if (selectedNode.model.readonly) break;
                const newSelectedNode = selectedNode.nextItem || selectedNode.prevItem;
                if (newSelectedNode) {
                    newSelectedNode.select();
                    let selectedModel = this._cutModel = selectedNode.model;
                    selectedModel.parent.removeChild(selectedModel.index);
                }
                break;

            case "ctrl-v":
                if (selectedNode.model.readonly) break;
                if (this._cutModel) {
                    let selectedModel = selectedNode.model;
                    let selectedIndex = selectedModel.index;
                    selectedModel.parent.insertChild(selectedIndex, this._cutModel);
                    this._cutModel = null;
                    selectedNode.prevSiblingItem.select();
                }
                event.stopPropagation();
                break;

            case "enter":
                selectedNode.edit();
                break;

            case "ctrl-enter":
                if (selectedNode.model.readonly) break;
                var selectedModel = selectedNode.model;
                var newModel = new store.Node();
                selectedModel.parent.insertChild(selectedModel.index+1, newModel);
                selectedNode.nextSiblingItem.select();
                event.stopPropagation();
                break;
        }
    }

    _handleViewerKeyDown (event) {}

    _handleEditorKeyDown (event) {}

    _handleKeyDown (event) {
        const keyStr = keyString(event);

        switch (keyStr) {
            case "ctrl-space":
                let layout = this.getAttribute("layout");
                switch (layout) {
                    case undefined:
                    case "viewer-only":
                        this.setAttribute("layout", "vertical");
                        break;
                    case "vertical":
                        this.setAttribute("layout", "horizontal");
                        break;
                    case "horizontal":
                        this.setAttribute("layout", "editor-only");
                        break;
                    case "editor-only":
                    default:
                        this.setAttribute("layout", "viewer-only");
                        break;
                }
                event.stopPropagation();
                event.preventDefault();
                break;
        }
    }
}

module.exports = OloOutliner.register("olo-outliner");
