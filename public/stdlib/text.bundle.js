(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{131:function(r,n){function e(r){if("string"!=typeof r)throw new Error("String type expected")}function t(r){if(Number.isNaN(r))throw new Error("Number type expected")}n.find=function(r,n){return e(r),e(n),r.indexOf(n)},n.rfind=function(r,n){return e(r),e(n),r.lastIndexOf(n)},n.lower=function(r){return e(r),r.toLowerCase()},n.upper=function(r){return e(r),r.toUpperCase()},n.char=function(...r){for(let n of r)t(n);return String.fromCharCode(...r)},n.code=function(r){return e(r),Array.from(r).map(r=>r.charCodeAt(0))},n.slice=function(r,n,o){return e(r),t(n),void 0!==o&&t(o),r.slice(n,o)},n.split=function(r,n){return e(r),e(n),r.split(n)},n.replace=(r,n,t)=>{for(e(r),e(n),e(t);-1!==r.indexOf(n);)r=r.replace(n,t);return r}}}]);