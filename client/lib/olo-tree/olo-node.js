
const OloComponent = require("olo-component");

const oloNodeTemplate = require("./olo-node.html!text");

const cache = new WeakMap();



class OloNode extends OloComponent {

    static get template () {
        return oloNodeTemplate;
    }



    // LIFE CYCLE

    constructor () {
        super();
        this.$("#icon").addEventListener('click', () => this.toggleCollapsed());
        this.$("#viewer").addEventListener('click', () => this.select());
        this.$("#editor").addEventListener('blur', () => this.cancel());
    }


    // RENDERING

    updateView () {
        if (this.model === null) {
            this.$("#icon").textContent = "";
            this.$("#viewer").textContent = "<VOID>";
            this.$("#child-list").innerHTML = "";
        }
        else {
            if (cache.get(this.model) !== this) cache.set(this.model, this);

            if (this.model.readonly) this.classList.add("readonly");
            else this.classList.remove("readonly");

            var icon;
            if (this.model.size === 0) icon = "";
            else icon = this.collapsed ? "\u25ba" : "\u25bc";
            this.$("#icon").textContent = icon;

            this.$("#viewer").innerHTML = this.model.name;

            var pos = 0;
            const childList = this.$("#child-list");
            for (let i=0; i<this.model.size; i++) {
                let nodeModel = this.model.getChild(i);
                let childNode = cache.get(nodeModel);
                if (!childNode) {
                    childNode = document.createElement('olo-node');
                    childNode.classList.add("collapsed");
                }
                childNode.setAttribute("model", nodeModel.name);
                childList.insertBefore(childNode, childList.children[i]);
            }
            while (childList.children.length > this.model.size) {
                childList.removeChild(childList.lastChild);
            }
        }
    }



    // COLLAPSING/EXPANDING

    get collapsed () {
        return this.classList.contains('collapsed');
    }

    set collapsed (value) {
        if (Boolean(value) === this.collapsed) return;
        if (Boolean(value)) {
            let selectedChild = this.findItem((node) => node.selected);
            if (selectedChild) this.select();
            this.classList.add('collapsed');
        }
        else {
            this.classList.remove('collapsed');
        }
    }

    toggleCollapsed () {
        this.collapsed = !this.collapsed;
    }



    // EDIT

    get editable () {
        return this.classList.contains("editable");
    }

    edit () {
        if (this.model && this.model.readonly) return;
        this.classList.add("editable");
        const inputElt = this.$("#editor");
        inputElt.value = this.model.name;
        inputElt.focus();
    }

    commit () {
        if (!this.editable) return;
        const valueElt = this.$("#viewer");
        const inputElt = this.$("#editor");
        if (this.model.name !== inputElt.value) {
            this.model.name = inputElt.value;
        }
        this.classList.remove("editable");
    }

    cancel () {
        if (!this.editable) return;
        const valueElt = this.$("#viewer");
        this.classList.remove("editable");
    }


    // SELECTION

    get selected () {
        return this.classList.contains("selected");
    }

    select () {
        this.classList.add("selected");
        this.dispatch("olo-node-selected", {oloNode: this})
    }

    unselect () {
        this.classList.remove("selected");
    }



    // QUERY

    get parentItem () {
        const parent = this.parentComponent;
        return parent instanceof OloNode ? parent : null;
    }

    get prevSiblingItem () {
        const prevSibling = this.previousSibling;
        return prevSibling instanceof OloNode ? prevSibling : null;
    }

    get nextSiblingItem () {
        const nextSibling = this.nextSibling;
        return nextSibling instanceof OloNode ? nextSibling : null;
    }

    get prevItem () {
        var target = this.prevSiblingItem;
        if (target) {
            while (!target.collapsed && target.size > 0) {
                target = target.childItem(target.size-1);
            }
        }
        else {
            target = this.parentItem;
        }
        return target;
    }

    get nextItem () {
        var target = null;
        if (!this.collapsed && this.size > 0) {
            target = this.childItem(0);
        }
        else if (this.nextSiblingItem) {
            target = this.nextSiblingItem;
        }
        else {
            var parent = this.parentItem;
            while (!target && parent) {
                target = parent.nextSiblingItem;
                parent = parent.parentItem;
            }
        }
        return target;
    }

    get size () {
        return this.$("#child-list").querySelectorAll("olo-node").length;
    }

    get childItems () {
        return Array.from(this.$("#child-list").querySelectorAll("olo-node"))
    }

    childItem (index) {
        return this.$("#child-list").querySelectorAll("olo-node")[index] || null;
    }

    findItem (matchFn) {
        for (let item of this.childItems) {
            if (matchFn(item)) return item;
            let match = item.findItem(matchFn);
            if (match) return match;
        }
        return null;
    }
}

module.exports = OloNode.register("olo-node");
