require("./olo-viewer.css");


const sanitize = require("./utils/sanitize");
const stripIndent = require("strip-indent");



module.exports = {
    
    template: `<div class="olo-viewer" v-html="render(value)"></div>`,
    
    props: [ 'value', 'allowed_tags' ],
    
    methods: {
        
        sanitize (html) {
            return sanitize(html, this.allowed_tags);
        },
        
        render (value) {
            const type = detectType(value);
            switch (type) {
                case "undefined":   return this.sanitize( renderUndefined() );
                case "null":        return this.sanitize( renderNull() );
                case "boolean":     return this.sanitize( renderBoolean(value) );
                case "number":      return this.sanitize( renderNumber(value) );
                case "date":        return this.sanitize( renderDate(value) );
                case "array":       return this.sanitize( renderArray(value) );
                case "object":      return this.sanitize( renderObject(value) );
                case "error":       return this.sanitize( renderError(value) );
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

function renderValue (value) {
    return `<div class="value">${value}</div>`;
}

function renderUndefined () {
    return renderValue(undefined);
}

function renderNull () {
    return renderValue(null);
}

function renderBoolean (value) {
    return renderValue(Boolean(value));
}

function renderNumber (value) {
    return renderValue(value);
}

function renderDate (date) {
    return renderValue(date.toISOString());
}

function renderObject (obj) {
    return renderValue("{...}");
}

function renderArray (arr) {
    return renderValue("[...]");
}    

function renderError (error) {
    return stripIndent(`
        <h1>Rendering error</h1>
        <code><pre>${error}</pre></code>
        `);
}
