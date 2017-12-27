
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

    canRead (docPath) {
        return this.match(docPath) && PERMISSIONS[this.permission] >= PERMISSIONS.read;
    }

    canWrite (docPath) {
        return this.match(docPath) && PERMISSIONS[this.permission] >= PERMISSIONS.write;
    }

    canAdmin (docPath) {
        return this.match(docPath) && PERMISSIONS[this.permission] >= PERMISSIONS.admin;
    }

    assertReadPermission (docPath) {
        if (!this.canRead(docPath)) {
            const url = Path.parse(docPath).toString();
            throw new errors.ReadPermissionError(url);
        }
    }

    assertWritePermission (docPath) {
        if (!this.canWrite(docPath)) {
            const url = Path.parse(docPath).toString();
            throw new errors.WritePermissionError(url);
        }
    }

    assertAdminPermission (docPath) {
        if (!this.canAdmin(docPath)) {
            const url = Path.parse(docPath).toString();
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
        const hash = this.toHash();
        const payload = {
            u: hash.user,
            pa: hash.pattern,
            pe: PERMISSIONS[hash.permission] || 0
        }
        const token = jwtSign(payload, secret, {expiresIn:expiresIn});
        return token;
    }

    static decode (token, secret) {
        try {
            var payload = jwtVerify(token, secret);
        } catch (err) {
            return null;
        }

        const hash = {
            user: payload.u,
            pattern: payload.pa,
            permission: (() => {
                for (let pe in PERMISSIONS) if (PERMISSIONS[pe] === payload.pe) return pe;
                return 'none';
            })()
        };

        return new Auth(hash);
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
