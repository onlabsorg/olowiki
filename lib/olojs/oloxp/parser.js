//     JavaScript Expression Parser (JSEP) <%= version %>
//     JSEP may be freely distributed under the MIT License
//     http://jsep.from.so/


const parser = {};

// This is the full set of types that any JSEP node can be.
// Store them here to save space when minified
var COMPOUND = 'Compound',
	IDENTIFIER = 'Identifier',
	MEMBER_EXP = 'MemberExpression',
	LITERAL = 'Literal',
	THIS_EXP = 'ThisExpression',
	CALL_EXP = 'CallExpression',
	UNARY_EXP = 'UnaryExpression',
	BINARY_EXP = 'BinaryExpression',
	ARRAY_EXP = 'ArrayExpression',

	PERIOD_CODE = 46, // '.'
	COMMA_CODE  = 44, // ','
	SQUOTE_CODE = 39, // single quote
	DQUOTE_CODE = 34, // double quotes
	OPAREN_CODE = 40, // (
	CPAREN_CODE = 41, // )
	OBRACK_CODE = 91, // [
	CBRACK_CODE = 93, // ]
	QUMARK_CODE = 63, // ?
	SEMCOL_CODE = 59, // ;
	COLON_CODE  = 58; // :

function throwError (message, index) {
	var error = new Error(message + ' at character ' + index);
	error.index = index;
	error.description = message;
	throw error;
}

// Operations
// ----------

function getMaxLen (items) {
    max_len = 0;
    for (let item of items) {
        max_len = Math.max(max_len, item.length);
    }
    return max_len;    
}

const unaryOps = new Set('-', '!', '~', '+');
unaryOps.maxLen = () => getMaxLen(unaryOps);

// Use a map for the binary operations and set their values to their
// binary precedence for quick reference:
// see [Order of operations](http://en.wikipedia.org/wiki/Order_of_operations#Programming_language)
const binaryOps = new Map([
    ['||', 1], ['&&', 2], ['|', 3],  ['^', 4],  ['&', 5],
	['==', 6], ['!=', 6], ['===', 6], ['!==', 6],
	['<', 7],  ['>', 7],  ['<=', 7],  ['>=', 7],
	['<<', 8],  ['>>', 8], ['>>>', 8],
	['+', 9], ['-', 9],
	['*', 10], ['/', 10], ['%', 10]    
]);
binaryOps.maxLen = () => getMaxLen(binaryOps.keys());
binaryOps.precedenceOf = op_name => binaryOps.get(op_name) || 0;


// Literals
// ----------
// Store the values to return for the various literals we may encounter
var literals = {
	'true': true,
	'false': false,
	'null': null
};
// Except for `this`, which is special. This could be changed to something like `'self'` as well
var this_str = 'this';

// Utility function (gets called from multiple places)
const create = {
	
	binaryExpression: (operator, left, right) => Object({
		type: BINARY_EXP,
		operator: operator,
		left: left,
		right: right		
	}),
	
	unaryExpression: (operator, argument, prefix) => Object({
		type: UNARY_EXP,
		operator: operator,
		argument: argument,
		prefix: prefix
	}),
	
	literal: (value, raw) => Object({
		type: LITERAL,
		value: value,
		raw: raw		
	}), 
	
	thisExpression: () => Object({ 
		type: THIS_EXP 
	}),	

	identifier: (name) => Object({
		type: IDENTIFIER,
		name: name					
	}),
	
	memberExpression: (computed, object, property) => Object({
		type: MEMBER_EXP,
		computed: computed,
		object: object,
		property: property		
	}),

	callExpression: (args, callee) => Object({
		type: CALL_EXP,
		'arguments': args,
		callee: callee						
	}),

	arrayExpression: (elements) => Object({
		type: ARRAY_EXP,
		elements: elements
	}),

	compound: (body) => Object({
		type: COMPOUND,
		body: body		
	}),
}

const match = {
	
	decimalDigit:    ch => ch >= 48 && ch <= 57, 			// 0...9
	
	identifierStart: ch => (ch === 36) || (ch === 95) || 	// `$` and `_`
						   (ch >= 65 && ch <= 90) || 		// A...Z
						   (ch >= 97 && ch <= 122) || 		// a...z
            			   (ch >= 128 && !binaryOps.get(String.fromCharCode(ch))), // any non-ASCII that is not an operator
						   
	identifierPart:  ch => match.identifierStart(ch) || match.decimalDigit(ch),
	
}

