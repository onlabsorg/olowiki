const olojs = require("olojs");

exports.join = async function (X, separator="") {
    const list = await olojs.context.list(X);
    
    let strList = [];
    for (let item of list) {
        let strItem = await olojs.context.str(item);
        strList.push( strItem );
    }
    return strList.join(separator);
}

exports.reverse = async function (X) {
    const list = await olojs.context.list(X);
    return Array.from(list).reverse();                
}

exports.__call__ = olojs.context.list;

exports.toString = () => exports.__text__;

exports.title = "Binary module: list";
exports.__text__ = `<p>
Find the documentation at <a href="/doc/binaries/list">/doc/binaries/list</a>
</p>`;
