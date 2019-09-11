

var source = `
    This is a text that contains a 
    <t1:>template named t1 </t1>
    and then some other text and then another <t2:>template named t2 </t2> and that's it!
    `;
    
    
var text = source.replace(/<\s*([a-z_A-Z][a-z_A-Z0-9]*)\s*:\s*>([\s\S]*)<\s*\/\s*\1\s*>/g, (match, name, content) => {
    console.log("found", name, ":", content);
    return "{{?}}";
});

console.log(text);