// Parsing
// -------
// `expr` is a string with the passed in expression
parser.parse = function(expr) {
	// `index` stores the character number we are currently at while `length` is a constant
	// All of the gobbles below will modify `index` as we move along
	var index = 0,
		charAtFunc = expr.charAt,
		charCodeAtFunc = expr.charCodeAt,
		exprI = i => charAtFunc.call(expr, i),
		exprICode = i => charCodeAtFunc.call(expr, i),
		length = expr.length,

		// Push `index` up to the next non-space character
		gobbleSpaces = () => {
			var ch = exprICode(index);
			// space or tab
			while(ch === 32 || ch === 9 || ch === 10 || ch === 13) {
				ch = exprICode(++index);
			}
		},

		// The main parsing function.
		gobbleExpression = () => gobbleBinaryExpression(),

		// Search for the operation portion of the string (e.g. `+`, `===`)
		// Start by taking the longest possible binary operations (3 characters: `===`, `!==`, `>>>`)
		// and move down from 3 to 2 to 1 character until a matching binary operation is found
		// then, return that binary operation
		gobbleBinaryOp = () => {
			gobbleSpaces();
			var biop, 
                to_check = expr.substr(index, binaryOps.maxLen()), 
                tc_len = to_check.length;
			while(tc_len > 0) {
				// Don't accept a binary op when it is an identifier.
				// Binary ops that start with a identifier-valid character must be followed
				// by a non identifier-part valid character
				if(binaryOps.has(to_check) && (
					!match.identifierStart(exprICode(index)) ||
					(index+to_check.length< expr.length && !match.identifierPart(exprICode(index+to_check.length)))
				)) {
					index += tc_len;
					return to_check;
				}
				to_check = to_check.substr(0, --tc_len);
			}
			return false;
		},

		// This function is responsible for gobbling an individual expression,
		// e.g. `1`, `1+2`, `a+(b*2)-Math.sqrt(2)`
		gobbleBinaryExpression = () => {
			var ch_i, node, biop, prec, stack, biop_info, left, right, i, cur_biop;

			// First, try to get the leftmost thing
			// Then, check to see if there's a binary operator operating on that leftmost thing
			left = gobbleToken();
			biop = gobbleBinaryOp();

			// If there wasn't a binary operator, just return the leftmost node
			if(!biop) {
				return left;
			}

			// Otherwise, we need to start a stack to properly place the binary operations in their
			// precedence structure
			biop_info = { value: biop, prec: binaryOps.precedenceOf(biop)};

			right = gobbleToken();
			if(!right) {
				throwError("Expected expression after " + biop, index);
			}
			stack = [left, biop_info, right];

			// Properly deal with precedence using [recursive descent](http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
			while((biop = gobbleBinaryOp())) {
				prec = binaryOps.precedenceOf(biop);

				if(prec === 0) {
					break;
				}
				biop_info = { value: biop, prec: prec };

				cur_biop = biop;
				// Reduce: make a binary expression from the three topmost entries.
				while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
					right = stack.pop();
					biop = stack.pop().value;
					left = stack.pop();
					node = create.binaryExpression(biop, left, right);
					stack.push(node);
				}

				node = gobbleToken();
				if(!node) {
					throwError("Expected expression after " + cur_biop, index);
				}
				stack.push(biop_info, node);
			}

			i = stack.length - 1;
			node = stack[i];
			while(i > 1) {
				node = create.binaryExpression(stack[i - 1].value, stack[i - 2], node);
				i -= 2;
			}
			return node;
		},

		// An individual part of a binary expression:
		// e.g. `foo.bar(baz)`, `1`, `"abc"`, `(a % 2)` (because it's in parenthesis)
		gobbleToken = () => {
			var ch, to_check, tc_len;

			gobbleSpaces();
			ch = exprICode(index);

			if(match.decimalDigit(ch) || ch === PERIOD_CODE) {
				// Char code 46 is a dot `.` which can start off a numeric literal
				return gobbleNumericLiteral();
			} else if(ch === SQUOTE_CODE || ch === DQUOTE_CODE) {
				// Single or double quotes
				return gobbleStringLiteral();
			} else if (ch === OBRACK_CODE) {
				return gobbleArray();
			} else {
				to_check = expr.substr(index, unaryOps.maxLen());
				tc_len = to_check.length;
				while(tc_len > 0) {
				// Don't accept an unary op when it is an identifier.
				// Unary ops that start with a identifier-valid character must be followed
				// by a non identifier-part valid character
					if(unaryOps.has(to_check) && (
						!match.identifierStart(exprICode(index)) ||
						(index+to_check.length < expr.length && !match.identifierPart(exprICode(index+to_check.length)))
					)) {
						index += tc_len;
						return create.unaryExpression(to_check, gobbleToken(), true);
					}
					to_check = to_check.substr(0, --tc_len);
				}

				if (match.identifierStart(ch) || ch === OPAREN_CODE) { // open parenthesis
					// `foo`, `bar.baz`
					return gobbleVariable();
				}
			}

			return false;
		},
		// Parse simple numeric literals: `12`, `3.4`, `.5`. Do this by using a string to
		// keep track of everything in the numeric literal and then calling `parseFloat` on that string
		gobbleNumericLiteral = () => {
			var number = '', ch, chCode;
			while(match.decimalDigit(exprICode(index))) {
				number += exprI(index++);
			}

			if(exprICode(index) === PERIOD_CODE) { // can start with a decimal marker
				number += exprI(index++);

				while(match.decimalDigit(exprICode(index))) {
					number += exprI(index++);
				}
			}

			ch = exprI(index);
			if(ch === 'e' || ch === 'E') { // exponent marker
				number += exprI(index++);
				ch = exprI(index);
				if(ch === '+' || ch === '-') { // exponent sign
					number += exprI(index++);
				}
				while(match.decimalDigit(exprICode(index))) { //exponent itself
					number += exprI(index++);
				}
				if(!match.decimalDigit(exprICode(index-1)) ) {
					throwError('Expected exponent (' + number + exprI(index) + ')', index);
				}
			}


			chCode = exprICode(index);
			// Check to make sure this isn't a variable name that start with a number (123abc)
			if(match.identifierStart(chCode)) {
				throwError('Variable names cannot start with a number (' +
							number + exprI(index) + ')', index);
			} else if(chCode === PERIOD_CODE) {
				throwError('Unexpected period', index);
			}

			return create.literal(parseFloat(number), number);
		},

		// Parses a string literal, staring with single or double quotes with basic support for escape codes
		// e.g. `"hello world"`, `'this is\nJSEP'`
		gobbleStringLiteral = () => {
			var str = '', quote = exprI(index++), closed = false, ch;

			while(index < length) {
				ch = exprI(index++);
				if(ch === quote) {
					closed = true;
					break;
				} else if(ch === '\\') {
					// Check for all of the common escape codes
					ch = exprI(index++);
					switch(ch) {
						case 'n': str += '\n'; break;
						case 'r': str += '\r'; break;
						case 't': str += '\t'; break;
						case 'b': str += '\b'; break;
						case 'f': str += '\f'; break;
						case 'v': str += '\x0B'; break;
						default : str += ch;
					}
				} else {
					str += ch;
				}
			}

			if(!closed) {
				throwError('Unclosed quote after "'+str+'"', index);
			}

			return create.literal(str, quote + str + quote);
		},

		// Gobbles only identifiers
		// e.g.: `foo`, `_value`, `$x1`
		// Also, this function checks if that identifier is a literal:
		// (e.g. `true`, `false`, `null`) or `this`
		gobbleIdentifier = () => {
			var ch = exprICode(index), start = index, identifier;

			if(match.identifierStart(ch)) {
				index++;
			} else {
				throwError('Unexpected ' + exprI(index), index);
			}

			while(index < length) {
				ch = exprICode(index);
				if(match.identifierPart(ch)) {
					index++;
				} else {
					break;
				}
			}
			identifier = expr.slice(start, index);

			if(literals.hasOwnProperty(identifier)) {
				return create.literal(literals[identifier], identifier);
			} else if(identifier === this_str) {
				return create.thisExpression();
			} else {
				return create.identifier(identifier);
			}
		},

		// Gobbles a list of arguments within the context of a function call
		// or array literal. This function also assumes that the opening character
		// `(` or `[` has already been gobbled, and gobbles expressions and commas
		// until the terminator character `)` or `]` is encountered.
		// e.g. `foo(bar, baz)`, `my_func()`, or `[bar, baz]`
		gobbleArguments = (termination) => {
			var ch_i, args = [], node, closed = false;
			var separator_count = 0;
			while(index < length) {
				gobbleSpaces();
				ch_i = exprICode(index);
				if(ch_i === termination) { // done parsing
					closed = true;
					index++;
					if(termination === CPAREN_CODE && separator_count && separator_count >= args.length){
						throwError('Unexpected token ' + String.fromCharCode(termination), index);
					}
					break;
				} else if (ch_i === COMMA_CODE) { // between expressions
					index++;
					separator_count++;
					if(separator_count !== args.length) { // missing argument
						if(termination === CPAREN_CODE) {
							throwError('Unexpected token ,', index);
						}
						else if(termination === CBRACK_CODE) {
							for(var arg = args.length; arg< separator_count; arg++) {
								args.push(null);
							}
						}
					}
				} else {
					node = gobbleExpression();
					if(!node || node.type === COMPOUND) {
						throwError('Expected comma', index);
					}
					args.push(node);
				}
			}
			if (!closed) {
				throwError('Expected ' + String.fromCharCode(termination), index);
			}
			return args;
		},

		// Gobble a non-literal variable name. This variable name may include properties
		// e.g. `foo`, `bar.baz`, `foo['bar'].baz`
		// It also gobbles function calls:
		// e.g. `Math.acos(obj.angle)`
		gobbleVariable = () => {
			var ch_i, node;
			ch_i = exprICode(index);

			if(ch_i === OPAREN_CODE) {
				node = gobbleGroup();
			} else {
				node = gobbleIdentifier();
			}
			gobbleSpaces();
			ch_i = exprICode(index);
			while(ch_i === PERIOD_CODE || ch_i === OBRACK_CODE || ch_i === OPAREN_CODE) {
				index++;
				if(ch_i === PERIOD_CODE) {
					gobbleSpaces();
					node = create.memberExpression(false, node, gobbleIdentifier());
				} else if(ch_i === OBRACK_CODE) {
					node = create.memberExpression(true, node, gobbleExpression());
					gobbleSpaces();
					ch_i = exprICode(index);
					if(ch_i !== CBRACK_CODE) {
						throwError('Unclosed [', index);
					}
					index++;
				} else if(ch_i === OPAREN_CODE) {
					// A function call is being made; gobble all the arguments
					node = create.callExpression(gobbleArguments(CPAREN_CODE), node);
				}
				gobbleSpaces();
				ch_i = exprICode(index);
			}
			return node;
		},

		// Responsible for parsing a group of things within parentheses `()`
		// This function assumes that it needs to gobble the opening parenthesis
		// and then tries to gobble everything within that parenthesis, assuming
		// that the next thing it should see is the close parenthesis. If not,
		// then the expression probably doesn't have a `)`
		gobbleGroup = () => {
			index++;
			var node = gobbleExpression();
			gobbleSpaces();
			if(exprICode(index) === CPAREN_CODE) {
				index++;
				return node;
			} else {
				throwError('Unclosed (', index);
			}
		},

		// Responsible for parsing Array literals `[1, 2, 3]`
		// This function assumes that it needs to gobble the opening bracket
		// and then tries to gobble the expressions as arguments.
		gobbleArray = () => {
			index++;
			return create.arrayExpression(gobbleArguments(CBRACK_CODE));
		},

		nodes = [], ch_i, node;

	while(index < length) {
		ch_i = exprICode(index);

		// Expressions can be separated by semicolons, commas, or just inferred without any
		// separators
		if(ch_i === SEMCOL_CODE || ch_i === COMMA_CODE) {
			index++; // ignore separators
		} else {
			// Try to gobble each expression individually
			if((node = gobbleExpression())) {
				nodes.push(node);
			// If we weren't able to find a binary expression and are out of room, then
			// the expression passed in probably has too much
			} else if(index < length) {
				throwError('Unexpected "' + exprI(index) + '"', index);
			}
		}
	}

	// If there's only one expression just try returning the expression
	if(nodes.length === 1) {
		return nodes[0];
	} else {
		return create.compound(nodes);
	}
};

