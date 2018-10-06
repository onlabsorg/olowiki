require("./olo-viewer.css");


const sanitize = require("./utils/sanitize");
const stripIndent = require("strip-indent");
const escape = require("lodash/escape");



module.exports = {
    
    template: `<div class="olo-viewer" v-html="render(value)"></div>`,
    
    props: [ 'path', 'value', 'allowed_tags' ],
    
    methods: {
        
        sanitize (html) {
            return sanitize(html, this.allowed_tags);
        },
        
        render (value) {
            const type = detectType(value);
            switch (type) {
                case "undefined":   return this.sanitize( renderUndefined(this.path) );
                case "null":        return this.sanitize( renderNull(this.path) );
                case "boolean":     return this.sanitize( renderBoolean(this.path, value) );
                case "number":      return this.sanitize( renderNumber(this.path, value) );
                case "date":        return this.sanitize( renderDate(this.path, value) );
                case "array":       return this.sanitize( renderArray(this.path, value) );
                case "object":      return this.sanitize( renderObject(this.path, value) );
                case "error":       return this.sanitize( renderError(this.path, value) );
                default:            return this.sanitize( String(value) );
            }                    
        }
    }
}




function detectType (obj) {
    const type = typeof obj;
    
    if (type === "object") {
        if (obj === null) return "null";
        if (Array.isArray(obj)) return "array";
        if (obj instanceof Date) return "date";
        if (obj instanceof Error) return "error";
        return "object";
    }
    else {
        return type;
    }    
}

function renderBlockValue (value) {
    return `<div class="value">${value}</div>`;
}

function renderInlineValue (value) {
    const type = detectType(value);
    switch (type) {
        case "array":   return "[...]";
        case "object":  return "{...}";
        default:        return escape( String(value) );
    }                    
    return String(value);
}

function renderUndefined (path) {
    return renderBlockValue(undefined);
}

function renderNull (path) {
    return renderBlockValue(null);
}

function renderBoolean (path, value) {
    return renderBlockValue(Boolean(value));
}

function renderNumber (path, value) {
    return renderBlockValue(value);
}

function renderDate (path, date) {
    return renderBlockValue(date.toISOString());
}

function renderObject (path, obj) {
    var html = "<dl>";
    for (let key in obj) {
        let subPath = `#${path}.${key}`;
        html += `<dt><a href="${subPath}">${key}</a></dt>`;
        html += `<dd>${renderInlineValue(obj[key])}</dd>`;
    }
    html += "</dl>";
    return html;
}

function renderArray (path, arr) {
    var html = "<ul>";
    for (let i=0; i<arr.length; i++) {
        let item = arr[i];
        let subPath = `#${path}.${i}`;
        let value = renderInlineValue(item);
        html += `<li><a href="${subPath}">${value}</a></li>`;
    }
    html += "</ul>";
    return html;
}    

function renderError (path, error) {
    console.dir(error);
    return stripIndent(`
        <h1>Rendering error</h1>
        <code><pre>${error}</pre></code>
        `);
}
