const lexer = require("./lexer");

const ETC = exports.ETC = Symbol("...");
const GLOBALS = Symbol("Globals");



exports.parse = function (tokens) {
    
    const parseDefinition = () => {

        if (!tokens[i].matchIdentifier()) {
            throw new Error("Expected identifier");
        }
        
        const name = tokens[i].value; i++;        
        
        if (tokens[i].matchSymbol('=')) {
            i++;
            let value = parseExpression();
            return new Assignment(name, value);
        }
        
        else if (tokens[i].matchSymbol(':')) {
            i++;
            let parameters = parseParameters();
            if (!tokens[i].matchSymbol('->')) {
                throw new Error("Expected symbol '->'");
            }
            i++;
            let body = parseExpression();
            let func = new FunctionDefinition(parameters, body);
            return new Assignment(name, func);
        }
        
        else {
            throw new Error("Expected '=' or ':'");
        }
    }
    
    const parseParameters = () => {
        if (!tokens[i].matchSymbol('(')) {
            throw new Error("Expected open parenthesis");
        }
        i++;
        if (tokens[i].matchSymbol(')')) {
            i++;
            return []
        }
        
        const parameters = [];
        
        while (true) {
            if (!tokens[i].matchIdentifier()) {
                throw new Error("Expected parameter identifier.");
            }
            parameters.push(tokens[i].value); i++;
            
            if (tokens[i].matchSymbol(')')) {
                i++; break;
            }
            
            if (!tokens[i].matchSymbol(',')) {
                throw new Error("Expected parameter separator or closing parenthesis.");
            }
            i++;
        }
        
        return parameters;        
    }
    
    const parseExpression = () => {
        var expr = [ parseOperand() ];
        
        while (tokens[i].matchBinaryOperator()) {
            let operator = tokens[i].value; i++;
            let Operation = binaryOperations[operator];
            expr.push(Operation);

            let operand = parseOperand();
            expr.push(operand);
        }
        
        while (expr.length > 1) {
            
            // find higher precedence operand
            let precedence = 0;
            let operatorIndex = 0;
            for (let j=1; j<expr.length; j+=2) {
                let Operation = expr[j];
                if (Operation.precedence > precedence) {
                    precedence = Operation.precedence;
                    operatorIndex = j;
                }
            }
            
            // evaluate the higher precedence operation
            let leftHandOperand = expr[operatorIndex - 1];
            let Operation = expr[operatorIndex];
            let rightHandOperand = expr[operatorIndex + 1];
            let operation = new Operation(leftHandOperand, rightHandOperand);
            
            // replace the [...,left,operator,right,...] items with the operation node
            expr.splice(operatorIndex-1, 3, operation);
        }
        
        return expr[0];
    }
    
    const parseOperand = () => {
        var operand;
        
        if (tokens[i].matchSign() && tokens[i+1].matchNumberLiteral()) {
            let factor = tokens[i].value === "-" ? -1 : 1;
            operand = tokens[i+1].value * factor;
            i+=2;
        }
        
        else if (tokens[i].matchLiteral()) {
            operand = tokens[i].value; i++;
        }
        
        else if (tokens[i].matchIdentifier()) {
            operand = new Reference(GLOBALS, tokens[i].value); i++;            
        }
        
        else if (tokens[i].matchSymbol('(')) {
            i++;
            operand = parseExpression();
            if (!tokens[i].matchSymbol(")")) {
                throw new Error(`Expected closing parenthesis ")"`);
            }
            i++
        }
        
        else if (tokens[i].matchSymbol('[')) {
            let items = parseListDefinition();
            operand = new ListDefinition(...items);
        }
        
        else if (tokens[i].matchSymbol('{')) {
            operand = parseNamespaceDefinition();
        }
        
        else {
            throw new Error('Operand expected.');
        }
        
        while (true) {
            if (tokens[i].matchSymbol('(')) {
                let args = parseListDefinition(); 
                operand = new FunctionCall(operand, args);
            }                
            if (tokens[i].matchSymbol('[')) {
                i++;
                let key = parseExpression(); 
                if (tokens[i].matchSymbol(']')) {
                    i++;
                } else {
                    throw new Error("Expected closing parenthesis `]`");
                }
                operand = new Query(operand, key);                        
            }
            else if (tokens[i].matchSymbol('.')) {
                i++;
                if (tokens[i].type !== lexer.Token.IDENTIFIER) {
                    throw new Error("Expected identifier");
                }
                let name = tokens[i].value; i++;
                operand = new Reference(operand, name);
            }
            else {
                break;
            }                                
        }   
        
        return operand;         
    }
    
    const parseListDefinition = () => {
        if (tokens[i].matchSymbol('(')) {
            var closingParenthesis = ")"; i++;
        } else if (tokens[i].matchSymbol("[")) {
            var closingParenthesis = "]"; i++;            
        } else {
            throw new Error('Opening parenthesis `(` or `[` expected.')
        }

        if (tokens[i].matchSymbol(closingParenthesis)) {
            i++;
            return []
        }
        
        const items = [];
        
        while (true) {
            if (tokens[i].matchSymbol(".") && tokens[i+1].matchSymbol(".") && tokens[i+2].matchSymbol(".")) {
                items.push(ETC); i+=3;
            } else {
                let item = parseExpression();
                items.push(item);
            }
            
            if (tokens[i].matchSymbol(closingParenthesis)) {
                i++; break;
            }
            
            if (!tokens[i].matchSymbol(',')) {
                throw new Error("Expected comma or closing bracket");
            }
            
            i++;
        }
        
        return items;
    };   

    const parseNamespaceDefinition = () => {
        i++; // the first token is an open parenthesis
        if (tokens[i].matchSymbol('}')) {
            i++;
            return new NamespaceDefinition();
        }
        
        const statements = [];
        
        while (true) {
            let statement = parseDefinition();
            statements.push(statement);
            
            if (tokens[i].matchSymbol('}')) {
                i++; break;
            }
            
            if (!tokens[i].matchSymbol(',')) {
                throw new Error("Expected comma or closing bracket");
            }
            
            i++;
        }
        
        return new NamespaceDefinition(...statements);
    };   

    var i=0;
    const closingToken = new lexer.Token('', '')
    tokens.push( closingToken );
    
    if (tokens[0].matchIdentifier() && (tokens[1].matchSymbol('=') || tokens[1].matchSymbol(':'))) {
        var ast = parseDefinition();
    } else {
        var ast = parseExpression();
    }

    if (tokens[i] !== closingToken) {
        throw new Error("Unexpected end of expression");
    }
    
    return ast;                
}


