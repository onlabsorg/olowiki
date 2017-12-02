
const uuid = require("uuid");
const fs = require("fs");

const config = require("./config");

const jwt = require("jsonwebtoken");
if (!fs.existsSync(`${config.path}/jwt.key`)) {
    fs.writeFileSync(`${config.path}/jwt.key`, uuid.v4());
}
const privateKey = fs.readFileSync(`${config.path}/jwt.key`);

if (!fs.exists(`${config.path}/users`)) {
    fs.mkdirSync(`${config.path}/users`);
}



function getUserFilePath (name) {
    return `${config.path}/users/${name}.json`;
}

function userExists (name) {
    const userFilePath = getUserFilePath(name);
    return fs.existsSync(userFilePath);
}

function getUserData (name) {
    const userFilePath = getUserFilePath(name);
    const userFileContent = fs.readFileSync(getUserFilePath(name));
    return JSON.parse(userFileContent)
}

function setUserData (name, userData) {
    const userFilePath = getUserFilePath(name);
    const userFileContent = JSON.stringify(userData);
    fs.writeFileSync(userFilePath, userFileContent);
}



class User {

    static auth (name, password) {
        try {
            var userData = getUserData(name);
        } catch (e) {
            throw new Error(`Wrong user name '${name}'`);
        }

        if (userData.password !== password) {
            throw new Error(`Wrong password for user '${name}'`);
        }

        delete userData.password;
        userData.name = name;
        const token = jwt.sign(userData, privateKey);
        return new User(token);
    }

    static create (name, password) {
        if (userExists(name)) {
            throw new Error(`User '${name}' already exists.`);
        }
        setUserData(name, {
            uid: uuid.v4(),
            password: password,
        });
        return this.auth(name, password);
    }

    constructor (token) {
        this._token = token;
        this._data = jwt.verify(token, privateKey);
    }

    get uid () {
        return this._data.uid;
    }

    get name () {
        return this._data.name;
    }

    get token () {
        return this._token;
    }
}

module.exports = User;
