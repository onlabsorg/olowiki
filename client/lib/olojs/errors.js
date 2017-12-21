

exports.ReadPermissionError = class extends Error {
    constructor (path) {
        super(`Read access deinied to '${path}'`);
        this.path = String(path);
        this.statusCode = 403;
    }

    toHash () {
        return {
            type: 'ReadPermissionError',
            param: this.path
        }
    }
};

exports.WritePermissionError = class extends Error {
    constructor (path) {
        super(`Write access deinied to '${path}'`);
        this.path = String(path);
        this.statusCode = 403;
    }

    toHash () {
        return {
            type: 'WritePermissionError',
            param: this.path
        }
    }
};

exports.DocumentNotFoundError = class extends Error {
    constructor (path) {
        super(`Document '${path}' not found`);
        this.path = String(path);
        this.statusCode = 404;
    }

    toHash () {
        return {
            type: 'DocumentNotFoundError',
            param: this.path
        }
    }
};
