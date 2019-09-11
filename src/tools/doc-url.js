
const URI = require("uri-js");
const queryParser = require("query-parse");


class DocumentURL {
    
    constructor (href) {
        const uri = URI.parse(href);
        this.scheme = uri.scheme;
        this.userinfo = uri.userinfo;
        this.host = uri.host;
        this.port = uri.port;
        this.path = uri.path;
        this.query = parseQuery(uri.query);
        this.fragment = uri.fragment;
    }
        
    get name () {
        return this.path.split("/").pop();
    }
    
    get authority () {
        const userinfo = this.userinfo ? `${this.userinfo}@` : "";
        const host = this.host || "";
        const port = host && this.port ? `:${this.port}` : ""
        return `//${userinfo}${host}${port}`;
    }
    
    get root () {
        return `${this.scheme}:${this.authority}`;
    }
    
    get absoluteURI () {
        return `${this.root}${this.path}`
    }
    
    resolve (subPath) {
        const href = URI.resolve( String(this), subPath );
        return new DocumentURI(href);
    }
    
    toString () {
        return URI.serialize({
            scheme: this.scheme,
            userinfo: this.userinfo,
            host: this.host,
            port: this.port,
            path: this.path,
            query: queryParser.toString(this.query),
            fragment: this.fragment
        });
    }
}


function parseQuery (queryString) {
    const query = queryParser.toObject(queryString);
    for (let key in query) {
        let value = Number(query[key]);
        if (!Number.isNaN(value)) query[key] = value;
    }
    return query;
}


module.exports = DocumentURL;
