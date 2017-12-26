
const Path = require("./path");
const errors = require("./errors");

const jwtSign = require("jsonwebtoken/sign");
const jwtVerify = require("jsonwebtoken/verify");


const PERMISSIONS = Object.freeze({
    none:  0b000,
    read:  0b001,
    write: 0b011,
    admin: 0b111
});



class Auth {

    constructor (hash) {
        hash = Object(hash);
        this._pattern = hash.pattern || "**";
        this._permission = PERMISSIONS[hash.permission] ? hash.permission : "none";
        this._user = hash.user;
    }

    get pattern () {
        return this._pattern;
    }

    get permission () {
        return this._permission;
    }

    get user () {
        return this._user;
    }

    match (docPath) {
        return Path.parse(docPath).match(this.pattern);
    }

    canRead (docPath, subPath) {
        return this.match(docPath) && PERMISSIONS[this.permission] >= PERMISSIONS.read;
    }

    canWrite (docPath, subPath) {
        if (!this.canRead(docPath, subPath)) return false;
        if (PERMISSIONS[this.permission] >= PERMISSIONS.admin) return true;
        if (Path.parse(subPath)[0] === "data" && PERMISSIONS[this.permission] >= PERMISSIONS.write) return true;
        return false;
    }

    canAdmin (docPath) {
        return this.match(docPath) && PERMISSIONS[this.permission] >= PERMISSIONS.admin;
    }

    assertReadable (docPath, subPath) {
        if (!this.canRead(docPath, subPath)) {
            const url = `${Path.parse(docPath)}#${Path.parse(subPath)}`;
            throw new errors.ReadPermissionError(url);
        }
    }

    assertWritable (docPath, subPath) {
        this.assertReadable(docPath, subPath);
        if (!this.canWrite(docPath, subPath)) {
            const url = `${Path.parse(docPath)}#${Path.parse(subPath)}`;
            throw new errors.WritePermissionError(url);
        }
    }

    assertAdministrable (docPath) {
        if (!this.canAdmin(docPath)) {
            const url = `${Path.parse(docPath)}`;
            throw new errors.AdminPermissionError(url);
        }
    }

    toHash () {
        return {
            pattern: this.pattern,
            permission: this.permission,
            user: this.user
        }
    }

    encode (secret, expiresIn="1y") {
        const payload = this.toHash();
        const token = jwtSign(payload, secret, {expiresIn:expiresIn});
        return token;
    }

    static decode (token, secret) {
        try {
            const payload = jwtVerify(token, secret);
            return new Auth(payload);
        } catch (err) {
            return null;
        }
    }
}


Auth.default = new Auth({
    pattern: "**",
    permission: "read"
});


Auth.root = new Auth({
    user: "root",
    pattern: "**",
    permission: "admin"
});



module.exports = Auth;
