const ace = require("ace");
const aceURL = new URL(require("ace!path"));
ace.config.set('basePath', aceURL.pathname);

var currentEditorInfo;
var styles;
var cssHeads = [];


function getStyle () {
	var style1 = document.getElementById('ace_editor.css') || document.getElementById('ace_editor')
	var style2 = document.getElementById('ace-tm')
	var style3 = style2.nextSibling

	styles = [style1, style2, style3]
	styles.forEach(function (style) {
		style.parentNode.removeChild(style)
	})
}


function fixStyle (cssHead) {
	styles.forEach(function (style) {
		cssHead.appendChild(style.cloneNode(true))
	})
}


function hookDom () {
	var domHook = ace.require('ace/lib/dom');
	var dom = {
		getDocumentHead: domHook.getDocumentHead,
		importCssString: domHook.importCssString,
		hasCssString   : domHook.hasCssString
	}

	var docHook = {
		createElement : document.createElement.bind(document),
		createTextNode: document.createTextNode.bind(document),
		cssHead       : null // change by importCssString
	}

	domHook.getDocumentHead = function (doc) {
		if (doc === docHook) {
			return docHook.cssHead;
		}
		return dom.getDocumentHead.apply(doc, arguments);
	}

	domHook.hasCssString = function (id, doc) {
		if (doc === docHook) {
			return dom.hasCssString(id, docHook.cssHead);
		}
		return dom.hasCssString(id, doc);
	}


	domHook.importCssString = function (cssText, id, doc) {
		var result
		cssHeads.forEach(function (cssHead) {
			docHook.cssHead = cssHead
			result = dom.importCssString.call(this, cssText, id, docHook)
		})
		return result
	}
}


function hookEditor () {
	var EditorHook = ace.require('ace/editor').Editor
	var Editor = {
		setTheme: EditorHook.prototype.setTheme
	}

	EditorHook.prototype.setTheme = function () {
		currentEditorInfo = this.__aceShim
		Editor.setTheme.apply(this, arguments)
		//currentEditorInfo = null
	}
}


var id = 0
const ace_edit = ace.edit;
ace.edit = function (elt, header) {
    const editor = ace_edit(elt);
    if (header) {
        editor.__aceShim = {
			id     : id++,
			cssHead: header
		}
		fixStyle(header)
		cssHeads.push(header)
    }
    return editor;
}


hookDom();
getStyle();
hookEditor();


module.exports = ace;
