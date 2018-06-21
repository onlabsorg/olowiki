
const olo = window.olo;

module.exports = function () {
    
    olo.Document.decorators.set('set', (element) => {
        const setElt = Object.create(element);
        
        setElt.toString = () => "";
        
        setElt.render = async function (context) {
            await this.attributes.render(context);
            for (let [key, value] of this.attributes) {
                context[key] = value;
            }
        }
        
        return setElt;
    });
}
