const model = require("model");
const OloComponent = require("olo-component");
const OloViewer = require("olo-viewer");
const OloEditor = require("olo-editor");
const OloTree = require("olo-tree");

const keyString = require("utils/key-string");

const oloOutlinerTemplate = require("olo-outliner/olo-outliner.html!text");

class OloOutliner extends OloComponent {

    static get template () {
        return oloOutlinerTemplate;
    }

    constructor () {
        super();
        this.addEventListener('olo-node-selected', () => this._updateOutlinerView());

        this.addEventListener('keydown', (event) => this._handleKeyDown(event));

        this.$("olo-tree").tabIndex = 1;
        this.$("olo-tree").addEventListener('keydown', (event) => this._handleTreeKeyDown(event));

        this.$("olo-viewer").tabIndex = 1;
        this.$("olo-viewer").addEventListener('keydown', (event) => this._handleViewerKeyDown(event));

        this.$("olo-editor").tabIndex = 1;
        this.$("olo-editor").addEventListener('keydown', (event) => this._handleEditorKeyDown(event));
    }

    _updateOutlinerView () {
        const viewModel = this.$("olo-tree").selectedNode.model;
        const modelPath = viewModel.path;
        this.$("olo-editor").setAttribute("model", modelPath);
        this.$("olo-viewer").setAttribute("model", modelPath);
    }

    _handleTreeKeyDown (event) {
        const selectedNode = this.$("olo-tree").selectedNode;
        if (selectedNode === null) return;

        const keyStr = keyString(event);

        if (selectedNode.editable) switch(keyStr) {

            case "enter":
                selectedNode.commit();
                this.$("olo-tree").focus();
                break;

            case "esc":
                selectedNode.cancel();
                this.$("olo-tree").focus();
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
                var newModel = new model.Node();
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
            case "ctrl-shift-l":
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
