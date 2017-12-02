
const Path = require("./path");
const Value = require("./value");


class Change {

    constructor (path, value, timestamp=null) {
        this.path = Path.parse(path);
        this.value = Value(value);

        var date, tsType = Value.type(timestamp);
        switch (tsType) {
            case 'Date':
                this.timestamp = new Date(timestamp.getTime());
                break;
            case 'Number':
            case 'String':
                this.timestamp = new Date(timestamp);
                break;
            default:
                this.timestamp = new Date();
                break;
        }
    }

    getSuperChange (path) {
        return new Change([path, this.path], this.value, this.timestamp);
    }

    getSubChange (path) {
        path = Path.parse(path);

        if (path.match(this.path)) {
            return new Change('/', this.value, this.timestamp);
        }

        if (this.path.match(`${path}/**`)) {
            let subPath = Path.parse(this.path.slice(path.length));
            return new Change(subPath, this.value, this.timestamp);
        }

        if (path.match(`${this.path}/**`)) {
            let subPath = Path.parse(path.slice(this.path.length));
            return new Change('/', subPath.lookup(this.value), this.timestamp);
        }

        return null;
    }

    apply (obj) {
        const parent = this.path.parent.lookup(obj);
        if (Value.type(parent) === 'Object') {
            if (this.value !== undefined) {
                parent[this.path.leaf] = Value(this.value);
            } else {
                delete parent[this.path.leaf];
            }
        }
    }

    toHash () {
        return {
            path: String(this.path),
            value: Value(this.value),
            timestamp: this.timestamp.toISOString()
        }
    }

    static diff (val1, val2) {
        val1 = Value(val1);
        val2 = Value(val2);
        var type1 = Value.type(val1);
        var type2 = Value.type(val2);


        if (type1 !== type2) {
            return [new Change('/', val2, 0)];
        }

        if (type1 !== "Object") {
            return val1 === val2 ? [] : [new Change('/', val2, 0)];
        }

        const changes = [];

        for (let key in val1) {
            if (val2[key] === undefined) {
                changes.push(new Change(key, undefined, 0));
            }
        }

        for (let key in val2) {
            const childChanges = Change.diff(val1[key], val2[key]);
            for (let childChange of childChanges) {
                changes.push(childChange.getSuperChange(key));
            }
        }

        return changes;
    }

    static sort (...changes) {
        return changes.filter(change => change instanceof Change).sort((change1, change2) => {
            if (change1.timestamp < change2.timestamp) return -1;
            if (change1.timestamp === change2.timestamp) return 0;
            if (change1.timestamp > change2.timestamp) return +1;
        });
    }

    static digest (base, ...changes) {
        const obj = Value(base);
        changes = this.sort(...changes);
        for (let change of changes) {
            change.apply(obj);
        }
        return obj;
    }
}


module.exports = Change;
