
const oloml = require("../oloml");


class Composition extends oloml.SequenceType {
    
    async evaluate (scope, ...args) {
        var text = "";
        for (let item of this.data) {
            if (typeof item.evaluate === "function") {
                text += await item.evaluate(scope, ...args)
            } else {
                text += String(item);
            }
        }
        
        return text;
    }
}


module.exports = Composition;
