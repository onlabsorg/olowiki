(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1172ef8e"],{6538:function(t,e,n){"use strict";n("d543")},c2a6:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"olo-omnibar",class:{focused:t.focus}},[n("input",{ref:"input",attrs:{type:"text"}})])},u=[],i={name:"olo-omnibar",props:["value"],data:()=>({focus:!1}),computed:{},watch:{value(){this.updateInput()}},methods:{updateInput(){this.$refs.input.value!==this.value&&(this.$refs.input.value=this.value)},handleInputChange(){this.$emit("input",this.$refs.input.value),this.$refs.input.blur()},handleInputFocus(){this.focus=!0},handleInputBlur(){this.focus=!1}},mounted(){this.$refs.input.addEventListener("change",this.handleInputChange.bind(this)),this.$refs.input.addEventListener("focus",this.handleInputFocus.bind(this)),this.$refs.input.addEventListener("blur",this.handleInputBlur.bind(this)),this.updateInput()}},a=i,h=(n("6538"),n("2877")),p=Object(h["a"])(a,s,u,!1,null,null,null);e["default"]=p.exports},d543:function(t,e,n){}}]);
//# sourceMappingURL=chunk-1172ef8e.790ce026.js.map