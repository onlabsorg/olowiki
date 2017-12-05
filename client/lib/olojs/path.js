
const minimatch = require("minimatch");

class Path extends Array {

    static parse (...subPaths) {
        const path = [];

        for (let subPath of subPaths) {

            // ... case array
            if (Array.isArray(subPath) || subPath instanceof Path) {
                subPath = Path.parse(...subPath);
            }
            // ... case string
            else if (subPath !== "" && subPath !== undefined && subPath !== null) {
                subPath = String(subPath).split('/');
            }
            // ... not a string nor an array
            else {
                subPath = []
            }

            // Append each key of the subPath to this path
            for (let item of subPath) {
                if (item === "..") {
                    path.pop();
                } else if (item !== "" && item !== ".") {
                    path.push(item);
                }
            }
        }

        return new Path(...path);
    }

    constructor (...items) {
        items = items.map(item => String(item));
        super(...items);
    }

    get leaf () {
        return this[this.length-1];
    }

    get parent () {
        return this.length > 0 ? new Path(...this.slice(0,-1)) : null;
    }

    lookup (obj) {
        var value = obj;
        for (let key of this) {
            try {
                value = value[key];
            } catch (e) {
                return undefined;
            }
        }
        return value;
    }

    match (pattern) {
        return minimatch(String(this), String(pattern));
    }

    toString () {
        return '/' + this.join('/');
    }
}



module.exports = Path;
