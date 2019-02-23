const Document = require("olo-store/lib/document");
const sanitize = require("./sanitize");
const allowedTags = require("./allowed-tags");    

module.exports = async function render (source, path, compact=false) {
    const doc = new Document(source);
    const fragment = await getFragment(doc, path);
    const html = compact ? await fragment.renderCompact() : await fragment.render();
    return sanitize(html, allowedTags);
}


async function getFragment (doc, path) {
    const data = await doc.evaluate(path);

    if (typeof data === 'string') {
        return new TextFragment(path, data);
    }
    
    if (data instanceof Date) {
        return new DateFragment(path, data);
    }        
    
    if (data === null) {
        return new NullFragment(path, data);
    }
    
    if (data === undefined) {
        return new UndefinedFragment(path, data);
    }
    
    if (typeof data === 'number') {
        return new UndefinedFragment(path, data);
    }
    
    if (typeof data === 'boolean') {
        return new BooleanFragment(path, data);
    }
    
    if (Array.isArray(data)) {
        let list = [];
        for (let i=0; i<data.length; i++) {
            let itemPath = path ? `${path}.${i}` : String(i);
            itemFragment = await getFragment(doc, itemPath);
            list.push(itemFragment);
        }
        return new ListFragment(path, list);
    }
    
    if (typeof data === 'object' && data !== null) {
        if (data._repr_) {
            let reprPath = path ? `${path}._repr_` : "_repr_";
            return await getFragment(doc, reprPath);
        } else {
            let dict = {};
            for (let key in data) {
                let itemPath = path ? `${path}.${key}` : key;
                dict[key] = await getFragment(doc, itemPath);
            }
            return new DictFragment(path, dict);                    
        }
    }

    return new PrimitiveFragment(path, data);
}

class Fragment {
    
    constructor (path, data) {
        this.path = path;
        this.data = data;
    }
}

class PrimitiveFragment extends Fragment {
    
    render () {
        return `<section class="primitive">${this.data}</section>`        
    }
    
    renderCompact () {
        return String(this.data);
    }
}

class DateFragment extends PrimitiveFragment {
    
    constructor (path, data) {
        super(path, data.toUTCString());
    }
}

class NumericFragment extends PrimitiveFragment {}

class BooleanFragment extends PrimitiveFragment {}

class NullFragment extends PrimitiveFragment {}

class UndefinedFragment extends PrimitiveFragment {}

class TextFragment extends Fragment {
    
    render () {
        return `<section class="text">${this.data}</section>`;
    }
    
    renderCompact () {
        return `<div class="content-heading">${this.data}</div>`
    }
}

class DictFragment extends Fragment {
    
    render () {
        var html = `<section class="dict">`;
        for (let key in this.data) {
            html += `
                <div class="card">
                    <a class="item" href="#${this.data[key].path}">
                        <div class="card-title">${key}</div>
                        <div class="card-content">${this.data[key].renderCompact()}</div>
                    </a>
                </div>
            `;
        }
        html += `</section>`
        return html;
    }
    
    renderCompact () {
        const len = Object.keys(this.data).length
        return `<span class="content-description"><b>{</b> ${len} items <b>}</b></span>`;
    }
}

class ListFragment extends Fragment {
    
    render () {
        var html = `<section class="list">`;
        for (let item of this.data) {
            html += `
                <div class="card">
                    <a class="item" href="#${item.path}">
                        <div class="card-content">${item.renderCompact()}</div>
                    </a>
                </div>\n
            `;
        }
        html += `</section>`
        return html;            
    }
    
    renderCompact () {
        const len = this.data.length
        return `<span class="content-description"><b>[</b> ${len} items <b>]</b></span>`;
    }
}
