import{e as S,s as y,h as D,i as R,c as q,b as A,d as H}from"./disclose-version.wQ3dIjQK.js";import{t as N,q as P,d as B,i as C,f as T,H as I,a as E,h as M,b as V,e as W,P as L,c as Y,p as $,g as j,j as z}from"./runtime.DzFWss8o.js";function F(e,a,t,s){function r(n){if(s.capture||b(a,n),!n.cancelBubble)return t.call(this,n)}return e.startsWith("pointer")||e==="wheel"?P(()=>{a.addEventListener(e,r,s)}):a.addEventListener(e,r,s),r}function Q(e,a,t,s,r){var n={capture:s,passive:r},u=F(e,a,t,n);(a===document.body||a===window||a===document)&&N(()=>{a.removeEventListener(e,u,n)})}function U(e){for(var a=0;a<e.length;a++)k.add(e[a]);for(var t of g)t(e)}function b(e,a){var m;var t=e.ownerDocument,s=a.type,r=((m=a.composedPath)==null?void 0:m.call(a))||[],n=r[0]||a.target,u=0,d=a.__root;if(d){var l=r.indexOf(d);if(l!==-1&&(e===document||e===window)){a.__root=e;return}var p=r.indexOf(e);if(p===-1)return;l<=p&&(u=l)}if(n=r[u]||a.target,n!==e){B(a,"currentTarget",{configurable:!0,get(){return n||t}});try{for(var i,f=[];n!==null;){var _=n.parentNode||n.host||null;try{var o=n["__"+s];if(o!==void 0&&!n.disabled)if(C(o)){var[h,...c]=o;h.apply(n,[a,...c])}else o.call(n,a)}catch(v){i?f.push(v):i=v}if(a.cancelBubble||_===e||_===null)break;n=_}if(i){for(let v of f)queueMicrotask(()=>{throw v});throw i}}finally{a.__root=e,n=e}}}const k=new Set,g=new Set;function X(e,a){(e.__t??(e.__t=e.nodeValue))!==a&&(e.nodeValue=e.__t=a)}function Z(e,a,t,s){a===void 0||a(e,t)}function G(e,a){const t=a.anchor??a.target.appendChild(S());return T(()=>O(e,{...a,anchor:t}),!1)}function x(e,a){const t=a.target,s=H;try{return T(()=>{y(!0);for(var r=t.firstChild;r&&(r.nodeType!==8||r.data!==I);)r=r.nextSibling;if(!r)throw E;const n=D(r),u=O(e,{...a,anchor:n});return y(!1),u},!1)}catch(r){if(r===E)return a.recover===!1&&M(),R(),q(t),y(!1),G(e,a);throw r}finally{y(!!s),A(s)}}function O(e,{target:a,anchor:t,props:s={},events:r,context:n,intro:u=!1}){R();const d=new Set,l=b.bind(null,a),p=b.bind(null,document),i=o=>{for(let h=0;h<o.length;h++){const c=o[h];d.has(c)||(d.add(c),a.addEventListener(c,l,L.includes(c)?{passive:!0}:void 0),document.addEventListener(c,p,L.includes(c)?{passive:!0}:void 0))}};i(V(k)),g.add(i);let f;const _=W(()=>(Y(()=>{if(n){$({});var o=z;o.c=n}r&&(s.$$events=r),f=e(t,s)||{},n&&j()}),()=>{for(const o of d)a.removeEventListener(o,l);g.delete(i),w.delete(f)}));return w.set(f,_),f}let w=new WeakMap;function aa(e){const a=w.get(e);a==null||a()}export{X as a,F as c,U as d,Q as e,x as h,G as m,Z as s,aa as u};