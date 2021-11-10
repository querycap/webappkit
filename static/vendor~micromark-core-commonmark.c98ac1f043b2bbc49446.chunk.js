"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[765],{46604:(e,n,t)=>{t.d(n,{v:()=>o});var r=t(58408),i=t(1191),c=t(49734);const o={name:"attention",tokenize:function(e,n){const t=this.parser.constructs.attentionMarkers.null,r=this.previous,c=(0,i.r)(r);let o;return function(n){return e.enter("attentionSequence"),o=n,u(n)};function u(a){if(a===o)return e.consume(a),u;const s=e.exit("attentionSequence"),l=(0,i.r)(a),f=!l||2===l&&c||t.includes(a),d=!c||2===c&&l||t.includes(r);return s._open=Boolean(42===o?f:f&&(c||!d)),s._close=Boolean(42===o?d:d&&(l||!f)),n(a)}},resolveAll:function(e,n){let t,i,o,a,s,l,f,d,m=-1;for(;++m<e.length;)if("enter"===e[m][0]&&"attentionSequence"===e[m][1].type&&e[m][1]._close)for(t=m;t--;)if("exit"===e[t][0]&&"attentionSequence"===e[t][1].type&&e[t][1]._open&&n.sliceSerialize(e[t][1]).charCodeAt(0)===n.sliceSerialize(e[m][1]).charCodeAt(0)){if((e[t][1]._close||e[m][1]._open)&&(e[m][1].end.offset-e[m][1].start.offset)%3&&!((e[t][1].end.offset-e[t][1].start.offset+e[m][1].end.offset-e[m][1].start.offset)%3))continue;l=e[t][1].end.offset-e[t][1].start.offset>1&&e[m][1].end.offset-e[m][1].start.offset>1?2:1;const h=Object.assign({},e[t][1].end),p=Object.assign({},e[m][1].start);u(h,-l),u(p,l),a={type:l>1?"strongSequence":"emphasisSequence",start:h,end:Object.assign({},e[t][1].end)},s={type:l>1?"strongSequence":"emphasisSequence",start:Object.assign({},e[m][1].start),end:p},o={type:l>1?"strongText":"emphasisText",start:Object.assign({},e[t][1].end),end:Object.assign({},e[m][1].start)},i={type:l>1?"strong":"emphasis",start:Object.assign({},a.start),end:Object.assign({},s.end)},e[t][1].end=Object.assign({},a.start),e[m][1].start=Object.assign({},s.end),f=[],e[t][1].end.offset-e[t][1].start.offset&&(f=(0,r.V)(f,[["enter",e[t][1],n],["exit",e[t][1],n]])),f=(0,r.V)(f,[["enter",i,n],["enter",a,n],["exit",a,n],["enter",o,n]]),f=(0,r.V)(f,(0,c.C)(n.parser.constructs.insideSpan.null,e.slice(t+1,m),n)),f=(0,r.V)(f,[["exit",o,n],["enter",s,n],["exit",s,n],["exit",i,n]]),e[m][1].end.offset-e[m][1].start.offset?(d=2,f=(0,r.V)(f,[["enter",e[m][1],n],["exit",e[m][1],n]])):d=0,(0,r.d)(e,t-1,m-t+3,f),m=t+f.length-d-2;break}m=-1;for(;++m<e.length;)"attentionSequence"===e[m][1].type&&(e[m][1].type="data");return e}};function u(e,n){e.column+=n,e.offset+=n,e._bufferIndex+=n}},12159:(e,n,t)=>{t.d(n,{j:()=>i});var r=t(34426);const i={name:"autolink",tokenize:function(e,n,t){let i=1;return function(n){return e.enter("autolink"),e.enter("autolinkMarker"),e.consume(n),e.exit("autolinkMarker"),e.enter("autolinkProtocol"),c};function c(n){return(0,r.jv)(n)?(e.consume(n),o):(0,r.n9)(n)?s(n):t(n)}function o(e){return 43===e||45===e||46===e||(0,r.H$)(e)?u(e):s(e)}function u(n){return 58===n?(e.consume(n),a):(43===n||45===n||46===n||(0,r.H$)(n))&&i++<32?(e.consume(n),u):s(n)}function a(n){return 62===n?(e.exit("autolinkProtocol"),m(n)):null===n||32===n||60===n||(0,r.Av)(n)?t(n):(e.consume(n),a)}function s(n){return 64===n?(e.consume(n),i=0,l):(0,r.n9)(n)?(e.consume(n),s):t(n)}function l(e){return(0,r.H$)(e)?f(e):t(e)}function f(n){return 46===n?(e.consume(n),i=0,l):62===n?(e.exit("autolinkProtocol").type="autolinkEmail",m(n)):d(n)}function d(n){return(45===n||(0,r.H$)(n))&&i++<63?(e.consume(n),45===n?d:f):t(n)}function m(t){return e.enter("autolinkMarker"),e.consume(t),e.exit("autolinkMarker"),e.exit("autolink"),n}}}},29338:(e,n,t)=>{t.d(n,{w:()=>c});var r=t(38667),i=t(34426);const c={tokenize:function(e,n,t){return(0,r.f)(e,(function(e){return null===e||(0,i.Ch)(e)?n(e):t(e)}),"linePrefix")},partial:!0}},5717:(e,n,t)=>{t.d(n,{m:()=>c});var r=t(38667),i=t(34426);const c={name:"blockQuote",tokenize:function(e,n,t){const r=this;return function(n){if(62===n){const t=r.containerState;return t.open||(e.enter("blockQuote",{_container:!0}),t.open=!0),e.enter("blockQuotePrefix"),e.enter("blockQuoteMarker"),e.consume(n),e.exit("blockQuoteMarker"),c}return t(n)};function c(t){return(0,i.xz)(t)?(e.enter("blockQuotePrefixWhitespace"),e.consume(t),e.exit("blockQuotePrefixWhitespace"),e.exit("blockQuotePrefix"),n):(e.exit("blockQuotePrefix"),n(t))}},continuation:{tokenize:function(e,n,t){return(0,r.f)(e,e.attempt(c,n,t),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}},exit:function(e){e.exit("blockQuote")}}},46792:(e,n,t)=>{t.d(n,{L:()=>i});var r=t(34426);const i={name:"characterEscape",tokenize:function(e,n,t){return function(n){return e.enter("characterEscape"),e.enter("escapeMarker"),e.consume(n),e.exit("escapeMarker"),i};function i(i){return(0,r.sR)(i)?(e.enter("characterEscapeValue"),e.consume(i),e.exit("characterEscapeValue"),e.exit("characterEscape"),n):t(i)}}}},81114:(e,n,t)=>{t.d(n,{u:()=>c});var r=t(44935),i=t(34426);const c={name:"characterReference",tokenize:function(e,n,t){const c=this;let o,u,a=0;return function(n){return e.enter("characterReference"),e.enter("characterReferenceMarker"),e.consume(n),e.exit("characterReferenceMarker"),s};function s(n){return 35===n?(e.enter("characterReferenceMarkerNumeric"),e.consume(n),e.exit("characterReferenceMarkerNumeric"),l):(e.enter("characterReferenceValue"),o=31,u=i.H$,f(n))}function l(n){return 88===n||120===n?(e.enter("characterReferenceMarkerHexadecimal"),e.consume(n),e.exit("characterReferenceMarkerHexadecimal"),e.enter("characterReferenceValue"),o=6,u=i.AF,f):(e.enter("characterReferenceValue"),o=7,u=i.pY,f(n))}function f(s){let l;return 59===s&&a?(l=e.exit("characterReferenceValue"),u!==i.H$||(0,r.M)(c.sliceSerialize(l))?(e.enter("characterReferenceMarker"),e.consume(s),e.exit("characterReferenceMarker"),e.exit("characterReference"),n):t(s)):u(s)&&a++<o?(e.consume(s),f):t(s)}}}},81459:(e,n,t)=>{t.d(n,{_:()=>c});var r=t(38667),i=t(34426);const c={name:"codeFenced",tokenize:function(e,n,t){const c=this,o={tokenize:function(e,n,t){let c=0;return(0,r.f)(e,o,"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4);function o(n){return e.enter("codeFencedFence"),e.enter("codeFencedFenceSequence"),u(n)}function u(n){return n===l?(e.consume(n),c++,u):c<f?t(n):(e.exit("codeFencedFenceSequence"),(0,r.f)(e,a,"whitespace")(n))}function a(r){return null===r||(0,i.Ch)(r)?(e.exit("codeFencedFence"),n(r)):t(r)}},partial:!0},u={tokenize:function(e,n,t){const r=this;return i;function i(n){return e.enter("lineEnding"),e.consume(n),e.exit("lineEnding"),c}function c(e){return r.parser.lazy[r.now().line]?t(e):n(e)}},partial:!0},a=this.events[this.events.length-1],s=a&&"linePrefix"===a[1].type?a[2].sliceSerialize(a[1],!0).length:0;let l,f=0;return function(n){return e.enter("codeFenced"),e.enter("codeFencedFence"),e.enter("codeFencedFenceSequence"),l=n,d(n)};function d(n){return n===l?(e.consume(n),f++,d):(e.exit("codeFencedFenceSequence"),f<3?t(n):(0,r.f)(e,m,"whitespace")(n))}function m(n){return null===n||(0,i.Ch)(n)?k(n):(e.enter("codeFencedFenceInfo"),e.enter("chunkString",{contentType:"string"}),h(n))}function h(n){return null===n||(0,i.z3)(n)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),(0,r.f)(e,p,"whitespace")(n)):96===n&&n===l?t(n):(e.consume(n),h)}function p(n){return null===n||(0,i.Ch)(n)?k(n):(e.enter("codeFencedFenceMeta"),e.enter("chunkString",{contentType:"string"}),x(n))}function x(n){return null===n||(0,i.Ch)(n)?(e.exit("chunkString"),e.exit("codeFencedFenceMeta"),k(n)):96===n&&n===l?t(n):(e.consume(n),x)}function k(t){return e.exit("codeFencedFence"),c.interrupt?n(t):g(t)}function g(n){return null===n?S(n):(0,i.Ch)(n)?e.attempt(u,e.attempt(o,S,s?(0,r.f)(e,g,"linePrefix",s+1):g),S)(n):(e.enter("codeFlowValue"),v(n))}function v(n){return null===n||(0,i.Ch)(n)?(e.exit("codeFlowValue"),g(n)):(e.consume(n),v)}function S(t){return e.exit("codeFenced"),n(t)}},concrete:!0}},31037:(e,n,t)=>{t.d(n,{S:()=>c});var r=t(38667),i=t(34426);const c={name:"codeIndented",tokenize:function(e,n,t){const c=this;return function(n){return e.enter("codeIndented"),(0,r.f)(e,u,"linePrefix",5)(n)};function u(e){const n=c.events[c.events.length-1];return n&&"linePrefix"===n[1].type&&n[2].sliceSerialize(n[1],!0).length>=4?a(e):t(e)}function a(n){return null===n?l(n):(0,i.Ch)(n)?e.attempt(o,a,l)(n):(e.enter("codeFlowValue"),s(n))}function s(n){return null===n||(0,i.Ch)(n)?(e.exit("codeFlowValue"),a(n)):(e.consume(n),s)}function l(t){return e.exit("codeIndented"),n(t)}}},o={tokenize:function(e,n,t){const c=this;return o;function o(n){return c.parser.lazy[c.now().line]?t(n):(0,i.Ch)(n)?(e.enter("lineEnding"),e.consume(n),e.exit("lineEnding"),o):(0,r.f)(e,u,"linePrefix",5)(n)}function u(e){const r=c.events[c.events.length-1];return r&&"linePrefix"===r[1].type&&r[2].sliceSerialize(r[1],!0).length>=4?n(e):(0,i.Ch)(e)?o(e):t(e)}},partial:!0}},11727:(e,n,t)=>{t.d(n,{h:()=>i});var r=t(34426);const i={name:"codeText",tokenize:function(e,n,t){let i,c,o=0;return function(n){return e.enter("codeText"),e.enter("codeTextSequence"),u(n)};function u(n){return 96===n?(e.consume(n),o++,u):(e.exit("codeTextSequence"),a(n))}function a(n){return null===n?t(n):96===n?(c=e.enter("codeTextSequence"),i=0,l(n)):32===n?(e.enter("space"),e.consume(n),e.exit("space"),a):(0,r.Ch)(n)?(e.enter("lineEnding"),e.consume(n),e.exit("lineEnding"),a):(e.enter("codeTextData"),s(n))}function s(n){return null===n||32===n||96===n||(0,r.Ch)(n)?(e.exit("codeTextData"),a(n)):(e.consume(n),s)}function l(t){return 96===t?(e.consume(t),i++,l):i===o?(e.exit("codeTextSequence"),e.exit("codeText"),n(t)):(c.type="codeTextData",s(t))}},resolve:function(e){let n,t,r=e.length-4,i=3;if(!("lineEnding"!==e[i][1].type&&"space"!==e[i][1].type||"lineEnding"!==e[r][1].type&&"space"!==e[r][1].type))for(n=i;++n<r;)if("codeTextData"===e[n][1].type){e[i][1].type="codeTextPadding",e[r][1].type="codeTextPadding",i+=2,r-=2;break}n=i-1,r++;for(;++n<=r;)void 0===t?n!==r&&"lineEnding"!==e[n][1].type&&(t=n):n!==r&&"lineEnding"!==e[n][1].type||(e[t][1].type="codeTextData",n!==t+2&&(e[t][1].end=e[n-1][1].end,e.splice(t+2,n-t-2),r-=n-t-2,n=t+2),t=void 0);return e},previous:function(e){return 96!==e||"characterEscape"===this.events[this.events.length-1][1].type}}},26928:(e,n,t)=>{t.d(n,{k:()=>o});var r=t(38667),i=t(34426),c=t(72559);const o={tokenize:function(e,n){let t;return function(n){return e.enter("content"),t=e.enter("chunkContent",{contentType:"content"}),r(n)};function r(n){return null===n?c(n):(0,i.Ch)(n)?e.check(u,o,c)(n):(e.consume(n),r)}function c(t){return e.exit("chunkContent"),e.exit("content"),n(t)}function o(n){return e.consume(n),e.exit("chunkContent"),t.next=e.enter("chunkContent",{contentType:"content",previous:t}),t=t.next,r}},resolve:function(e){return(0,c._)(e),e}},u={tokenize:function(e,n,t){const c=this;return function(n){return e.exit("chunkContent"),e.enter("lineEnding"),e.consume(n),e.exit("lineEnding"),(0,r.f)(e,o,"linePrefix")};function o(r){if(null===r||(0,i.Ch)(r))return t(r);const o=c.events[c.events.length-1];return!c.parser.constructs.disable.null.includes("codeIndented")&&o&&"linePrefix"===o[1].type&&o[2].sliceSerialize(o[1],!0).length>=4?n(r):e.interrupt(c.parser.constructs.flow,t,n)(r)}},partial:!0}},59518:(e,n,t)=>{t.d(n,{D:()=>l});var r=t(16943),i=t(94106),c=t(38667),o=t(17770),u=t(28654),a=t(76064),s=t(34426);const l={name:"definition",tokenize:function(e,n,t){const o=this;let l;return function(n){return e.enter("definition"),i.f.call(o,e,d,t,"definitionLabel","definitionLabelMarker","definitionLabelString")(n)};function d(n){return l=(0,a.d)(o.sliceSerialize(o.events[o.events.length-1][1]).slice(1,-1)),58===n?(e.enter("definitionMarker"),e.consume(n),e.exit("definitionMarker"),(0,u.S)(e,(0,r.Z)(e,e.attempt(f,(0,c.f)(e,m,"whitespace"),(0,c.f)(e,m,"whitespace")),t,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString"))):t(n)}function m(r){return null===r||(0,s.Ch)(r)?(e.exit("definition"),o.parser.defined.includes(l)||o.parser.defined.push(l),n(r)):t(r)}}},f={tokenize:function(e,n,t){return function(n){return(0,s.z3)(n)?(0,u.S)(e,r)(n):t(n)};function r(n){return 34===n||39===n||40===n?(0,o.X)(e,(0,c.f)(e,i,"whitespace"),t,"definitionTitle","definitionTitleMarker","definitionTitleString")(n):t(n)}function i(e){return null===e||(0,s.Ch)(e)?n(e):t(e)}},partial:!0}},42847:(e,n,t)=>{t.d(n,{R:()=>i});var r=t(34426);const i={name:"hardBreakEscape",tokenize:function(e,n,t){return function(n){return e.enter("hardBreakEscape"),e.enter("escapeMarker"),e.consume(n),i};function i(i){return(0,r.Ch)(i)?(e.exit("escapeMarker"),e.exit("hardBreakEscape"),n(i)):t(i)}}}},12911:(e,n,t)=>{t.d(n,{Z:()=>o});var r=t(38667),i=t(34426),c=t(58408);const o={name:"headingAtx",tokenize:function(e,n,t){const c=this;let o=0;return function(n){return e.enter("atxHeading"),e.enter("atxHeadingSequence"),u(n)};function u(r){return 35===r&&o++<6?(e.consume(r),u):null===r||(0,i.z3)(r)?(e.exit("atxHeadingSequence"),c.interrupt?n(r):a(r)):t(r)}function a(t){return 35===t?(e.enter("atxHeadingSequence"),s(t)):null===t||(0,i.Ch)(t)?(e.exit("atxHeading"),n(t)):(0,i.xz)(t)?(0,r.f)(e,a,"whitespace")(t):(e.enter("atxHeadingText"),l(t))}function s(n){return 35===n?(e.consume(n),s):(e.exit("atxHeadingSequence"),a(n))}function l(n){return null===n||35===n||(0,i.z3)(n)?(e.exit("atxHeadingText"),a(n)):(e.consume(n),l)}},resolve:function(e,n){let t,r,i=e.length-2,o=3;"whitespace"===e[o][1].type&&(o+=2);i-2>o&&"whitespace"===e[i][1].type&&(i-=2);"atxHeadingSequence"===e[i][1].type&&(o===i-1||i-4>o&&"whitespace"===e[i-2][1].type)&&(i-=o+1===i?2:4);i>o&&(t={type:"atxHeadingText",start:e[o][1].start,end:e[i][1].end},r={type:"chunkText",start:e[o][1].start,end:e[i][1].end,contentType:"text"},(0,c.d)(e,o,i-o+1,[["enter",t,n],["enter",r,n],["exit",r,n],["exit",t,n]]));return e}}},44178:(e,n,t)=>{t.d(n,{P:()=>o});var r=t(34426),i=t(58033),c=t(29338);const o={name:"htmlFlow",tokenize:function(e,n,t){const c=this;let o,a,s,l,f;return function(n){return e.enter("htmlFlow"),e.enter("htmlFlowData"),e.consume(n),d};function d(i){return 33===i?(e.consume(i),m):47===i?(e.consume(i),x):63===i?(e.consume(i),o=3,c.interrupt?n:V):(0,r.jv)(i)?(e.consume(i),s=String.fromCharCode(i),a=!0,k):t(i)}function m(i){return 45===i?(e.consume(i),o=2,h):91===i?(e.consume(i),o=5,s="CDATA[",l=0,p):(0,r.jv)(i)?(e.consume(i),o=4,c.interrupt?n:V):t(i)}function h(r){return 45===r?(e.consume(r),c.interrupt?n:V):t(r)}function p(r){return r===s.charCodeAt(l++)?(e.consume(r),l===s.length?c.interrupt?n:I:p):t(r)}function x(n){return(0,r.jv)(n)?(e.consume(n),s=String.fromCharCode(n),k):t(n)}function k(u){return null===u||47===u||62===u||(0,r.z3)(u)?47!==u&&a&&i.L.includes(s.toLowerCase())?(o=1,c.interrupt?n(u):I(u)):i.G.includes(s.toLowerCase())?(o=6,47===u?(e.consume(u),g):c.interrupt?n(u):I(u)):(o=7,c.interrupt&&!c.parser.lazy[c.now().line]?t(u):a?S(u):v(u)):45===u||(0,r.H$)(u)?(e.consume(u),s+=String.fromCharCode(u),k):t(u)}function g(r){return 62===r?(e.consume(r),c.interrupt?n:I):t(r)}function v(n){return(0,r.xz)(n)?(e.consume(n),v):T(n)}function S(n){return 47===n?(e.consume(n),T):58===n||95===n||(0,r.jv)(n)?(e.consume(n),z):(0,r.xz)(n)?(e.consume(n),S):T(n)}function z(n){return 45===n||46===n||58===n||95===n||(0,r.H$)(n)?(e.consume(n),z):b(n)}function b(n){return 61===n?(e.consume(n),y):(0,r.xz)(n)?(e.consume(n),b):S(n)}function y(n){return null===n||60===n||61===n||62===n||96===n?t(n):34===n||39===n?(e.consume(n),f=n,C):(0,r.xz)(n)?(e.consume(n),y):(f=null,M(n))}function C(n){return null===n||(0,r.Ch)(n)?t(n):n===f?(e.consume(n),F):(e.consume(n),C)}function M(n){return null===n||34===n||39===n||60===n||61===n||62===n||96===n||(0,r.z3)(n)?b(n):(e.consume(n),M)}function F(e){return 47===e||62===e||(0,r.xz)(e)?S(e):t(e)}function T(n){return 62===n?(e.consume(n),w):t(n)}function w(n){return(0,r.xz)(n)?(e.consume(n),w):null===n||(0,r.Ch)(n)?I(n):t(n)}function I(n){return 45===n&&2===o?(e.consume(n),j):60===n&&1===o?(e.consume(n),H):62===n&&4===o?(e.consume(n),B):63===n&&3===o?(e.consume(n),V):93===n&&5===o?(e.consume(n),q):!(0,r.Ch)(n)||6!==o&&7!==o?null===n||(0,r.Ch)(n)?E(n):(e.consume(n),I):e.check(u,B,E)(n)}function E(n){return e.exit("htmlFlowData"),L(n)}function L(n){return null===n?_(n):(0,r.Ch)(n)?e.attempt({tokenize:P,partial:!0},L,_)(n):(e.enter("htmlFlowData"),I(n))}function P(e,n,t){return function(n){return e.enter("lineEnding"),e.consume(n),e.exit("lineEnding"),r};function r(e){return c.parser.lazy[c.now().line]?t(e):n(e)}}function j(n){return 45===n?(e.consume(n),V):I(n)}function H(n){return 47===n?(e.consume(n),s="",D):I(n)}function D(n){return 62===n&&i.L.includes(s.toLowerCase())?(e.consume(n),B):(0,r.jv)(n)&&s.length<8?(e.consume(n),s+=String.fromCharCode(n),D):I(n)}function q(n){return 93===n?(e.consume(n),V):I(n)}function V(n){return 62===n?(e.consume(n),B):45===n&&2===o?(e.consume(n),V):I(n)}function B(n){return null===n||(0,r.Ch)(n)?(e.exit("htmlFlowData"),_(n)):(e.consume(n),B)}function _(t){return e.exit("htmlFlow"),n(t)}},resolveTo:function(e){let n=e.length;for(;n--&&("enter"!==e[n][0]||"htmlFlow"!==e[n][1].type););n>1&&"linePrefix"===e[n-2][1].type&&(e[n][1].start=e[n-2][1].start,e[n+1][1].start=e[n-2][1].start,e.splice(n-2,2));return e},concrete:!0},u={tokenize:function(e,n,t){return function(r){return e.exit("htmlFlowData"),e.enter("lineEndingBlank"),e.consume(r),e.exit("lineEndingBlank"),e.attempt(c.w,n,t)}},partial:!0}},33998:(e,n,t)=>{t.d(n,{L:()=>c});var r=t(38667),i=t(34426);const c={name:"htmlText",tokenize:function(e,n,t){const c=this;let o,u,a,s;return function(n){return e.enter("htmlText"),e.enter("htmlTextData"),e.consume(n),l};function l(n){return 33===n?(e.consume(n),f):47===n?(e.consume(n),C):63===n?(e.consume(n),b):(0,i.jv)(n)?(e.consume(n),T):t(n)}function f(n){return 45===n?(e.consume(n),d):91===n?(e.consume(n),u="CDATA[",a=0,k):(0,i.jv)(n)?(e.consume(n),z):t(n)}function d(n){return 45===n?(e.consume(n),m):t(n)}function m(n){return null===n||62===n?t(n):45===n?(e.consume(n),h):p(n)}function h(e){return null===e||62===e?t(e):p(e)}function p(n){return null===n?t(n):45===n?(e.consume(n),x):(0,i.Ch)(n)?(s=p,D(n)):(e.consume(n),p)}function x(n){return 45===n?(e.consume(n),V):p(n)}function k(n){return n===u.charCodeAt(a++)?(e.consume(n),a===u.length?g:k):t(n)}function g(n){return null===n?t(n):93===n?(e.consume(n),v):(0,i.Ch)(n)?(s=g,D(n)):(e.consume(n),g)}function v(n){return 93===n?(e.consume(n),S):g(n)}function S(n){return 62===n?V(n):93===n?(e.consume(n),S):g(n)}function z(n){return null===n||62===n?V(n):(0,i.Ch)(n)?(s=z,D(n)):(e.consume(n),z)}function b(n){return null===n?t(n):63===n?(e.consume(n),y):(0,i.Ch)(n)?(s=b,D(n)):(e.consume(n),b)}function y(e){return 62===e?V(e):b(e)}function C(n){return(0,i.jv)(n)?(e.consume(n),M):t(n)}function M(n){return 45===n||(0,i.H$)(n)?(e.consume(n),M):F(n)}function F(n){return(0,i.Ch)(n)?(s=F,D(n)):(0,i.xz)(n)?(e.consume(n),F):V(n)}function T(n){return 45===n||(0,i.H$)(n)?(e.consume(n),T):47===n||62===n||(0,i.z3)(n)?w(n):t(n)}function w(n){return 47===n?(e.consume(n),V):58===n||95===n||(0,i.jv)(n)?(e.consume(n),I):(0,i.Ch)(n)?(s=w,D(n)):(0,i.xz)(n)?(e.consume(n),w):V(n)}function I(n){return 45===n||46===n||58===n||95===n||(0,i.H$)(n)?(e.consume(n),I):E(n)}function E(n){return 61===n?(e.consume(n),L):(0,i.Ch)(n)?(s=E,D(n)):(0,i.xz)(n)?(e.consume(n),E):w(n)}function L(n){return null===n||60===n||61===n||62===n||96===n?t(n):34===n||39===n?(e.consume(n),o=n,P):(0,i.Ch)(n)?(s=L,D(n)):(0,i.xz)(n)?(e.consume(n),L):(e.consume(n),o=void 0,H)}function P(n){return n===o?(e.consume(n),j):null===n?t(n):(0,i.Ch)(n)?(s=P,D(n)):(e.consume(n),P)}function j(e){return 62===e||47===e||(0,i.z3)(e)?w(e):t(e)}function H(n){return null===n||34===n||39===n||60===n||61===n||96===n?t(n):62===n||(0,i.z3)(n)?w(n):(e.consume(n),H)}function D(n){return e.exit("htmlTextData"),e.enter("lineEnding"),e.consume(n),e.exit("lineEnding"),(0,r.f)(e,q,"linePrefix",c.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function q(n){return e.enter("htmlTextData"),s(n)}function V(r){return 62===r?(e.consume(r),e.exit("htmlTextData"),e.exit("htmlText"),n):t(r)}}}},76854:(e,n,t)=>{t.d(n,{Z:()=>f});var r=t(16943),i=t(94106),c=t(17770),o=t(28654),u=t(34426),a=t(58408),s=t(76064),l=t(49734);const f={name:"labelEnd",tokenize:function(e,n,t){const r=this;let i,c,o=r.events.length;for(;o--;)if(("labelImage"===r.events[o][1].type||"labelLink"===r.events[o][1].type)&&!r.events[o][1]._balanced){i=r.events[o][1];break}return function(n){if(!i)return t(n);return i._inactive?a(n):(c=r.parser.defined.includes((0,s.d)(r.sliceSerialize({start:i.end,end:r.now()}))),e.enter("labelEnd"),e.enter("labelMarker"),e.consume(n),e.exit("labelMarker"),e.exit("labelEnd"),u)};function u(t){return 40===t?e.attempt(d,n,c?n:a)(t):91===t?e.attempt(m,n,c?e.attempt(h,n,a):a)(t):c?n(t):a(t)}function a(e){return i._balanced=!0,t(e)}},resolveTo:function(e,n){let t,r,i,c,o=e.length,u=0;for(;o--;)if(t=e[o][1],r){if("link"===t.type||"labelLink"===t.type&&t._inactive)break;"enter"===e[o][0]&&"labelLink"===t.type&&(t._inactive=!0)}else if(i){if("enter"===e[o][0]&&("labelImage"===t.type||"labelLink"===t.type)&&!t._balanced&&(r=o,"labelLink"!==t.type)){u=2;break}}else"labelEnd"===t.type&&(i=o);const s={type:"labelLink"===e[r][1].type?"link":"image",start:Object.assign({},e[r][1].start),end:Object.assign({},e[e.length-1][1].end)},f={type:"label",start:Object.assign({},e[r][1].start),end:Object.assign({},e[i][1].end)},d={type:"labelText",start:Object.assign({},e[r+u+2][1].end),end:Object.assign({},e[i-2][1].start)};return c=[["enter",s,n],["enter",f,n]],c=(0,a.V)(c,e.slice(r+1,r+u+3)),c=(0,a.V)(c,[["enter",d,n]]),c=(0,a.V)(c,(0,l.C)(n.parser.constructs.insideSpan.null,e.slice(r+u+4,i-3),n)),c=(0,a.V)(c,[["exit",d,n],e[i-2],e[i-1],["exit",f,n]]),c=(0,a.V)(c,e.slice(i+1)),c=(0,a.V)(c,[["exit",s,n]]),(0,a.d)(e,r,e.length,c),e},resolveAll:function(e){let n,t=-1;for(;++t<e.length;)n=e[t][1],"labelImage"!==n.type&&"labelLink"!==n.type&&"labelEnd"!==n.type||(e.splice(t+1,"labelImage"===n.type?4:2),n.type="data",t++);return e}},d={tokenize:function(e,n,t){return function(n){return e.enter("resource"),e.enter("resourceMarker"),e.consume(n),e.exit("resourceMarker"),(0,o.S)(e,i)};function i(n){return 41===n?l(n):(0,r.Z)(e,a,t,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",3)(n)}function a(n){return(0,u.z3)(n)?(0,o.S)(e,s)(n):l(n)}function s(n){return 34===n||39===n||40===n?(0,c.X)(e,(0,o.S)(e,l),t,"resourceTitle","resourceTitleMarker","resourceTitleString")(n):l(n)}function l(r){return 41===r?(e.enter("resourceMarker"),e.consume(r),e.exit("resourceMarker"),e.exit("resource"),n):t(r)}}},m={tokenize:function(e,n,t){const r=this;return function(n){return i.f.call(r,e,c,t,"reference","referenceMarker","referenceString")(n)};function c(e){return r.parser.defined.includes((0,s.d)(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?n(e):t(e)}}},h={tokenize:function(e,n,t){return function(n){return e.enter("reference"),e.enter("referenceMarker"),e.consume(n),e.exit("referenceMarker"),r};function r(r){return 93===r?(e.enter("referenceMarker"),e.consume(r),e.exit("referenceMarker"),e.exit("reference"),n):t(r)}}}},73355:(e,n,t)=>{t.d(n,{C:()=>r});const r={name:"labelStartImage",tokenize:function(e,n,t){const r=this;return function(n){return e.enter("labelImage"),e.enter("labelImageMarker"),e.consume(n),e.exit("labelImageMarker"),i};function i(n){return 91===n?(e.enter("labelMarker"),e.consume(n),e.exit("labelMarker"),e.exit("labelImage"),c):t(n)}function c(e){return 94===e&&"_hiddenFootnoteSupport"in r.parser.constructs?t(e):n(e)}},resolveAll:t(76854).Z.resolveAll}},43412:(e,n,t)=>{t.d(n,{F:()=>r});const r={name:"labelStartLink",tokenize:function(e,n,t){const r=this;return function(n){return e.enter("labelLink"),e.enter("labelMarker"),e.consume(n),e.exit("labelMarker"),e.exit("labelLink"),i};function i(e){return 94===e&&"_hiddenFootnoteSupport"in r.parser.constructs?t(e):n(e)}},resolveAll:t(76854).Z.resolveAll}},24007:(e,n,t)=>{t.d(n,{g:()=>i});var r=t(38667);const i={name:"lineEnding",tokenize:function(e,n){return function(t){return e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),(0,r.f)(e,n,"linePrefix")}}}},34778:(e,n,t)=>{t.d(n,{p:()=>u});var r=t(38667),i=t(34426),c=t(29338),o=t(75176);const u={name:"list",tokenize:function(e,n,t){const r=this,u=r.events[r.events.length-1];let s=u&&"linePrefix"===u[1].type?u[2].sliceSerialize(u[1],!0).length:0,l=0;return function(n){const c=r.containerState.type||(42===n||43===n||45===n?"listUnordered":"listOrdered");if("listUnordered"===c?!r.containerState.marker||n===r.containerState.marker:(0,i.pY)(n)){if(r.containerState.type||(r.containerState.type=c,e.enter(c,{_container:!0})),"listUnordered"===c)return e.enter("listItemPrefix"),42===n||45===n?e.check(o.C,t,d)(n):d(n);if(!r.interrupt||49===n)return e.enter("listItemPrefix"),e.enter("listItemValue"),f(n)}return t(n)};function f(n){return(0,i.pY)(n)&&++l<10?(e.consume(n),f):(!r.interrupt||l<2)&&(r.containerState.marker?n===r.containerState.marker:41===n||46===n)?(e.exit("listItemValue"),d(n)):t(n)}function d(n){return e.enter("listItemMarker"),e.consume(n),e.exit("listItemMarker"),r.containerState.marker=r.containerState.marker||n,e.check(c.w,r.interrupt?t:m,e.attempt(a,p,h))}function m(e){return r.containerState.initialBlankLine=!0,s++,p(e)}function h(n){return(0,i.xz)(n)?(e.enter("listItemPrefixWhitespace"),e.consume(n),e.exit("listItemPrefixWhitespace"),p):t(n)}function p(t){return r.containerState.size=s+r.sliceSerialize(e.exit("listItemPrefix"),!0).length,n(t)}},continuation:{tokenize:function(e,n,t){const o=this;return o.containerState._closeFlow=void 0,e.check(c.w,(function(t){return o.containerState.furtherBlankLines=o.containerState.furtherBlankLines||o.containerState.initialBlankLine,(0,r.f)(e,n,"listItemIndent",o.containerState.size+1)(t)}),(function(t){if(o.containerState.furtherBlankLines||!(0,i.xz)(t))return o.containerState.furtherBlankLines=void 0,o.containerState.initialBlankLine=void 0,a(t);return o.containerState.furtherBlankLines=void 0,o.containerState.initialBlankLine=void 0,e.attempt(s,n,a)(t)}));function a(i){return o.containerState._closeFlow=!0,o.interrupt=void 0,(0,r.f)(e,e.attempt(u,n,t),"linePrefix",o.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(i)}}},exit:function(e){e.exit(this.containerState.type)}},a={tokenize:function(e,n,t){const c=this;return(0,r.f)(e,(function(e){const r=c.events[c.events.length-1];return!(0,i.xz)(e)&&r&&"listItemPrefixWhitespace"===r[1].type?n(e):t(e)}),"listItemPrefixWhitespace",c.parser.constructs.disable.null.includes("codeIndented")?void 0:5)},partial:!0},s={tokenize:function(e,n,t){const i=this;return(0,r.f)(e,(function(e){const r=i.events[i.events.length-1];return r&&"listItemIndent"===r[1].type&&r[2].sliceSerialize(r[1],!0).length===i.containerState.size?n(e):t(e)}),"listItemIndent",i.containerState.size+1)},partial:!0}},5072:(e,n,t)=>{t.d(n,{C:()=>c});var r=t(38667),i=t(34426);const c={name:"setextUnderline",tokenize:function(e,n,t){const c=this;let o,u,a=c.events.length;for(;a--;)if("lineEnding"!==c.events[a][1].type&&"linePrefix"!==c.events[a][1].type&&"content"!==c.events[a][1].type){u="paragraph"===c.events[a][1].type;break}return function(n){if(!c.parser.lazy[c.now().line]&&(c.interrupt||u))return e.enter("setextHeadingLine"),e.enter("setextHeadingLineSequence"),o=n,s(n);return t(n)};function s(n){return n===o?(e.consume(n),s):(e.exit("setextHeadingLineSequence"),(0,r.f)(e,l,"lineSuffix")(n))}function l(r){return null===r||(0,i.Ch)(r)?(e.exit("setextHeadingLine"),n(r)):t(r)}},resolveTo:function(e,n){let t,r,i,c=e.length;for(;c--;)if("enter"===e[c][0]){if("content"===e[c][1].type){t=c;break}"paragraph"===e[c][1].type&&(r=c)}else"content"===e[c][1].type&&e.splice(c,1),i||"definition"!==e[c][1].type||(i=c);const o={type:"setextHeading",start:Object.assign({},e[r][1].start),end:Object.assign({},e[e.length-1][1].end)};e[r][1].type="setextHeadingText",i?(e.splice(r,0,["enter",o,n]),e.splice(i+1,0,["exit",e[t][1],n]),e[t][1].end=Object.assign({},e[i][1].end)):e[t][1]=o;return e.push(["exit",o,n]),e}}},75176:(e,n,t)=>{t.d(n,{C:()=>c});var r=t(38667),i=t(34426);const c={name:"thematicBreak",tokenize:function(e,n,t){let c,o=0;return function(n){return e.enter("thematicBreak"),c=n,u(n)};function u(s){return s===c?(e.enter("thematicBreakSequence"),a(s)):(0,i.xz)(s)?(0,r.f)(e,u,"whitespace")(s):o<3||null!==s&&!(0,i.Ch)(s)?t(s):(e.exit("thematicBreak"),n(s))}function a(n){return n===c?(e.consume(n),o++,a):(e.exit("thematicBreakSequence"),u(n))}}}}}]);