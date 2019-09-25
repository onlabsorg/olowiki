const olojs = require("olojs");
const marked = require("marked");
const context = olojs.Expression.createContext();


exports.presets = {

    title: "Binary module: markdown",
    
    __call__: async function (source) {
        source = await context.str(source);
        return marked(source);
    }
}


exports.body = `<p>
Find the documentation at <a href="/doc/binaries/markdown">/doc/binaries/markdown</a>
</p>`;
