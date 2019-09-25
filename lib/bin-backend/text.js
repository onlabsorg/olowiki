const olojs = require("olojs");
const context = olojs.Expression.createContext();

exports.presets = {

    title: "Binary module: text",

    ucase: async function (X) {
        const str = await context.str(X);
        return str.toUpperCase();
    },    

    lcase: async function (X) {
        const str = await context.str(X);
        return str.toLowerCase();
    },    

    trim: async function (X) {
        const str = await context.str(X);
        return str.trim();
    },    

    split: async function (X, divider) {
        const str = await context.str(X);
        divider = await context.str(divider);
        return str.split(divider);
    },

    render: async function (template) {
        template = await context.str(template.trim());
        const values = [];
        var text = template.replace(/{([A-Z_a-z][[A-Z_a-z0-9]*)}/g, (match, name) => {
            values.push(this[name]);
            return `{${values.length-1}}`;
        });
        for (let i=0; i<values.length; i++) {
            let stringValue = await context.str(values[i]);
            text = text.replace(`{${i}}`, stringValue);
        }
        return text;
    },

    __call__: context.str,    
}

exports.body = `<p>
Find the documentation at <a href="/doc/binaries/text">/doc/binaries/text</a>
</p>`;
