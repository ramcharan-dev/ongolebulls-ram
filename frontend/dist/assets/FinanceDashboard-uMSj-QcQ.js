import{n as Re,c as N,u as Ve,a as qe,r as o,j as e,Q as _e,W as De,A as l,R as U,E as Xe,U as Ce}from"./index-CBdPhbzg.js";import{d as He,l as Ye}from"./theme-CVoCgdjI.js";import{L as Je,a as Qe}from"./log-out-XNb9afVR.js";import{C as Ee,I as Ke}from"./info-1SYKPtY_.js";import{R as Ne}from"./receipt-Bq4k6gyE.js";import{B as Ze}from"./bell-bbqgtkOi.js";import{C as Ae}from"./circle-check-big-BR3ppFar.js";import{T as ze}from"./triangle-alert-DcK14a9G.js";import{I as ae}from"./inbox-BNPj5Wsn.js";import{P as Te}from"./plus-BczYa6Gw.js";import{S as es}from"./search-ejUTuyX_.js";import{X as Y}from"./x-C3hjsG26.js";import{C as ss}from"./circle-alert-DYAS5zCb.js";import{R as ts}from"./refresh-cw-D3uugpiT.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ns=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 18v-2",key:"qcmpov"}],["path",{d:"M12 18v-4",key:"q1q25u"}],["path",{d:"M16 18v-6",key:"15y0np"}]],Fe=Re("file-chart-column-increasing",ns);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],is=Re("pen",rs),D={getStats:()=>N.get("/api/finance/stats"),getPayouts:s=>N.get("/api/finance/payouts",{params:s}),createPayout:s=>N.post("/api/finance/payouts",s),releasePayout:s=>N.patch(`/api/finance/payouts/${s}/release`),disputePayout:(s,t)=>N.patch(`/api/finance/payouts/${s}/dispute`,{reason:t}),getCommissionRules:()=>N.get("/api/finance/commission-rules"),createCommissionRule:s=>N.post("/api/finance/commission-rules",s),updateCommissionRule:(s,t)=>N.put(`/api/finance/commission-rules/${s}`,t),deactivateCommissionRule:s=>N.patch(`/api/finance/commission-rules/${s}/deactivate`),getReconciliation:s=>N.get("/api/finance/reconciliation",{params:s}),getGstTdsSummary:s=>N.get("/api/finance/gst-tds-summary",{params:s}),getPartners:()=>N.get("/api/finance/partners")},h=s=>s==null?"₹0":new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(s),pe=s=>{if(!s)return"—";try{return new Date(s).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}catch{return"—"}},ke=s=>{if(!s)return"?";const t=s.trim().split(/\s+/);return t.length>1?(t[0][0]+t[t.length-1][0]).toUpperCase():s.substring(0,2).toUpperCase()},je=(()=>{const s=[],t=new Date;for(let k=0;k<12;k++){const x=new Date(t.getFullYear(),t.getMonth()-k,1);s.push(`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}`)}return s})();Ce`to { transform: rotate(360deg); }`;const os=Ce`from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }`,as=Ce`0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; }`,ls=Ce`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`,cs=l.div`
  display: flex;
  min-height: 100vh;
  font-family: ${({theme:s})=>s.typography.fontFamily};
  background: ${({theme:s})=>s.colors.background};
  color: ${({theme:s})=>s.colors.text};
`,ds=l.aside`
  width: 240px;
  background: ${({theme:s})=>s.colors.sidebar};
  border-right: 1px solid ${({theme:s})=>s.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 20;
`,we=l.button`
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
`,xs=l.div`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  background: ${({theme:s})=>s.colors.background};
`,us=l.header`
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
`,hs=l.div`
  padding: 24px;
  animation: ${ls} 0.3s ease;
`,f=l.div`
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
`,A=l.div`
  font-size: 13px;
  color: ${({theme:s})=>s.colors.textMuted};
  font-weight: 500;
`,J=l.table`
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
`,Q=l.tr`
  transition: background 0.1s ease;
  &:hover { background: ${({theme:s})=>s.colors.muted}; }
`,L=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  ${({$variant:s,theme:t})=>{switch(s){case"success":return U`background: ${t.colors.successLight}; color: ${t.colors.success};`;case"warning":return U`background: ${t.colors.warningLight}; color: ${t.colors.warning};`;case"danger":return U`background: ${t.colors.dangerLight}; color: ${t.colors.danger};`;case"info":return U`background: rgba(37,99,235,0.1); color: ${t.colors.secondary};`;case"muted":return U`background: ${t.colors.muted}; color: ${t.colors.textMuted};`}}}
`,j=l.button`
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
  ${({$variant:s,theme:t})=>{switch(s){case"danger":return U`background: ${t.colors.danger}; color: ${t.colors.buttonText}; border: none;`;case"outline":return U`background: transparent; color: ${t.colors.text}; border: 1px solid ${t.colors.border};`;case"ghost":return U`background: transparent; color: ${t.colors.textMuted}; border: none; padding: 6px 8px;`;default:return U`background: ${t.colors.secondary}; color: ${t.colors.buttonText}; border: none;`}}}
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
`,O=l.input`
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
`,ps=l.textarea`
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
`,g=l.label`
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
`,$e=l.div`
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, ${({theme:s})=>s.colors.muted} 25%, ${({theme:s})=>s.colors.border} 50%, ${({theme:s})=>s.colors.muted} 75%);
  background-size: 200px 100%;
  animation: ${as} 1.5s infinite;
  margin-bottom: 12px;
  &:nth-child(2) { width: 80%; }
  &:nth-child(3) { width: 60%; }
