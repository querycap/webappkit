"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[261],{9942:(e,n,t)=>{t.d(n,{Q:()=>X});var r={};t.r(r),t.d(r,{attentionMarkers:()=>N,contentInitial:()=>W,disable:()=>U,document:()=>V,flow:()=>G,flowInitial:()=>q,insideSpan:()=>K,string:()=>H,text:()=>J});var i=t(32933),o=t(69443),u=t(35009);const s={tokenize:function(e){const n=e.attempt(this.parser.constructs.contentInitial,(function(t){if(null===t)return void e.consume(t);return e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),(0,o.f)(e,n,"linePrefix")}),(function(n){return e.enter("paragraph"),r(n)}));let t;return n;function r(n){const r=e.enter("chunkText",{contentType:"text",previous:t});return t&&(t.next=r),t=r,i(n)}function i(n){return null===n?(e.exit("chunkText"),e.exit("paragraph"),void e.consume(n)):(0,u.Ch)(n)?(e.consume(n),e.exit("chunkText"),r):(e.consume(n),i)}}};var c=t(37161);const l={tokenize:function(e){const n=this,t=[];let r,i,o,s=0;return l;function l(r){if(s<t.length){const i=t[s];return n.containerState=i[1],e.attempt(i[0].continuation,a,d)(r)}return d(r)}function a(e){if(s++,n.containerState._closeFlow){n.containerState._closeFlow=void 0,r&&_();const t=n.events.length;let i,o=t;for(;o--;)if("exit"===n.events[o][0]&&"chunkFlow"===n.events[o][1].type){i=n.events[o][1].end;break}b(s);let u=t;for(;u<n.events.length;)n.events[u][1].end=Object.assign({},i),u++;return(0,c.d)(n.events,o+1,0,n.events.slice(t)),n.events.length=u,d(e)}return l(e)}function d(i){if(s===t.length){if(!r)return v(i);if(r.currentConstruct&&r.currentConstruct.concrete)return x(i);n.interrupt=Boolean(r.currentConstruct)}return n.containerState={},e.check(f,p,h)(i)}function p(e){return r&&_(),b(s),v(e)}function h(e){return n.parser.lazy[n.now().line]=s!==t.length,o=n.now().offset,x(e)}function v(t){return n.containerState={},e.attempt(f,g,x)(t)}function g(e){return s++,t.push([n.currentConstruct,n.containerState]),v(e)}function x(t){return null===t?(r&&_(),b(0),void e.consume(t)):(r=r||n.parser.flow(n.now()),e.enter("chunkFlow",{contentType:"flow",previous:i,_tokenizer:r}),m(t))}function m(t){return null===t?(k(e.exit("chunkFlow"),!0),b(0),void e.consume(t)):(0,u.Ch)(t)?(e.consume(t),k(e.exit("chunkFlow")),s=0,n.interrupt=void 0,l):(e.consume(t),m)}function k(e,t){const u=n.sliceStream(e);if(t&&u.push(null),e.previous=i,i&&(i.next=e),i=e,r.defineSkip(e.start),r.write(u),n.parser.lazy[e.start.line]){let e=r.events.length;for(;e--;)if(r.events[e][1].start.offset<o&&(!r.events[e][1].end||r.events[e][1].end.offset>o))return;const t=n.events.length;let i,u,l=t;for(;l--;)if("exit"===n.events[l][0]&&"chunkFlow"===n.events[l][1].type){if(i){u=n.events[l][1].end;break}i=!0}for(b(s),e=t;e<n.events.length;)n.events[e][1].end=Object.assign({},u),e++;(0,c.d)(n.events,l+1,0,n.events.slice(t)),n.events.length=e}}function b(r){let i=t.length;for(;i-- >r;){const r=t[i];n.containerState=r[1],r[0].exit.call(n,e)}t.length=r}function _(){r.write([null]),i=void 0,r=void 0,n.containerState._closeFlow=void 0}}},f={tokenize:function(e,n,t){return(0,o.f)(e,e.attempt(this.parser.constructs.document,n,t),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}};var a=t(27813),d=t(46791);const p={tokenize:function(e){const n=this,t=e.attempt(a.w,(function(r){if(null===r)return void e.consume(r);return e.enter("lineEndingBlank"),e.consume(r),e.exit("lineEndingBlank"),n.currentConstruct=void 0,t}),e.attempt(this.parser.constructs.flowInitial,r,(0,o.f)(e,e.attempt(this.parser.constructs.flow,r,e.attempt(d.k,r)),"linePrefix")));return t;function r(r){if(null!==r)return e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),n.currentConstruct=void 0,t;e.consume(r)}}};const h={resolveAll:m()},v=x("string"),g=x("text");function x(e){return{tokenize:function(n){const t=this,r=this.parser.constructs[e],i=n.attempt(r,o,u);return o;function o(e){return c(e)?i(e):u(e)}function u(e){if(null!==e)return n.enter("data"),n.consume(e),s;n.consume(e)}function s(e){return c(e)?(n.exit("data"),i(e)):(n.consume(e),s)}function c(e){if(null===e)return!0;const n=r[e];let i=-1;if(n)for(;++i<n.length;){const e=n[i];if(!e.previous||e.previous.call(t,t.previous))return!0}return!1}},resolveAll:m("text"===e?k:void 0)}}function m(e){return function(n,t){let r,i=-1;for(;++i<=n.length;)void 0===r?n[i]&&"data"===n[i][1].type&&(r=i,i++):n[i]&&"data"===n[i][1].type||(i!==r+2&&(n[r][1].end=n[i-1][1].end,n.splice(r+2,i-r-2),i=r+2),r=void 0);return e?e(n,t):n}}function k(e,n){let t=-1;for(;++t<=e.length;)if((t===e.length||"lineEnding"===e[t][1].type)&&"data"===e[t-1][1].type){const r=e[t-1][1],i=n.sliceStream(r);let o,u=i.length,s=-1,c=0;for(;u--;){const e=i[u];if("string"==typeof e){for(s=e.length;32===e.charCodeAt(s-1);)c++,s--;if(s)break;s=-1}else if(-2===e)o=!0,c++;else if(-1!==e){u++;break}}if(c){const i={type:t===e.length||o||c<2?"lineSuffix":"hardBreakTrailing",start:{line:r.end.line,column:r.end.column-c,offset:r.end.offset-c,_index:r.start._index+u,_bufferIndex:u?s:r.start._bufferIndex+s},end:Object.assign({},r.end)};r.end=Object.assign({},i.start),r.start.offset===r.end.offset?Object.assign(r,i):(e.splice(t,0,["enter",i,n],["exit",i,n]),t+=2)}t++}return e}var b=t(50552);function _(e,n,t){let r=Object.assign(t?Object.assign({},t):{line:1,column:1,offset:0},{_index:0,_bufferIndex:-1});const i={},o=[];let s=[],l=[],f=!0;const a={consume:function(e){(0,u.Ch)(e)?(r.line++,r.column=1,r.offset+=-3===e?2:1,C()):-1!==e&&(r.column++,r.offset++);r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===s[r._index].length&&(r._bufferIndex=-1,r._index++));d.previous=e,f=!0},enter:function(e,n){const t=n||{};return t.type=e,t.start=g(),d.events.push(["enter",t,d]),l.push(t),t},exit:function(e){const n=l.pop();return n.end=g(),d.events.push(["exit",n,d]),n},attempt:_((function(e,n){w(e,n.from)})),check:_(k),interrupt:_(k,{interrupt:!0})},d={previous:null,code:null,containerState:{},events:[],parser:e,sliceStream:v,sliceSerialize:function(e,n){return function(e,n){let t=-1;const r=[];let i;for(;++t<e.length;){const o=e[t];let u;if("string"==typeof o)u=o;else switch(o){case-5:u="\r";break;case-4:u="\n";break;case-3:u="\r\n";break;case-2:u=n?" ":"\t";break;case-1:if(!n&&i)continue;u=" ";break;default:u=String.fromCharCode(o)}i=-2===o,r.push(u)}return r.join("")}(v(e),n)},now:g,defineSkip:function(e){i[e.line]=e.column,C()},write:function(e){if(s=(0,c.V)(s,e),x(),null!==s[s.length-1])return[];return w(n,0),d.events=(0,b.C)(o,d.events,d),d.events}};let p,h=n.tokenize.call(d,a);return n.resolveAll&&o.push(n),d;function v(e){return function(e,n){const t=n.start._index,r=n.start._bufferIndex,i=n.end._index,o=n.end._bufferIndex;let u;t===i?u=[e[t].slice(r,o)]:(u=e.slice(t,i),r>-1&&(u[0]=u[0].slice(r)),o>0&&u.push(e[i].slice(0,o)));return u}(s,e)}function g(){return Object.assign({},r)}function x(){let e;for(;r._index<s.length;){const n=s[r._index];if("string"==typeof n)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<n.length;)m(n.charCodeAt(r._bufferIndex));else m(n)}}function m(e){f=void 0,p=e,h=h(e)}function k(e,n){n.restore()}function _(e,n){return function(t,i,o){let u,s,c,p;return Array.isArray(t)?h(t):"tokenize"in t?h([t]):function(e){return n;function n(n){const t=null!==n&&e[n],r=null!==n&&e.null;return h([...Array.isArray(t)?t:t?[t]:[],...Array.isArray(r)?r:r?[r]:[]])(n)}}(t);function h(e){return u=e,s=0,0===e.length?o:v(e[s])}function v(e){return function(t){p=function(){const e=g(),n=d.previous,t=d.currentConstruct,i=d.events.length,o=Array.from(l);return{restore:u,from:i};function u(){r=e,d.previous=n,d.currentConstruct=t,d.events.length=i,l=o,C()}}(),c=e,e.partial||(d.currentConstruct=e);if(e.name&&d.parser.constructs.disable.null.includes(e.name))return m(t);return e.tokenize.call(n?Object.assign(Object.create(d),n):d,a,x,m)(t)}}function x(n){return f=!0,e(c,p),i}function m(e){return f=!0,p.restore(),++s<u.length?v(u[s]):o}}}function w(e,n){e.resolveAll&&!o.includes(e)&&o.push(e),e.resolve&&(0,c.d)(d.events,n,d.events.length-n,e.resolve(d.events.slice(n),d)),e.resolveTo&&(d.events=e.resolveTo(d.events,d))}function C(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}var w=t(6006),C=t(65281),y=t(28327),S=t(27024),I=t(7557),A=t(15231),z=t(20556),j=t(85348),O=t(41027),F=t(19570),T=t(95914),E=t(79799),B=t(42831),P=t(63597),L=t(52304),M=t(69842),Z=t(2279),D=t(98498),Q=t(76267),R=t(34781);const V={42:w.p,43:w.p,45:w.p,48:w.p,49:w.p,50:w.p,51:w.p,52:w.p,53:w.p,54:w.p,55:w.p,56:w.p,57:w.p,62:C.m},W={91:y.D},q={[-2]:S.S,[-1]:S.S,32:S.S},G={35:I.Z,42:A.C,45:[z.C,A.C],60:j.P,61:z.C,95:A.C,96:O._,126:O._},H={38:F.u,92:T.L},J={[-5]:E.g,[-4]:E.g,[-3]:E.g,33:B.C,38:F.u,42:P.v,60:[L.j,M.L],91:Z.F,92:[D.R,T.L],93:Q.Z,95:P.v,96:R.h},K={null:[P.v,h]},N={null:[42,95]},U={null:[]};function X(e={}){const n={defined:[],lazy:{},constructs:(0,i.W)([r].concat(e.extensions||[])),content:t(s),document:t(l),flow:t(p),string:t(v),text:t(g)};return n;function t(e){return function(t){return _(n,e,t)}}}},29165:(e,n,t)=>{t.d(n,{e:()=>i});var r=t(98314);function i(e){for(;!(0,r._)(e););return e}},90507:(e,n,t)=>{t.d(n,{d:()=>i});const r=/[\0\t\n\r]/g;function i(){let e,n=1,t="",i=!0;return function(o,u,s){const c=[];let l,f,a,d,p;o=t+o.toString(u),a=0,t="",i&&(65279===o.charCodeAt(0)&&a++,i=void 0);for(;a<o.length;){if(r.lastIndex=a,l=r.exec(o),d=l&&void 0!==l.index?l.index:o.length,p=o.charCodeAt(d),!l){t=o.slice(a);break}if(10===p&&a===d&&e)c.push(-3),e=void 0;else switch(e&&(c.push(-5),e=void 0),a<d&&(c.push(o.slice(a,d)),n+=d-a),p){case 0:c.push(65533),n++;break;case 9:for(f=4*Math.ceil(n/4),c.push(-2);n++<f;)c.push(-1);break;case 10:c.push(-4),n=1;break;default:e=!0,n=1}a=d+1}s&&(e&&c.push(-5),t&&c.push(t),c.push(null));return c}}}}]);