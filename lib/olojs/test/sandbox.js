const stripIndent = require("strip-indent");


const text = stripIndent(`
    
        
    name1: value1
        
        child11
    
        child12
        child13
    node2
        
        child21
        child22
        child23
        
    `);


function spacesBefore (str) {
    return str.search(/\S|$/);
}

function parseList (text) {
    console.log("PARSING LIST:", text);
    const listMatch = text.match(/^(\s*\n)*(.*)$/s)
    const emptyLines = listMatch[1].split("\n");
    emptyLines.pop();
    const nodesMatch = listMatch[2].match(/^\S.*\n(?:\s.*\n|\s*\n)*/gm);
    const nodes = nodesMatch.map(nodeSource => parseNode(nodeSource));
    return {emptyLines, node}
}

function parseNode (text) {
    console.log("PARSING NODE:", text);
    const match = text.match(/^(\S.*)\n((?:\s.*\n|\n)*)$/);
    if (!match) return null;
    const rootLine = match[1];
    const childText = match[2];
    
    const rootLineMatch = rootLine.match(/^([A-Za-z_][A-Za-z_0-9]*)(\s*\:\s*)(.*)$/);
    const options = {spacesBeforeColon:0, spacesAfterColon:1};
    if (rootLineMatch) {
        var name = rootLineMatch[1];
        options.spacesBeforeColon = spacesBefore(rootLineMatch[2]);
        options.spacesAfterColon = rootLineMatch[2].length - options.spacesBeforeColon - 1;
        var value = rootLineMatch[3];
    } else {
        var name = "";
        var value = rootLine;
    }
    
    const childList = parseList(childText);
    
    return {rootLine, childText, name, value, options};
}

// plist = parseList(text);
// console.log(plist);
// 
// pnode1 = parseNode(plist.nodesMatch[0]);
// console.log(pnode1);


function* splitListSource (listSource) {
    if (listSource === "") return;
    
    const listSourceMatch = listSource.match(/^(\S.*(?:\n\s.*|\n\s*)*)((?:.*\n?)*)$/);
    if (listSourceMatch) {
        yield listSourceMatch[1];
        for (let siblingNodeSource of splitListSource(listSourceMatch[2])) {
            yield siblingNodeSource;
        }
    } else {
        throw new Error("Syntax error!");
    }
    
}


const listSource = "name1: value1\n" +
                   "   child11: value11\n" +
                   "   child12: value12\n" +
                   "   child13: value13\n" +
                   "name2: value2\n" +
                   "   child21: value21\n" +
                   "   child22: value22\n" +
                   "   child23: value23\n" +
                   "name3: value2\n" +
                   "   child31: value31\n" +
                   "   child32: value32\n" +
                   "   child33: value33\n" ;
                                      
for (let nodeSource of splitListSource(listSource)) {
    console.log(nodeSource);
}  
                   
