(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const O=n=>{let t;const e=new Set,i=(h,d)=>{const c=typeof h=="function"?h(t):h;if(!Object.is(c,t)){const v=t;t=d??(typeof c!="object"||c===null)?c:Object.assign({},t,c),e.forEach(f=>f(t,v))}},s=()=>t,l={setState:i,getState:s,getInitialState:()=>g,subscribe:h=>(e.add(h),()=>e.delete(h))},g=t=n(i,s,l);return l},D=(n=>O);function j(n){return new Promise((t,e)=>{n.oncomplete=n.onsuccess=()=>t(n.result),n.onabort=n.onerror=()=>e(n.error)})}function Q(n,t){let e;const i=()=>{if(e)return e;const s=indexedDB.open(n);return s.onupgradeneeded=()=>s.result.createObjectStore(t),e=j(s),e.then(r=>{r.onclose=()=>e=void 0},()=>{}),e};return(s,r)=>i().then(o=>r(o.transaction(t,s).objectStore(t)))}let E;function P(){return E||(E=Q("keyval-store","keyval")),E}function _(n,t=P()){return t("readonly",e=>j(e.get(n)))}function W(n,t,e=P()){return e("readwrite",i=>(i.put(t,n),j(i.transaction)))}const H="root-directory-handle";function z(n,t){let e;try{e=n()}catch{return}return{getItem:s=>{var r;const o=g=>g===null?null:JSON.parse(g,void 0),l=(r=e.getItem(s))!=null?r:null;return l instanceof Promise?l.then(o):o(l)},setItem:(s,r)=>e.setItem(s,JSON.stringify(r,void 0)),removeItem:s=>e.removeItem(s)}}const B=n=>t=>{try{const e=n(t);return e instanceof Promise?e:{then(i){return B(i)(e)},catch(i){return this}}}catch(e){return{then(i){return this},catch(i){return B(i)(e)}}}},G=(n,t)=>(e,i,s)=>{let r={storage:z(()=>window.localStorage),partialize:a=>a,version:0,merge:(a,x)=>({...x,...a}),...t},o=!1,l=0;const g=new Set,h=new Set;let d=r.storage;if(!d)return n((...a)=>{console.warn(`[zustand persist middleware] Unable to update item '${r.name}', the given storage is currently unavailable.`),e(...a)},i,s);const c=()=>{const a=r.partialize({...i()});return d.setItem(r.name,{state:a,version:r.version})},v=s.setState;s.setState=(a,x)=>(v(a,x),c());const f=n((...a)=>(e(...a),c()),i,s);s.getInitialState=()=>f;let w;const C=()=>{var a,x;if(!d)return;const I=++l;o=!1,g.forEach(p=>{var b;return p((b=i())!=null?b:f)});const k=((x=r.onRehydrateStorage)==null?void 0:x.call(r,(a=i())!=null?a:f))||void 0;return B(d.getItem.bind(d))(r.name).then(p=>{if(p)if(typeof p.version=="number"&&p.version!==r.version){if(r.migrate){const b=r.migrate(p.state,p.version);return b instanceof Promise?b.then(L=>[!0,L]):[!0,b]}console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,p.state];return[!1,void 0]}).then(p=>{var b;if(I!==l)return;const[L,V]=p;if(w=r.merge(V,(b=i())!=null?b:f),e(w,!0),L)return c()}).then(()=>{I===l&&(k?.(w,void 0),w=i(),o=!0,h.forEach(p=>p(w)))}).catch(p=>{I===l&&k?.(void 0,p)})};return s.persist={setOptions:a=>{r={...r,...a},a.storage&&(d=a.storage)},clearStorage:()=>{d?.removeItem(r.name)},getOptions:()=>r,rehydrate:()=>C(),hasHydrated:()=>o,onHydrate:a=>(g.add(a),()=>{g.delete(a)}),onFinishHydration:a=>(h.add(a),()=>{h.delete(a)})},r.skipHydration||C(),w||f},J=G,u=D()(J((n,t)=>({entries:[],history:[],isLoading:!1,searchQuery:"",viewMode:"list",error:null,setEntries:e=>n({entries:e}),setSearchQuery:e=>n({searchQuery:e}),setViewMode:e=>n({viewMode:e}),setHistory:e=>{n({history:e})},requestDirectory:async e=>{try{let i=null;return e==="NEW"?i=[await window.showDirectoryPicker({mode:"read"})]:i=await _(H)||[],t().navigateTo(i)}catch(i){n({error:i})}},navigateTo:async e=>{try{n({isLoading:!0});const{setEntries:i,setHistory:s}=t();if(!e||e.length===0)return;s(e),W(H,e);const r=[];for await(const o of e[e.length-1].values())r.push(o);r.sort((o,l)=>o.kind==="directory"&&l.kind==="file"?-1:o.kind==="file"&&l.kind==="directory"?1:o.name.localeCompare(l.name)),i(r)}catch(i){n({error:i})}finally{n({isLoading:!1})}},cdInto:e=>{const{history:i}=t(),s=[...i,e];return t().navigateTo(s)}}),{name:"entry-store",storage:z(()=>localStorage),partialize:n=>({viewMode:n.viewMode,searchQuery:n.searchQuery})})),X=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>`},S=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`},Y=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`},K=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>`},R=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`},Z=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`},tt=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>`},y=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>`},et=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M3 20V4"/></svg>`},it=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg>`},nt=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>`},A=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>`},st=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>`},$=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/></svg>`},rt=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>`},ot=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`},at=(n={})=>{const{width:t=24,height:e=24,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`},lt=(n={})=>{const{width:t=18,height:e=18,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`},T=(n={})=>{const{width:t=16,height:e=16,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="m9 18 6-6-6-6"/></svg>`},U=(n={})=>{const{width:t=16,height:e=16,className:i=""}=n;return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${i}"><path d="m15 18-6-6 6-6"/></svg>`};class ct{constructor(t){this.themes=["light","dark","cupcake","bumblebee","emerald","corporate","synthwave","retro","cyberpunk","valentine","halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula","cmyk","autumn","business","acid","lemonade","night","coffee","winter","dim","nord","sunset"],this.handleThemeSelect=e=>{const i=e.target;i.value&&(this.applyTheme(i.value),this.render())},this.container=t,this.currentTheme=localStorage.getItem("theme")||"light",this.applyTheme(this.currentTheme),this.render()}applyTheme(t){this.currentTheme=t,document.documentElement.setAttribute("data-theme",t),localStorage.setItem("theme",t)}render(){this.container.innerHTML=`
      <div class="dropdown dropdown-end">
        <button class="btn btn-ghost btn-circle" id="theme-toggle-btn" tabindex="0" role="button">
        ${nt()}
        </button>
        
        <div tabindex="0" class="dropdown-content card card-sm bg-base-200 z-1 w-52 shadow-2xl p-2 border border-base-300">
          <div class="card-body p-0">
            <fieldset class="fieldset p-2 gap-1 overflow-y-auto max-h-80">
              <legend class="fieldset-legend text-xs opacity-50 uppercase tracking-widest">Select Theme</legend>
              ${this.themes.map(t=>`
                <label class="flex gap-3 cursor-pointer items-center p-2 hover:bg-base-300 rounded-btn transition-colors">
                  <input type="radio" 
                         name="theme-dropdown" 
                         class="radio radio-xs theme-controller" 
                         value="${t}" 
                         ${this.currentTheme===t?"checked":""} />
                  <span class="text-sm capitalize">${t}</span>
                </label>
              `).join("")}
            </fieldset>
          </div>
        </div>
      </div>
    `,this.container.querySelectorAll('input[name="theme-dropdown"]').forEach(t=>{t.addEventListener("change",this.handleThemeSelect)})}}class dt{constructor(t){this.container=t,this.render(),new ct(this.container.querySelector("#theme-toggle-container")),document.getElementById("load-folder-btn")?.addEventListener("click",()=>u.getState().requestDirectory("NEW"))}render(){this.container.innerHTML=`
      <header class="sticky top-0 z-40 w-full py-4 md:px-0 px-4 flex items-center justify-between bg-base-100 border-b border-base-content/10">
        <h1 class="text-2xl font-extrabold tracking-tight">Explorer</h1>

        <div class="flex items-center gap-2">
        <button id="load-folder-btn" class="btn btn-primary btn-sm gap-2">
          <span>${X()}</span>
          Load Folder
        </button>
          <div id="theme-toggle-container"></div>
        </div>
      </header>
    `}}class ht{constructor(t){this.container=t,this.setupInitialUI(),this.listBtn=this.container.querySelector("#view-list-btn"),this.gridBtn=this.container.querySelector("#view-grid-btn"),this.unsubscribe=u.subscribe((e,i)=>{(e.viewMode!==i.viewMode||e.searchQuery!==i.searchQuery)&&this.updateViewMode(e)}),this.bindEvents()}setupInitialUI(){const{searchQuery:t,viewMode:e}=u.getState();this.container.innerHTML=`
      <div class="flex flex-wrap items-center gap-2 p-3 border-b border-base-content/5">
        <div class="relative flex-1 min-w-[200px]">
          <input 
            id="explorer-search"
            type="search" 
            placeholder="Search in folder..." 
            value="${t}"
            class="input input-sm w-full outline-none"
          />
        </div>
        <div class="join">
          <button id="view-list-btn" class="btn ${e==="list"?"bg-base-100 shadow-sm text-primary":"opacity-40"} btn-sm btn-ghost join-item px-2">
            ${K()}
          </button>
          <button id="view-grid-btn" class="btn ${e==="grid"?"bg-base-100 shadow-sm text-primary":"opacity-40"} btn-sm btn-ghost join-item px-2">
            ${Y()}
          </button>
        </div>
      </div>
    `}updateViewMode(t){const e=t.viewMode==="list",i=["bg-base-100","shadow-sm","text-primary"];this.listBtn.classList.toggle("opacity-40",!e),this.gridBtn.classList.toggle("opacity-40",e),i.forEach(s=>{this.listBtn.classList.toggle(s,e),this.gridBtn.classList.toggle(s,!e)})}bindEvents(){this.container.addEventListener("click",t=>{const e=t.target;e.closest("#view-list-btn")?u.getState().setViewMode("list"):e.closest("#view-grid-btn")&&u.getState().setViewMode("grid")}),this.container.addEventListener("input",t=>{const e=t.target;e.id==="explorer-search"&&(clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(()=>{u.getState().setSearchQuery(e.value)},200))})}destroy(){this.unsubscribe()}}class ut{constructor(){this.plugins=[]}setRootSlot(t){this.rootSlot=t}register(t){const e=new t;this.plugins.some(i=>i.id===e.id)||(this.plugins.push(e),e.initialize?.(this.rootSlot))}getPluginForEntry(t){if("kind"in t&&t.kind==="directory")return null;const e=t.name,i=e.lastIndexOf(".");if(i<=0)return null;const s=e.slice(i+1).toLowerCase();return this.plugins.find(r=>r.extensions.has(s))||null}getIconForEntry(t){return this.getPluginForEntry(t)?.getIcon?.(t)||null}getActionsForEntry(t){return this.getPluginForEntry(t)?.getActions?.(t)||[]}executeAction(t,e,i){const s=e[i],r=this.getPluginForEntry(s);if(r){if(t.requiresContext){const o=this.getContextEntries(e,i,r.extensions);return t.handler(s,o)}return t.handler(s)}}handleDefaultAction(t,e){const i=this.getActionsForEntry(t[e]);i.length>0&&this.executeAction(i[0],t,e)}getContextEntries(t,e,i){return new Promise(s=>{let r=-1,o=0;const l=t.filter((g,h)=>{if(g.kind!=="file")return!1;const d=g.name,c=d.lastIndexOf(".");if(c<=0)return!1;const v=d.slice(c+1).toLowerCase();return i.has(v)?(h===e&&(r=o),o++,!0):!1});s({entries:l,relativeIndex:r})})}}const m=new ut;class gt{constructor(){this.container=document.createElement("ul"),this.container.id="entry-context-menu",this.container.className="dropdown menu fixed bg-base-100 shadow-sm z-[100] bg-base-200 border border-base-content/10 rounded-xl min-w-[160px] hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200",document.body.appendChild(this.container),window.addEventListener("click",()=>this.hide()),window.addEventListener("contextmenu",t=>{this.container.classList.contains("hidden")||t.preventDefault()})}show(t,e,i,s){if(e.length===0)return;this.container.innerHTML=e.map((c,v)=>`
        <li data-id="${v}">
          <span class="flex items-center gap-2">
            ${c.icon?`<span>${c.icon}</span>`:""}
            ${c.label}
          </span>
        </li>
      `).join(""),this.container.querySelectorAll("[data-id]").forEach(c=>{c.addEventListener("click",()=>{const v=parseInt(c.getAttribute("data-id"),10);m.executeAction(e[v],i,s),this.hide()})}),this.container.classList.remove("hidden");const{innerWidth:r,innerHeight:o}=window,{offsetWidth:l,offsetHeight:g}=this.container;let h=t.clientX,d=t.clientY;t.clientX+l>r&&(h=t.clientX-l),t.clientY+g>o&&(d=t.clientY-g),this.container.style.left=`${h}px`,this.container.style.top=`${d}px`}hide(){this.container.classList.add("hidden")}}const pt=new gt;class mt{constructor(t){this.filteredEntries=[],this.container=t,this.unsubscribe=u.subscribe(this.render.bind(this)),this.container.addEventListener("click",this.handleListClick.bind(this)),this.container.addEventListener("contextmenu",this.handleContextMenu.bind(this))}render(t){const{searchQuery:e,viewMode:i,entries:s,isLoading:r,error:o}=t;if(o){this.container.innerHTML=this.getNoPermissionTemplate();return}if(r){this.container.innerHTML=this.getLoadingTemplate();return}if(this.filteredEntries=s.filter(l=>l.name.toLowerCase().includes(e.toLowerCase())),this.filteredEntries.length===0){this.container.innerHTML=this.getEmptyTemplate();return}i==="list"?this.container.innerHTML=`<div class="flex flex-col gap-1">${this.filteredEntries.map(this.createListEntryHtml).join("")}</div>`:this.container.innerHTML=`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">${this.filteredEntries.map(this.createGridEntryHtml).join("")}</div>`}createListEntryHtml(t,e){const s=t.kind==="directory"?S({className:"size-full"}):m.getIconForEntry(t)||$({className:"size-full"});return`
      <button
        data-id="${e}"
        class="flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all hover:bg-base-200 group w-full"
      >
        <div class="flex items-center justify-center w-8 h-8 rounded-md bg-primary/5 text-primary shrink-0 transition-colors group-hover:bg-primary/10">
          <span class="size-4/5">${s}</span>
        </div>
        <span class="font-medium text-sm truncate">
          ${t.name}
        </span>
      </button>
    `}createGridEntryHtml(t,e){const s=t.kind==="directory"?S({className:"size-full"}):m.getIconForEntry(t)||$({className:"size-full"});return`
      <button
        data-id="${e}"
        class="flex flex-col items-center gap-2 p-3 text-center rounded-xl transition-all hover:bg-base-200 group w-full"
      >
        <div class="flex items-center justify-center aspect-square w-full rounded-lg bg-primary/5 text-primary shrink-0 transition-transform">
          <span class="size-3/5 mx-auto">${s}</span>
        </div>
        <span class="font-medium text-xs truncate w-full">
          ${t.name}
        </span>
      </button>
    `}handleListClick(t){const e=t.target.closest("[data-id]");if(!e)return;const i=Number(e.getAttribute("data-id")),s=this.filteredEntries[i];s&&(s.kind==="directory"?u.getState().cdInto(s):m.handleDefaultAction(this.filteredEntries,i))}handleContextMenu(t){t.preventDefault();const e=t.target.closest("[data-id]");if(!e)return;const i=Number(e.getAttribute("data-id")),s=this.filteredEntries[i];if(!s)return;const r=m.getActionsForEntry(s);pt.show(t,r,this.filteredEntries,i)}getEmptyTemplate(){return`
      <div class="flex flex-col items-center justify-center h-full gap-4">
        ${$({className:"opacity-20 size-40"})}
        <p class="text-lg font-bold">No items</p>
      </div>
    `}getLoadingTemplate(){return`
      <div class="flex flex-col items-center justify-center h-48 gap-2 text-primary">
        <span class="loading loading-ring loading-xl"></span>
        <p class="text-sm font-medium animate-pulse">Parsing directory...</p>
      </div>  
    `}getNoPermissionTemplate(){return`
      <div class="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center">
          <span>${S({className:"size-40 opacity-20"})}</span>
        <div>
           <p class="text-lg font-bold">Permission Required</p>
           <p class="text-sm opacity-70">Please click 'Load Folder' to start.</p>
        </div>
      </div>
    `}destroy(){this.unsubscribe()}}class vt{constructor(t){this.container=t,this.container.className="flex items-center gap-2 px-4 py-1.5 bg-base-100 border-b border-base-300 overflow-x-auto no-scrollbar min-h-[40px]",this.unsubscribe=u.subscribe((e,i)=>{e.history!==i.history&&this.render()}),this.container.addEventListener("click",this.handleClick.bind(this)),this.render()}render(){const{history:t}=u.getState(),e=t.length<=1;this.container.innerHTML=`
      <button 
        id="breadcrumb-back" 
        class="btn btn-ghost btn-xs btn-square shrink-0 ${e?"btn-disabled opacity-80":""}"
        ${e?"disabled":""}
        aria-label="Go back"
      >
        ${lt({width:14,height:14})}
      </button>
      
      <div class="h-4 w-px bg-base-300 mx-1 shrink-0"></div>

      <div class="flex items-center gap-0.5 text-xs font-medium whitespace-nowrap">
        ${t.map((i,s)=>`
          ${s>0?`<span class="opacity-30 mx-0.5">${T({width:12,height:12})}</span>`:""}
          <button 
            data-index="${s}" 
            class="px-1.5 py-1 rounded-md transition-colors ${s===t.length-1?"text-primary cursor-default font-bold":"text-muted-foreground hover:bg-base-200 hover:text-base-content"}"
          >
            ${i.name||"Library"}
          </button>
        `).join("")}
      </div>
    `}handleClick(t){const e=t.target;if(e.closest("#breadcrumb-back")){const{history:s}=u.getState();s.length>1&&this.dispatchNavigation(s.slice(0,s.length-1));return}const i=e.closest("[data-index]");if(i){const s=Number(i.getAttribute("data-index")),{history:r}=u.getState();if(s===r.length-1)return;this.dispatchNavigation(r.slice(0,s+1))}}dispatchNavigation(t){u.getState().navigateTo(t)}destroy(){this.unsubscribe()}}class bt{constructor(t){this.container=t,this.renderShell(),u.getState().requestDirectory("LAST")}renderShell(){this.container.innerHTML=`
      <div id="explorer-toolbar-container"></div>
      <div id="explorer-breadcrumbs-container"></div>
