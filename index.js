const Path = require("path");
const fs = require("fs");
const uuid4 = require("uuid/v4");
const User = require("./lib/user");
const OloJS = require("@onlabsorg/olojs");


class OloWiki extends OloJS {

    getEnvironment () {
        global.olowiki = {
            'require': modulePath => require(`./lib/${modulePath}`)
        };
        const env = super.getEnvironment();
        delete global.olowiki;
        return env;
    }
    
    async init (ownerId) {
        const olonvTemplateArguments = {
            owner: ownerId,
            secret: uuid4()
        };
        const dirs = [
            "docs", 
        ];
        await super.init(olonvTemplateArguments, dirs);
    }
    
    generateToken (userId, attributes) {
        const env = this.getEnvironment();
        const user = new User(userId, ...attributes);
        const token = user.generateToken(env.secret);
        return token;
    }    

    parseToken (token) {
        const env = this.getEnvironment();
        const user = User.verifyToken(token, env.secret);
        return user;
    }
    
    static getVersion () {
        const npmPackage = JSON.parse( fs.readFileSync(`${__dirname}/package.json`, 'utf8') );
        return npmPackage.version || "1.0.0";        
    }
    
    static getEnvironmentScriptTemplate () {
        return fs.readFileSync(Path.resolve(__dirname, "./templates/olonv.js"), "utf8");
    }    
}

module.exports = OloWiki;
