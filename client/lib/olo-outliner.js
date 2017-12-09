const Path = require("olojs/path");

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

class OloOutliner extends OloComponent {

    static get template () {
        return oloOutlinerTemplate;
    }

    static get observedAttributes () {
        return super.observedAttributes.concat("layout");
    }

    constructor () {
        super();

        this.addEventListener('olo-tree-node-selected', event => {
            const modelAttr = Path.parse(event.detail.path).toString();
            this.$("#content").setAttribute("model", modelAttr);
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
        });
    }

    attributeChangedCallback (attrName, oldVal, newVal) {
        super.attributeChangedCallback(attrName, oldVal, newVal);
        switch (attrName) {
            case "layout":
                this._updateLayout(oldVal, newVal);
                break;
        }
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

        this._contentSplitOptions = {
            direction: "vertical",
            sizes: [60, 40],
            gutterSize: 6,
            minSize: 200,
            elementStyle: elementStyle,
            gutterStyle: gutterStyle,
            onDragEnd: () => {this._contentSplitOptions.sizes = this._contentSplit.getSizes()}
        }

        this._mainSplit = Split([this.$("nav"), this.$("#content")], this._mainSplitOptions);
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
}

module.exports = OloOutliner.register("olo-outliner");
