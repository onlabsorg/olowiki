

module.exports = function (str) {
    const lines = str.split("\n");
    var indent = 1e6;

    for (let line of lines) {
        let leadingSpaces = line.search(/\S/);
        if (leadingSpaces !== -1) indent = Math.min(indent, leadingSpaces);
    }

    for (let i=0; i<lines.length; i++) {
        lines[i] = lines[i].substr(indent);
    }

    return lines.join("\n");
}
