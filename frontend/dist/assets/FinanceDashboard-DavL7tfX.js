import{c as Ce,b as N,u as _e,G as Ve,r as o,j as e,Q as qe,$ as De,z as l,a0 as O,E as Xe,_ as $e}from"./index-DAvtno57.js";import{d as He,l as Ye}from"./theme-CVoCgdjI.js";import{L as Qe,a as Je}from"./log-out-Cn3YlGKx.js";import{R as Ee}from"./receipt-ChwL5QjO.js";import{B as Ke}from"./bell-D1M6CPiD.js";import{C as Ne}from"./circle-check-big-Cw7SYSzY.js";import{T as ze}from"./triangle-alert-DDOs4YBv.js";import{I as ae}from"./inbox-DnK-OVtf.js";import{P as Ae}from"./plus-C2aRT0nA.js";import{S as Ze}from"./search-Cg3Y7j9N.js";import{X as Y}from"./x-DJs_N984.js";import{C as es}from"./circle-alert-CHLylryf.js";import{R as ss}from"./refresh-cw-CwMwBVYN.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ts=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]],Te=Ce("calculator",ts);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ns=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 18v-2",key:"qcmpov"}],["path",{d:"M12 18v-4",key:"q1q25u"}],["path",{d:"M16 18v-6",key:"15y0np"}]],Fe=Ce("file-chart-column-increasing",ns);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],is=Ce("info",rs);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const os=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],as=Ce("pen",os),D={getStats:()=>N.get("/api/finance/stats"),getPayouts:s=>N.get("/api/finance/payouts",{params:s}),createPayout:s=>N.post("/api/finance/payouts",s),releasePayout:s=>N.patch(`/api/finance/payouts/${s}/release`),disputePayout:(s,t)=>N.patch(`/api/finance/payouts/${s}/dispute`,{reason:t}),getCommissionRules:()=>N.get("/api/finance/commission-rules"),createCommissionRule:s=>N.post("/api/finance/commission-rules",s),updateCommissionRule:(s,t)=>N.put(`/api/finance/commission-rules/${s}`,t),deactivateCommissionRule:s=>N.patch(`/api/finance/commission-rules/${s}/deactivate`),getReconciliation:s=>N.get("/api/finance/reconciliation",{params:s}),getGstTdsSummary:s=>N.get("/api/finance/gst-tds-summary",{params:s}),getPartners:()=>N.get("/api/finance/partners")},p=s=>s==null?"₹0":new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(s),pe=s=>{if(!s)return"—";try{return new Date(s).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}catch{return"—"}},we=s=>{if(!s)return"?";const t=s.trim().split(/\s+/);return t.length>1?(t[0][0]+t[t.length-1][0]).toUpperCase():s.substring(0,2).toUpperCase()},je=(()=>{const s=[],t=new Date;for(let j=0;j<12;j++){const x=new Date(t.getFullYear(),t.getMonth()-j,1);s.push(`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}`)}return s})();$e`to { transform: rotate(360deg); }`;const ls=$e`from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }`,cs=$e`0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; }`,ds=$e`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`,xs=l.div`
  display: flex;
  min-height: 100vh;
  font-family: ${({theme:s})=>s.typography.fontFamily};
  background: ${({theme:s})=>s.colors.background};
  color: ${({theme:s})=>s.colors.text};
`,hs=l.aside`
  width: 240px;
  background: ${({theme:s})=>s.colors.sidebar};
  border-right: 1px solid ${({theme:s})=>s.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 20;
`,Re=l.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: ${({$active:s,theme:t})=>s?t.colors.muted:"transparent"};
  color: ${({$active:s,theme:t})=>s?t.colors.secondary:t.colors.textMuted};
  font-size: 14px;
  font-weight: ${({$active:s})=>s?600:500};
  cursor: pointer;
  font-family: inherit;
  border-left: 3px solid ${({$active:s,theme:t})=>s?t.colors.secondary:"transparent"};
  transition: all 0.15s ease;
  &:hover {
    background: ${({theme:s})=>s.colors.muted};
    color: ${({theme:s})=>s.colors.text};
  }
`,us=l.div`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  background: ${({theme:s})=>s.colors.background};
`,ps=l.header`
  height: 64px;
  background: ${({theme:s})=>s.colors.header};
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`,js=l.div`
  padding: 24px;
  animation: ${ds} 0.3s ease;
`,m=l.div`
  background: ${({theme:s})=>s.colors.surface};
  border: 1px solid ${({$borderColor:s,theme:t})=>s||t.colors.border};
  border-radius: 12px;
  box-shadow: ${({theme:s})=>s.shadows.sm};
  padding: 20px;
`,Ie=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`,T=l.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({theme:s})=>s.colors.text};
  line-height: 1;
  margin-bottom: 4px;
`,z=l.div`
  font-size: 13px;
  color: ${({theme:s})=>s.colors.textMuted};
  font-weight: 500;
