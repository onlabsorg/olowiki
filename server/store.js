
const fs = require('fs');
const YAML = require('js-yaml');

function readFileAsync (path, options) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function writeFileAsync (path, data, options) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}



class Store {

    constructor (path) {
        this.path = path;
    }

    auth (docPath, authorization) {
        return "write";
        // or "read"
        // or "none"
    }

    async read (docPath, authorization) {
        const docAuth = this.auth(docPath, authorization);
        if (docAuth !== "read" && docAuth !== "write") {
            throw new Error(`Read permission denied on document path ${docPath}`);
        }

        const docContent = await readFileAsync(this.path + docPath, {encoding:'utf8'});
        return {
            head: {
                'olo-Doc-Auth': docAuth,
            },
            body: YAML.load(docContent),
        };
    }

    async write (docPath, docContent, authorization) {
        const docAuth = this.auth(docPath, authorization);
        if (docAuth !== "write") {
            throw new Error(`Write permission denied on document path ${docPath}`);
        }

        await writeFileAsync(this.path + docPath, YAML.dump(docContent), {encoding:'utf8'});
    }
}


module.exports = Store;
