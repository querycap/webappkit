if(!self.define){let e,i={};const r=(r,s)=>(r=new URL(r+".js",s).href,i[r]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=i,document.head.appendChild(e)}else e=r,importScripts(r),i()})).then((()=>{let e=i[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(s,n)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(i[l])return;let t={};const o=e=>r(e,l),u={module:{uri:l},exports:t,require:o};i[l]=Promise.all(s.map((e=>u[e]||o(e)))).then((e=>(n(...e),t)))}}define(["./workbox-c663a9cf"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"06d230d1f3106ce09039bf8444792e8c"},{url:"registerSW.js",revision:"31fef8d1b503029d5a7fe01e72ee759b"},{url:"static/bootstrap.3bc382a2.js",revision:null},{url:"static/index.312300b9.js",revision:null},{url:"static/require.77299e94.js",revision:null},{url:"static/vendor~core.152a6264.js",revision:null},{url:"static/vendor~localforage.056fab36.js",revision:null},{url:"static/vendor~markdown.69f4fbcb.js",revision:null},{url:"static/vendor~polyfill.c7e5801b.js",revision:null},{url:"static/vendor~prismjs.167fb8d4.js",revision:null},{url:"static/vendor~redux-logger.c7805b13.js",revision:null},{url:"static/vendor~styling.609fdf1b.js",revision:null},{url:"static/vendor~utils.6fe662fb.js",revision:null},{url:"static/vendor~uuid.4794b367.js",revision:null},{url:"manifest.webmanifest",revision:"5552a669a79796be7f5a24679fb5c52d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
