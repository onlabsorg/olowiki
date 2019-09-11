const olojs = require("olojs");


exports.ucase = async function (X) {
    const str = await olojs.context.str(X);
    return str.toUpperCase();
}    

exports.lcase = async function (X) {
    const str = await olojs.context.str(X);
    return str.toLowerCase();
}    

exports.trim = async function (X) {
    const str = await olojs.context.str(X);
    return str.trim();
}     

exports.split = async function (X, divider) {
    const str = await olojs.context.str(X);
    divider = await olojs.context.str(divider);
    return str.split(divider);
}

exports.render = async function (template) {
    template = await olojs.context.str(template.trim());
    const values = [];
    var text = template.replace(/{([A-Z_a-z][[A-Z_a-z0-9]*)}/g, (match, name) => {
        values.push(this[name]);
        return `{${values.length-1}}`;
    });
    for (let i=0; i<values.length; i++) {
        let stringValue = await olojs.context.str(values[i]);
        text = text.replace(`{${i}}`, stringValue);
    }
    return text;
}

exports.__call__ = olojs.context.str;

exports.toString = () => exports.__text__;

exports.title = "Binary module: text";
exports.__text__ = `<p>
Find the documentation at <a href="/doc/binaries/text">/doc/binaries/text</a>
</p>`;
