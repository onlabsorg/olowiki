(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["swan_modules/json"],{a7ec:function(e,n){e.exports=e=>{const n={},a=new e.Undefined("Text"),s=new e.Undefined("Namespace"),t=n=>e.wrap(n)instanceof e.Text;return n.parse=n=>t(n)?JSON.parse(e.unwrap(n)):s,n.serialize=(...n)=>{const s=new e.Tuple(...n);return s.imapSync(n=>{switch(n.typeName){case"Bool":case"Numb":case"Text":case"List":case"Namespace":return JSON.stringify(e.unwrap(n),null,2);default:return a}})},n}}}]);
//# sourceMappingURL=json.31e3824f.js.map