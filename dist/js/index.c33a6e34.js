(function(e){function t(t){for(var r,a,s=t[0],c=t[1],u=t[2],l=0,h=[];l<s.length;l++)a=s[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&h.push(o[a][0]),o[a]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);d&&d(t);while(h.length)h.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,a=1;a<n.length;a++){var s=n[a];0!==o[s]&&(r=!1)}r&&(i.splice(t--,1),e=c(c.s=n[0]))}return e}var r={},a={index:0},o={index:0},i=[];function s(e){return c.p+"js/"+({"swan_modules/debug":"swan_modules/debug","swan_modules/list":"swan_modules/list","swan_modules/markdown":"swan_modules/markdown","swan_modules/numb":"swan_modules/numb","swan_modules/text":"swan_modules/text","swan_modules/time":"swan_modules/time"}[e]||e)+"."+{"chunk-58b9c262":"b4c0d109","chunk-957562aa":"c57ac3f3","chunk-7357ccc0":"22e21e4b","chunk-0c8e615c":"16966e9a","chunk-4e6633d9":"85773edb","chunk-cfbf4e3c":"967becfd","swan_modules/debug":"c2e4e257","swan_modules/list":"da90fa46","swan_modules/markdown":"1f9f74be","swan_modules/numb":"dc47200b","swan_modules/text":"95304708","swan_modules/time":"a9536d6a","chunk-1495148a":"9969948c","chunk-f8e553ae":"50c14d47"}[e]+".js"}function c(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n={"chunk-58b9c262":1,"chunk-7357ccc0":1,"chunk-0c8e615c":1,"chunk-4e6633d9":1,"chunk-cfbf4e3c":1,"chunk-1495148a":1,"chunk-f8e553ae":1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var r="css/"+({"swan_modules/debug":"swan_modules/debug","swan_modules/list":"swan_modules/list","swan_modules/markdown":"swan_modules/markdown","swan_modules/numb":"swan_modules/numb","swan_modules/text":"swan_modules/text","swan_modules/time":"swan_modules/time"}[e]||e)+"."+{"chunk-58b9c262":"393cdac0","chunk-957562aa":"31d6cfe0","chunk-7357ccc0":"de69aa5f","chunk-0c8e615c":"7a89350f","chunk-4e6633d9":"905b1511","chunk-cfbf4e3c":"59bea105","swan_modules/debug":"31d6cfe0","swan_modules/list":"31d6cfe0","swan_modules/markdown":"31d6cfe0","swan_modules/numb":"31d6cfe0","swan_modules/text":"31d6cfe0","swan_modules/time":"31d6cfe0","chunk-1495148a":"79896427","chunk-f8e553ae":"d040954a"}[e]+".css",o=c.p+r,i=document.getElementsByTagName("link"),s=0;s<i.length;s++){var u=i[s],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===r||l===o))return t()}var h=document.getElementsByTagName("style");for(s=0;s<h.length;s++){u=h[s],l=u.getAttribute("data-href");if(l===r||l===o)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var r=t&&t.target&&t.target.src||o,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=r,delete a[e],d.parentNode.removeChild(d),n(i)},d.href=o;var m=document.getElementsByTagName("head")[0];m.appendChild(d)})).then((function(){a[e]=0})));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var i=new Promise((function(t,n){r=o[e]=[t,n]}));t.push(r[2]=i);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,c.nc&&l.setAttribute("nonce",c.nc),l.src=s(e);var h=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(d);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;h.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",h.name="ChunkLoadError",h.type=r,h.request=a,n[1](h)}o[e]=void 0}};var d=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},c.m=e,c.c=r,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)c.d(n,r,function(t){return e[t]}.bind(null,r));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/",c.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var h=0;h<u.length;h++)t(u[h]);var d=l;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";n("85ec")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("81ae"),a=n("1da1"),o=(n("96cf"),n("b64b"),n("2b0e")),i=n("f309");o["a"].use(i["a"]);var s=new i["a"]({}),c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("v-app-bar",{attrs:{app:"",flat:"",color:"#F1F3F4"}}),n("v-navigation-drawer",{attrs:{app:"",floating:"","hide-overlay":"","mini-variant":e.showMiniNavigation,permanent:"",color:"#F1F3F4"},model:{value:e.showNavigation,callback:function(t){e.showNavigation=t},expression:"showNavigation"}},[n("v-toolbar",{attrs:{elevation:"0",color:"#F1F3F4"}},[n("v-btn",{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.showMiniNavigation=!e.showMiniNavigation}}},[n("v-icon",[e._v("mdi-menu")])],1),n("v-toolbar-title",[e._v(e._s(e.navigationTitle))])],1),e.showMiniNavigation?e._e():n("olo-tree",{attrs:{store:e.store,root:e.treeRoot,active:e.docPath},on:{"update:active":e.handleActiveTreeItemChange,"add-item":function(t){return e.addDocTo(t)},"copy-item":function(t){return e.copyItem(t)},"delete-item":function(t){return e.deleteItem(t)},"download-item":function(t){return e.download(t)}}})],1),n("v-navigation-drawer",{attrs:{app:"",right:"",floating:"","mini-variant":e.showMiniCommands,permanent:"",color:"#F1F3F4"},scopedSlots:e._u([{key:"append",fn:function(){return[n("v-list",[n("v-divider"),n("olo-menu-item",{attrs:{icon:"mdi-home-outline",title:"Home",kbshortcut:""},on:{click:function(t){return e.setHash(e.homePath)}}}),n("olo-menu-item",{attrs:{icon:"mdi-help-circle-outline",title:"Help",kbshortcut:""},on:{click:function(t){return e.setHash(e.helpPath)}}})],1)]},proxy:!0}]),model:{value:e.showCommands,callback:function(t){e.showCommands=t},expression:"showCommands"}},[n("v-toolbar",{attrs:{elevation:"0",color:"#F1F3F4"}},[n("v-btn",{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.showMiniCommands=!e.showMiniCommands}}},[n("v-icon",[e._v(e._s(e.showMiniCommands?"mdi-chevron-left":"mdi-chevron-right"))])],1),n("v-toolbar-title",[e._v("Document")])],1),n("v-list",["view"===e.mode?n("olo-menu-item",{attrs:{icon:"mdi-pencil",title:"Edit",kbshortcut:"CTRL-ENTER"},on:{click:function(t){e.mode="edit"}}}):e._e(),"edit"===e.mode?n("olo-menu-item",{attrs:{icon:"mdi-check",title:"Render",kbshortcut:"CTRL-ENTER"},on:{click:function(t){e.mode="view"}}}):e._e(),n("olo-menu-item",{attrs:{icon:"mdi-content-save",title:"Save",kbshortcut:"CTRL-S"},on:{click:e.save}}),n("olo-menu-item",{attrs:{icon:"mdi-content-copy",title:"Duplicate",kbshortcut:""},on:{click:function(t){return e.copyItem(e.docPath)}}}),n("olo-menu-item",{attrs:{icon:"mdi-delete",title:"Delete",kbshortcut:""},on:{click:function(t){return e.deleteDoc(e.docPath)}}}),n("olo-menu-item",{attrs:{icon:"mdi-download",title:"Download",kbshortcut:""},on:{click:function(t){return e.download(e.docPath)}}})],1)],1),n("v-main",{staticStyle:{"background-color":"#F1F3F4"}},[n("olo-document",{ref:"document",class:e.mode,attrs:{store:e.store,docid:e.hash,mode:e.mode},on:{"doc-rendered":function(t){e.docData=t}}})],1),n("v-snackbar",{attrs:{timeout:e.message.timeout},scopedSlots:e._u([{key:"action",fn:function(t){var r=t.attrs;return[n("v-btn",e._b({attrs:{color:"blue",text:""},on:{click:function(t){e.message.show=!1}}},"v-btn",r,!1),[e._v(" Close ")])]}}]),model:{value:e.message.show,callback:function(t){e.$set(e.message,"show",t)},expression:"message.show"}},[e._v(" "+e._s(e.message.text)+" ")]),n("olo-input",{ref:"question"})],1)},u=[],l=(n("d3b7"),n("3ca3"),n("ddb0"),n("ac1f"),n("1276"),n("99af"),n("fb6a"),n("254c")),h={name:"App",props:["appName","store","homePath","helpPath","treeRoot"],components:{"olo-document":function(){return Promise.all([n.e("chunk-7357ccc0"),n.e("chunk-4e6633d9")]).then(n.bind(null,"ac7e"))},"olo-tree":function(){return n.e("chunk-cfbf4e3c").then(n.bind(null,"4a06"))},"olo-menu-item":function(){return Promise.all([n.e("chunk-58b9c262"),n.e("chunk-957562aa")]).then(n.bind(null,"90a3"))},"olo-input":function(){return Promise.all([n.e("chunk-7357ccc0"),n.e("chunk-0c8e615c")]).then(n.bind(null,"3f17"))}},data:function(){return{hash:"",mode:"view",showNavigation:!0,showMiniNavigation:!0,showCommands:!0,showMiniCommands:!0,docData:{__path__:"",__title__:"Loading ..."},activeTreeItem:[],message:{show:!1,text:"",timeout:2e3}}},computed:{docPath:function(){return this.docData?this.docData.__path__:this.hash.split("?")[0]},navigationTitle:function(){return this.appName||"Content"}},methods:{setHash:function(e){location.hash=this.store.normalizePath(e)},commit:function(){this.$refs.document.commit()},save:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$refs.document.save();case 3:e.showMessage("Saved to ".concat(e.docPath)),t.next=10;break;case 6:t.prev=6,t.t0=t["catch"](0),e.showMessage("Failed to save to ".concat(e.docPath)),console.error(t.t0);case 10:case"end":return t.stop()}}),t,null,[[0,6]])})))()},addDocTo:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.askQuestion("Enter the path of the new document.",e);case 2:if(r=n.sent,!r){n.next=14;break}return n.prev=4,n.next=7,t.store.createDocument(r);case 7:t.showMessage("Created ".concat(r)),n.next=14;break;case 10:n.prev=10,n.t0=n["catch"](4),t.showMessage("Failed to create ".concat(r)),console.error(n.t0);case 14:case"end":return n.stop()}}),n,null,[[4,10]])})))()},copyItem:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.askQuestion("Enter the path of document copy.",e);case 2:if(r=n.sent,!r){n.next=14;break}return n.prev=4,n.next=7,t.store.copy(e,r);case 7:t.showMessage("Copied ".concat(e," to ").concat(r)),n.next=14;break;case 10:n.prev=10,n.t0=n["catch"](4),t.showMessage("Failed to copy ".concat(e," to ").concat(r)),console.error(n.t0);case 14:case"end":return n.stop()}}),n,null,[[4,10]])})))()},deleteDoc:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(n.prev=0,e!==t.docPath){n.next=6;break}return n.next=4,t.$refs.document.delete();case 4:n.next=8;break;case 6:return n.next=8,t.store.delete(e);case 8:t.showMessage("Deleted ".concat(e)),n.next=15;break;case 11:n.prev=11,n.t0=n["catch"](0),t.showMessage("Failed to delete ".concat(e)),console.error(n.t0);case 15:case"end":return n.stop()}}),n,null,[[0,11]])})))()},deleteItem:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if("/"!==e.slice(-1)){n.next=13;break}return n.prev=1,n.next=4,t.store.deleteAll(e);case 4:t.showMessage("Deleted ".concat(e)),n.next=11;break;case 7:n.prev=7,n.t0=n["catch"](1),t.showMessage("Failed to delete ".concat(e)),console.error(n.t0);case 11:n.next=15;break;case 13:return n.next=15,t.deleteDoc(e);case 15:case"end":return n.stop()}}),n,null,[[1,7]])})))()},download:function(e){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.store.download(e);case 2:case"end":return n.stop()}}),n)})))()},showMessage:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2e3;this.message.text=e,this.message.timeout=t,this.message.show=!0,console.log("[olowiki message]",e)},askQuestion:function(e){var t=arguments,n=this;return Object(a["a"])(regeneratorRuntime.mark((function r(){var a;return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return a=t.length>1&&void 0!==t[1]?t[1]:"",r.next=3,n.$refs.question.ask(e,a);case 3:return r.abrupt("return",r.sent);case 4:case"end":return r.stop()}}),r)})))()},handleActiveTreeItemChange:function(e){"/"===e.slice(0,1)&&this.setHash(e)},handleHashChange:function(){if(location.hash){var e=location.hash.slice(1);this.hash=this.store.normalizePath(e),this.hash!==e&&this.setHash(this.hash)}else location.hash=this.homePath},handleKeyboardCommand:function(e){var t=Object(l["detectKeyString"])(e);if("view"===this.mode)switch(t){case"Ctrl+S":e.preventDefault(),this.save();break;case"Ctrl+Return":this.mode="edit";break;default:break}else if("edit"===this.mode)switch(t){case"Ctrl+S":e.preventDefault(),this.save();break;case"Ctrl+Return":this.mode="view",this.commit();break;default:break}}},mounted:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:document.body.addEventListener("keydown",e.handleKeyboardCommand.bind(e),!0),window.addEventListener("hashchange",e.handleHashChange.bind(e)),e.handleHashChange();case 3:case"end":return t.stop()}}),t)})))()}},d=h,m=(n("034f"),n("2877")),p=n("6544"),f=n.n(p),v=n("7496"),w=n("40dc"),b=n("8336"),k=n("ce7e"),g=n("132d"),x=n("8860"),y=n("f6c45"),_=n("f774"),j=n("2db4"),O=n("71d9"),R=n("2a7f"),C=Object(m["a"])(d,c,u,!1,null,null,null),D=C.exports;f()(C,{VApp:v["a"],VAppBar:w["a"],VBtn:b["a"],VDivider:k["a"],VIcon:g["a"],VList:x["a"],VMain:y["a"],VNavigationDrawer:_["a"],VSnackbar:j["a"],VToolbar:O["a"],VToolbarTitle:R["a"]});var P=n("b85c"),T=n("d4ec"),M=n("bee2"),S=n("45eb"),E=n("7e84"),N=n("262e"),F=n("2caf"),A=n("df7c"),L=n("21a6"),H=n("c4e3"),z=function(e){return"/"===e.slice(-1)},I=function(e){return A["normalize"]("/".concat(e))},V=function(e){Object(N["a"])(n,e);var t=Object(F["a"])(n);function n(e){var r;return Object(T["a"])(this,n),r=t.call(this,e),r._listeners=[],r}return Object(M["a"])(n,[{key:"onChange",value:function(e){"function"===typeof e&&this._listeners.push(e)}},{key:"_emit",value:function(e){var t,n=Object(P["a"])(this._listeners);try{for(n.s();!(t=n.n()).done;){var r=t.value;r(e)}}catch(a){n.e(a)}finally{n.f()}}},{key:"write",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(S["a"])(Object(E["a"])(n.prototype),"write",this).call(this,t,r);case 2:this._emit({op:"SET",path:A["normalize"]("/".concat(t)),value:r});case 3:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"delete",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(S["a"])(Object(E["a"])(n.prototype),"delete",this).call(this,t);case 2:this._emit({op:"DEL",path:A["normalize"]("/".concat(t))});case 3:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"deleteAll",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(S["a"])(Object(E["a"])(n.prototype),"deleteAll",this).call(this,t);case 2:this._emit({op:"DEL",path:A["normalize"]("/".concat(t,"/"))});case 3:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()}]),n}(r["Router"]),B=function(e){Object(N["a"])(r,e);var t=Object(F["a"])(r);function r(){return Object(T["a"])(this,r),t.apply(this,arguments)}return Object(M["a"])(r,[{key:"createContext",value:function(e){var t=this,a=Object(S["a"])(Object(E["a"])(r.prototype),"createContext",this).call(this,e);return a.__oloWiki__={version:n("9224").version},a.__docs__={read:function(e){return t.read(e)},list:function(e){return t.list(e)}},a}},{key:"exists",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.read(t);case 2:return n=e.sent,e.abrupt("return",""!==n);case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"assertNonExistance",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.exists(t);case 2:if(!e.sent){e.next=4;break}throw new Error("Document '".concat(t,"' already exists."));case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"createDocument",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.assertNonExistance(t);case 2:return e.next=4,this.write(t,"");case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"copyDocument",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t,n){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=I(t),n=I(n),e.next=4,this.assertNonExistance(n);case 4:if(t===n){e.next=10;break}return e.next=7,this.read(t);case 7:return r=e.sent,e.next=10,this.write(n,r);case 10:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"copyDirectory",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t,n){var r,a,o,i,s,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=I("".concat(t,"/")),n=I("".concat(n,"/")),e.next=4,this.list(t);case 4:r=e.sent,a=Object(P["a"])(r),e.prev=6,a.s();case 8:if((o=a.n()).done){e.next=21;break}if(i=o.value,s=A["join"](t,i),c=A["join"](n,i),!z(i)){e.next=17;break}return e.next=15,this.copyDirectory(s,c);case 15:e.next=19;break;case 17:return e.next=19,this.copyDocument(s,c);case 19:e.next=8;break;case 21:e.next=26;break;case 23:e.prev=23,e.t0=e["catch"](6),a.e(e.t0);case 26:return e.prev=26,a.f(),e.finish(26);case 29:case"end":return e.stop()}}),e,this,[[6,23,26,29]])})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"copy",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t,n){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!z(t)){e.next=5;break}return e.next=3,this.copyDirectory(t,n);case 3:e.next=7;break;case 5:return e.next=7,this.copyDocument(t,n);case 7:case"end":return e.stop()}}),e,this)})));function t(t,n){return e.apply(this,arguments)}return t}()},{key:"download",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var n,r,a,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if("/"!==t.slice(-1)){e.next=10;break}return n=new H,e.next=4,this._zipDir(t,n);case 4:return e.next=6,n.generateAsync({type:"blob"});case 6:r=e.sent,L["saveAs"](r,"".concat(A["basename"](t.slice(0,-1)),".zip")),e.next=15;break;case 10:return e.next=12,this.read(t);case 12:a=e.sent,o=new Blob([a],{type:"text/plain;charset=utf-8"}),L["saveAs"](o,"".concat(A["basename"](t),".olo"));case 15:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"_zipDir",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t,n){var r,a,o,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.list(t);case 2:r=e.sent,a=Object(P["a"])(r),e.prev=4,a.s();case 6:if((o=a.n()).done){e.next=21;break}if(i=o.value,"/"!==i.slice(-1)){e.next=13;break}return e.next=11,this._zipDir(t+i,n.folder(i.slice(0,-1)));case 11:e.next=19;break;case 13:return e.t0=n,e.t1="".concat(i,".olo"),e.next=17,this.read(t+i);case 17:e.t2=e.sent,e.t0.file.call(e.t0,e.t1,e.t2);case 19:e.next=6;break;case 21:e.next=26;break;case 23:e.prev=23,e.t3=e["catch"](4),a.e(e.t3);case 26:return e.prev=26,a.f(),e.finish(26);case 29:case"end":return e.stop()}}),e,this,[[4,23,26,29]])})));function t(t,n){return e.apply(this,arguments)}return t}()}]),r}(V);o["a"].config.productionTip=!1;var $=function(e){return q.apply(this,arguments)};function q(){return q=Object(a["a"])(regeneratorRuntime.mark((function e(t){var n,r,a,i,c,u,l=arguments;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(n=l.length>1&&void 0!==l[1]?l[1]:{},r={},a={},r.store=a.store=new B(n.routes||K.routes),i=0,c=Object.keys(K);i<c.length;i++)u=c[i],"routes"!==u&&(r[u]=a[u]=n[u]||K[u]);return console.log(a),r.vue=new o["a"]({vuetify:s,render:function(e){return e(D,{props:a})}}).$mount(t),e.abrupt("return",r);case 8:case"end":return e.stop()}}),e)}))),q.apply(this,arguments)}var K={appName:"olowiki",routes:{},homePath:"/",helpPath:"./wiki/help/index",treeRoot:"/"};window.olo=r,document.addEventListener("DOMContentLoaded",(function(){r["wiki"]=$("#app",{appName:"oloWiki",routes:{"/":new r["HTTPStore"](location.origin+"/docs/"),"/.wiki/":new r["HTTPStore"](location.origin+"/.wiki/",{extension:".olo"}),"http:/":new r["HTTPStore"]("http:/"),"https:/":new r["HTTPStore"]("https:/"),"local:/":new r["BrowserStore"]("olojs_local_store"),"temp:/":new r["MemoryStore"]},homePath:"/index",helpPath:"/.wiki/help/index",treeRoot:"/"})}))},"85ec":function(e,t,n){},9224:function(e){e.exports=JSON.parse('{"name":"@onlabsorg/olowiki","version":"0.15.3","description":"Wiki based on olojs documents","keywords":["wiki","swan","olojs","olojs-cli","browser","cms"],"homepage":"https://github.com/onlabsorg/olowiki#readme","bugs":{"url":"https://github.com/onlabsorg/olowiki/issues"},"author":"Marcello Del Buono","repository":{"type":"git","url":"git+https://github.com/onlabsorg/olowiki.git"},"main":"index.js","scripts":{"serve":"vue-cli-service serve","build":"vue-cli-service build","develop":"vue-cli-service build --mode develop --watch","lint":"vue-cli-service lint"},"license":"ISC","dependencies":{"@onlabsorg/olojs":"0.22.x","brace":"^0.11.1","core-js":"^3.6.5","dompurify":"^2.3.3","express":"^4.17.1","file-saver":"^2.0.5","jszip":"^3.7.1","key-string":"^0.4.0","vue":"^2.6.11","vue-async-computed":"^3.9.0","vuetify":"^2.4.0"},"devDependencies":{"@vue/cli-plugin-babel":"~4.5.0","@vue/cli-plugin-eslint":"~4.5.0","@vue/cli-service":"~4.5.0","babel-eslint":"^10.1.0","eslint":"^6.7.2","eslint-plugin-vue":"^6.2.2","sass":"~1.32.0","sass-loader":"^10.0.0","vue-cli-plugin-vuetify":"~2.4.2","vue-template-compiler":"^2.6.11","vuetify-loader":"^1.7.0"},"eslintConfig":{"root":true,"env":{"node":true},"extends":["plugin:vue/essential","eslint:recommended"],"parserOptions":{"parser":"babel-eslint"},"rules":{}},"browserslist":["> 1%","last 2 versions","not dead"],"publishConfig":{"access":"public"}}')}});
//# sourceMappingURL=index.c33a6e34.js.map