
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
    }

    get pattern () {
        return this._pattern;
    }

    get permission () {
        return this._permission;
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

    toHash () {
        return {
            pattern: this.pattern,
            permission: this.permission
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



module.exports = Auth;