// Atomic expression that yields a value
class Operation {
    
    constructor (...operators) {
        this.operators = operators;
    }
    
    async evaluate (scope) {
        const args = [];
        for (let op of this.operators) {
            args.push( op instanceof Operation ? await op.evaluate(scope) : scope.$normalize(op) );
        }        
        return scope.$normalize( await this.constructor.handler(scope, ...args) );
    }

    static async handler (scope, ...args) {
        return scope.NOTHING;
    }
}

// name = value
// name: (args) -> expression
class Assignment extends Operation {    
    
    constructor (name, value) {
        super(name, value);
    }

    static async handler (scope, name, value) {
        scope[name] = value;
        return scope.NOTHING;    
    }
}


// (params) -> expression
class FunctionDefinition extends Operation {
    
    constructor (params, body) {
        const evaluateBody = scope => body instanceof Operation ? body.evaluate(scope) : body;
        super(params, evaluateBody);
    }

    static async handler (scope, params, evaluateBody) {
        return async function (...args) {
            const fnScope = Object.create(scope);
            for (let i=0; i<args.length; i++) {
                let param = params[i];
                fnScope[param] = args[i];
            }
            return await evaluateBody(fnScope);
        }                
    }    
}


// [item1, item2, item3, ...]
class ListDefinition extends Operation {
    
    constructor (...items) {
        super(...items);
    }

    static async handler (scope, ...items) {
        return items;
    }    
}


// {name1 = expr1, name2 = expr2, ... }
class NamespaceDefinition extends Operation {
    
    constructor (...statements) {
        super(statements);
    }

    static async handler (scope, statements) {
        const nsScope = Object.create(scope);
        const ns = {};
        
        for (let statement of statements) {
            await statement.evaluate(nsScope);
        }
        const names = Object.getOwnPropertyNames(nsScope);
        for (let name of names) {
            ns[name] = nsScope[name];
        }
        return ns;    
    }    
}

// namespace.name
class Reference extends Operation {
    
    constructor (namespace, name) {
        super(namespace, name);
    }
    
    static async handler (scope, namespace, name) {
        if (namespace === GLOBALS) namespace = scope;
        return scope.$dot(namespace, name);        
    }    
}

// container[key]
class Query extends Operation {    
    
    constructor (container, key) {
        super(container, key);
    }
    
    static async handler (scope, container, key) {
        return await scope.$query(container, key);
    }   
}

// name(args)
class FunctionCall extends Operation {    
    
    constructor (callable, args) {
        super(callable, ...args);
    }
    
    static async handler (scope, callable, ...args) {
        return await scope.$call(callable, ...args);
    }
}

// binary operations
const binaryOperations = {};

function defineBinaryOperation (operator, precedence, handler) {
    
    class BinaryOperation extends Operation {
        
        constructor (lho, rho) {
            super(lho, rho);
        }
        
        static async handler (scope, lho, rho) {
            return await scope[handler].call(scope, lho, rho);
        }
        
        static get precedence () {
            return precedence;
        }
    }
    
    lexer.addBinaryOperator(operator);
    binaryOperations[operator] = BinaryOperation;
}

exports.defineBinaryOperation = defineBinaryOperation;
