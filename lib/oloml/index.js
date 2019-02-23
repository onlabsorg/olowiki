
const parser = require("./lib/parser");

const ExpressionType = require("./lib/types/expression");
parser.types.set("!=", ExpressionType);

const TemplateType = require("./lib/types/template");
parser.types.set("!template", TemplateType);

const MarkdownType = require("./lib/types/markdown");
parser.types.set("!markdown", MarkdownType);

exports.parser = parser;
exports.Document = require("./lib/document");
