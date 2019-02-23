
exports.UnknownStore = class extends Error {
    constructor (storeURL) {
        super(`Unknown store: ${storeURL}`);
    }
}

exports.DocumentNotFound = class extends Error {
    constructor (path) {
        super(`Document not found: '${path}'`);
    }
}

exports.ReadAccessDenied = class extends Error {
    constructor (path) {
        super(`Read access denied: '${path}'`);
    }
}

exports.WriteAccessDenied = class extends Error {
    constructor (path) {
        super(`Write access denied: '${path}'`);
    }
}

exports.SyntaxError = class extends Error {
    constructor () {
        super(`Syntax error!`);
    }    
}

exports.TypeError = class extends Error {
    constructor (obj, ExpectedType) {
        super(`Type error!`);
    }
}
