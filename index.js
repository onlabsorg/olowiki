const Path = require("path");
const fs = require("fs");
const uuid4 = require("uuid/v4");
const Server = require("./lib/server");
const auth = require("./lib/auth");


class OloWiki {
    
    constructor (path) {
        this.path = path;
    }
    
    readConfigFile () {
        const configPath = Path.join(this.path, "olowiki.json");
        return JSON.parse( fs.readFileSync(configPath, 'utf8') );        
    }
    
    writeConfigFile (config) {
        const configPath = Path.join(this.path, "olowiki.json");
        fs.writeFileSync(configPath, JSON.stringify(config, "", 4), 'utf8');    
    }   
    
    start (port=8010) {
        const options = this.readConfigFile();
        options.version = this.constructor.getVersion();
        options.basePath = this.path;
         
        const server = new Server(options);
         
        server.listen(port, () => {
            console.log(`olowiki server listening on port ${port}`);
        });
    }

    init (ownerId, smtpURL) {
        const config = {
            owner: ownerId,
            secret: uuid4(),
            email: smtpURL
        };
        createDir( Path.join(this.path, "doc") );
        createDir( Path.join(this.path, "lib") );
        createDir( Path.join(this.path, "users") );
        this.writeConfigFile(config);
        console.log("olowiki instance successfully created.");
    }
    
    setSMTP (host, port, user, password) {
        const config = this.readConfigFile();
        config.email = {
            host: host,
            port: Number(port),
            secure: port === "465",
            auth: {
                user: user,
                pass: password
            }
        }
        this.writeConfigFile(config);
        console.log("olowiki SMTP server parameters configured correctly.");
    }    
    
    generateToken (userId, attributes) {
        const config = this.readConfigFile();
        const user = new auth.User(userId, ...attributes);
        const token = user.generateToken(config.secret);
        return token;
    }    

    parseToken (token) {
        const config = this.readConfigFile();
        const user = auth.User.verifyToken(token, config.secret);
        return user;
    }
    
    static getVersion () {
        const npmPackage = JSON.parse( fs.readFileSync(`${__dirname}/package.json`, 'utf8') );
        return npmPackage.version || "1.0.0";        
    }
}

function createDir (dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

module.exports = OloWiki;
