(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["swan_modules/debug"],{"7c39":function(e,o){e.exports=e=>{const o={};let a=0;return o.log=(...o)=>{const n=new e.Tuple(...o).normalize();return a++,console.log(`Log ${a}:`,n),`[[Log ${a}]]`},o.inspect=(...a)=>{const n=new e.Tuple(...a).normalize(),s={type:n.typeName};switch(s.type){case"Bool":case"Numb":case"Text":s.value=e.unwrap(n);break;case"List":s.value=n.domain.map(e=>o.inspect(n.vget(e)));break;case"Namespace":s.value={};for(let e of n.domain)s.value[e]=o.inspect(n.vget(e));break;case"Func":break;case"Tuple":s.value=Array.from(n.items()).map(e=>o.inspect(e));break;case"Undefined":if(s.operation=n.type,s.arguments=n.args.map(e=>o.inspect(e)),n.position){const[e,o]=n.position.getLocation();s.source=n.position.source.split("\n")[e-1],s.position=o}break}return s},o}}}]);
//# sourceMappingURL=debug.c3f98aa6.js.map