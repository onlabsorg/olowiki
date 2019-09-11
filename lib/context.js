const olojs = require("olojs");

const context = Object.create(olojs.context);

context.eval = async function (expression) {
    try {
        return await olojs.context.eval.call(this, expression);
    } catch (error) {
        console.error(error);
        return `<strong style="color:red">(!)</strong>`;
    }
}

context.license = "https://opensource.org/licenses/MIT";

module.exports = context;