`,Q=l.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`,c=l.th`
  background: ${({theme:s})=>s.colors.muted};
  color: ${({theme:s})=>s.colors.textMuted};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
  &:first-child { border-radius: 8px 0 0 0; }
  &:last-child { border-radius: 0 8px 0 0; }
`,d=l.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({theme:s})=>s.colors.text};
  border-bottom: 1px solid ${({theme:s})=>s.colors.muted};
  vertical-align: middle;
`,J=l.tr`
  transition: background 0.1s ease;
  &:hover { background: ${({theme:s})=>s.colors.muted}; }
`,G=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  ${({$variant:s,theme:t})=>{switch(s){case"success":return O`background: ${t.colors.successLight}; color: ${t.colors.success};`;case"warning":return O`background: ${t.colors.warningLight}; color: ${t.colors.warning};`;case"danger":return O`background: ${t.colors.dangerLight}; color: ${t.colors.danger};`;case"info":return O`background: rgba(37,99,235,0.1); color: ${t.colors.secondary};`;case"muted":return O`background: ${t.colors.muted}; color: ${t.colors.textMuted};`}}}
`,g=l.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  ${({$variant:s,theme:t})=>{switch(s){case"danger":return O`background: ${t.colors.danger}; color: ${t.colors.buttonText}; border: none;`;case"outline":return O`background: transparent; color: ${t.colors.text}; border: 1px solid ${t.colors.border};`;case"ghost":return O`background: transparent; color: ${t.colors.textMuted}; border: none; padding: 6px 8px;`;default:return O`background: ${t.colors.secondary}; color: ${t.colors.buttonText}; border: none;`}}}
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,te=l.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`,ne=l.div`
  background: ${({theme:s})=>s.colors.surface};
  border-radius: 16px;
  box-shadow: ${({theme:s})=>s.shadows.lg};
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
`,re=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,ie=l.div`
  padding: 24px;
