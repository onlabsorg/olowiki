
const globals = module.exports = {

    // constants
    E: Math.E,          // Euler's constant and the base of natural logarithms, approximately 2.718.
    PI: Math.PI,        // Ratio of the circumference of a circle to its diameter, approximately 3.14159.

    // trigonometric functions
    acos: Math.acos,    // Returns the arccosine of a number.
    acosh: Math.acosh,  // Returns the hyperbolic arccosine of a number.
    asin: Math.asin,    // Returns the arcsine of a number.
    asinh: Math.asinh,  // Returns the hyperbolic arcsine of a number.
    atan: Math.atan,    // Returns the arctangent of a number.
    atanh: Math.atanh,  // Returns the hyperbolic arctangent of a number.
    cos: Math.cos,      // Returns the cosine of a number.
    cosh: Math.cosh,    // Returns the hyperbolic cosine of a number.
    sin: Math.sin,      // Returns the sine of a number.
    sinh: Math.sinh,    // Returns the hyperbolic sine of a number.
    tan: Math.tan,      // Returns the tangent of a number.
    tanh: Math.tanh,    // Returns the hyperbolic tangent of a number.
    degrees: (angle) => 180 / Math.PI * angle,      // converts radians to degrees
    radians: (angle) => Math.PI / 180 * angle,      // converts degrees to radians
    
    // rounding
    abs: Math.abs,      // Returns the absolute value of a number.
    ceil: Math.ceil,    // Returns the smallest integer greater than or equal to a number.
    floor: Math.floor,  // Returns the largest integer less than or equal to a number.
    round: Math.round,  // Returns the value of a number rounded to the nearest integer.

    // exponential and logarithm
    exp: Math.exp,      // Returns Ex, where x is the argument, and E is Euler's constant (2.718…), the base of the natural logarithm.
    log: Math.log,      // Returns the natural logarithm (loge, also ln) of a number.
    log10: Math.log10,  // Returns the base 10 logarithm of a number.
    
    // other math functions
    max: Math.max,      // Returns the largest of zero or more numbers.
    min: Math.min,      // Returns the smallest of zero or more numbers.
    pow: Math.pow,      // Returns base to the exponent power, that is, baseexponent.
    random: Math.random,// Returns a pseudo-random number between 0 and 1.
    sqrt: Math.sqrt,    // Returns the positive square root of a number.
};