<div id="explorer-list-container" class="flex-1 overflow-y-auto overflow-x-hidden"></div>`,this.breadcrumbs=new vt(this.container.querySelector("#explorer-breadcrumbs-container")),this.toolbar=new ht(this.container.querySelector("#explorer-toolbar-container")),this.list=new mt(this.container.querySelector("#explorer-list-container"))}destroy(){this.toolbar?.destroy(),this.list?.destroy(),this.breadcrumbs?.destroy()}}function ft(n){return new Worker("/web-explorer/assets/metadata.worker-DJT_Vqod.js",{type:"module",name:n?.name})}const M=typeof window<"u"?new ft:null,N=new Map;M&&(M.onmessage=n=>{N.get(n.data.target)?.(n.data)});const q={send:n=>{M?.postMessage(n)},subscribe:(n,t)=>(N.set(n,t),()=>N.delete(n))};function F(n){const t=Math.floor(n/60),e=Math.floor(n%60);return`${t}:${e.toString().padStart(2,"0")}`}class wt{constructor(t){this.metadata=null,this.currentEntries=[],this.currentIndex=-1,this.isDragging=!1,this.container=t,this.audio=new Audio,this.audio.loop=!1,this.container.innerHTML=`
      <div id="pb-wrapper" class="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-500 translate-y-full pointer-events-none">
        <div class="relative w-full max-w-lg border-t border-base-content/10 bg-base-100/80 backdrop-blur-xl shadow-2xl mb-4 border-x border-b mx-4">
          
          <button id="pb-close" class="btn btn-ghost btn-circle btn-xs absolute -top-2 -right-2 bg-base-100 border border-base-content/10 shadow-sm z-60">
            ${Z({className:"size-3"})}
          </button>

          <input type="range" min="0" step="0.1" value="0" class="range-sm h-2 range w-full range-primary" id="pb-progress" />
          <div class="p-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0 flex-1 text-left group p-1" id="pb-track-info">
              <div id="pb-artwork" class="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden bg-primary/10 text-primary shrink-0"></div>
              <div class="flex flex-col min-w-0 leading-tight justify-center flex-1">
                <h3 id="pb-title" class="font-bold text-xs truncate"></h3>
                <span id="pb-time" class="text-[10px] tabular-nums opacity-60 leading-tight">0:00 / 0:00</span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button class="btn btn-ghost btn-circle btn-sm disabled:opacity-30" id="pb-prev">${et()}</button>
              <button class="btn btn-primary btn-circle btn-sm" id="pb-toggle">${y()}</button>
              <button class="btn btn-ghost btn-circle btn-sm disabled:opacity-30" id="pb-next">${it()}</button>
            </div>
            <div class="hidden sm:flex items-center justify-end gap-2 w-28 shrink-0">
              <button class="btn btn-ghost btn-circle btn-sm" id="pb-mute">${A()}</button>
              <input type="range" min="0" max="1" step="0.01" value="1" class="range range-xs range-primary w-16" id="pb-volume" />
            </div>
          </div>
        </div>
      </div>
    `,this.wrapper=this.container.querySelector("#pb-wrapper"),this.progress=this.container.querySelector("#pb-progress"),this.timeLabel=this.container.querySelector("#pb-time"),this.title=this.container.querySelector("#pb-title"),this.playPauseBtn=this.container.querySelector("#pb-toggle"),this.volumeSlider=this.container.querySelector("#pb-volume"),this.muteBtn=this.container.querySelector("#pb-mute"),this.artwork=this.container.querySelector("#pb-artwork"),this.prevBtn=this.container.querySelector("#pb-prev"),this.nextBtn=this.container.querySelector("#pb-next"),this.closeBtn=this.container.querySelector("#pb-close"),this.initAudioListeners(),this.bindEvents()}initAudioListeners(){this.audio.ontimeupdate=()=>this.updateProgress(),this.audio.onplay=()=>this.updatePlaybackState(),this.audio.onpause=()=>this.updatePlaybackState(),this.audio.onvolumechange=()=>this.updateVolumeUI(),this.audio.onended=()=>this.next(),this.audio.onloadedmetadata=()=>{this.progress.max=(this.audio.duration||0).toString(),this.updateProgress()},q.subscribe("player",t=>{t.error||(t.metadata&&(this.metadata=t.metadata),this.metadata&&(navigator.mediaSession.metadata=new MediaMetadata({title:this.metadata.title,artist:this.metadata.artist,album:this.metadata.album,artwork:this.metadata.artwork?[{src:this.metadata.artwork.src}]:[]}),this.setupMediaSessionAPI()),this.syncFullUI())})}setupMediaSessionAPI(){navigator.mediaSession.setActionHandler("play",()=>this.toggle()),navigator.mediaSession.setActionHandler("pause",()=>this.toggle()),navigator.mediaSession.setActionHandler("nexttrack",()=>this.next()),navigator.mediaSession.setActionHandler("previoustrack",()=>this.prev()),navigator.mediaSession.setActionHandler("stop",()=>this.close()),navigator.mediaSession.setActionHandler("seekto",t=>{t.seekTime!=null&&this.seek(t.seekTime)})}seek(t){this.audio.currentTime=t}bindEvents(){this.playPauseBtn.addEventListener("click",()=>this.toggle()),this.prevBtn.addEventListener("click",()=>this.prev()),this.nextBtn.addEventListener("click",()=>this.next()),this.closeBtn.addEventListener("click",()=>this.close()),this.progress.addEventListener("input",t=>{this.isDragging=!0,this.seek(parseFloat(t.target.value))}),this.progress.addEventListener("change",()=>{this.isDragging=!1}),this.volumeSlider.addEventListener("input",t=>{this.audio.volume=parseFloat(t.target.value)}),this.muteBtn.addEventListener("click",()=>{this.audio.volume=this.audio.volume===0?1:0})}async loadEntry(t){const e=this.currentEntries[t];if(e?.kind==="file"){this.currentIndex=t;const i=await e.getFile();await this.play(i)}}async play(t,e){this.cleanupResources();const i=t instanceof File?t:await t.getFile();if(this.audio.src=URL.createObjectURL(i),q.send({target:"player",file:i,quality:"high"}),await this.audio.play(),e){const{entries:s,relativeIndex:r}=await e;this.currentEntries=s,this.currentIndex=r,this.updateNavButtons()}}close(){this.audio.pause(),this.cleanupResources(),this.metadata=null,this.currentEntries=[],this.currentIndex=-1,navigator.mediaSession.metadata=null,this.syncFullUI()}cleanupResources(){this.audio.src&&(URL.revokeObjectURL(this.audio.src),this.audio.src=""),this.metadata?.artwork.src&&URL.revokeObjectURL(this.metadata.artwork.src)}toggle(){this.audio.paused?this.audio.play():this.audio.pause()}next(){this.currentIndex<this.currentEntries.length-1&&this.loadEntry(this.currentIndex+1)}prev(){if(this.audio.currentTime>3){this.seek(0);return}this.currentIndex>0&&this.loadEntry(this.currentIndex-1)}updateProgress(){const t=this.audio.currentTime,e=this.audio.duration||0;this.timeLabel.textContent=`${F(t)} / ${F(e)}`,this.isDragging||(this.progress.value=t.toString())}updatePlaybackState(){this.playPauseBtn.innerHTML=this.audio.paused?y():tt()}updateVolumeUI(){this.muteBtn.innerHTML=this.audio.volume===0?st():A(),document.activeElement!==this.volumeSlider&&(this.volumeSlider.value=this.audio.volume.toString())}updateNavButtons(){this.prevBtn.disabled=this.currentIndex<=0,this.nextBtn.disabled=this.currentIndex>=this.currentEntries.length-1||this.currentIndex===-1}syncFullUI(){const t=!!this.metadata;this.wrapper.classList.toggle("translate-y-full",!t),this.wrapper.classList.toggle("pointer-events-none",!t),t&&(this.title.textContent=this.metadata?.title||"Unknown Track",this.updateNavButtons(),this.metadata?.artwork.src?this.artwork.innerHTML=`<img src="${this.metadata.artwork.src}" class="w-full h-full object-cover rounded-lg" />`:this.artwork.innerHTML=R(),this.updateProgress(),this.updatePlaybackState(),this.updateVolumeUI())}}class xt{constructor(){this.id="music-plugin",this.name="Music Handler",this.extensions=new Set(["mp3","wav","m4a","flac","ogg"])}initialize(t){this.playerBar=new wt(t)}getIcon(){return R({className:"size-full"})}getActions(t){return[{label:"Play Music",icon:y(),handler:async(e,i)=>{e.kind!=="directory"&&this.playerBar.play(e,i)},requiresContext:!0}]}handleSystemIntent(t){return this.playerBar.play(t)}}class yt{constructor(t){this.container=t,this.currentEntries=[],this.currentIndex=-1,this.container.innerHTML=`
    <dialog id="plugin-video-modal" class="modal">
      <div class="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-black relative group">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white bg-black/20 hover:bg-black/40 z-3">✕</button>
        </form>
        
        <div class="absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 z-2">
          <button id="video-prev" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 ">
            ${U({width:32,height:32,className:"stroke-[2.5]"})}
          </button>
        </div>
        
        <div class="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 z-2">
          <button id="video-next" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 ">
            ${T({width:32,height:32,className:"stroke-[2.5]"})}
          </button>
        </div>

        <video id="plugin-video-player" loop controls autoplay class="w-full aspect-video"></video>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button id="modal-close-btn">close</button>
      </form>
    </dialog> 
    `,this.dialog=this.container.querySelector("#plugin-video-modal"),this.video=this.container.querySelector("#plugin-video-player"),this.prevBtn=this.container.querySelector("#video-prev"),this.nextBtn=this.container.querySelector("#video-next"),this.prevBtn.onclick=()=>this.navigate(-1),this.nextBtn.onclick=()=>this.navigate(1),this.dialog.addEventListener("close",this.onClose.bind(this))}async open(t,e){this.dialog.open||this.dialog.showModal();const i=t instanceof File?t:await t.getFile();if(this.updateUI(i),this.currentEntries=[],this.currentIndex=-1,this.updateNavButtons(),e){const{entries:s,relativeIndex:r}=await e;this.dialog.open&&(this.currentEntries=s,this.currentIndex=r,this.updateNavButtons())}}async loadEntry(t){const e=this.currentEntries[t];if(e?.kind==="file"){const i=await e.getFile();this.updateUI(i)}this.updateNavButtons()}updateUI(t){this.video.src&&URL.revokeObjectURL(this.video.src),this.video.dataset.name=t.name,this.video.src=URL.createObjectURL(t)}navigate(t){const e=this.currentIndex+t;e>=0&&e<this.currentEntries.length&&(this.currentIndex=e,this.loadEntry(this.currentIndex))}updateNavButtons(){const t=this.currentEntries.length<=1;this.prevBtn.classList.toggle("hidden",t),this.nextBtn.classList.toggle("hidden",t),this.prevBtn.disabled=this.currentIndex<=0,this.nextBtn.disabled=this.currentIndex>=this.currentEntries.length-1}cleanup(){this.video.src&&(URL.revokeObjectURL(this.video.src),this.video.src="")}onClose(){this.cleanup(),this.currentEntries=[],this.currentIndex=-1}getVideoName(){return this.video.dataset.name}}class kt{constructor(t,e){this.queue=[],this.currentIndex=-1,this.container=t,this.videoViewer=e,this.container.className="btm-nav border-t border-base-300 bg-base-200/80 backdrop-blur px-4 hidden h-12",this.setupListeners()}setupListeners(){this.container.addEventListener("click",t=>{const e=t.target,i=e.closest("[data-id]");if(!i)return;const s=Number(i.getAttribute("data-id"));e.closest(".btn-remove")?this.removeFromQueue(s):this.playAt(s)})}async playAt(t){if(t<0||t>=this.queue.length)return;this.currentIndex=t;const i=await this.queue[t].getFile(),s={entries:this.queue,relativeIndex:t};this.videoViewer.open(i,s),this.render()}next(){this.currentIndex<this.queue.length-1&&this.playAt(this.currentIndex+1)}prev(){this.currentIndex>0&&this.playAt(this.currentIndex-1)}addToQueue(t){this.queue.some(i=>i.name===t.name)||(this.queue.push(t),this.render())}removeFromQueue(t){this.queue.splice(t,1),t===this.currentIndex?(this.currentIndex=-1,this.queue.length>0&&this.playAt(Math.min(t,this.queue.length-1))):t<this.currentIndex&&this.currentIndex--,this.render()}render(){if(this.queue.length===0){this.container.classList.add("hidden");return}this.container.classList.remove("hidden");const t=this.videoViewer.getVideoName();this.container.innerHTML=`
      <div class="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div class="flex flex-col min-w-0 pr-4">
          <span class="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Now Playing</span>
          <span class="text-xs font-semibold truncate w-48 sm:w-80">${t||"—"}</span>
        </div>

          <div class="dropdown dropdown-top dropdown-end">
            <button tabindex="0" class="btn btn-ghost btn-xs gap-2 normal-case font-medium">
              Queue <div class="badge badge-primary badge-xs">${this.queue.length}</div>
            </button>
            <div tabindex="0" class="dropdown-content z-60 card card-compact bg-base-100 border border-base-content/10 shadow-2xl mb-2">
              <div class="card-body p-0">
                <ul class="menu menu-sm max-h-72 overflow-y-auto p-1">
                  ${this.queue.map((e,i)=>`
                      <li data-id="${i}">
                        <div class="flex justify-between items-center py-2 px-3">
                          <span class="truncate flex-1 cursor-pointer">${i+1}. ${e.name}</span>
                          <button class="btn btn-ghost btn-xs btn-circle btn-remove hover:bg-error hover:text-error-content ml-2">✕</button>
                        </div>
                      </li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
      </div>
    `}}class It{constructor(){this.id="video-plugin",this.name="Video Handler",this.extensions=new Set(["mp4","webm"])}initialize(t){const e=document.createElement("div");e.id="video-viewer-container",t.appendChild(e),this.videoViewer=new yt(e);const i=document.createElement("div");i.id="video-player-bar-container",t.appendChild(i),this.videoPlayerBar=new kt(i,this.videoViewer)}getIcon(){return rt({className:"size-full"})}getActions(t){return[{label:"Play Video",icon:y(),handler:(e,i)=>{e.kind!=="directory"&&this.videoViewer.open(e,i)},requiresContext:!0},{label:"Add to Queue",icon:at(),handler:e=>{e.kind==="file"&&this.videoPlayerBar.addToQueue(e)},requiresContext:!1}]}handleSystemIntent(t){return this.videoViewer.open(t)}}class Lt{constructor(t){this.container=t,this.currentEntries=[],this.currentIndex=-1,this.container.innerHTML=`
    <dialog id="plugin-image-modal" class="modal">
      <div class="modal-box w-11/12 max-w-7xl h-[90vh] p-0 overflow-hidden bg-black/95 flex flex-col items-center justify-center border border-white/10 relative group">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white bg-black/40 hover:bg-black/60 z-30 transition-colors">✕</button>
        </form>

        <div class="absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 z-20 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100">
          <button id="image-prev" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 transition-transform">
            ${U({width:32,height:32,className:"stroke-[2.5]"})}
          </button>
        </div>
        
        <div class="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 z-20 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100">
          <button id="image-next" class="btn btn-circle btn-ghost text-white bg-black/40 hover:bg-black/60 disabled:hidden active:scale-95 transition-transform">
            ${T({width:32,height:32,className:"stroke-[2.5]"})}
          </button>
        </div>
        
        <img 
          id="plugin-image-player" 
          class="w-full h-full object-contain block pointer-events-none select-none p-2"
          alt="Preview"
        />
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    `,this.dialog=this.container.querySelector("#plugin-image-modal"),this.image=this.container.querySelector("#plugin-image-player"),this.prevBtn=this.container.querySelector("#image-prev"),this.nextBtn=this.container.querySelector("#image-next"),this.prevBtn.onclick=e=>{e.stopPropagation(),this.navigate(-1)},this.nextBtn.onclick=e=>{e.stopPropagation(),this.navigate(1)},this.dialog.addEventListener("close",this.onClose.bind(this))}async open(t,e){this.dialog.open||this.dialog.showModal();const i=t instanceof File?t:await t.getFile();if(this.updateUI(i),this.currentEntries=[],this.currentIndex=-1,this.updateNavButtons(),e){const{entries:s,relativeIndex:r}=await e;this.dialog.open&&(this.currentEntries=s,this.currentIndex=r,this.updateNavButtons())}}async loadEntry(t){const e=this.currentEntries[t];if(e?.kind==="file"){const i=await e.getFile();this.updateUI(i)}this.updateNavButtons()}updateUI(t){this.image.src&&URL.revokeObjectURL(this.image.src),this.image.src=URL.createObjectURL(t)}navigate(t){const e=this.currentIndex+t;e>=0&&e<this.currentEntries.length&&(this.currentIndex=e,this.loadEntry(this.currentIndex))}updateNavButtons(){const t=this.currentEntries.length<=1;this.prevBtn.classList.toggle("hidden",t),this.nextBtn.classList.toggle("hidden",t),this.prevBtn.disabled=this.currentIndex<=0,this.nextBtn.disabled=this.currentIndex>=this.currentEntries.length-1}onClose(){URL.revokeObjectURL(this.image.src),this.currentEntries=[],this.currentIndex=-1}}class Et{constructor(){this.id="image-plugin",this.name="Image Handler",this.extensions=new Set(["png","jpg","jpeg","gif","webp"])}initialize(t){const e=document.createElement("div");e.id="image-viewer-container",t.appendChild(e),this.imageViewer=new Lt(e)}getIcon(){return ot({className:"size-full"})}getActions(t){return[{label:"Open Image",icon:y(),handler:(e,i)=>{e.kind!=="directory"&&this.imageViewer.open(e,i)},requiresContext:!0}]}handleSystemIntent(t){return this.imageViewer.open(t)}}class St{constructor(t){this.container=t,this.createOverlay(),this.setupListeners()}createOverlay(){this.container.className=`
      fixed inset-0 flex opacity-0 flex-col items-center justify-center
      bg-base-100/60 backdrop-blur-md pointer-events-none
      border-8 border-dashed border-primary/30 m-4 rounded-3xl transition-all duration-300
    `,this.container.innerHTML=`
      <div class="flex flex-col items-center gap-6 p-10 text-center animate-in fade-in zoom-in duration-300">
        <div id="drop-status-icon" class="relative">
           <div class="p-6 bg-primary text-primary-content rounded-full shadow-2xl shadow-primary/40">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
           </div>
           <span id="drop-spinner" class="loading loading-ring loading-lg text-primary absolute -inset-2 hidden"></span>
        </div>

        <div>
          <h2 class="text-3xl font-black tracking-tight text-base-content" id="drop-title">Drop to Open</h2>
          <p class="text-base-content/60 mt-2 font-medium" id="drop-subtitle">Release to initialize plugin</p>
        </div>
        
        <div class="badge badge-primary badge-outline font-mono uppercase tracking-widest text-xs">Ready for input</div>
      </div>
    `}setupListeners(){window.addEventListener("dragover",t=>{t.preventDefault(),this.show()}),window.addEventListener("dragleave",t=>{t.relatedTarget===null&&this.hide()}),window.addEventListener("drop",async t=>{t.preventDefault();const e=t.dataTransfer?.items;if(!e||e.length===0)return;const i=e[0];if(i.kind==="file"&&"getAsFileSystemHandle"in i){const s=await i.getAsFileSystemHandle();if(s===null)return;if(s.kind==="directory")u.getState().navigateTo([s]);else{const r=await s.getFile();m.getPluginForEntry(r)?.handleSystemIntent?.(r)}}else alert("not supported...");this.hide()})}show(){this.container.classList.remove("opacity-0","pointer-events-none"),this.container.classList.add("opacity-100","z-[9999]")}hide(){this.container.classList.remove("opacity-100","z-[9999]"),this.container.classList.add("opacity-0","pointer-events-none")}}"launchQueue"in window&&window.launchQueue&&window.launchQueue.setConsumer(async n=>{if(n.files.length>0){const t=n.files[0];if(t.kind==="directory")return alert("not supported yet...");const e=await t.getFile(),i=m.getPluginForEntry(e);i?.handleSystemIntent?i.handleSystemIntent(e):alert("No handler found...")}});const $t=()=>{const n=localStorage.getItem("theme");n?document.documentElement.setAttribute("data-theme",n):document.documentElement.setAttribute("data-theme","dark");const t=document.getElementById("app");t.className="md:max-w-3xl w-full mx-auto flex flex-col h-screen overflow-hidden",t.innerHTML=`
  <div id="header-container"></div>

  <div id="explorer-container" class="flex-1 flex flex-col overflow-hidden bg-base-200/30 border border-base-content/5">
  </div>

  <div id="plugin-slots-root"></div>

  <div id="global-dropzone"></div>
`,m.setRootSlot(document.getElementById("plugin-slots-root")),m.register(xt),m.register(It),m.register(Et),new dt(document.getElementById("header-container")),new bt(document.getElementById("explorer-container")),new St(document.getElementById("global-dropzone"))};$t();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/web-explorer/sw.js")});