// To be filled in by the template
parser.version = '<%= version %>';
parser.toString = () => 'JavaScript Expression Parser (JSEP) v' + parser.version;

/**
 * @method parser.addUnaryOp
 * @param {string} op_name The name of the unary op to add
 * @return parser
 */
parser.addUnaryOp = function(op_name) {
    if (!unaryOps.has(op_name)) unaryOps.add(op_name);
	return this;
};

/**
 * @method parser.addBinaryOp
 * @param {string} op_name The name of the binary op to add
 * @param {number} precedence The precedence of the binary op (can be a float)
 * @return parser
 */
parser.addBinaryOp = function(op_name, precedence) {
    binaryOps.set(op_name, precedence);
	return this;
};

/**
 * @method parser.addLiteral
 * @param {string} literal_name The name of the literal to add
 * @param {*} literal_value The value of the literal
 * @return parser
 */
parser.addLiteral = function(literal_name, literal_value) {
	literals[literal_name] = literal_value;
	return this;
};

/**
 * @method parser.removeUnaryOp
 * @param {string} op_name The name of the unary op to remove
 * @return parser
 */
parser.removeUnaryOp = function(op_name) {
    unaryOps.delete(op_name);
	return this;
};

/**
 * @method parser.removeAllUnaryOps
 * @return parser
 */
parser.removeAllUnaryOps = function() {
    unaryOps.clear();
	return this;
};

/**
 * @method parser.removeBinaryOp
 * @param {string} op_name The name of the binary op to remove
 * @return parser
 */
parser.removeBinaryOp = function(op_name) {
	binaryOps.delete(op_name);
	return this;
};

/**
 * @method parser.removeAllBinaryOps
 * @return parser
 */
parser.removeAllBinaryOps = function() {
	binaryOps.clear();
	return this;
};

/**
 * @method parser.removeLiteral
 * @param {string} literal_name The name of the literal to remove
 * @return parser
 */
parser.removeLiteral = function(literal_name) {
	delete literals[literal_name];
	return this;
};

/**
 * @method parser.removeAllLiterals
 * @return parser
 */
parser.removeAllLiterals = function() {
	literals = {};

	return this;
};



module.exports = parser;
