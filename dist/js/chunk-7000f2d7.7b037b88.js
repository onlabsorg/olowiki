(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7000f2d7"],{"272d":function(e,t,n){},"3e6d":function(e,t,n){"use strict";n("272d")},"4b85":function(e,t,n){},9987:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",{staticClass:"olo-viewer",domProps:{innerHTML:e._s(e.saneHTML)}})},o=[],i=n("c0c4"),a=n.n(i),l={name:"olo-viewer",props:["html"],computed:{saneHTML:function(){return a.a.sanitize(this.html)}}},c=l,s=(n("3e6d"),n("2877")),u=n("6544"),d=n.n(u),f=(n("4de4"),n("b64b"),n("2ca0"),n("99af"),n("20f6"),n("4b85"),n("498a"),n("a15b"),n("2b0e"));function p(e){return f["a"].extend({name:"v-".concat(e),functional:!0,props:{id:String,tag:{type:String,default:"div"}},render:function(t,n){var r=n.props,o=n.data,i=n.children;o.staticClass="".concat(e," ").concat(o.staticClass||"").trim();var a=o.attrs;if(a){o.attrs={};var l=Object.keys(a).filter((function(e){if("slot"===e)return!1;var t=a[e];return e.startsWith("data-")?(o.attrs[e]=t,!1):t||"string"===typeof t}));l.length&&(o.staticClass+=" ".concat(l.join(" ")))}return r.id&&(o.domProps=o.domProps||{},o.domProps.id=r.id),t(r.tag,o,i)}})}var m=n("d9f7"),h=p("container").extend({name:"v-container",functional:!0,props:{id:String,tag:{type:String,default:"div"},fluid:{type:Boolean,default:!1}},render:function(e,t){var n,r=t.props,o=t.data,i=t.children,a=o.attrs;return a&&(o.attrs={},n=Object.keys(a).filter((function(e){if("slot"===e)return!1;var t=a[e];return e.startsWith("data-")?(o.attrs[e]=t,!1):t||"string"===typeof t}))),r.id&&(o.domProps=o.domProps||{},o.domProps.id=r.id),e(r.tag,Object(m["a"])(o,{staticClass:"container",class:Array({"container--fluid":r.fluid}).concat(n||[])}),i)}}),g=Object(s["a"])(c,r,o,!1,null,null,null);t["default"]=g.exports;d()(g,{VContainer:h})},c0c4:function(e,t,n){
/*! @license DOMPurify 2.3.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.3.3/LICENSE */
(function(t,n){e.exports=n()})(0,(function(){"use strict";function e(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var t=Object.hasOwnProperty,n=Object.setPrototypeOf,r=Object.isFrozen,o=Object.getPrototypeOf,i=Object.getOwnPropertyDescriptor,a=Object.freeze,l=Object.seal,c=Object.create,s="undefined"!==typeof Reflect&&Reflect,u=s.apply,d=s.construct;u||(u=function(e,t,n){return e.apply(t,n)}),a||(a=function(e){return e}),l||(l=function(e){return e}),d||(d=function(t,n){return new(Function.prototype.bind.apply(t,[null].concat(e(n))))});var f=w(Array.prototype.forEach),p=w(Array.prototype.pop),m=w(Array.prototype.push),h=w(String.prototype.toLowerCase),g=w(String.prototype.match),y=w(String.prototype.replace),v=w(String.prototype.indexOf),b=w(String.prototype.trim),T=w(RegExp.prototype.test),A=x(TypeError);function w(e){return function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return u(e,t,r)}}function x(e){return function(){for(var t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];return d(e,n)}}function S(e,t){n&&n(e,null);var o=t.length;while(o--){var i=t[o];if("string"===typeof i){var a=h(i);a!==i&&(r(t)||(t[o]=a),i=a)}e[i]=!0}return e}function E(e){var n=c(null),r=void 0;for(r in e)u(t,e,[r])&&(n[r]=e[r]);return n}function _(e,t){while(null!==e){var n=i(e,t);if(n){if(n.get)return w(n.get);if("function"===typeof n.value)return w(n.value)}e=o(e)}function r(e){return console.warn("fallback value for",e),null}return r}var k=a(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),O=a(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),R=a(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),N=a(["animate","color-profile","cursor","discard","fedropshadow","feimage","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),D=a(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),M=a(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),L=a(["#text"]),C=a(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),F=a(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),I=a(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),H=a(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),z=l(/\{\{[\s\S]*|[\s\S]*\}\}/gm),P=l(/<%[\s\S]*|[\s\S]*%>/gm),U=l(/^data-[\-\w.\u00B7-\uFFFF]/),j=l(/^aria-[\-\w]+$/),B=l(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),W=l(/^(?:\w+script|data):/i),G=l(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),q="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function V(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var Y=function(){return"undefined"===typeof window?null:window},K=function(e,t){if("object"!==("undefined"===typeof e?"undefined":q(e))||"function"!==typeof e.createPolicy)return null;var n=null,r="data-tt-policy-suffix";t.currentScript&&t.currentScript.hasAttribute(r)&&(n=t.currentScript.getAttribute(r));var o="dompurify"+(n?"#"+n:"");try{return e.createPolicy(o,{createHTML:function(e){return e}})}catch(i){return console.warn("TrustedTypes policy "+o+" could not be created."),null}};function $(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Y(),t=function(e){return $(e)};if(t.version="2.3.3",t.removed=[],!e||!e.document||9!==e.document.nodeType)return t.isSupported=!1,t;var n=e.document,r=e.document,o=e.DocumentFragment,i=e.HTMLTemplateElement,l=e.Node,c=e.Element,s=e.NodeFilter,u=e.NamedNodeMap,d=void 0===u?e.NamedNodeMap||e.MozNamedAttrMap:u,w=e.Text,x=e.Comment,J=e.DOMParser,X=e.trustedTypes,Z=c.prototype,Q=_(Z,"cloneNode"),ee=_(Z,"nextSibling"),te=_(Z,"childNodes"),ne=_(Z,"parentNode");if("function"===typeof i){var re=r.createElement("template");re.content&&re.content.ownerDocument&&(r=re.content.ownerDocument)}var oe=K(X,n),ie=oe&&He?oe.createHTML(""):"",ae=r,le=ae.implementation,ce=ae.createNodeIterator,se=ae.createDocumentFragment,ue=ae.getElementsByTagName,de=n.importNode,fe={};try{fe=E(r).documentMode?r.documentMode:{}}catch(wt){}var pe={};t.isSupported="function"===typeof ne&&le&&"undefined"!==typeof le.createHTMLDocument&&9!==fe;var me=z,he=P,ge=U,ye=j,ve=W,be=G,Te=B,Ae=null,we=S({},[].concat(V(k),V(O),V(R),V(D),V(L))),xe=null,Se=S({},[].concat(V(C),V(F),V(I),V(H))),Ee=null,_e=null,ke=!0,Oe=!0,Re=!1,Ne=!1,De=!1,Me=!1,Le=!1,Ce=!1,Fe=!1,Ie=!0,He=!1,ze=!0,Pe=!0,Ue=!1,je={},Be=null,We=S({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),Ge=null,qe=S({},["audio","video","img","source","image","track"]),Ve=null,Ye=S({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ke="http://www.w3.org/1998/Math/MathML",$e="http://www.w3.org/2000/svg",Je="http://www.w3.org/1999/xhtml",Xe=Je,Ze=!1,Qe=void 0,et=["application/xhtml+xml","text/html"],tt="text/html",nt=void 0,rt=null,ot=r.createElement("form"),it=function(e){rt&&rt===e||(e&&"object"===("undefined"===typeof e?"undefined":q(e))||(e={}),e=E(e),Ae="ALLOWED_TAGS"in e?S({},e.ALLOWED_TAGS):we,xe="ALLOWED_ATTR"in e?S({},e.ALLOWED_ATTR):Se,Ve="ADD_URI_SAFE_ATTR"in e?S(E(Ye),e.ADD_URI_SAFE_ATTR):Ye,Ge="ADD_DATA_URI_TAGS"in e?S(E(qe),e.ADD_DATA_URI_TAGS):qe,Be="FORBID_CONTENTS"in e?S({},e.FORBID_CONTENTS):We,Ee="FORBID_TAGS"in e?S({},e.FORBID_TAGS):{},_e="FORBID_ATTR"in e?S({},e.FORBID_ATTR):{},je="USE_PROFILES"in e&&e.USE_PROFILES,ke=!1!==e.ALLOW_ARIA_ATTR,Oe=!1!==e.ALLOW_DATA_ATTR,Re=e.ALLOW_UNKNOWN_PROTOCOLS||!1,Ne=e.SAFE_FOR_TEMPLATES||!1,De=e.WHOLE_DOCUMENT||!1,Ce=e.RETURN_DOM||!1,Fe=e.RETURN_DOM_FRAGMENT||!1,Ie=!1!==e.RETURN_DOM_IMPORT,He=e.RETURN_TRUSTED_TYPE||!1,Le=e.FORCE_BODY||!1,ze=!1!==e.SANITIZE_DOM,Pe=!1!==e.KEEP_CONTENT,Ue=e.IN_PLACE||!1,Te=e.ALLOWED_URI_REGEXP||Te,Xe=e.NAMESPACE||Je,Qe=Qe=-1===et.indexOf(e.PARSER_MEDIA_TYPE)?tt:e.PARSER_MEDIA_TYPE,nt="application/xhtml+xml"===Qe?function(e){return e}:h,Ne&&(Oe=!1),Fe&&(Ce=!0),je&&(Ae=S({},[].concat(V(L))),xe=[],!0===je.html&&(S(Ae,k),S(xe,C)),!0===je.svg&&(S(Ae,O),S(xe,F),S(xe,H)),!0===je.svgFilters&&(S(Ae,R),S(xe,F),S(xe,H)),!0===je.mathMl&&(S(Ae,D),S(xe,I),S(xe,H))),e.ADD_TAGS&&(Ae===we&&(Ae=E(Ae)),S(Ae,e.ADD_TAGS)),e.ADD_ATTR&&(xe===Se&&(xe=E(xe)),S(xe,e.ADD_ATTR)),e.ADD_URI_SAFE_ATTR&&S(Ve,e.ADD_URI_SAFE_ATTR),e.FORBID_CONTENTS&&(Be===We&&(Be=E(Be)),S(Be,e.FORBID_CONTENTS)),Pe&&(Ae["#text"]=!0),De&&S(Ae,["html","head","body"]),Ae.table&&(S(Ae,["tbody"]),delete Ee.tbody),a&&a(e),rt=e)},at=S({},["mi","mo","mn","ms","mtext"]),lt=S({},["foreignobject","desc","title","annotation-xml"]),ct=S({},O);S(ct,R),S(ct,N);var st=S({},D);S(st,M);var ut=function(e){var t=ne(e);t&&t.tagName||(t={namespaceURI:Je,tagName:"template"});var n=h(e.tagName),r=h(t.tagName);if(e.namespaceURI===$e)return t.namespaceURI===Je?"svg"===n:t.namespaceURI===Ke?"svg"===n&&("annotation-xml"===r||at[r]):Boolean(ct[n]);if(e.namespaceURI===Ke)return t.namespaceURI===Je?"math"===n:t.namespaceURI===$e?"math"===n&&lt[r]:Boolean(st[n]);if(e.namespaceURI===Je){if(t.namespaceURI===$e&&!lt[r])return!1;if(t.namespaceURI===Ke&&!at[r])return!1;var o=S({},["title","style","font","a","script"]);return!st[n]&&(o[n]||!ct[n])}return!1},dt=function(e){m(t.removed,{element:e});try{e.parentNode.removeChild(e)}catch(wt){try{e.outerHTML=ie}catch(wt){e.remove()}}},ft=function(e,n){try{m(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch(wt){m(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),"is"===e&&!xe[e])if(Ce||Fe)try{dt(n)}catch(wt){}else try{n.setAttribute(e,"")}catch(wt){}},pt=function(e){var t=void 0,n=void 0;if(Le)e="<remove></remove>"+e;else{var o=g(e,/^[\r\n\t ]+/);n=o&&o[0]}"application/xhtml+xml"===Qe&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var i=oe?oe.createHTML(e):e;if(Xe===Je)try{t=(new J).parseFromString(i,Qe)}catch(wt){}if(!t||!t.documentElement){t=le.createDocument(Xe,"template",null);try{t.documentElement.innerHTML=Ze?"":i}catch(wt){}}var a=t.body||t.documentElement;return e&&n&&a.insertBefore(r.createTextNode(n),a.childNodes[0]||null),Xe===Je?ue.call(t,De?"html":"body")[0]:De?t.documentElement:a},mt=function(e){return ce.call(e.ownerDocument||e,e,s.SHOW_ELEMENT|s.SHOW_COMMENT|s.SHOW_TEXT,null,!1)},ht=function(e){return!(e instanceof w||e instanceof x)&&!("string"===typeof e.nodeName&&"string"===typeof e.textContent&&"function"===typeof e.removeChild&&e.attributes instanceof d&&"function"===typeof e.removeAttribute&&"function"===typeof e.setAttribute&&"string"===typeof e.namespaceURI&&"function"===typeof e.insertBefore)},gt=function(e){return"object"===("undefined"===typeof l?"undefined":q(l))?e instanceof l:e&&"object"===("undefined"===typeof e?"undefined":q(e))&&"number"===typeof e.nodeType&&"string"===typeof e.nodeName},yt=function(e,n,r){pe[e]&&f(pe[e],(function(e){e.call(t,n,r,rt)}))},vt=function(e){var n=void 0;if(yt("beforeSanitizeElements",e,null),ht(e))return dt(e),!0;if(g(e.nodeName,/[\u0080-\uFFFF]/))return dt(e),!0;var r=nt(e.nodeName);if(yt("uponSanitizeElement",e,{tagName:r,allowedTags:Ae}),!gt(e.firstElementChild)&&(!gt(e.content)||!gt(e.content.firstElementChild))&&T(/<[/\w]/g,e.innerHTML)&&T(/<[/\w]/g,e.textContent))return dt(e),!0;if("select"===r&&T(/<template/i,e.innerHTML))return dt(e),!0;if(!Ae[r]||Ee[r]){if(Pe&&!Be[r]){var o=ne(e)||e.parentNode,i=te(e)||e.childNodes;if(i&&o)for(var a=i.length,l=a-1;l>=0;--l)o.insertBefore(Q(i[l],!0),ee(e))}return dt(e),!0}return e instanceof c&&!ut(e)?(dt(e),!0):"noscript"!==r&&"noembed"!==r||!T(/<\/no(script|embed)/i,e.innerHTML)?(Ne&&3===e.nodeType&&(n=e.textContent,n=y(n,me," "),n=y(n,he," "),e.textContent!==n&&(m(t.removed,{element:e.cloneNode()}),e.textContent=n)),yt("afterSanitizeElements",e,null),!1):(dt(e),!0)},bt=function(e,t,n){if(ze&&("id"===t||"name"===t)&&(n in r||n in ot))return!1;if(Oe&&!_e[t]&&T(ge,t));else if(ke&&T(ye,t));else{if(!xe[t]||_e[t])return!1;if(Ve[t]);else if(T(Te,y(n,be,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==v(n,"data:")||!Ge[e]){if(Re&&!T(ve,y(n,be,"")));else if(n)return!1}else;}return!0},Tt=function(e){var n=void 0,r=void 0,o=void 0,i=void 0;yt("beforeSanitizeAttributes",e,null);var a=e.attributes;if(a){var l={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:xe};i=a.length;while(i--){n=a[i];var c=n,s=c.name,u=c.namespaceURI;if(r=b(n.value),o=nt(s),l.attrName=o,l.attrValue=r,l.keepAttr=!0,l.forceKeepAttr=void 0,yt("uponSanitizeAttribute",e,l),r=l.attrValue,!l.forceKeepAttr&&(ft(s,e),l.keepAttr))if(T(/\/>/i,r))ft(s,e);else{Ne&&(r=y(r,me," "),r=y(r,he," "));var d=nt(e.nodeName);if(bt(d,o,r))try{u?e.setAttributeNS(u,s,r):e.setAttribute(s,r),p(t.removed)}catch(wt){}}}yt("afterSanitizeAttributes",e,null)}},At=function e(t){var n=void 0,r=mt(t);yt("beforeSanitizeShadowDOM",t,null);while(n=r.nextNode())yt("uponSanitizeShadowNode",n,null),vt(n)||(n.content instanceof o&&e(n.content),Tt(n));yt("afterSanitizeShadowDOM",t,null)};return t.sanitize=function(r,i){var a=void 0,c=void 0,s=void 0,u=void 0,d=void 0;if(Ze=!r,Ze&&(r="\x3c!--\x3e"),"string"!==typeof r&&!gt(r)){if("function"!==typeof r.toString)throw A("toString is not a function");if(r=r.toString(),"string"!==typeof r)throw A("dirty is not a string, aborting")}if(!t.isSupported){if("object"===q(e.toStaticHTML)||"function"===typeof e.toStaticHTML){if("string"===typeof r)return e.toStaticHTML(r);if(gt(r))return e.toStaticHTML(r.outerHTML)}return r}if(Me||it(i),t.removed=[],"string"===typeof r&&(Ue=!1),Ue);else if(r instanceof l)a=pt("\x3c!----\x3e"),c=a.ownerDocument.importNode(r,!0),1===c.nodeType&&"BODY"===c.nodeName||"HTML"===c.nodeName?a=c:a.appendChild(c);else{if(!Ce&&!Ne&&!De&&-1===r.indexOf("<"))return oe&&He?oe.createHTML(r):r;if(a=pt(r),!a)return Ce?null:ie}a&&Le&&dt(a.firstChild);var f=mt(Ue?r:a);while(s=f.nextNode())3===s.nodeType&&s===u||vt(s)||(s.content instanceof o&&At(s.content),Tt(s),u=s);if(u=null,Ue)return r;if(Ce){if(Fe){d=se.call(a.ownerDocument);while(a.firstChild)d.appendChild(a.firstChild)}else d=a;return Ie&&(d=de.call(n,d,!0)),d}var p=De?a.outerHTML:a.innerHTML;return Ne&&(p=y(p,me," "),p=y(p,he," ")),oe&&He?oe.createHTML(p):p},t.setConfig=function(e){it(e),Me=!0},t.clearConfig=function(){rt=null,Me=!1},t.isValidAttribute=function(e,t,n){rt||it({});var r=nt(e),o=nt(t);return bt(r,o,n)},t.addHook=function(e,t){"function"===typeof t&&(pe[e]=pe[e]||[],m(pe[e],t))},t.removeHook=function(e){pe[e]&&p(pe[e])},t.removeHooks=function(e){pe[e]&&(pe[e]=[])},t.removeAllHooks=function(){pe={}},t}var J=$();return J}))}}]);
//# sourceMappingURL=chunk-7000f2d7.7b037b88.js.map