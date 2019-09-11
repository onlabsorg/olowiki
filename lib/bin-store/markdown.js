const olojs = require("olojs");
const marked = require("marked");


exports.__call__ = async function (source) {
    source = await olojs.context.str(source);
    return marked(source);
}


exports.toString = () => exports.__text__;

exports.title = "Binary module: markdown";
exports.__text__ = `<p>
Find the documentation at <a href="/doc/binaries/markdown">/doc/binaries/markdown</a>
</p>`;
