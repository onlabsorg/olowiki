const ace = require('brace');

ace.define("ace/mode/olo_highlight_rules", ["require","exports","module","ace/mode/text_highlight_rules"], function(acequire, exports) {
    "use strict";
    const expressionClosingToken = {token:"markup.list.meta.tag", regex:/%>/, next:"start"};

    var oop = acequire("../lib/oop");
    
    var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    var OloHighlightRules = function() {

        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used
       this.$rules = {
            "start" : [
                {token:"markup.list.meta.tag", regex:/<%/, next:"expression"}
            ],
            
            "expression" : [
                {token:"string", regex:"'(?=.)", next:"string1"},     // single quote string
                {token:"string", regex:'"(?=.)', next:"string2"},     // double quote string
                {token:"string", regex:"`(?=.)", next:"stringTemp"},  // accent quote string
                {token:"constant.numeric", regex:/(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/},   // decimal integers and floats
                {token:"variable", regex:/[a-z_A-Z]+[a-z_A-Z0-9]*/},
                expressionClosingToken,
                {token:"keyword.operator", regex:/,|<<|>>|:|=|->|;|\?|\||&|==|!=|<|<=|>|>=|\+|-|\*|\/|%|\^|\./},
                {token:"paren.lparen", regex:/[[({]/},
                {token:"paren.rparen", regex:/[\])}]/},   
                {token:"comment", regex:"#", next:"comment"}             
            ],
            
            // single quote string
            "string1" : [
                {token:"string", regex:"'", next:"expression"}, 
                {defaultToken:"string"}                
            ],

            // double quote string
            "string2" : [
                {token:"string", regex:'"', next:"expression"}, 
                {defaultToken:"string"}                
            ],
            
            // accent quote string
            "stringTemp" : [
                {token:"string", regex:'`', next:"expression"}, 
                {defaultToken:"string"}
            ],

            // comment
            "comment": [
                expressionClosingToken,                
                {token:"comment", regex:/$/, next:"expression"},
                {defaultToken:"comment"}
            ],
        };
    };

    oop.inherits(OloHighlightRules, TextHighlightRules);

    exports.OloHighlightRules = OloHighlightRules;
});



ace.define("ace/mode/folding/oloml",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode"], function(acequire, exports) {
    "use strict";

    var oop = acequire("../../lib/oop");
    var BaseFoldMode = acequire("./fold_mode").FoldMode;

    var FoldMode = function() {};
    oop.inherits(FoldMode, BaseFoldMode);

    FoldMode.prototype.getFoldWidgetRange = function(session, foldStyle, row) {
        var range = this.indentationBlock(session, row);
        if (range)
            return range;

        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        if (startLevel == -1 || line[startLevel] != "#")
            return;

        var startColumn = line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            line = session.getLine(row);
            var level = line.search(re);

            if (level == -1)
                continue;

            if (line[level] != "#")
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };
    
    FoldMode.prototype.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var indent = line.search(/\S/);
        var next = session.getLine(row + 1);
        var prev = session.getLine(row - 1);
        var prevIndent = prev.search(/\S/);
        var nextIndent = next.search(/\S/);

        if (indent == -1) {
            session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
            return "";
        }
        if (prevIndent == -1) {
            if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
                session.foldWidgets[row - 1] = "";
                session.foldWidgets[row + 1] = "";
                return "start";
            }
        } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
            if (session.getLine(row - 2).search(/\S/) == -1) {
                session.foldWidgets[row - 1] = "start";
                session.foldWidgets[row + 1] = "";
                return "";
            }
        }

        if (prevIndent!= -1 && prevIndent < indent)
            session.foldWidgets[row - 1] = "start";
        else
            session.foldWidgets[row - 1] = "";

        if (indent < nextIndent)
            return "start";
        else
            return "";
    };
    
    exports.FoldMode = FoldMode;
});

ace.define("ace/mode/oloml", ["require","exports","module","ace/lib/oop","ace/mode/text", "ace/mode/folding/oloml","ace/range"], function (acequire, exports) {
    
    "use strict";

    const oop = acequire("../lib/oop");
    
    // defines the parent mode
    const TextMode = acequire("./text").Mode;

    // defines the language specific highlighters and folding rules
    const OloHighlightRules = acequire("./olo_highlight_rules").OloHighlightRules;
    var OloFoldMode = acequire("./folding/oloml").FoldMode;
    //var Range = acequire("../range").Range;
    

    var Mode = function() {
        // set everything up
        TextMode.call(this);
        this.HighlightRules = OloHighlightRules;
        this.foldingRules = new OloFoldMode("");
        this.$behaviour = this.$defaultBehaviour;        
    };
    oop.inherits(Mode, TextMode);

    Mode.prototype.$id = "ace/mode/oloml";

    exports.Mode = Mode;
});
