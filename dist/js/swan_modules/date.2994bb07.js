(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["swan_modules/date"],{"75aa":function(e,t){e.exports={__apply__:(e,t=1,a=1,n=0,s=0,o=0,g=0)=>Number(new Date(e,t-1,a,n,s,o,g)),timezone:-(new Date).getTimezoneOffset()/60,parse:e=>Number(Date.parse(e)),stringify:e=>a(e).toISOString(),now:()=>Date.now(),year:e=>a(e).getFullYear(),month:e=>a(e).getMonth()+1,week:e=>{e=new Date(Number(e)),e.setHours(0,0,0,0),e.setDate(e.getDate()+3-(e.getDay()+6)%7);var t=new Date(e.getFullYear(),0,4);return 1+Math.round(((e.getTime()-t.getTime())/864e5-3+(t.getDay()+6)%7)/7)},weekDay:e=>a(e).getDay(),day:e=>a(e).getDate(),hours:e=>a(e).getHours(),minutes:e=>a(e).getMinutes(),seconds:e=>a(e).getSeconds(),milliseconds:e=>a(e).getMilliseconds(),UTC:{__apply__:(e,t=1,a=1,n=0,s=0,o=0,g=0)=>Date.UTC(e,t-1,a,n,s,o,g),year:e=>a(e).getUTCFullYear(),month:e=>a(e).getUTCMonth()+1,weekDay:e=>a(e).getUTCDay(),day:e=>a(e).getUTCDate(),hours:e=>a(e).getUTCHours(),minutes:e=>a(e).getUTCMinutes(),seconds:e=>a(e).getUTCSeconds(),milliseconds:e=>a(e).getUTCMilliseconds()}};const a=e=>new Date(e)}}]);
//# sourceMappingURL=date.2994bb07.js.map