
const BrowserEnvironment = require("@onlabsorg/olojs/src/browser-environment");
const parsePath = require("path-parse");


class OlowikiEnvironment extends BrowserEnvironment {
    
    constructor (origin) {
        super(origin, {
            get Authorization () {
                return self._getAuthorizationHeader();
            }
        });
        const self = this;
    }
    
    _getAuthorizationHeader () {
        return `Bearer ${this.getToken()}`;
    }
    
    getToken () {
        return localStorage.getItem("token");
    }

    setToken (token) {
        localStorage.setItem("token", token);
    }

    async getUser () {
        const token = this.getToken();
        const response = await fetch("/user", {
            method: 'get',
            headers: {
                'Authorization': this._getAuthorizationHeader(),
            }
        });
        if (response.status === 200) {
            let user = await response.json();
            return user.id;        
        } else {
            return "Guest";
        }
    }

    async requestToken (userId) {
        const response = await fetch("/user", {
            method: 'post',
            headers: {},
            body: String(userId)
        });
        
        if (!response.ok) {
            let message = await response.text();
            throw new Error(message);        
        }
    }


    // COMMENT HANDLING METHODS
    
    _getCommentsPath (docPath) {
        const ppath = parsePath(docPath);
        return `${ppath.dir}/.${ppath.base}/cmt/`;        
    }
    
    async appendComment (docPath, comment) {
        const commentsPath = this._getCommentsPath(docPath);
        return await this.appendDocument(commentsPath, comment);
    }
    
    async listComments (docPath) {
        const commentsPath = this._getCommentsPath(docPath);
        return (await this.loadDocument(commentsPath)).items;        
    }
    
    async readComments (docPath) {
        const commentsPath = this._getCommentsPath(docPath);
        const commentsList = await this.listComments(docPath);
        const comments = [];
        for (let commentName of commentsList) {
            if (commentName.indexOf("/") !== -1) continue;
            let fullCommentPath = commentsPath + commentName;
            comments.push({
                time: new Date(commentName),
                path: fullCommentPath,
                source: await this.readDocument(fullCommentPath)
            })
        }
        return comments;
    }
    
    async loadComments (docPath) {
        const comments = await this.readComments(docPath);
        for (let comment of comments) {
            let evaluateComment = this.parseDocument(comment.source);
            let context = this.createContext(comment.path);
            comment.content = await evaluateComment(context);
            comment.author = comment.content.author;
        }
        return comments;
    }
}

module.exports = window.olonv = new OlowikiEnvironment(location.origin);
