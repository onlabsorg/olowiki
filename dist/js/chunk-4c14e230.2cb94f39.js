(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4c14e230"],{"0789":function(t,e,n){"use strict";n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return u})),n.d(e,"a",(function(){return d}));var r=n("d9f7");function i(t=[],...e){return Array().concat(t,...e)}function s(t,e="top center 0",n){return{name:t,functional:!0,props:{group:{type:Boolean,default:!1},hideOnLeave:{type:Boolean,default:!1},leaveAbsolute:{type:Boolean,default:!1},mode:{type:String,default:n},origin:{type:String,default:e}},render(e,n){const s="transition"+(n.props.group?"-group":""),a={props:{name:t,mode:n.props.mode},on:{beforeEnter(t){t.style.transformOrigin=n.props.origin,t.style.webkitTransformOrigin=n.props.origin}}};return n.props.leaveAbsolute&&(a.on.leave=i(a.on.leave,t=>{const{offsetTop:e,offsetLeft:n,offsetWidth:r,offsetHeight:i}=t;t._transitionInitialStyles={position:t.style.position,top:t.style.top,left:t.style.left,width:t.style.width,height:t.style.height},t.style.position="absolute",t.style.top=e+"px",t.style.left=n+"px",t.style.width=r+"px",t.style.height=i+"px"}),a.on.afterLeave=i(a.on.afterLeave,t=>{if(t&&t._transitionInitialStyles){const{position:e,top:n,left:r,width:i,height:s}=t._transitionInitialStyles;delete t._transitionInitialStyles,t.style.position=e||"",t.style.top=n||"",t.style.left=r||"",t.style.width=i||"",t.style.height=s||""}})),n.props.hideOnLeave&&(a.on.leave=i(a.on.leave,t=>{t.style.setProperty("display","none","important")})),e(s,Object(r["a"])(n.data,a),n.children)}}}function a(t,e,n="in-out"){return{name:t,functional:!0,props:{mode:{type:String,default:n}},render(n,i){return n("transition",Object(r["a"])(i.data,{props:{name:t},on:e}),i.children)}}}var o=n("80d2"),l=function(t="",e=!1){const n=e?"width":"height",r="offset"+Object(o["x"])(n);return{beforeEnter(t){t._parent=t.parentNode,t._initialStyle={transition:t.style.transition,overflow:t.style.overflow,[n]:t.style[n]}},enter(e){const i=e._initialStyle;e.style.setProperty("transition","none","important"),e.style.overflow="hidden";const s=e[r]+"px";e.style[n]="0",e.offsetHeight,e.style.transition=i.transition,t&&e._parent&&e._parent.classList.add(t),requestAnimationFrame(()=>{e.style[n]=s})},afterEnter:s,enterCancelled:s,leave(t){t._initialStyle={transition:"",overflow:t.style.overflow,[n]:t.style[n]},t.style.overflow="hidden",t.style[n]=t[r]+"px",t.offsetHeight,requestAnimationFrame(()=>t.style[n]="0")},afterLeave:i,leaveCancelled:i};function i(e){t&&e._parent&&e._parent.classList.remove(t),s(e)}function s(t){const e=t._initialStyle[n];t.style.overflow=t._initialStyle.overflow,null!=e&&(t.style[n]=e),delete t._initialStyle}};s("carousel-transition"),s("carousel-reverse-transition"),s("tab-transition"),s("tab-reverse-transition"),s("menu-transition"),s("fab-transition","center center","out-in"),s("dialog-transition"),s("dialog-bottom-transition"),s("dialog-top-transition");const c=s("fade-transition"),u=(s("scale-transition"),s("scroll-x-transition"),s("scroll-x-reverse-transition"),s("scroll-y-transition"),s("scroll-y-reverse-transition"),s("slide-x-transition")),d=(s("slide-x-reverse-transition"),s("slide-y-transition"),s("slide-y-reverse-transition"),a("expand-transition",l()));a("expand-x-transition",l("",!0))},"297c":function(t,e,n){"use strict";var r=n("2b0e"),i=(n("6ece"),n("0789")),s=n("90a2"),a=n("a9ad"),o=n("fe6c"),l=n("a452"),c=n("7560"),u=n("80d2"),d=n("58df");const h=Object(d["a"])(a["a"],Object(o["b"])(["absolute","fixed","top","bottom"]),l["a"],c["a"]);var p=h.extend({name:"v-progress-linear",directives:{intersect:s["a"]},props:{active:{type:Boolean,default:!0},backgroundColor:{type:String,default:null},backgroundOpacity:{type:[Number,String],default:null},bufferValue:{type:[Number,String],default:100},color:{type:String,default:"primary"},height:{type:[Number,String],default:4},indeterminate:Boolean,query:Boolean,reverse:Boolean,rounded:Boolean,stream:Boolean,striped:Boolean,value:{type:[Number,String],default:0}},data(){return{internalLazyValue:this.value||0,isVisible:!0}},computed:{__cachedBackground(){return this.$createElement("div",this.setBackgroundColor(this.backgroundColor||this.color,{staticClass:"v-progress-linear__background",style:this.backgroundStyle}))},__cachedBar(){return this.$createElement(this.computedTransition,[this.__cachedBarType])},__cachedBarType(){return this.indeterminate?this.__cachedIndeterminate:this.__cachedDeterminate},__cachedBuffer(){return this.$createElement("div",{staticClass:"v-progress-linear__buffer",style:this.styles})},__cachedDeterminate(){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__determinate",style:{width:Object(u["h"])(this.normalizedValue,"%")}}))},__cachedIndeterminate(){return this.$createElement("div",{staticClass:"v-progress-linear__indeterminate",class:{"v-progress-linear__indeterminate--active":this.active}},[this.genProgressBar("long"),this.genProgressBar("short")])},__cachedStream(){return this.stream?this.$createElement("div",this.setTextColor(this.color,{staticClass:"v-progress-linear__stream",style:{width:Object(u["h"])(100-this.normalizedBuffer,"%")}})):null},backgroundStyle(){const t=null==this.backgroundOpacity?this.backgroundColor?1:.3:parseFloat(this.backgroundOpacity);return{opacity:t,[this.isReversed?"right":"left"]:Object(u["h"])(this.normalizedValue,"%"),width:Object(u["h"])(Math.max(0,this.normalizedBuffer-this.normalizedValue),"%")}},classes(){return{"v-progress-linear--absolute":this.absolute,"v-progress-linear--fixed":this.fixed,"v-progress-linear--query":this.query,"v-progress-linear--reactive":this.reactive,"v-progress-linear--reverse":this.isReversed,"v-progress-linear--rounded":this.rounded,"v-progress-linear--striped":this.striped,"v-progress-linear--visible":this.isVisible,...this.themeClasses}},computedTransition(){return this.indeterminate?i["b"]:i["c"]},isReversed(){return this.$vuetify.rtl!==this.reverse},normalizedBuffer(){return this.normalize(this.bufferValue)},normalizedValue(){return this.normalize(this.internalLazyValue)},reactive(){return Boolean(this.$listeners.change)},styles(){const t={};return this.active||(t.height=0),this.indeterminate||100===parseFloat(this.normalizedBuffer)||(t.width=Object(u["h"])(this.normalizedBuffer,"%")),t}},methods:{genContent(){const t=Object(u["o"])(this,"default",{value:this.internalLazyValue});return t?this.$createElement("div",{staticClass:"v-progress-linear__content"},t):null},genListeners(){const t=this.$listeners;return this.reactive&&(t.click=this.onClick),t},genProgressBar(t){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__indeterminate",class:{[t]:!0}}))},onClick(t){if(!this.reactive)return;const{width:e}=this.$el.getBoundingClientRect();this.internalValue=t.offsetX/e*100},onObserve(t,e,n){this.isVisible=n},normalize(t){return t<0?0:t>100?100:parseFloat(t)}},render(t){const e={staticClass:"v-progress-linear",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":this.normalizedBuffer,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:{bottom:this.bottom?0:void 0,height:this.active?Object(u["h"])(this.height):0,top:this.top?0:void 0},on:this.genListeners()};return t("div",e,[this.__cachedStream,this.__cachedBackground,this.__cachedBuffer,this.__cachedBar,this.genContent()])}}),f=p;e["a"]=r["a"].extend().extend({name:"loadable",props:{loading:{type:[Boolean,String],default:!1},loaderHeight:{type:[Number,String],default:2}},methods:{genProgress(){return!1===this.loading?null:this.$slots.progress||this.$createElement(f,{props:{absolute:!0,color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,height:this.loaderHeight,indeterminate:!0}})}}})},"37a9":function(t,e,n){},5331:function(t,e,n){"use strict";n("37a9")},"615b":function(t,e,n){},"6ece":function(t,e,n){},a452:function(t,e,n){"use strict";var r=n("2b0e");function i(t="value",e="change"){return r["a"].extend({name:"proxyable",model:{prop:t,event:e},props:{[t]:{required:!1}},data(){return{internalLazyValue:this[t]}},computed:{internalValue:{get(){return this.internalLazyValue},set(t){t!==this.internalLazyValue&&(this.internalLazyValue=t,this.$emit(e,t))}}},watch:{[t](t){this.internalLazyValue=t}}})}const s=i();e["a"]=s},ac7e:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-card",{staticClass:"olo-document",attrs:{elevation:"1",rounded:"lg"}},["view"==t.mode?n("olo-viewer",{attrs:{html:t.text}}):t._e(),"edit"==t.mode?n("olo-editor",{attrs:{theme:"idle_fingers",fontsize:"14"},model:{value:t.editorContent,callback:function(e){t.editorContent=e},expression:"editorContent"}}):t._e()],1)},i=[],s=n("2b0e");function a(t,e,n){t.$set(t.$data._asyncComputed[e],"state",n),t.$set(t.$data._asyncComputed[e],"updating","updating"===n),t.$set(t.$data._asyncComputed[e],"error","error"===n),t.$set(t.$data._asyncComputed[e],"success","success"===n)}function o(t){return"function"===typeof t?t:t.get}function l(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function c(t){return l(t,"lazy")&&t.lazy}function u(t,e){return t[d+e]}var d="async_computed$lazy_active$",h="async_computed$lazy_data$";function p(t,e,n){t[d+e]=!1,t[h+e]=n}function f(t){return{get:function(){return this[d+t]=!0,this[h+t]},set:function(e){this[h+t]=e}}}function y(t,e,n){t[h+e]=n}function m(t,e){return t[h+e]}var v=function(t){return function(){var e=this;return t.watch.forEach((function(t){var n=t.split(".");if(1===n.length)e[t];else try{var r=e;n.forEach((function(t){r=r[t]}))}catch(i){throw console.error("AsyncComputed: bad path: ",t),i}})),t.get.call(this)}},g=function(t){return function(){return t.watch.call(this),t.get.call(this)}};function b(t){if("function"===typeof t.watch)return g(t);if(Array.isArray(t.watch))return t.watch.forEach((function(t){if("string"!==typeof t)throw new Error("AsyncComputed: watch elemnts must be strings")})),v(t);throw Error("AsyncComputed: watch should be function or an array")}var _="function"===typeof Symbol?Symbol("did-not-update"):{},C=function(t,e){return function(){return t.shouldUpdate.call(this)?e.call(this):_}},w=function(t){return _===t},$="_async_computed$",x={install:function(t,e){e=e||{},t.config.optionMergeStrategies.asyncComputed=t.config.optionMergeStrategies.computed,t.mixin({data:function(){return{_asyncComputed:{}}},computed:{$asyncComputed:function(){return this.$data._asyncComputed}},beforeCreate:function(){var t=this.$options.asyncComputed||{};if(Object.keys(t).length){for(var n in t){var r=S(n,t[n]);this.$options.computed[$+n]=r}this.$options.data=k(this.$options,e)}},created:function(){for(var n in this.$options.asyncComputed||{}){var r=this.$options.asyncComputed[n],i=z.call(this,r,e);c(r)?y(this,n,i):this[n]=i}for(var s in this.$options.asyncComputed||{})B(this,s,e,t)}})}};function B(t,e,n,r){var i=0,s=function(s){var o=++i;w(s)||(s&&s.then||(s=Promise.resolve(s)),a(t,e,"updating"),s.then((function(n){o===i&&(a(t,e,"success"),t[e]=n)})).catch((function(s){if(o===i&&(a(t,e,"error"),r.set(t.$data._asyncComputed[e],"exception",s),!1!==n.errorHandler)){var l=void 0===n.errorHandler?console.error.bind(console,"Error evaluating async computed property:"):n.errorHandler;n.useRawError?l(s,t,s.stack):l(s.stack)}})))};r.set(t.$data._asyncComputed,e,{exception:null,update:function(){t._isDestroyed||s(o(t.$options.asyncComputed[e]).apply(t))}}),a(t,e,"updating"),t.$watch($+e,s,{immediate:!0})}function k(t,e){var n=t.data,r=t.asyncComputed||{};return function(t){var i=("function"===typeof n?n.call(this,t):n)||{};for(var s in r){var a=this.$options.asyncComputed[s],o=z.call(this,a,e);c(a)?(p(i,s,o),this.$options.computed[s]=f(s)):i[s]=o}return i}}function S(t,e){if("function"===typeof e)return e;var n=e.get;if(l(e,"watch")&&(n=b(e)),l(e,"shouldUpdate")&&(n=C(e,n)),c(e)){var r=n;n=function(){return u(this,t)?r.call(this):m(this,t)}}return n}function z(t,e){var n=null;return"default"in t?n=t.default:"default"in e&&(n=e.default),"function"===typeof n?n.call(this):n}"undefined"!==typeof window&&window.Vue&&window.Vue.use(x);var O=x;s["a"].use(O);var V={name:"olo-document",components:{"olo-viewer":()=>n.e("chunk-7000f2d7").then(n.bind(null,"9987")),"olo-editor":()=>n.e("chunk-dedf162c").then(n.bind(null,"1071"))},props:["store","path","mode","presets"],data:()=>({source:"",editorContent:""}),computed:{context(){return this.store?this.store.createContext(this.path,this.presets):{}},evaluate(){return this.store.parse(this.source)},text(){return this.doc.text},data(){return this.doc.data}},asyncComputed:{fileContent:{async get(){try{return this.store.read(this.path)}catch(t){return`<p><b>Failed to load ${this.path}</b></p>\n                            <code><pre>${t.message}</pre></code>`}},default:""},doc:{async get(){return this.evaluate(this.context)},default:{text:"",data:{}}}},watch:{fileContent(){this.source=this.fileContent},source(){this.editorContent=this.source},doc(){this.$emit("doc-rendered",this.doc.data)}},methods:{commit(){this.source=this.editorContent},async save(){this.commit(),await this.store.write(this.path,this.source)},async delete(){await this.store.delete(this.path),this.source=""}}},E=V,L=(n("5331"),n("2877")),j=n("6544"),P=n.n(j),A=n("b0af"),H=Object(L["a"])(E,r,i,!1,null,null,null);e["default"]=H.exports;P()(H,{VCard:A["a"]})},b0af:function(t,e,n){"use strict";n("615b");var r=n("10d2"),i=n("297c"),s=n("1c87"),a=n("58df");e["a"]=Object(a["a"])(i["a"],s["a"],r["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes(){return{"v-card":!0,...s["a"].options.computed.classes.call(this),"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised,...r["a"].options.computed.classes.call(this)}},styles(){const t={...r["a"].options.computed.styles.call(this)};return this.img&&(t.background=`url("${this.img}") center center / cover no-repeat`),t}},methods:{genProgress(){const t=i["a"].options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render(t){const{tag:e,data:n}=this.generateRouteLink();return n.style=this.styles,this.isClickable&&(n.attrs=n.attrs||{},n.attrs.tabindex=0),t(e,this.setBackgroundColor(this.color,n),[this.genProgress(),this.$slots.default])}})}}]);
//# sourceMappingURL=chunk-4c14e230.2cb94f39.js.map