`,js=l.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`,gs=l.button`
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
`,fs=l.div`
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
  animation: ${os} 0.3s ease;
  max-width: 360px;
  color: ${({theme:s})=>s.colors.text};
  font-size: 14px;
`,ms=l.div`
  padding: 20px 16px 16px;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,ys=l.div`
  padding: 16px;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,vs=l.nav`
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`,bs=l.div`
  padding: 8px 8px 16px;
  border-top: 1px solid ${({theme:s})=>s.colors.border};
`,Ge=l.div`
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({theme:s})=>s.colors.secondary}, #1d4ed8);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0;
`,Ss=l(Ge)`width: 32px; height: 32px; font-size: 12px;`,q=l.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px;`,v=l.div`margin-bottom: 16px;`,Cs=l.div`position: relative; max-width: 300px;`,$s=l.div`position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: ${({theme:s})=>s.colors.textMuted};`,Ps=l(O)`padding-left: 36px;`,me=l.h3`font-size: 16px; font-weight: 600; margin-bottom: 16px; color: ${({theme:s})=>s.colors.text};`,ks=l.div`
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
`,ws=[{key:"overview",label:"Overview",Icon:Je},{key:"payouts",label:"Payouts",Icon:De},{key:"commissions",label:"Commission Rules",Icon:Ee},{key:"reconciliation",label:"Reconciliation",Icon:Fe},{key:"gst",label:"GST / TDS",Icon:Ne}],Rs={overview:"Overview",payouts:"Payouts Management",commissions:"Commission Rules",reconciliation:"Reconciliation",gst:"GST / TDS Summary"},Pe=s=>{const t=s.toUpperCase();return t==="RELEASED"?"success":t==="APPROVED"?"info":t==="PENDING"?"warning":t==="DISPUTED"?"danger":"muted"};function Hs(){const s=Ve(),{isDark:t,toggleTheme:k}=qe(),x=JSON.parse(localStorage.getItem("ob_user")||"{}");o.useEffect(()=>{x.role!=="FINANCE"&&s("/login")},[x.role,s]);const[S,w]=o.useState("overview"),[b,P]=o.useState(null);o.useEffect(()=>{if(!b)return;const r=setTimeout(()=>P(null),3e3);return()=>clearTimeout(r)},[b]);const m=o.useCallback((r,u)=>P({type:r,message:u}),[]),p=()=>{localStorage.removeItem("ob_user"),s("/login")};return x.role!=="FINANCE"?null:e.jsxs(_e,{theme:t?He:Ye,children:[e.jsxs(cs,{children:[e.jsxs(ds,{children:[e.jsxs(ms,{children:[e.jsx("div",{style:{fontSize:15,fontWeight:700},children:"OngoleBulls Invest"}),e.jsx("div",{style:{fontSize:11,color:"inherit",opacity:.5,marginTop:2},children:"Finance Dashboard"})]}),e.jsx(ys,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx(Ge,{children:ke(x.fullName||x.name)}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx("div",{style:{fontSize:14,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:x.fullName||x.name||"Finance"}),e.jsx(L,{$variant:"info",style:{marginTop:3,fontSize:10},children:"Finance"})]})]})}),e.jsx(vs,{children:ws.map(({key:r,label:u,Icon:a})=>e.jsxs(we,{$active:S===r,onClick:()=>w(r),children:[e.jsx(a,{size:18})," ",u]},r))}),e.jsx(bs,{children:e.jsxs(we,{onClick:p,children:[e.jsx(Qe,{size:16})," Logout"]})})]}),e.jsxs(xs,{children:[e.jsxs(us,{children:[e.jsx("span",{style:{fontSize:18,fontWeight:600},children:Rs[S]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16},children:[e.jsx("button",{onClick:k,title:t?"Switch to Light Mode":"Switch to Dark Mode",style:{background:"none",border:`1px solid ${t?"#334155":"#e2e8f0"}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",transition:"all 0.2s ease",color:"inherit"},children:t?"☀️":"🌙"}),e.jsx(Ze,{size:18,style:{cursor:"pointer",opacity:.5}}),e.jsx("div",{style:{width:1,height:24,background:"currentColor",opacity:.15}}),e.jsx("span",{style:{fontSize:14,fontWeight:500},children:x.fullName||x.name}),e.jsx(Ss,{children:ke(x.fullName||x.name)})]})]}),e.jsxs(hs,{children:[S==="overview"&&e.jsx(Ds,{showToast:m}),S==="payouts"&&e.jsx(Es,{showToast:m}),S==="commissions"&&e.jsx(Ns,{showToast:m}),S==="reconciliation"&&e.jsx(As,{showToast:m}),S==="gst"&&e.jsx(zs,{showToast:m})]})]})]}),b&&e.jsxs(fs,{$type:b.type,children:[b.type==="success"?e.jsx(Ae,{size:16}):e.jsx(ze,{size:16}),b.message]})]})}function ye(){return e.jsxs(f,{children:[e.jsx($e,{}),e.jsx($e,{}),e.jsx($e,{})]})}function ve({message:s,onRetry:t}){return e.jsxs(f,{$borderColor:"currentColor",style:{borderColor:"var(--danger, #DC2626)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:12},children:[e.jsx(ss,{size:20}),e.jsx("span",{style:{fontWeight:600},children:"Error"})]}),e.jsx("p",{style:{marginBottom:16,fontSize:14,opacity:.7},children:s}),e.jsxs(j,{$variant:"outline",onClick:t,children:[e.jsx(ts,{size:14})," Retry"]})]})}function ce({icon:s,text:t}){return e.jsx(f,{children:e.jsxs(fe,{children:[e.jsx(s,{size:40}),e.jsx("p",{children:t})]})})}function Ds({showToast:s}){const[t,k]=o.useState(null),[x,S]=o.useState([]),[w,b]=o.useState(!0),[P,m]=o.useState(""),p=o.useCallback(async()=>{var a,z;b(!0),m("");try{const[C,F]=await Promise.all([D.getStats(),D.getPayouts()]);k(C.data),S(Array.isArray(F.data)?F.data:[])}catch(C){m(((z=(a=C==null?void 0:C.response)==null?void 0:a.data)==null?void 0:z.message)||(C==null?void 0:C.message)||"Failed to load overview")}finally{b(!1)}},[]);if(o.useEffect(()=>{p()},[p]),w)return e.jsx(ye,{});if(P)return e.jsx(ve,{message:P,onRetry:p});if(!t)return e.jsx(ce,{icon:ae,text:"No data available"});const r=x.filter(a=>a.status==="PENDING").slice(0,5),u=x.filter(a=>a.status==="RELEASED").slice(0,5);return e.jsxs(e.Fragment,{children:[e.jsxs(Ie,{children:[e.jsxs(f,{children:[e.jsx(A,{children:"Pending Payouts"}),e.jsx(T,{children:t.totalPayoutsPending})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Released Payouts"}),e.jsx(T,{children:t.totalPayoutsReleased})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Pending Amount"}),e.jsx(T,{children:h(t.pendingAmount)})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Released This Month"}),e.jsx(T,{children:h(t.releasedThisMonth)})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Active Commission Rules"}),e.jsx(T,{children:t.activeCommissionRules})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Disputed Payouts"}),e.jsx(T,{children:t.disputedPayouts})]})]}),e.jsxs(q,{children:[e.jsxs(f,{children:[e.jsx(me,{children:"Payouts Awaiting Release"}),r.length===0?e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No pending payouts"})]}):e.jsxs(J,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Period"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:r.map(a=>e.jsxs(Q,{children:[e.jsx(d,{children:a.partnerName}),e.jsx(d,{children:a.period}),e.jsx(d,{children:e.jsx(le,{children:h(a.netAmount)})}),e.jsx(d,{children:e.jsx(L,{$variant:"warning",children:"Pending"})})]},a.id))})]})]}),e.jsxs(f,{children:[e.jsx(me,{children:"Recently Released"}),u.length===0?e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No released payouts yet"})]}):e.jsxs(J,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Date"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:u.map(a=>e.jsxs(Q,{children:[e.jsx(d,{children:a.partnerName}),e.jsx(d,{children:e.jsx(le,{children:h(a.netAmount)})}),e.jsx(d,{children:pe(a.payoutDate)}),e.jsx(d,{children:e.jsx(L,{$variant:"success",children:"Released"})})]},a.id))})]})]})]})]})}function Es({showToast:s}){const[t,k]=o.useState([]),[x,S]=o.useState(!0),[w,b]=o.useState(""),[P,m]=o.useState(""),[p,r]=o.useState(""),[u,a]=o.useState(null),[z,C]=o.useState(null),[F,M]=o.useState(null),[_,X]=o.useState(""),[de,B]=o.useState(!1),[K,xe]=o.useState([]),[I,G]=o.useState(!1),[H,Z]=o.useState(0),[W,be]=o.useState(""),[ee,Se]=o.useState(""),[ue,i]=o.useState("18"),[E,$]=o.useState("10"),he=()=>{const n=parseFloat(ee)||0,R=n*(parseFloat(ue)||0)/100,y=n*(parseFloat(E)||0)/100;return n-R-y},se=o.useCallback(async()=>{var n,R;S(!0),b("");try{const y={};P&&(y.status=P),p&&(y.search=p);const V=await D.getPayouts(y);k(Array.isArray(V.data)?V.data:[])}catch(y){b(((R=(n=y==null?void 0:y.response)==null?void 0:n.data)==null?void 0:R.message)||(y==null?void 0:y.message)||"Failed to load payouts")}finally{S(!1)}},[P,p]);o.useEffect(()=>{se()},[se]);const Le=async()=>{B(!0);try{const n=await D.getPartners();xe(Array.isArray(n.data)?n.data:[])}catch{}Z(0),be(""),Se(""),i("18"),$("10")},Me=async()=>{var R,y;if(!H||!W||!ee){s("error","Fill all required fields");return}const n=K.find(V=>V.id===H);G(!0);try{await D.createPayout({partnerId:H,partnerName:(n==null?void 0:n.fullName)||"",period:W,grossAmount:parseFloat(ee),gstPercent:parseFloat(ue)||0,tdsPercent:parseFloat(E)||0}),s("success","Payout created successfully"),B(!1),se()}catch(V){s("error",((y=(R=V==null?void 0:V.response)==null?void 0:R.data)==null?void 0:y.message)||"Failed to create payout")}finally{G(!1)}},Be=async()=>{var n,R;if(z){G(!0);try{await D.releasePayout(z),s("success","Payout released"),C(null),se()}catch(y){s("error",((R=(n=y==null?void 0:y.response)==null?void 0:n.data)==null?void 0:R.message)||"Failed to release payout")}finally{G(!1)}}},We=async()=>{var n,R;if(!F||!_.trim()){s("error","Please provide a dispute reason");return}G(!0);try{await D.disputePayout(F,_.trim()),s("success","Payout disputed"),M(null),X(""),se()}catch(y){s("error",((R=(n=y==null?void 0:y.response)==null?void 0:n.data)==null?void 0:R.message)||"Failed to dispute payout")}finally{G(!1)}},Ue=["","PENDING","APPROVED","RELEASED","DISPUTED"],Oe={"":"All",PENDING:"Pending",APPROVED:"Approved",RELEASED:"Released",DISPUTED:"Disputed"};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},children:[e.jsx(js,{children:Ue.map(n=>e.jsx(gs,{$active:P===n,onClick:()=>m(n),children:Oe[n]},n))}),e.jsxs(j,{onClick:Le,children:[e.jsx(Te,{size:14})," Create Payout"]})]}),e.jsx("div",{style:{marginBottom:16},children:e.jsxs(Cs,{children:[e.jsx($s,{children:e.jsx(es,{size:16})}),e.jsx(Ps,{placeholder:"Search by partner name...",value:p,onChange:n=>r(n.target.value)})]})}),x?e.jsx(ye,{}):w?e.jsx(ve,{message:w,onRetry:se}):t.length===0?e.jsx(ce,{icon:De,text:"No payouts found"}):e.jsx(f,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(J,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Period"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"GST"}),e.jsx(c,{children:"TDS"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Date"}),e.jsx(c,{children:"Status"}),e.jsx(c,{children:"Actions"})]})}),e.jsx("tbody",{children:t.map(n=>e.jsxs(Q,{children:[e.jsx(d,{children:n.partnerName}),e.jsx(d,{children:n.period}),e.jsx(d,{children:h(n.grossAmount)}),e.jsx(d,{children:h(n.gst)}),e.jsx(d,{children:h(n.tds)}),e.jsx(d,{children:e.jsx(le,{children:h(n.netAmount)})}),e.jsx(d,{children:pe(n.payoutDate||n.createdAt)}),e.jsx(d,{children:e.jsx(L,{$variant:Pe(n.status),children:n.status})}),e.jsx(d,{children:e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsx(j,{$variant:"ghost",onClick:()=>a(n),title:"View",children:e.jsx(Xe,{size:16})}),(n.status==="PENDING"||n.status==="APPROVED")&&e.jsx(j,{$variant:"ghost",onClick:()=>C(n.id),title:"Release",style:{color:"#059669"},children:e.jsx(Ae,{size:16})}),n.status==="PENDING"&&e.jsx(j,{$variant:"ghost",onClick:()=>{M(n.id),X("")},title:"Dispute",style:{color:"#DC2626"},children:e.jsx(ze,{size:16})})]})})]},n.id))})]})})}),u&&e.jsx(te,{onClick:()=>a(null),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Payout Details"}),e.jsx(j,{$variant:"ghost",onClick:()=>a(null),children:e.jsx(Y,{size:18})})]}),e.jsxs(ie,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"Partner"}),e.jsx("div",{children:u.partnerName})]}),e.jsxs(q,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"Period"}),e.jsx("div",{children:u.period})]}),e.jsxs(v,{children:[e.jsx(g,{children:"Status"}),e.jsx(L,{$variant:Pe(u.status),children:u.status})]})]}),e.jsxs(q,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"Gross Amount"}),e.jsx("div",{children:h(u.grossAmount)})]}),e.jsxs(v,{children:[e.jsx(g,{children:"Net Amount"}),e.jsx(le,{children:h(u.netAmount)})]})]}),e.jsxs(q,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"GST"}),e.jsx("div",{children:h(u.gst)})]}),e.jsxs(v,{children:[e.jsx(g,{children:"TDS"}),e.jsx("div",{children:h(u.tds)})]})]}),u.payoutDate&&e.jsxs(v,{children:[e.jsx(g,{children:"Payout Date"}),e.jsx("div",{children:pe(u.payoutDate)})]}),u.releasedByName&&e.jsxs(v,{children:[e.jsx(g,{children:"Released By"}),e.jsx("div",{children:u.releasedByName})]}),u.disputeReason&&e.jsxs(v,{children:[e.jsx(g,{children:"Dispute Reason"}),e.jsx("div",{style:{padding:12,borderRadius:8},children:u.disputeReason})]})]}),e.jsx(oe,{children:e.jsx(j,{$variant:"outline",onClick:()=>a(null),children:"Close"})})]})}),z!==null&&e.jsx(te,{onClick:()=>C(null),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Confirm Release"}),e.jsx(j,{$variant:"ghost",onClick:()=>C(null),children:e.jsx(Y,{size:18})})]}),e.jsx(ie,{children:e.jsx("p",{children:"Are you sure you want to release this payout? This action cannot be undone."})}),e.jsxs(oe,{children:[e.jsx(j,{$variant:"outline",onClick:()=>C(null),children:"Cancel"}),e.jsx(j,{onClick:Be,disabled:I,children:I?"Releasing...":"Release Payout"})]})]})}),F!==null&&e.jsx(te,{onClick:()=>M(null),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Dispute Payout"}),e.jsx(j,{$variant:"ghost",onClick:()=>M(null),children:e.jsx(Y,{size:18})})]}),e.jsx(ie,{children:e.jsxs(v,{children:[e.jsx(g,{children:"Reason for Dispute *"}),e.jsx(ps,{placeholder:"Explain the reason for disputing this payout...",value:_,onChange:n=>X(n.target.value)})]})}),e.jsxs(oe,{children:[e.jsx(j,{$variant:"outline",onClick:()=>M(null),children:"Cancel"}),e.jsx(j,{$variant:"danger",onClick:We,disabled:I,children:I?"Submitting...":"Submit Dispute"})]})]})}),de&&e.jsx(te,{onClick:()=>B(!1),children:e.jsxs(ne,{onClick:n=>n.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Create Payout"}),e.jsx(j,{$variant:"ghost",onClick:()=>B(!1),children:e.jsx(Y,{size:18})})]}),e.jsxs(ie,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"Partner *"}),e.jsxs(ge,{value:H,onChange:n=>Z(Number(n.target.value)),children:[e.jsx("option",{value:0,children:"Select a partner"}),K.map(n=>e.jsx("option",{value:n.id,children:n.fullName},n.id))]})]}),e.jsxs(v,{children:[e.jsx(g,{children:"Period *"}),e.jsxs(ge,{value:W,onChange:n=>be(n.target.value),children:[e.jsx("option",{value:"",children:"Select period"}),je.map(n=>e.jsx("option",{value:n,children:n},n))]})]}),e.jsxs(v,{children:[e.jsx(g,{children:"Gross Amount *"}),e.jsx(O,{type:"number",placeholder:"Enter gross amount",value:ee,onChange:n=>Se(n.target.value)})]}),e.jsxs(q,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"GST %"}),e.jsx(O,{type:"number",value:ue,onChange:n=>i(n.target.value)})]}),e.jsxs(v,{children:[e.jsx(g,{children:"TDS %"}),e.jsx(O,{type:"number",value:E,onChange:n=>$(n.target.value)})]})]}),e.jsx(f,{style:{marginTop:8},children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(A,{children:"Net Payout (auto-calculated)"}),e.jsx(le,{style:{fontSize:20},children:h(he())})]})})]}),e.jsxs(oe,{children:[e.jsx(j,{$variant:"outline",onClick:()=>B(!1),children:"Cancel"}),e.jsx(j,{onClick:Me,disabled:I,children:I?"Creating...":"Create Payout"})]})]})})]})}function Ns({showToast:s}){const[t,k]=o.useState([]),[x,S]=o.useState(!0),[w,b]=o.useState(""),[P,m]=o.useState(!1),[p,r]=o.useState(null),[u,a]=o.useState(null),[z,C]=o.useState(!1),[F,M]=o.useState(""),[_,X]=o.useState(""),[de,B]=o.useState(""),[K,xe]=o.useState(""),[I,G]=o.useState(""),[H,Z]=o.useState(""),W=o.useCallback(async()=>{var i,E;S(!0),b("");try{const $=await D.getCommissionRules();k(Array.isArray($.data)?$.data:[])}catch($){b(((E=(i=$==null?void 0:$.response)==null?void 0:i.data)==null?void 0:E.message)||($==null?void 0:$.message)||"Failed to load commission rules")}finally{S(!1)}},[]);o.useEffect(()=>{W()},[W]);const be=async()=>{var E,$;if(!F||!_||!de||!K||!I){s("error","Fill all required fields");return}C(!0);const i={amcName:F,fundCategory:_,trailPercent:parseFloat(de),upfrontPercent:parseFloat(K),effectiveFrom:I,effectiveTo:H||void 0};try{p?(await D.updateCommissionRule(p.id,i),s("success","Commission rule updated")):(await D.createCommissionRule(i),s("success","Commission rule created")),m(!1),r(null),W()}catch(he){s("error",(($=(E=he==null?void 0:he.response)==null?void 0:E.data)==null?void 0:$.message)||(p?"Failed to update rule":"Failed to create rule"))}finally{C(!1)}},ee=async()=>{var i,E;if(u){C(!0);try{await D.deactivateCommissionRule(u),s("success","Rule deactivated"),a(null),W()}catch($){s("error",((E=(i=$==null?void 0:$.response)==null?void 0:i.data)==null?void 0:E.message)||"Failed to deactivate rule")}finally{C(!1)}}},Se=["Equity","Debt","Hybrid","ELSS","Liquid","Index","Sectoral","International"],ue=i=>["Equity","ELSS","Sectoral"].includes(i)?"info":["Debt","Liquid"].includes(i)?"success":["Hybrid","Index"].includes(i)?"warning":"muted";return e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:16},children:e.jsxs(j,{onClick:()=>{r(null),m(!0),M(""),X(""),B(""),xe(""),G(""),Z("")},children:[e.jsx(Te,{size:14})," Add Rule"]})}),x?e.jsx(ye,{}):w?e.jsx(ve,{message:w,onRetry:W}):t.length===0?e.jsx(ce,{icon:Ee,text:"No commission rules configured"}):e.jsx(f,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(J,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"AMC"}),e.jsx(c,{children:"Category"}),e.jsx(c,{children:"Trail %"}),e.jsx(c,{children:"Upfront %"}),e.jsx(c,{children:"Effective From"}),e.jsx(c,{children:"Effective To"}),e.jsx(c,{children:"Status"}),e.jsx(c,{children:"Actions"})]})}),e.jsx("tbody",{children:t.map(i=>e.jsxs(Q,{children:[e.jsx(d,{style:{fontWeight:500},children:i.amcName}),e.jsx(d,{children:e.jsx(L,{$variant:ue(i.fundCategory),children:i.fundCategory})}),e.jsxs(d,{children:[i.trailPercent,"%"]}),e.jsxs(d,{children:[i.upfrontPercent,"%"]}),e.jsx(d,{children:pe(i.effectiveFrom)}),e.jsx(d,{children:i.effectiveTo?pe(i.effectiveTo):"—"}),e.jsx(d,{children:e.jsx(L,{$variant:i.isActive?"success":"danger",children:i.isActive?"Active":"Inactive"})}),e.jsx(d,{children:e.jsxs("div",{style:{display:"flex",gap:4},children:[i.isActive&&e.jsx(j,{$variant:"ghost",onClick:()=>{r(i),M(i.amcName),X(i.fundCategory),B(String(i.trailPercent)),xe(String(i.upfrontPercent)),G(i.effectiveFrom),Z(i.effectiveTo||""),m(!0)},title:"Edit",children:e.jsx(is,{size:16})}),i.isActive&&e.jsx(j,{$variant:"ghost",onClick:()=>a(i.id),title:"Deactivate",style:{color:"#DC2626"},children:e.jsx(Y,{size:16})})]})})]},i.id))})]})})}),P&&e.jsx(te,{onClick:()=>{m(!1),r(null)},children:e.jsxs(ne,{onClick:i=>i.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:p?"Edit Commission Rule":"Add Commission Rule"}),e.jsx(j,{$variant:"ghost",onClick:()=>{m(!1),r(null)},children:e.jsx(Y,{size:18})})]}),e.jsxs(ie,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"AMC Name *"}),e.jsx(O,{placeholder:"e.g., HDFC Mutual Fund",value:F,onChange:i=>M(i.target.value)})]}),e.jsxs(v,{children:[e.jsx(g,{children:"Fund Category *"}),e.jsxs(ge,{value:_,onChange:i=>X(i.target.value),children:[e.jsx("option",{value:"",children:"Select category"}),Se.map(i=>e.jsx("option",{value:i,children:i},i))]})]}),e.jsxs(q,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"Trail % *"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"e.g., 0.50",value:de,onChange:i=>B(i.target.value)})]}),e.jsxs(v,{children:[e.jsx(g,{children:"Upfront % *"}),e.jsx(O,{type:"number",step:"0.01",placeholder:"e.g., 1.00",value:K,onChange:i=>xe(i.target.value)})]})]}),e.jsxs(q,{children:[e.jsxs(v,{children:[e.jsx(g,{children:"Effective From *"}),e.jsx(O,{type:"date",value:I,onChange:i=>G(i.target.value)})]}),e.jsxs(v,{children:[e.jsx(g,{children:"Effective To"}),e.jsx(O,{type:"date",value:H,onChange:i=>Z(i.target.value)})]})]})]}),e.jsxs(oe,{children:[e.jsx(j,{$variant:"outline",onClick:()=>{m(!1),r(null)},children:"Cancel"}),e.jsx(j,{onClick:be,disabled:z,children:z?p?"Updating...":"Creating...":p?"Update Rule":"Create Rule"})]})]})}),u!==null&&e.jsx(te,{onClick:()=>a(null),children:e.jsxs(ne,{onClick:i=>i.stopPropagation(),children:[e.jsxs(re,{children:[e.jsx("span",{style:{fontWeight:600,fontSize:16},children:"Confirm Deactivation"}),e.jsx(j,{$variant:"ghost",onClick:()=>a(null),children:e.jsx(Y,{size:18})})]}),e.jsx(ie,{children:e.jsx("p",{children:"Are you sure you want to deactivate this commission rule? It will no longer apply to new payouts."})}),e.jsxs(oe,{children:[e.jsx(j,{$variant:"outline",onClick:()=>a(null),children:"Cancel"}),e.jsx(j,{$variant:"danger",onClick:ee,disabled:z,children:z?"Deactivating...":"Deactivate"})]})]})})]})}function As({showToast:s}){const[t,k]=o.useState(je[0]),[x,S]=o.useState(null),[w,b]=o.useState(!0),[P,m]=o.useState(""),p=o.useCallback(async()=>{var r,u;b(!0),m("");try{const a=await D.getReconciliation({period:t});S(a.data)}catch(a){m(((u=(r=a==null?void 0:a.response)==null?void 0:r.data)==null?void 0:u.message)||(a==null?void 0:a.message)||"Failed to load reconciliation data")}finally{b(!1)}},[t]);return o.useEffect(()=>{p()},[p]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{marginBottom:16},children:[e.jsx(g,{children:"Period"}),e.jsx(ge,{style:{maxWidth:220},value:t,onChange:r=>k(r.target.value),children:je.map(r=>e.jsx("option",{value:r,children:r},r))})]}),w?e.jsx(ye,{}):P?e.jsx(ve,{message:P,onRetry:p}):x?e.jsxs(e.Fragment,{children:[e.jsxs(Ie,{children:[e.jsxs(f,{children:[e.jsx(A,{children:"Total Gross"}),e.jsx(T,{children:h(x.totalGross)})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Total GST"}),e.jsx(T,{children:h(x.totalGst)})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Total TDS"}),e.jsx(T,{children:h(x.totalTds)})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Net Released"}),e.jsx(T,{children:h(x.totalNetReleased)})]}),e.jsxs(f,{children:[e.jsx(A,{children:"Pending Release"}),e.jsx(T,{children:h(x.pendingRelease)})]})]}),e.jsx(me,{children:"Partner Breakdown"}),!x.partnerBreakdown||x.partnerBreakdown.length===0?e.jsx(ce,{icon:ae,text:"No partner breakdown data"}):e.jsx(f,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(J,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"GST"}),e.jsx(c,{children:"TDS"}),e.jsx(c,{children:"Net"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:x.partnerBreakdown.map(r=>e.jsxs(Q,{children:[e.jsx(d,{style:{fontWeight:500},children:r.partnerName}),e.jsx(d,{children:h(r.grossAmount)}),e.jsx(d,{children:h(r.gst)}),e.jsx(d,{children:h(r.tds)}),e.jsx(d,{children:e.jsx(le,{children:h(r.netAmount)})}),e.jsx(d,{children:e.jsx(L,{$variant:Pe(r.status),children:r.status})})]},r.id))})]})})})]}):e.jsx(ce,{icon:Fe,text:"No reconciliation data for this period"})]})}function zs({showToast:s}){const[t,k]=o.useState(je[0]),[x,S]=o.useState(null),[w,b]=o.useState(!0),[P,m]=o.useState(""),p=o.useCallback(async()=>{var r,u;b(!0),m("");try{const a=await D.getGstTdsSummary({period:t});S(a.data)}catch(a){m(((u=(r=a==null?void 0:a.response)==null?void 0:r.data)==null?void 0:u.message)||(a==null?void 0:a.message)||"Failed to load GST/TDS data")}finally{b(!1)}},[t]);return o.useEffect(()=>{p()},[p]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{marginBottom:16},children:[e.jsx(g,{children:"Period"}),e.jsx(ge,{style:{maxWidth:220},value:t,onChange:r=>k(r.target.value),children:je.map(r=>e.jsx("option",{value:r,children:r},r))})]}),w?e.jsx(ye,{}):P?e.jsx(ve,{message:P,onRetry:p}):x?e.jsxs(e.Fragment,{children:[e.jsxs(q,{children:[e.jsxs("div",{children:[e.jsx(me,{children:"GST Summary"}),!x.gstEntries||x.gstEntries.length===0?e.jsx(f,{children:e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No GST entries"})]})}):e.jsx(f,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(J,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"PAN"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"Rate"}),e.jsx(c,{children:"Amount"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:x.gstEntries.map((r,u)=>e.jsxs(Q,{children:[e.jsx(d,{style:{fontWeight:500},children:r.partnerName}),e.jsx(d,{children:r.pan||"—"}),e.jsx(d,{children:h(r.grossAmount)}),e.jsxs(d,{children:[r.rate,"%"]}),e.jsx(d,{children:h(r.amount)}),e.jsx(d,{children:e.jsx(L,{$variant:r.status==="FILED"?"success":"warning",children:r.status})})]},u))})]})})})]}),e.jsxs("div",{children:[e.jsx(me,{children:"TDS Summary"}),!x.tdsEntries||x.tdsEntries.length===0?e.jsx(f,{children:e.jsxs(fe,{children:[e.jsx(ae,{size:32}),e.jsx("p",{children:"No TDS entries"})]})}):e.jsx(f,{style:{padding:0,overflow:"hidden"},children:e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs(J,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(c,{children:"Partner"}),e.jsx(c,{children:"PAN"}),e.jsx(c,{children:"Gross"}),e.jsx(c,{children:"Rate"}),e.jsx(c,{children:"Amount"}),e.jsx(c,{children:"Status"})]})}),e.jsx("tbody",{children:x.tdsEntries.map((r,u)=>e.jsxs(Q,{children:[e.jsx(d,{style:{fontWeight:500},children:r.partnerName}),e.jsx(d,{children:r.pan||"—"}),e.jsx(d,{children:h(r.grossAmount)}),e.jsxs(d,{children:[r.rate,"%"]}),e.jsx(d,{children:h(r.amount)}),e.jsx(d,{children:e.jsx(L,{$variant:r.status==="DEDUCTED"?"success":"warning",children:r.status})})]},u))})]})})})]})]}),e.jsxs(ks,{children:[e.jsx(Ke,{size:18,style:{flexShrink:0,marginTop:1}}),e.jsx("span",{children:"These figures are for reference. File GST returns through your CA or GST portal."})]})]}):e.jsx(ce,{icon:Ne,text:"No GST/TDS data for this period"})]})}export{Hs as default};
