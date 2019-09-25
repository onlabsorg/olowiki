const olojs = require("olojs");
const context = olojs.Expression.createContext();


exports.presets = {
    
    title: "Binary module: list",

    join: async function (X, separator="") {
        const list = await context.list(X);
        
        let strList = [];
        for (let item of list) {
            let strItem = await context.str(item);
            strList.push( strItem );
        }
        return strList.join(separator);
    },

    reverse: async function (X) {
        const list = await context.list(X);
        return Array.from(list).reverse();                
    },

    __call__: context.list
};



exports.body = `<p>
Find the documentation at <a href="/doc/binaries/list">/doc/binaries/list</a>
</p>`;
