
const Value = require("./value");
const Path = require("./path");
const Change = require("./change");

const semver = require("semver");
const getSemverRelease = (version) => (semver.valid(version) || '0.0.0').split('-')[0];
const getSemverPrerelease = (version) => Number((semver.prerelease(semver.valid(version)) || ['pre', '0'])[1]);



class Document {

    constructor (docHash) {
        docHash = Object(docHash);

        this._committed = Value.type(docHash.committed) === 'Object' ? Value(docHash.committed) : {};

        this._release = getSemverRelease(docHash.release);

        if (Value.type(docHash.changes) === 'Array') {
            this._changes = docHash.changes
                    .filter(change => Value.type(change) === 'Object')
                    .map(change => new Change(change.path, change.value, change.timestamp));
        } else {
            this._changes = [];
        }

        this._digest = Change.digest(this._committed, ...this._changes);

        this._changeCallbacks = new Set();
    }

    get version () {
        return `${this._release}-pre.${this._changes.length}`;
    }

    get (path) {
        path = Path.parse(path);
        this.beforeRead(path);
        return path.lookup(this._digest);
    }

    type (path) {
        const value = this.get(path);
        return Value.type(value);
    }

    applyChanges (...changes) {
        const validChanges = changes.filter(change => change instanceof Change);
        if (validChanges.length === 0) return;

        for (let change of validChanges) this.beforeChange(change);
        for (let change of validChanges) this._changes.push(change);

        let oldDigest = this._digest;
        let newDigest = this._digest = Change.digest(this._committed, ...this._changes);;
        let diff = Change.diff(oldDigest, newDigest);
        if (diff.length > 0) {
            for (let callback of this.changeCallbacks) {
                if (typeof callback === 'function') callback(diff);
            }
        }
    }

    set (path, value) {
        const change = new Change(path, value);
        this.applyChanges(change);
    }

    delete (path) {
        const change = new Change(path, undefined);
        this.applyChanges(change);
    }

    commit (releaseType="patch") {
        if (releaseType === "major" || releaseType === "minor" || releaseType === "patch") {
            this.beforeCommit(releaseType);
            this._committed = this._digest;
            this._release = semver.inc(this._release, releaseType);
            this._changes = [];
        }
    }

    delta (version) {
        this.beforeRead(new Path());

        const oldVersion = semver.valid(version);
        const newVersion = this.version;
        if (getSemverRelease(oldVersion) !== getSemverRelease(newVersion)) return [];
        if (semver.gte(oldVersion, newVersion)) return [];

        const oldPrerelease = getSemverPrerelease(oldVersion);
        return this._changes.slice(oldPrerelease);
    }

    toHash () {
        this.beforeRead(new Path());
        return {
            committed: Value(this._committed),
            release: this._release,
            changes: this._changes.map(change => change.toHash()),
        };
    }

    beforeRead (path) {}

    beforeChange (change) {}

    beforeCommit (releaseType) {}

    get changeCallbacks () {
        return this._changeCallbacks;
    }
}



module.exports = Document;
