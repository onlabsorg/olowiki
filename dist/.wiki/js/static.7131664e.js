(function(e){function t(t){for(var n,s,r=t[0],c=t[1],l=t[2],d=0,u=[];d<r.length;d++)s=r[d],Object.prototype.hasOwnProperty.call(i,s)&&i[s]&&u.push(i[s][0]),i[s]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);h&&h(t);while(u.length)u.shift()();return a.push.apply(a,l||[]),o()}function o(){for(var e,t=0;t<a.length;t++){for(var o=a[t],n=!0,s=1;s<o.length;s++){var r=o[s];0!==i[r]&&(n=!1)}n&&(a.splice(t--,1),e=c(c.s=o[0]))}return e}var n={},s={static:0,index:0},i={static:0,index:0},a=[];function r(e){return c.p+".wiki/js/"+({"swan_modules/debug":"swan_modules/debug","swan_modules/json":"swan_modules/json","swan_modules/list":"swan_modules/list","swan_modules/markdown":"swan_modules/markdown","swan_modules/numb":"swan_modules/numb","swan_modules/text":"swan_modules/text","swan_modules/time":"swan_modules/time"}[e]||e)+"."+{"chunk-0b90926a":"d913293f","chunk-40b93790":"39ad3198","chunk-5080f974":"0136b9b0","chunk-5dccd4d0":"8ed68a4c","chunk-7e94f52c":"fb2774bb","swan_modules/debug":"8cb6b5cf","swan_modules/json":"c7351492","swan_modules/list":"8ba1d1e1","swan_modules/markdown":"4dfdaf8c","swan_modules/numb":"2a4d095e","swan_modules/text":"948fa646","swan_modules/time":"bc2b709e","chunk-7be83b7a":"8c06bdc8","chunk-de45676a":"70dc789c"}[e]+".js"}function c(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,c),o.l=!0,o.exports}c.e=function(e){var t=[],o={"chunk-0b90926a":1,"chunk-40b93790":1,"chunk-5080f974":1,"chunk-5dccd4d0":1,"chunk-7e94f52c":1,"chunk-7be83b7a":1,"chunk-de45676a":1};s[e]?t.push(s[e]):0!==s[e]&&o[e]&&t.push(s[e]=new Promise((function(t,o){for(var n=".wiki/css/"+({"swan_modules/debug":"swan_modules/debug","swan_modules/json":"swan_modules/json","swan_modules/list":"swan_modules/list","swan_modules/markdown":"swan_modules/markdown","swan_modules/numb":"swan_modules/numb","swan_modules/text":"swan_modules/text","swan_modules/time":"swan_modules/time"}[e]||e)+"."+{"chunk-0b90926a":"7d62041d","chunk-40b93790":"04b19d4c","chunk-5080f974":"50b814e9","chunk-5dccd4d0":"f0d886bd","chunk-7e94f52c":"4fd022e9","swan_modules/debug":"31d6cfe0","swan_modules/json":"31d6cfe0","swan_modules/list":"31d6cfe0","swan_modules/markdown":"31d6cfe0","swan_modules/numb":"31d6cfe0","swan_modules/text":"31d6cfe0","swan_modules/time":"31d6cfe0","chunk-7be83b7a":"79896427","chunk-de45676a":"c8b074fa"}[e]+".css",i=c.p+n,a=document.getElementsByTagName("link"),r=0;r<a.length;r++){var l=a[r],d=l.getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(d===n||d===i))return t()}var u=document.getElementsByTagName("style");for(r=0;r<u.length;r++){l=u[r],d=l.getAttribute("data-href");if(d===n||d===i)return t()}var h=document.createElement("link");h.rel="stylesheet",h.type="text/css",h.onload=t,h.onerror=function(t){var n=t&&t.target&&t.target.src||i,a=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");a.code="CSS_CHUNK_LOAD_FAILED",a.request=n,delete s[e],h.parentNode.removeChild(h),o(a)},h.href=i;var m=document.getElementsByTagName("head")[0];m.appendChild(h)})).then((function(){s[e]=0})));var n=i[e];if(0!==n)if(n)t.push(n[2]);else{var a=new Promise((function(t,o){n=i[e]=[t,o]}));t.push(n[2]=a);var l,d=document.createElement("script");d.charset="utf-8",d.timeout=120,c.nc&&d.setAttribute("nonce",c.nc),d.src=r(e);var u=new Error;l=function(t){d.onerror=d.onload=null,clearTimeout(h);var o=i[e];if(0!==o){if(o){var n=t&&("load"===t.type?"missing":t.type),s=t&&t.target&&t.target.src;u.message="Loading chunk "+e+" failed.\n("+n+": "+s+")",u.name="ChunkLoadError",u.type=n,u.request=s,o[1](u)}i[e]=void 0}};var h=setTimeout((function(){l({type:"timeout",target:d})}),12e4);d.onerror=d.onload=l,document.head.appendChild(d)}return Promise.all(t)},c.m=e,c.c=n,c.d=function(e,t,o){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(c.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(o,n,function(t){return e[t]}.bind(null,n));return o},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/",c.oe=function(e){throw console.error(e),e};var l=window["webpackJsonp"]=window["webpackJsonp"]||[],d=l.push.bind(l);l.push=t,l=l.slice();for(var u=0;u<l.length;u++)t(l[u]);var h=d;a.push([0,"chunk-vendors"]),o()})({0:function(e,t,o){e.exports=o("56d7")},"0a1d":function(e,t,o){},"56d7":function(e,t,o){"use strict";o.r(t);var n=o("81ae"),s=o("2b0e"),i=o("f309");s["a"].use(i["a"]);var a=new i["a"]({}),r=o("7496"),c=o("40dc"),l=o("8336"),d=o("ce7e"),u=o("132d"),h=o("8860"),m=o("f6c45"),f=o("f774"),w=o("2db4"),p=o("2fa4"),v=o("71d9"),g=o("2a7f"),b=function(){var e=this,t=e._self._c;return t(r["a"],[t(c["a"],{attrs:{app:"",flat:"",color:"#F1F3F4"}},[e.navigation.show?e._e():t(l["a"],{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.navigation.show=!0}}},[t(u["a"],[e._v("mdi-menu")])],1),t("olo-omnibar",{model:{value:e.docId,callback:function(t){e.docId=t},expression:"docId"}}),t(p["a"]),e.commands.show?e._e():t(l["a"],{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.commands.show=!0}}},[t(u["a"],[e._v("mdi-chevron-left")])],1)],1),t(f["a"],{ref:"navigation",attrs:{app:"",floating:"","hide-overlay":"","mini-variant":e.navigation.mini&&!e.smallScreen,width:e.navigation.width,color:"#F1F3F4"},scopedSlots:e._u([{key:"append",fn:function(){return[t(h["a"],[t(d["a"]),t("olo-menu-item",{attrs:{icon:"mdi-help-circle-outline",title:"Help",kbshortcut:""},on:{click:function(t){e.docId=e.helpPath}}})],1)]},proxy:!0}]),model:{value:e.navigation.show,callback:function(t){e.$set(e.navigation,"show",t)},expression:"navigation.show"}},[t(v["a"],{attrs:{elevation:"0",color:"#F1F3F4"}},[t(l["a"],{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.smallScreen?e.navigation.show=!1:e.navigation.mini=!e.navigation.mini}}},[t(u["a"],[e._v("mdi-menu")])],1),t(g["a"],[e._v(e._s(e.config.title))])],1),t("olo-tree",{attrs:{toc:e.config.toc,store:e.store,root:e.treeRoot,active:e.docPath,mini:e.navigation.mini&&!e.smallScreen},on:{"update:active":e.handleActiveTreeItemChange}})],1),t(f["a"],{attrs:{app:"",right:"",floating:"","mini-variant":e.commands.mini&&!e.smallScreen,color:"#F1F3F4"},model:{value:e.commands.show,callback:function(t){e.$set(e.commands,"show",t)},expression:"commands.show"}},[t(v["a"],{attrs:{elevation:"0",color:"#F1F3F4"}},[e.smallScreen?t(l["a"],{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.commands.show=!1}}},[t(u["a"],[e._v("mdi-chevron-right")])],1):e._e(),e.smallScreen?e._e():t(l["a"],{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.commands.mini=!e.commands.mini}}},[t(u["a"],[e._v(e._s(e.commands.mini&&!e.smallScreen?"mdi-chevron-left":"mdi-chevron-right"))])],1),t(g["a"],[e._v("Page")])],1),t(h["a"],["view"===e.mode?t("olo-menu-item",{attrs:{icon:"mdi-pencil",title:"Edit",kbshortcut:"CTRL-ENTER"},on:{click:function(t){e.mode="edit"}}}):e._e(),"edit"===e.mode?t("olo-menu-item",{attrs:{icon:"mdi-check",title:"Render",kbshortcut:"CTRL-ENTER"},on:{click:function(t){e.mode="view"}}}):e._e(),t("olo-menu-item",{attrs:{icon:"mdi-content-save",title:"Save",kbshortcut:"CTRL-S"},on:{click:e.save}}),t("olo-menu-item",{attrs:{icon:"mdi-content-copy",title:"Duplicate",kbshortcut:""},on:{click:function(t){return e.copyDoc(e.docPath)}}}),t("olo-menu-item",{attrs:{icon:"mdi-delete",title:"Delete",kbshortcut:""},on:{click:function(t){return e.deleteDoc(e.docPath)}}}),t("olo-menu-item",{attrs:{icon:"mdi-download",title:"Download",kbshortcut:""},on:{click:function(t){return e.download(e.docPath)}}})],1)],1),t(m["a"],{staticStyle:{"background-color":"#F1F3F4"}},[t("olo-document",{ref:"document",class:e.mode,attrs:{store:e.store,path:e.docId,mode:e.mode,presets:e.context},on:{"doc-rendered":function(t){e.docData=t}}})],1),t(w["a"],{attrs:{timeout:e.message.timeout},scopedSlots:e._u([{key:"action",fn:function({attrs:o}){return[t(l["a"],e._b({attrs:{color:"blue",text:""},on:{click:function(t){e.message.show=!1}}},"v-btn",o,!1),[e._v(" Close ")])]}}]),model:{value:e.message.show,callback:function(t){e.$set(e.message,"show",t)},expression:"message.show"}},[e._v(" "+e._s(e.message.text)+" ")]),t("olo-input",{ref:"question"})],1)},_=[],k=o("254c");const y={title:"My Wiki",toc:[]};var x={name:"App",props:["store","homePath","helpPath","treeRoot","context"],components:{"olo-document":()=>o.e("chunk-5dccd4d0").then(o.bind(null,"ac7e")),"olo-tree":()=>o.e("chunk-7e94f52c").then(o.bind(null,"4a06")),"olo-menu-item":()=>o.e("chunk-0b90926a").then(o.bind(null,"90a3")),"olo-input":()=>o.e("chunk-40b93790").then(o.bind(null,"3f17")),"olo-omnibar":()=>o.e("chunk-5080f974").then(o.bind(null,"c2a6"))},data:()=>({docId:"",mode:"view",navigation:{show:null,mini:!0,width:256,minWidth:256,borderSize:3},commands:{show:null,mini:!0},docData:{__path__:"",__title__:"Loading ..."},message:{show:!1,text:"",timeout:2e3},config:y}),computed:{docPath(){return this.docId.split("?")[0]},smallScreen(){switch(this.$vuetify.breakpoint.name){case"xs":return!0;case"sm":return!0;case"md":return!0;case"lg":return!1;case"xl":return!1;default:return!1}}},watch:{docId(){location.hash=this.store.normalizePath(this.docId)},"config.title"(){const e=document.head.querySelector("title");e.innerHTML=this.config.title}},methods:{async updateConfig(){const{data:e}=await this.store.load(this.homePath);this.config={title:e.__title__?String(e.__title__):y.title,toc:Array.isArray(e.__toc__)?e.__toc__:y.toc}},logEvent(e){console.log(e)},commit(){this.$refs.document.commit()},async save(){try{await this.$refs.document.save(),this.showMessage("Saved to "+this.docPath)}catch(e){this.showMessage("Failed to save to "+this.docPath),console.error(e)}},async copyDoc(e){const t=await this.askQuestion("Enter the path of document copy.",e);if(t)try{await this.store.copy(e,t),this.showMessage(`Copied ${e} to ${t}`)}catch(o){this.showMessage(`Failed to copy ${e} to ${t}`),console.error(o)}},async deleteDoc(e){try{e===this.docPath?await this.$refs.document.delete():await this.store.delete(e),this.showMessage("Deleted "+e)}catch(t){this.showMessage("Failed to delete "+e),console.error(t)}},async download(e){await this.store.download(e)},showMessage(e,t=2e3){this.message.text=e,this.message.timeout=t,this.message.show=!0,console.log("[olowiki message]",e)},async askQuestion(e,t=""){return await this.$refs.question.ask(e,t)},async handleStoreChange(){await this.updateConfig()},handleActiveTreeItemChange(e){"/"===e.slice(0,1)&&(this.docId=e)},handleHashChange(){const e=location.hash?location.hash.slice(1):this.homePath;this.docId=this.store.normalizePath(e)},handleMouseOverNavigationBorder(){},handleKeyboardCommand(e){const t=Object(k["detectKeyString"])(e);if("view"===this.mode)switch(t){case"Ctrl+S":e.preventDefault(),this.save();break;case"Ctrl+Return":this.mode="edit";break;default:break}else if("edit"===this.mode)switch(t){case"Ctrl+S":e.preventDefault(),this.save();break;case"Ctrl+Return":this.mode="view",this.commit();break;default:break}},initNavigation(){const e=this.$refs.navigation.$el,t=e.querySelector(".v-navigation-drawer__border");t.style.width=this.navigation.borderSize+"px";const o=this.navigation.borderSize,n=t=>{t.clientX>=this.navigation.minWidth&&(e.style.width=t.clientX+"px")};t.addEventListener("mouseover",()=>{document.body.style.cursor=this.navigation.mini?"":"ew-resize"}),t.addEventListener("mouseout",()=>{document.body.style.cursor=""}),t.addEventListener("mousedown",s=>{s.offsetX<o&&!this.navigation.mini&&(e.style.transition="initial",t.style.backgroundColor="#919191",document.addEventListener("mousemove",n,!1))},!1),document.addEventListener("mouseup",()=>{e.style.transition="",t.style.backgroundColor="",document.removeEventListener("mousemove",n,!1),this.navigation.mini||(this.navigation.width=Number(e.style.width.slice(0,-2)))},!1)}},async mounted(){document.body.addEventListener("keydown",this.handleKeyboardCommand.bind(this),!0),window.addEventListener("hashchange",this.handleHashChange.bind(this)),this.handleHashChange(),this.store.onChange(this.handleStoreChange.bind(this)),await this.updateConfig(),this.initNavigation()}},S=x,C=(o("6e7f"),o("2877")),P=Object(C["a"])(S,b,_,!1,null,null,null),E=P.exports,j=(o("d9e2"),o("b69a")),F=o("21a6");const D=e=>j["normalize"]("/"+e);class L extends n["Router"]{constructor(e){super(e),this._listeners=[]}onChange(e){"function"===typeof e&&this._listeners.push(e)}_emit(e){for(let t of this._listeners)t(e)}async write(e,t){await super.write(e,t),this._emit({op:"SET",path:j["normalize"]("/"+e),value:t})}async delete(e){await super.delete(e),this._emit({op:"DEL",path:j["normalize"]("/"+e)})}}class O extends L{async exists(e){const t=await this.read(e);return""!==t}async assertNonExistance(e){if(await this.exists(e))throw new Error(`Document '${e}' already exists.`)}async createDocument(e){await this.assertNonExistance(e),await this.write(e,"")}async copy(e,t){if(e=D(e),t=D(t),await this.assertNonExistance(t),e!==t){const o=await this.read(e);await this.write(t,o)}}async download(e){const t=await this.read(e);var o=new Blob([t],{type:"text/plain;charset=utf-8"});F["saveAs"](o,j["basename"](e)+".olo")}}s["a"].config.productionTip=!1;var T=async function(e,t={}){const o={},n={};o.store=n.store=new O(t.routes||$.routes);for(let s of Object.keys($))"routes"!==s&&(o[s]=n[s]=t[s]||$[s]);return o.vue=new s["a"]({vuetify:a,render:e=>e(E,{props:n})}).$mount(e),o};const $={routes:{},context:{},homePath:"/",helpPath:"./wiki/help/",treeRoot:"/"};window.olo=n,n["Wiki"]=T,n["Wiki"].version=o("9224").version},"6e7f":function(e,t,o){"use strict";o("0a1d")},9224:function(e){e.exports=JSON.parse('{"name":"@onlabsorg/olowiki","version":"0.17.3","description":"Wiki based on olojs documents","keywords":["wiki","swan","olojs","olojs-cli","browser","cms"],"homepage":"https://github.com/onlabsorg/olowiki#readme","bugs":{"url":"https://github.com/onlabsorg/olowiki/issues"},"author":"Marcello Del Buono","repository":{"type":"git","url":"git+https://github.com/onlabsorg/olowiki.git"},"main":"index.js","scripts":{"serve":"vue-cli-service serve","build":"vue-cli-service build","develop":"vue-cli-service build --mode develop --watch","lint":"vue-cli-service lint"},"license":"ISC","dependencies":{"@onlabsorg/olojs":"0.24.x","brace":"^0.11.1","core-js":"^3.6.5","dompurify":"^2.3.3","express":"^4.17.1","file-saver":"^2.0.5","jszip":"^3.7.1","key-string":"^0.4.0","ncp":"^2.0.0","vue":"^2.6.11","vue-async-computed":"^3.9.0","vuetify":"^2.4.0"},"devDependencies":{"@vue/cli-plugin-babel":"~4.5.0","@vue/cli-plugin-eslint":"~4.5.0","@vue/cli-service":"~4.5.0","babel-eslint":"^10.1.0","eslint":"^6.7.2","eslint-plugin-vue":"^6.2.2","sass":"~1.32.0","sass-loader":"^10.0.0","vue-cli-plugin-vuetify":"~2.4.2","vue-template-compiler":"^2.6.11","vuetify-loader":"^1.7.0"},"eslintConfig":{"root":true,"env":{"node":true},"extends":["plugin:vue/essential","eslint:recommended"],"parserOptions":{"parser":"babel-eslint"},"rules":{}},"browserslist":["> 1%","last 2 versions","not dead"],"publishConfig":{"access":"public"}}')}});
//# sourceMappingURL=static.7131664e.js.map