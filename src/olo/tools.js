

const tools = module.exports = {
    
    assign (scope, path, value) {
        const pathNames = path.split(".");
        const key = pathNames.pop();
        var obj = scope;
        for (let name of pathNames) {
            obj = obj[name];
        }
        obj[key] = value;
    },
    
    unindent (text) {
        const lines = text.split("\n");
        var indent = 1e6;

        for (let line of lines) {
            let leadingSpaces = line.search(/\S/);
            if (leadingSpaces !== -1) indent = Math.min(indent, leadingSpaces);
        }

        for (let i=0; i<lines.length; i++) {
            lines[i] = lines[i].substr(indent);
        }

        return lines.join("\n");        
    },
    
    URL (href) {
        
    },
    
    queryString: require('query-string')
};
