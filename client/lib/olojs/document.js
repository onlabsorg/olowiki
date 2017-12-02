
const Value = require("./value");
const Path = require("./path");
const Change = require("./change");
const CRDT = require("./CRDT");
const errors = require("./errors");

const semver = require("semver");
const getSemverRelease = (version) => (semver.valid(version) || '0.0.0').split('-')[0];
const getSemverPrerelease = (version) => Number((semver.prerelease(semver.valid(version)) || ['pre', '0'])[1]);

const ROLES = {
    reader: 0b0001,
    writer: 0b0011,
    admin:  0b0111,
    owner:  0b1111
};



class Document extends CRDT.Dict {

    constructor (docHash, userName='root') {
        docHash = Value.type(docHash) === 'Object' ? docHash : {};

        var committed;
        if (Value.type(docHash.committed) === 'Object') {
            committed = Value(docHash.committed);
            committed.body = Value.type(committed.body) === 'Object' ? committed.body : {};
            committed.head = Value.type(committed.head) === 'Object' ? committed.head : {};
        } else {
            committed = {
                head: {},
                body: {}
            }
        }
        super(committed, docHash.release, docHash.changes);
        this._owner = docHash.owner;
        this._userName = userName;
        this._changeCallbacks = new Set();
    }

    get ownerName () {
        return this._owner;
    }

    get userName () {
        return this._userName;
    }

    get userRole () {
        if (this.ownerName === this.userName || this.userName === 'root') {
            return 'owner';
        } else {
            let userName = this.userName;
            return this._sudo(() => this.get(`/head/users/${userName}/role`));
        }
    }

    beforeRead (path) {
        this.assertReadable(path);
    }

    beforeChange (change) {
        this.assertEditable (change.path);
    }

    afterChange (diff) {
        for (let callback of this._changeCallbacks) {
            if (typeof callback === 'function') callback(diff);
        }
    }

    beforeCommit (releaseType) {
        this.assertWritable();
    }

    subscribe (path, listener) {
        path = Path.parse(path);

        const subscription = {
            path: path,
            listener: listener,
        }

        const callback = (changes) => {
            changes = changes.map(change => change.getSubChange(subscription.path)).filter(change => change !== null);
            if (changes.length > 0 && typeof subscription.listener === "function") subscription.listener.call(this, changes);
        };

        this._changeCallbacks.add(callback);
        subscription.cancel = () => this._changeCallbacks.delete(callback);

        return subscription;
    }

    toHash () {
        const hash = super.toHash();
        hash.owner = this._owner;
        return hash;
    }


    // access control methods

    isReadable (path) {
        path = Path.parse(path);
        const role = this.userRole;
        return ROLES[role] >= ROLES.reader;
    }

    assertReadable (path) {
        if (!this.isReadable(path)) throw new errors.ReadPermissionError(path);
    }

    isEditable (path) {
        path = Path.parse(path);
        const role = this.userRole;
        if (ROLES[role] >= ROLES.owner) return true;
        if (path[0] === 'head' && ROLES[role] >= ROLES.admin) return true;
        if (path[0] === 'body' && ROLES[role] >= ROLES.writer) return true;
        return false;
    }

    assertEditable (path) {
        if (!this.isEditable(path)) throw new errors.UpdatePermissionError(path);
    }

    isWritable () {
        const role = this.userRole;
        return ROLES[role] >= ROLES.owner;
    }

    assertWritable () {
        if (!this.isWritable()) throw new errors.WritePermissionError('/');
    }

    _sudo (command) {
        const userName = this.userName;
        this._userName = 'root';
        const retval = command();
        this._userName = userName;
        return retval;
    }
}



module.exports = Document;
