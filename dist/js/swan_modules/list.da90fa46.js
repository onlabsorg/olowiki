(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["swan_modules/list"],{"117f":function(n,e){n.exports=n=>{const e={},t=new n.Undefined("Text"),i=new n.Undefined("List"),r=e=>n.wrap(e)instanceof n.Numb,s=e=>n.wrap(e)instanceof n.Text,f=e=>n.wrap(e)instanceof n.List;return e.reverse=n=>{if(f(n)){const e=[];for(let t=n.length-1;t>=0;t--)e.push(n[t]);return e}return i},e.find=n=>e=>f(e)?e.indexOf(n):NaN,e.rfind=n=>e=>f(e)?e.lastIndexOf(n):NaN,e.head=n=>e=>r(n)&&f(e)?e.slice(0,n):i,e.tail=n=>e=>r(n)&&f(e)?e.slice(n):i,e.join=n=>e=>{if(!s(n))return t;for(let n of e)if(!s(n))return t;return e.join(n)},e}}}]);
//# sourceMappingURL=list.da90fa46.js.map