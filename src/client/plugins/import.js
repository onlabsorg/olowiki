
const olo = require("../../olo");

module.exports = function (store) {
    
    olo.engine.defineTag('import', {
        
        type: 'void',
        
        allowedAttributes: [ 'href', 'name' ],
        
        async decorator (scope) {
            const targetDoc = await store.read(this.attributes.href);
            const targetScope = {};
            await olo.engine.render(targetDoc.template, targetScope);
            scope[this.attributes.name] = targetScope;
        }
    });
}