`,oe=l.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${({theme:s})=>s.colors.border};
`,U=l.input`
  width: 100%;
  height: 44px;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${({theme:s})=>s.colors.text};
  background: ${({theme:s})=>s.colors.surface};
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: ${({theme:s})=>s.colors.secondary}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  &::placeholder { color: ${({theme:s})=>s.colors.textMuted}; }
`,gs=l.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: ${({theme:s})=>s.colors.text};
  background: ${({theme:s})=>s.colors.surface};
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  resize: vertical;
  &:focus { border-color: ${({theme:s})=>s.colors.secondary}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  &::placeholder { color: ${({theme:s})=>s.colors.textMuted}; }
`,ge=l.select`
  width: 100%;
  height: 44px;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${({theme:s})=>s.colors.text};
  background: ${({theme:s})=>s.colors.surface};
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  &:focus { border-color: ${({theme:s})=>s.colors.secondary}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
`,f=l.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({theme:s})=>s.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`,fe=l.div`
  text-align: center;
  padding: 48px 24px;
  color: ${({theme:s})=>s.colors.textMuted};
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`,ke=l.div`
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, ${({theme:s})=>s.colors.muted} 25%, ${({theme:s})=>s.colors.border} 50%, ${({theme:s})=>s.colors.muted} 75%);
  background-size: 200px 100%;
  animation: ${cs} 1.5s infinite;
  margin-bottom: 12px;
  &:nth-child(2) { width: 80%; }
  &:nth-child(3) { width: 60%; }
`,fs=l.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`,ms=l.button`
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  background: ${({$active:s,theme:t})=>s?t.colors.secondary:t.colors.muted};
  color: ${({$active:s,theme:t})=>s?t.colors.buttonText:t.colors.textMuted};
  &:hover { opacity: 0.85; }
`,ys=l.div`
  position: fixed;
  top: 20px; right: 20px;
  z-index: 9999;
  background: ${({theme:s})=>s.colors.surface};
  border-radius: 12px;
  box-shadow: ${({theme:s})=>s.shadows.lg};
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid ${({$type:s,theme:t})=>s==="success"?t.colors.success:t.colors.danger};
  animation: ${ls} 0.3s ease;
  max-width: 360px;
  color: ${({theme:s})=>s.colors.text};
  font-size: 14px;
`,vs=l.div`
  padding: 20px 16px 16px;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,bs=l.div`
  padding: 16px;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,Ss=l.nav`
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`,Cs=l.div`
  padding: 8px 8px 16px;
  border-top: 1px solid ${({theme:s})=>s.colors.border};
`,Me=l.div`
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({theme:s})=>s.colors.secondary}, #1d4ed8);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0;
`,$s=l(Me)`width: 32px; height: 32px; font-size: 12px;`,V=l.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px;`,v=l.div`margin-bottom: 16px;`,ks=l.div`position: relative; max-width: 300px;`,Ps=l.div`position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: ${({theme:s})=>s.colors.textMuted};`,ws=l(U)`padding-left: 36px;`,me=l.h3`font-size: 16px; font-weight: 600; margin-bottom: 16px; color: ${({theme:s})=>s.colors.text};`,Rs=l.div`
  background: ${({theme:s})=>s.colors.warningLight};
  border: 1px solid ${({theme:s})=>s.colors.warning};
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: ${({theme:s})=>s.colors.text};
  margin-top: 20px;
`,le=l.span`
  font-weight: 700;
  color: ${({theme:s})=>s.colors.secondary};
`,Ds=[{key:"overview",label:"Overview",Icon:Qe},{key:"payouts",label:"Payouts",Icon:De},{key:"commissions",label:"Commission Rules",Icon:Te},{key:"reconciliation",label:"Reconciliation",Icon:Fe},{key:"gst",label:"GST / TDS",Icon:Ee}],Es={overview:"Overview",payouts:"Payouts Management",commissions:"Commission Rules",reconciliation:"Reconciliation",gst:"GST / TDS Summary"},Pe=s=>{const t=s.toUpperCase();return t==="RELEASED"?"success":t==="APPROVED"?"info":t==="PENDING"?"warning":t==="DISPUTED"?"danger":"muted"};function Ys(){const s=_e(),{isDark:t}=Ve(),j=JSON.parse(localStorage.getItem("ob_user")||"{}");o.useEffect(()=>{j.role!=="FINANCE"&&s("/login")},[j.role,s]);const[x,w]=o.useState("overview"),[k,P]=o.useState(null);o.useEffect(()=>{if(!k)return;const u=setTimeout(()=>P(null),3e3);return()=>clearTimeout(u)},[k]);const b=o.useCallback((u,r)=>P({type:u,message:r}),[]),S=()=>{localStorage.removeItem("ob_user"),s("/login")};return j.role!=="FINANCE"?null:e.jsxs(qe,{theme:t?He:Ye,children:[e.jsxs(xs,{children:[e.jsxs(hs,{children:[e.jsxs(vs,{children:[e.jsx("div",{style:{fontSize:15,fontWeight:700},children:"OngoleBulls Invest"}),e.jsx("div",{style:{fontSize:11,color:"inherit",opacity:.5,marginTop:2},children:"Finance Dashboard"})]}),e.jsx(bs,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx(Me,{children:we(j.fullName||j.name)}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx("div",{style:{fontSize:14,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:j.fullName||j.name||"Finance"}),e.jsx(G,{$variant:"info",style:{marginTop:3,fontSize:10},children:"Finance"})]})]})}),e.jsx(Ss,{children:Ds.map(({key:u,label:r,Icon:h})=>e.jsxs(Re,{$active:x===u,onClick:()=>w(u),children:[e.jsx(h,{size:18})," ",r]},u))}),e.jsx(Cs,{children:e.jsxs(Re,{onClick:S,children:[e.jsx(Je,{size:16})," Logout"]})})]}),e.jsxs(us,{children:[e.jsxs(ps,{children:[e.jsx("span",{style:{fontSize:18,fontWeight:600},children:Es[x]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16},children:[e.jsx(Ke,{size:18,style:{cursor:"pointer",opacity:.5}}),e.jsx("div",{style:{width:1,height:24,background:"currentColor",opacity:.15}}),e.jsx("span",{style:{fontSize:14,fontWeight:500},children:j.fullName||j.name}),e.jsx($s,{children:we(j.fullName||j.name)})]})]}),e.jsxs(js,{children:[x==="overview"&&e.jsx(Ns,{showToast:b}),x==="payouts"&&e.jsx(zs,{showToast:b}),x==="commissions"&&e.jsx(As,{showToast:b}),x==="reconciliation"&&e.jsx(Ts,{showToast:b}),x==="gst"&&e.jsx(Fs,{showToast:b})]})]})]}),k&&e.jsxs(ys,{$type:k.type,children:[k.type==="success"?e.jsx(Ne,{size:16}):e.jsx(ze,{size:16}),k.message]})]})}function ye(){return e.jsxs(m,{children:[e.jsx(ke,{}),e.jsx(ke,{}),e.jsx(ke,{})]})}function ve({message:s,onRetry:t}){return e.jsxs(m,{$borderColor:"currentColor",style:{borderColor:"var(--danger, #DC2626)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:12},children:[e.jsx(es,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Error"})]}),e.jsx("p",{style:{marginBottom:16,fontSize:14,opacity:.7},children:s}),e.jsxs(g,{$variant:"outline",onClick:t,children:[e.jsx(ss,{size:14})," Retry"]})]})}function ce({icon:s,text:t}){return e.jsx(m,{children:e.jsxs(fe,{children:[e.jsx(s,{size:40}),e.jsx("p",{children:t})]})})}function Ns({showToast:s}){const[t,j]=o.useState(null),[x,w]=o.useState([]),[k,P]=o.useState(!0),[b,S]=o.useState(""),u=o.useCallback(async()=>{var a,A;P(!0),S("");try{const[C,F]=await Promise.all([D.getStats(),D.getPayouts()]);j(C.data),w(Array.isArray(F.data)?F.data:[])}catch(C){S(((A=(a=C==null?void 0:C.response)==null?void 0:a.data)==null?void 0:A.message)||(C==null?void 0:C.message)||"Failed to load overview")}finally{P(!1)}},[]);if(o.useEffect(()=>{u()},[u]),k)return e.jsx(ye,{});if(b)return e.jsx(ve,{message:b,onRetry:u});if(!t)return e.jsx(ce,{icon:ae,text:"No data available"});const r=x.filter(a=>a.status==="PENDING").slice(0,5),h=x.filter(a=>a.status==="RELEASED").slice(0,5);return e.jsxs(e.Fragment,{children:[e.jsxs(Ie,{children:[e.jsxs(m,{children:[e.jsx(z,{children:"Pending Payouts"}),e.jsx(T,{children:t.totalPayoutsPending})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Released Payouts"}),e.jsx(T,{children:t.totalPayoutsReleased})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Pending Amount"}),e.jsx(T,{children:p(t.pendingAmount)})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Released This Month"}),e.jsx(T,{children:p(t.releasedThisMonth)})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Active Commission Rules"}),e.jsx(T,{children:t.activeCommissionRules})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Disputed Payouts"}),e.jsx(T,{children:t.disputedPayouts})]})]}),e.jsxs(V,{children:[e.jsxs(m,{children:[e.jsx(me,{children:"Payouts Awaiting Release"}),r.length===0?e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No pending payouts"})]}):e.jsxs(Q,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Period"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:r.map(a=>e.jsxs(J,{children:[e.jsx(d,{children:a.partnerName}),e.jsx(d,{children:a.period}),e.jsx(d,{children:e.jsx(le,{children:p(a.netAmount)})}),e.jsx(d,{children:e.jsx(G,{$variant:"warning",children:"Pending"})})]},a.id))})]})]}),e.jsxs(m,{children:[e.jsx(me,{children:"Recently Released"}),h.length===0?e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No released payouts yet"})]}):e.jsxs(Q,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Date"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:h.map(a=>e.jsxs(J,{children:[e.jsx(d,{children:a.partnerName}),e.jsx(d,{children:e.jsx(le,{children:p(a.netAmount)})}),e.jsx(d,{children:pe(a.payoutDate)}),e.jsx(d,{children:e.jsx(G,{$variant:"success",children:"Released"})})]},a.id))})]})]})]})]})}function zs({showToast:s}){const[t,j]=o.useState([]),[x,w]=o.useState(!0),[k,P]=o.useState(""),[b,S]=o.useState(""),[u,r]=o.useState(""),[h,a]=o.useState(null),[A,C]=o.useState(null),[F,L]=o.useState(null),[q,X]=o.useState(""),[de,B]=o.useState(!1),[K,xe]=o.useState([]),[I,M]=o.useState(!1),[H,Z]=o.useState(0),[W,be]=o.useState(""),[ee,Se]=o.useState(""),[he,i]=o.useState("18"),[E,$]=o.useState("10"),ue=()=>{const n=parseFloat(ee)||0,R=n*(parseFloat(he)||0)/100,y=n*(parseFloat(E)||0)/100;return n-R-y},se=o.useCallback(async()=>{var n,R;w(!0),P("");try{const y={};b&&(y.status=b),u&&(y.search=u);const _=await D.getPayouts(y);j(Array.isArray(_.data)?_.data:[])}catch(y){P(((R=(n=y==null?void 0:y.response)==null?void 0:n.data)==null?void 0:R.message)||(y==null?void 0:y.message)||"Failed to load payouts")}finally{w(!1)}},[b,u]);o.useEffect(()=>{se()},[se]);const Ge=async()=>{B(!0);try{const n=await D.getPartners();xe(Array.isArray(n.data)?n.data:[])}catch{}Z(0),be(""),Se(""),i("18"),$("10")},Le=async()=>{var R,y;if(!H||!W||!ee){s("error","Fill all required fields");return}const n=K.find(_=>_.id===H);M(!0);try{await D.createPayout({partnerId:H,partnerName:(n==null?void 0:n.fullName)||"",period:W,grossAmount:parseFloat(ee),gstPercent:parseFloat(he)||0,tdsPercent:parseFloat(E)||0}),s("success","Payout created successfully"),B(!1),se()}catch(_){s("error",((y=(R=_==null?void 0:_.response)==null?void 0:R.data)==null?void 0:y.message)||"Failed to create payout")}finally{M(!1)}},Be=async()=>{var n,R;if(A){M(!0);try{await D.releasePayout(A),s("success","Payout released"),C(null),se()}catch(y){s("error",((R=(n=y==null?void 0:y.response)==null?void 0:n.data)==null?void 0:R.message)||"Failed to release payout")}finally{M(!1)}}},We=async()=>{var n,R;if(!F||!q.trim()){s("error","Please provide a dispute reason");return}M(!0);try{await D.disputePayout(F,q.trim()),s("success","Payout disputed"),L(null),X(""),se()}catch(y){s("error",((R=(n=y==null?void 0:y.response)==null?void 0:n.data)==null?void 0:R.message)||"Failed to dispute payout")}finally{M(!1)}},Oe=["","PENDING","APPROVED","RELEASED","DISPUTED"],Ue={"":"All",PENDING:"Pending",APPROVED:"Approved",RELEASED:"Released",DISPUTED:"Disputed"};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},children:[e.jsx(fs,{children:Oe.map(n=>e.jsx(ms,{$active:b===n,onClick:()=>S(n),children:Ue[n]},n))}),e.jsxs(g,{onClick:Ge,children:[e.jsx(Ae,{size:14})," Create Payout"]})]}),e.jsx("div",{style:{marginBottom:16},children:e.jsxs(ks,{children:[e.jsx(Ps,{children:e.jsx(Ze,{size:16})}),e.jsx(ws,{placeholder:"Search by partner name...",value:u,onChange:n=>r(n.target.value)})]})}),x?e.jsx(ye,{}):k?e.jsx(ve,{message:k,onRetry:se}):t.length===0?e.jsx(ce,{icon:De,text:"No payouts found"}):e.jsx(m,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Q,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Period"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"GST"}),e.jsx(c,{children:"TDS"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Date"}),e.jsx(c,{children:"Status"}),e.jsx(c,{children:"Actions"})]})}),e.jsx("tbody",{children:t.map(n=>e.jsxs(J,{children:[e.jsx(d,{children:n.partnerName}),e.jsx(d,{children:n.period}),e.jsx(d,{children:p(n.grossAmount)}),e.jsx(d,{children:p(n.gst)}),e.jsx(d,{children:p(n.tds)}),e.jsx(d,{children:e.jsx(le,{children:p(n.netAmount)})}),e.jsx(d,{children:pe(n.payoutDate||n.createdAt)}),e.jsx(d,{children:e.jsx(G,{$variant:Pe(n.status),children:n.status})}),e.jsx(d,{children:e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsx(g,{$variant:"ghost",onClick:()=>a(n),title:"View",children:e.jsx(Xe,{size:16})}),(n.status==="PENDING"||n.status==="APPROVED")&&e.jsx(g,{$variant:"ghost",onClick:()=>C(n.id),title:"Release",style:{color:"#059669"},children:e.jsx(Ne,{size:16})}),n.status==="PENDING"&&e.jsx(g,{$variant:"ghost",onClick:()=>{L(n.id),X("")},title:"Dispute",style:{color:"#DC2626"},children:e.jsx(ze,{size:16})})]})})]},n.id))})]})})}),h&&e.jsx(te,{onClick:()=>a(null),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Payout Details"}),e.jsx(g,{$variant:"ghost",onClick:()=>a(null),children:e.jsx(Y,{size:18})})]}),e.jsxs(ie,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"Partner"}),e.jsx("div",{children:h.partnerName})]}),e.jsxs(V,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"Period"}),e.jsx("div",{children:h.period})]}),e.jsxs(v,{children:[e.jsx(f,{children:"Status"}),e.jsx(G,{$variant:Pe(h.status),children:h.status})]})]}),e.jsxs(V,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"Gross Amount"}),e.jsx("div",{children:p(h.grossAmount)})]}),e.jsxs(v,{children:[e.jsx(f,{children:"Net Amount"}),e.jsx(le,{children:p(h.netAmount)})]})]}),e.jsxs(V,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"GST"}),e.jsx("div",{children:p(h.gst)})]}),e.jsxs(v,{children:[e.jsx(f,{children:"TDS"}),e.jsx("div",{children:p(h.tds)})]})]}),h.payoutDate&&e.jsxs(v,{children:[e.jsx(f,{children:"Payout Date"}),e.jsx("div",{children:pe(h.payoutDate)})]}),h.releasedByName&&e.jsxs(v,{children:[e.jsx(f,{children:"Released By"}),e.jsx("div",{children:h.releasedByName})]}),h.disputeReason&&e.jsxs(v,{children:[e.jsx(f,{children:"Dispute Reason"}),e.jsx("div",{style:{padding:12,borderRadius:8},children:h.disputeReason})]})]}),e.jsx(oe,{children:e.jsx(g,{$variant:"outline",onClick:()=>a(null),children:"Close"})})]})}),A!==null&&e.jsx(te,{onClick:()=>C(null),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Confirm Release"}),e.jsx(g,{$variant:"ghost",onClick:()=>C(null),children:e.jsx(Y,{size:18})})]}),e.jsx(ie,{children:e.jsx("p",{children:"Are you sure you want to release this payout? This action cannot be undone."})}),e.jsxs(oe,{children:[e.jsx(g,{$variant:"outline",onClick:()=>C(null),children:"Cancel"}),e.jsx(g,{onClick:Be,disabled:I,children:I?"Releasing...":"Release Payout"})]})]})}),F!==null&&e.jsx(te,{onClick:()=>L(null),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Dispute Payout"}),e.jsx(g,{$variant:"ghost",onClick:()=>L(null),children:e.jsx(Y,{size:18})})]}),e.jsx(ie,{children:e.jsxs(v,{children:[e.jsx(f,{children:"Reason for Dispute *"}),e.jsx(gs,{placeholder:"Explain the reason for disputing this payout...",value:q,onChange:n=>X(n.target.value)})]})}),e.jsxs(oe,{children:[e.jsx(g,{$variant:"outline",onClick:()=>L(null),children:"Cancel"}),e.jsx(g,{$variant:"danger",onClick:We,disabled:I,children:I?"Submitting...":"Submit Dispute"})]})]})}),de&&e.jsx(te,{onClick:()=>B(!1),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Create Payout"}),e.jsx(g,{$variant:"ghost",onClick:()=>B(!1),children:e.jsx(Y,{size:18})})]}),e.jsxs(ie,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"Partner *"}),e.jsxs(ge,{value:H,onChange:n=>Z(Number(n.target.value)),children:[e.jsx("option",{value:0,children:"Select a partner"}),K.map(n=>e.jsx("option",{value:n.id,children:n.fullName},n.id))]})]}),e.jsxs(v,{children:[e.jsx(f,{children:"Period *"}),e.jsxs(ge,{value:W,onChange:n=>be(n.target.value),children:[e.jsx("option",{value:"",children:"Select period"}),je.map(n=>e.jsx("option",{value:n,children:n},n))]})]}),e.jsxs(v,{children:[e.jsx(f,{children:"Gross Amount *"}),e.jsx(U,{type:"number",placeholder:"Enter gross amount",value:ee,onChange:n=>Se(n.target.value)})]}),e.jsxs(V,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"GST %"}),e.jsx(U,{type:"number",value:he,onChange:n=>i(n.target.value)})]}),e.jsxs(v,{children:[e.jsx(f,{children:"TDS %"}),e.jsx(U,{type:"number",value:E,onChange:n=>$(n.target.value)})]})]}),e.jsx(m,{style:{marginTop:8},children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(z,{children:"Net Payout (auto-calculated)"}),e.jsx(le,{style:{fontSize:20},children:p(ue())})]})})]}),e.jsxs(oe,{children:[e.jsx(g,{$variant:"outline",onClick:()=>B(!1),children:"Cancel"}),e.jsx(g,{onClick:Le,disabled:I,children:I?"Creating...":"Create Payout"})]})]})})]})}function As({showToast:s}){const[t,j]=o.useState([]),[x,w]=o.useState(!0),[k,P]=o.useState(""),[b,S]=o.useState(!1),[u,r]=o.useState(null),[h,a]=o.useState(null),[A,C]=o.useState(!1),[F,L]=o.useState(""),[q,X]=o.useState(""),[de,B]=o.useState(""),[K,xe]=o.useState(""),[I,M]=o.useState(""),[H,Z]=o.useState(""),W=o.useCallback(async()=>{var i,E;w(!0),P("");try{const $=await D.getCommissionRules();j(Array.isArray($.data)?$.data:[])}catch($){P(((E=(i=$==null?void 0:$.response)==null?void 0:i.data)==null?void 0:E.message)||($==null?void 0:$.message)||"Failed to load commission rules")}finally{w(!1)}},[]);o.useEffect(()=>{W()},[W]);const be=async()=>{var E,$;if(!F||!q||!de||!K||!I){s("error","Fill all required fields");return}C(!0);const i={amcName:F,fundCategory:q,trailPercent:parseFloat(de),upfrontPercent:parseFloat(K),effectiveFrom:I,effectiveTo:H||void 0};try{u?(await D.updateCommissionRule(u.id,i),s("success","Commission rule updated")):(await D.createCommissionRule(i),s("success","Commission rule created")),S(!1),r(null),W()}catch(ue){s("error",(($=(E=ue==null?void 0:ue.response)==null?void 0:E.data)==null?void 0:$.message)||(u?"Failed to update rule":"Failed to create rule"))}finally{C(!1)}},ee=async()=>{var i,E;if(h){C(!0);try{await D.deactivateCommissionRule(h),s("success","Rule deactivated"),a(null),W()}catch($){s("error",((E=(i=$==null?void 0:$.response)==null?void 0:i.data)==null?void 0:E.message)||"Failed to deactivate rule")}finally{C(!1)}}},Se=["Equity","Debt","Hybrid","ELSS","Liquid","Index","Sectoral","International"],he=i=>["Equity","ELSS","Sectoral"].includes(i)?"info":["Debt","Liquid"].includes(i)?"success":["Hybrid","Index"].includes(i)?"warning":"muted";return e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:16},children:e.jsxs(g,{onClick:()=>{r(null),S(!0),L(""),X(""),B(""),xe(""),M(""),Z("")},children:[e.jsx(Ae,{size:14})," Add Rule"]})}),x?e.jsx(ye,{}):k?e.jsx(ve,{message:k,onRetry:W}):t.length===0?e.jsx(ce,{icon:Te,text:"No commission rules configured"}):e.jsx(m,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Q,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"AMC"}),e.jsx(c,{children:"Category"}),e.jsx(c,{children:"Trail %"}),e.jsx(c,{children:"Upfront %"}),e.jsx(c,{children:"Effective From"}),e.jsx(c,{children:"Effective To"}),e.jsx(c,{children:"Status"}),e.jsx(c,{children:"Actions"})]})}),e.jsx("tbody",{children:t.map(i=>e.jsxs(J,{children:[e.jsx(d,{style:{fontWeight:500},children:i.amcName}),e.jsx(d,{children:e.jsx(G,{$variant:he(i.fundCategory),children:i.fundCategory})}),e.jsxs(d,{children:[i.trailPercent,"%"]}),e.jsxs(d,{children:[i.upfrontPercent,"%"]}),e.jsx(d,{children:pe(i.effectiveFrom)}),e.jsx(d,{children:i.effectiveTo?pe(i.effectiveTo):"—"}),e.jsx(d,{children:e.jsx(G,{$variant:i.isActive?"success":"danger",children:i.isActive?"Active":"Inactive"})}),e.jsx(d,{children:e.jsxs("div",{style:{display:"flex",gap:4},children:[i.isActive&&e.jsx(g,{$variant:"ghost",onClick:()=>{r(i),L(i.amcName),X(i.fundCategory),B(String(i.trailPercent)),xe(String(i.upfrontPercent)),M(i.effectiveFrom),Z(i.effectiveTo||""),S(!0)},title:"Edit",children:e.jsx(as,{size:16})}),i.isActive&&e.jsx(g,{$variant:"ghost",onClick:()=>a(i.id),title:"Deactivate",style:{color:"#DC2626"},children:e.jsx(Y,{size:16})})]})})]},i.id))})]})})}),b&&e.jsx(te,{onClick:()=>{S(!1),r(null)},children:e.jsxs(ne,{onClick:i=>i.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:u?"Edit Commission Rule":"Add Commission Rule"}),e.jsx(g,{$variant:"ghost",onClick:()=>{S(!1),r(null)},children:e.jsx(Y,{size:18})})]}),e.jsxs(ie,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"AMC Name *"}),e.jsx(U,{placeholder:"e.g., HDFC Mutual Fund",value:F,onChange:i=>L(i.target.value)})]}),e.jsxs(v,{children:[e.jsx(f,{children:"Fund Category *"}),e.jsxs(ge,{value:q,onChange:i=>X(i.target.value),children:[e.jsx("option",{value:"",children:"Select category"}),Se.map(i=>e.jsx("option",{value:i,children:i},i))]})]}),e.jsxs(V,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"Trail % *"}),e.jsx(U,{type:"number",step:"0.01",placeholder:"e.g., 0.50",value:de,onChange:i=>B(i.target.value)})]}),e.jsxs(v,{children:[e.jsx(f,{children:"Upfront % *"}),e.jsx(U,{type:"number",step:"0.01",placeholder:"e.g., 1.00",value:K,onChange:i=>xe(i.target.value)})]})]}),e.jsxs(V,{children:[e.jsxs(v,{children:[e.jsx(f,{children:"Effective From *"}),e.jsx(U,{type:"date",value:I,onChange:i=>M(i.target.value)})]}),e.jsxs(v,{children:[e.jsx(f,{children:"Effective To"}),e.jsx(U,{type:"date",value:H,onChange:i=>Z(i.target.value)})]})]})]}),e.jsxs(oe,{children:[e.jsx(g,{$variant:"outline",onClick:()=>{S(!1),r(null)},children:"Cancel"}),e.jsx(g,{onClick:be,disabled:A,children:A?u?"Updating...":"Creating...":u?"Update Rule":"Create Rule"})]})]})}),h!==null&&e.jsx(te,{onClick:()=>a(null),children:e.jsxs(ne,{onClick:i=>i.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Confirm Deactivation"}),e.jsx(g,{$variant:"ghost",onClick:()=>a(null),children:e.jsx(Y,{size:18})})]}),e.jsx(ie,{children:e.jsx("p",{children:"Are you sure you want to deactivate this commission rule? It will no longer apply to new payouts."})}),e.jsxs(oe,{children:[e.jsx(g,{$variant:"outline",onClick:()=>a(null),children:"Cancel"}),e.jsx(g,{$variant:"danger",onClick:ee,disabled:A,children:A?"Deactivating...":"Deactivate"})]})]})})]})}function Ts({showToast:s}){const[t,j]=o.useState(je[0]),[x,w]=o.useState(null),[k,P]=o.useState(!0),[b,S]=o.useState(""),u=o.useCallback(async()=>{var r,h;P(!0),S("");try{const a=await D.getReconciliation({period:t});w(a.data)}catch(a){S(((h=(r=a==null?void 0:a.response)==null?void 0:r.data)==null?void 0:h.message)||(a==null?void 0:a.message)||"Failed to load reconciliation data")}finally{P(!1)}},[t]);return o.useEffect(()=>{u()},[u]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{marginBottom:16},children:[e.jsx(f,{children:"Period"}),e.jsx(ge,{style:{maxWidth:220},value:t,onChange:r=>j(r.target.value),children:je.map(r=>e.jsx("option",{value:r,children:r},r))})]}),k?e.jsx(ye,{}):b?e.jsx(ve,{message:b,onRetry:u}):x?e.jsxs(e.Fragment,{children:[e.jsxs(Ie,{children:[e.jsxs(m,{children:[e.jsx(z,{children:"Total Gross"}),e.jsx(T,{children:p(x.totalGross)})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Total GST"}),e.jsx(T,{children:p(x.totalGst)})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Total TDS"}),e.jsx(T,{children:p(x.totalTds)})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Net Released"}),e.jsx(T,{children:p(x.totalNetReleased)})]}),e.jsxs(m,{children:[e.jsx(z,{children:"Pending Release"}),e.jsx(T,{children:p(x.pendingRelease)})]})]}),e.jsx(me,{children:"Partner Breakdown"}),!x.partnerBreakdown||x.partnerBreakdown.length===0?e.jsx(ce,{icon:ae,text:"No partner breakdown data"}):e.jsx(m,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Q,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"GST"}),e.jsx(c,{children:"TDS"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:x.partnerBreakdown.map(r=>e.jsxs(J,{children:[e.jsx(d,{style:{fontWeight:500},children:r.partnerName}),e.jsx(d,{children:p(r.grossAmount)}),e.jsx(d,{children:p(r.gst)}),e.jsx(d,{children:p(r.tds)}),e.jsx(d,{children:e.jsx(le,{children:p(r.netAmount)})}),e.jsx(d,{children:e.jsx(G,{$variant:Pe(r.status),children:r.status})})]},r.id))})]})})})]}):e.jsx(ce,{icon:Fe,text:"No reconciliation data for this period"})]})}function Fs({showToast:s}){const[t,j]=o.useState(je[0]),[x,w]=o.useState(null),[k,P]=o.useState(!0),[b,S]=o.useState(""),u=o.useCallback(async()=>{var r,h;P(!0),S("");try{const a=await D.getGstTdsSummary({period:t});w(a.data)}catch(a){S(((h=(r=a==null?void 0:a.response)==null?void 0:r.data)==null?void 0:h.message)||(a==null?void 0:a.message)||"Failed to load GST/TDS data")}finally{P(!1)}},[t]);return o.useEffect(()=>{u()},[u]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{marginBottom:16},children:[e.jsx(f,{children:"Period"}),e.jsx(ge,{style:{maxWidth:220},value:t,onChange:r=>j(r.target.value),children:je.map(r=>e.jsx("option",{value:r,children:r},r))})]}),k?e.jsx(ye,{}):b?e.jsx(ve,{message:b,onRetry:u}):x?e.jsxs(e.Fragment,{children:[e.jsxs(V,{children:[e.jsxs("div",{children:[e.jsx(me,{children:"GST Summary"}),!x.gstEntries||x.gstEntries.length===0?e.jsx(m,{children:e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No GST entries"})]})}):e.jsx(m,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Q,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"PAN"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"Rate"}),e.jsx(c,{children:"Amount"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:x.gstEntries.map((r,h)=>e.jsxs(J,{children:[e.jsx(d,{style:{fontWeight:500},children:r.partnerName}),e.jsx(d,{children:r.pan||"—"}),e.jsx(d,{children:p(r.grossAmount)}),e.jsxs(d,{children:[r.rate,"%"]}),e.jsx(d,{children:p(r.amount)}),e.jsx(d,{children:e.jsx(G,{$variant:r.status==="FILED"?"success":"warning",children:r.status})})]},h))})]})})})]}),e.jsxs("div",{children:[e.jsx(me,{children:"TDS Summary"}),!x.tdsEntries||x.tdsEntries.length===0?e.jsx(m,{children:e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No TDS entries"})]})}):e.jsx(m,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(Q,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"PAN"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"Rate"}),e.jsx(c,{children:"Amount"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:x.tdsEntries.map((r,h)=>e.jsxs(J,{children:[e.jsx(d,{style:{fontWeight:500},children:r.partnerName}),e.jsx(d,{children:r.pan||"—"}),e.jsx(d,{children:p(r.grossAmount)}),e.jsxs(d,{children:[r.rate,"%"]}),e.jsx(d,{children:p(r.amount)}),e.jsx(d,{children:e.jsx(G,{$variant:r.status==="DEDUCTED"?"success":"warning",children:r.status})})]},h))})]})})})]})]}),e.jsxs(Rs,{children:[e.jsx(is,{size:18,style:{flexShrink:0,marginTop:1}}),e.jsx("span",{children:"These figures are for reference. File GST returns through your CA or GST portal."})]})]}):e.jsx(ce,{icon:Ee,text:"No GST/TDS data for this period"})]})}export{Ys as default};
