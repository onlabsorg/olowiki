
exports.DocumentNotFoundError = class extends Error {
    constructor () {
        super("Document not found.");
    }
}

exports.ReadAccessDeniedError = class extends Error {
    constructor () {
        super("Read access denied.");
    }
}

exports.WriteAccessDeniedError = class extends Error {
    constructor () {
        super("Write access denied.");
    }
}
