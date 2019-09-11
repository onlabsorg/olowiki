

class AccessDenied extends Error {
    constructor (operation, path) {
        super(`${operation} access denied on path '${path}'`);
    }
}

exports.ReadAccessDenied = class extends AccessDenied {
    constructor (path) {
        super('Read', path);
    }
}

exports.WriteAccessDenied = class extends AccessDenied {
    constructor (path) {
        super('Write', path);
    }
}

class NotAllowed extends Error {
    constructor (operation, path) {
        super(`${operation} operation not allowed on path '${path}'`);
    }
}

exports.WriteOperationNotAllowed = class extends NotAllowed {
    constructor (path) {
        super("Write", path);
    }
}
