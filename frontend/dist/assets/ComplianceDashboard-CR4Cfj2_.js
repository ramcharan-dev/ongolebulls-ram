import{c as ts,b as S,G as Is,u as Ds,r,j as e,Q as Ms,S as _e,z as n}from"./index-DpzyeW7E.js";import{d as Ps,l as Bs}from"./theme-CVoCgdjI.js";import{C as w}from"./check-BUvOLu9e.js";import{C as Ge}from"./circle-alert-BFOOwxKR.js";import{a as Us,L as _s}from"./log-out-DQ4FEgyy.js";import{S as Gs,M as Vs}from"./sun-BYs6kdqX.js";import{X as k}from"./x-CUlFmB3t.js";import{F as Ve}from"./file-check-Bi_5S7fw.js";import{S as Ys}from"./search-BmsQ4217.js";import{R as re}from"./refresh-cw-BfTJLgr5.js";import{P as Ws}from"./plus-wuHG5ZGg.js";import{I as Hs}from"./inbox-CChkUiij.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xs=[["path",{d:"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",key:"1jaruq"}]],ne=ts("flag",Xs);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qs=[["path",{d:"M15 12h-5",key:"r7krc0"}],["path",{d:"M15 8h-5",key:"1khuty"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]],Ye=ts("scroll-text",qs),m={getStats:()=>S.get("/api/compliance/stats"),getAuditLogs:s=>S.get("/api/compliance/audit-logs",{params:s}),getFlags:s=>S.get("/api/compliance/flags",{params:s}),raiseFlag:s=>S.post("/api/compliance/flags",s),resolveFlag:(s,o)=>S.patch(`/api/compliance/flags/${s}/resolve`,{notes:o}),getRiskSummary:()=>S.get("/api/compliance/partners/risk-summary"),getDisclosures:()=>S.get("/api/compliance/disclosures")},J=s=>{if(!s)return"—";try{return new Date(s).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}catch{return"—"}},oe=s=>{if(!s)return"—";try{return new Date(s).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return"—"}},Ks=n.div`
  display: flex;
  min-height: 100vh;
  background: ${({theme:s})=>s.colors.background};
  font-family: ${({theme:s})=>s.typography.fontFamily};
`,Qs=n.aside`
  width: 240px;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: ${({theme:s})=>s.colors.sidebar};
  border-right: 1px solid ${({theme:s})=>s.colors.border};
  display: flex;
  flex-direction: column;
  z-index: 20;
  box-shadow: ${({theme:s})=>s.shadows.md};
`,Js=n.div`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
  font-size: 15px;
  font-weight: 700;
  color: ${({theme:s})=>s.colors.text};
  letter-spacing: -0.3px;
`,Zs=n.nav`
  flex: 1;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
`,We=n.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 16px);
  height: 44px;
  padding: 0 16px;
  margin: 2px 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  font-weight: ${({$active:s})=>s?600:400};
  color: ${({$active:s,theme:o})=>s?o.colors.secondary:o.colors.textMuted};
  background: ${({$active:s,theme:o})=>s?o.colors.muted:"transparent"};
  border-left: ${({$active:s,theme:o})=>s?`3px solid ${o.colors.secondary}`:"3px solid transparent"};
  transition: all 0.2s ease;
  &:hover {
    background: ${({theme:s})=>s.colors.muted};
    color: ${({theme:s})=>s.colors.text};
  }
`,et=n.div`
  flex: 1;
`,st=n.main`
  margin-left: 240px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({theme:s})=>s.colors.background};
`,tt=n.header`
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({theme:s})=>s.colors.header};
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: ${({theme:s})=>s.shadows.sm};
`,it=n.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${({theme:s})=>s.colors.text};
  margin: 0;
`,rt=n.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,nt=n.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({theme:s})=>s.colors.border};
  background: ${({theme:s})=>s.colors.surface};
  color: ${({theme:s})=>s.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    background: ${({theme:s})=>s.colors.muted};
    color: ${({theme:s})=>s.colors.text};
  }
`,ot=n.div`
  padding: 24px;
`,h=n.div`
  background: ${({theme:s})=>s.colors.surface};
  border: 1px solid
    ${({$borderColor:s,theme:o})=>s||o.colors.border};
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: ${({theme:s})=>s.shadows.sm};
`,He=n.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`,D=n.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({theme:s})=>s.colors.text};
  margin-top: 8px;
`,M=n.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({theme:s})=>s.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,P=n.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({$color:s})=>s}20;
  color: ${({$color:s})=>s};
`,F=n.table`
  width: 100%;
  border-collapse: collapse;
`,a=n.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({theme:s})=>s.colors.textMuted};
  background: ${({theme:s})=>s.colors.muted};
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,l=n.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({theme:s})=>s.colors.text};
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,N=n.tr`
  &:hover {
    background: ${({theme:s})=>s.colors.muted};
  }
`,p=n.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${({$variant:s,theme:o})=>s==="success"?o.colors.successLight:s==="danger"?o.colors.dangerLight:s==="warning"?o.colors.warningLight:o.colors.muted};
  color: ${({$variant:s,theme:o})=>s==="success"?o.colors.success:s==="danger"?o.colors.danger:s==="warning"?o.colors.warning:o.colors.textMuted};
`,g=n.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  background: ${({$variant:s,theme:o})=>s==="primary"?o.colors.secondary:s==="danger"?o.colors.danger:"transparent"};
  color: ${({$variant:s,theme:o})=>s==="primary"||s==="danger"?"#fff":o.colors.text};
  border: ${({$variant:s,theme:o})=>s?"none":`1px solid ${o.colors.border}`};
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Xe=n.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`,qe=n.div`
  background: ${({theme:s})=>s.colors.surface};
  border-radius: 16px;
  box-shadow: ${({theme:s})=>s.shadows.lg};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
`,Ke=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({theme:s})=>s.colors.border};
`,Qe=n.div`
  padding: 24px;
`,Je=n.div`
  padding: 16px 24px;
  border-top: 1px solid ${({theme:s})=>s.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`,y=n.input`
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
  &:focus {
    border-color: ${({theme:s})=>s.colors.secondary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`,ae=n.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${({theme:s})=>s.colors.text};
  background: ${({theme:s})=>s.colors.surface};
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  &:focus {
    border-color: ${({theme:s})=>s.colors.secondary};
    outline: none;
  }
`,le=n.select`
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
`,u=n.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({theme:s})=>s.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`,at=n.div`
  text-align: center;
  padding: 48px 24px;
  color: ${({theme:s})=>s.colors.textMuted};
`,Z=n.div`
  height: 48px;
  background: ${({theme:s})=>s.colors.muted};
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`,lt=n.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,ct=n.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
`,Ze=n.button`
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  background: ${({$active:s,theme:o})=>s?o.colors.secondary:o.colors.muted};
  color: ${({$active:s})=>s?"#fff":"inherit"};
  &:hover {
    background: ${({$active:s,theme:o})=>s?o.colors.secondary:o.colors.border};
  }
`,B=n.span`
  color: ${({$ok:s,theme:o})=>s?o.colors.success:o.colors.danger};
  display: inline-flex;
  align-items: center;
`,dt=n.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${({theme:s})=>s.shadows.lg};
  background: ${({$type:s,theme:o})=>s==="success"?o.colors.success:o.colors.danger};
  color: #fff;
  animation: slideIn 0.3s ease;
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`,es=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  align-items: center;
`,xt=n.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
`,ht=n.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({theme:s})=>s.colors.textMuted};
  pointer-events: none;
  display: flex;
  align-items: center;
`,pt=n(y)`
  padding-left: 38px;
`,gt=n(le)`
  width: auto;
  min-width: 160px;
`,j=n.div`
  margin-bottom: 16px;
`,ss=n.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({theme:s})=>s.colors.text};
  margin: 0 0 16px 0;
`,ut=n.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`,R=n.div`
  overflow-x: auto;
`;function At(){const{isDark:s,toggleTheme:o}=Is(),ee=Ds(),[d,is]=r.useState("overview"),[U,ce]=r.useState(null),_=r.useCallback((t,c="success")=>{ce({msg:t,type:c}),setTimeout(()=>ce(null),3500)},[]),[$,rs]=r.useState(null),[ns,de]=r.useState(!0),[xe,he]=r.useState(""),[pe,os]=r.useState([]),[as,ge]=r.useState(!0),[ue,je]=r.useState(""),[me,ls]=r.useState([]),[cs,ye]=r.useState(!0),[fe,ve]=r.useState(""),[be,ds]=r.useState([]),[xs,Se]=r.useState(!1),[we,ke]=r.useState(""),[G,hs]=r.useState(""),[V,ps]=r.useState(""),[Y,gs]=r.useState(""),[W,us]=r.useState(""),[$e,js]=r.useState([]),[ms,Ce]=r.useState(!1),[Te,Ae]=r.useState(""),[H,ys]=r.useState("OPEN"),[fs,C]=r.useState(!1),[x,f]=r.useState({entityType:"PARTNER",entityId:"",entityName:"",flagType:"MISSING_DOCUMENT",reason:""}),[Ee,Fe]=r.useState(!1),[v,T]=r.useState(null),[X,q]=r.useState(""),[Ne,Re]=r.useState(!1),[ze,vs]=r.useState([]),[bs,Le]=r.useState(!1),[Oe,Ie]=r.useState(""),[De,Ss]=r.useState([]),[ws,Me]=r.useState(!1),[Pe,Be]=r.useState(""),[z,ks]=r.useState(!1);r.useEffect(()=>{JSON.parse(localStorage.getItem("ob_user")||"{}").role!=="COMPLIANCE"&&ee("/login")},[ee]);const L=r.useCallback(async()=>{var t,c;de(!0),he("");try{const i=await m.getStats();rs(i.data)}catch(i){he(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to load stats")}finally{de(!1)}},[]),O=r.useCallback(async()=>{var t,c;ge(!0),je("");try{const i=await m.getFlags({status:"OPEN"});os(i.data.slice(0,5))}catch(i){je(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to load flags")}finally{ge(!1)}},[]),se=r.useCallback(async()=>{var t,c;ye(!0),ve("");try{const i=await m.getAuditLogs();ls(i.data.slice(0,10))}catch(i){ve(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to load audit logs")}finally{ye(!1)}},[]),K=r.useCallback(async()=>{var t,c;Se(!0),ke("");try{const i={};G&&(i.entityType=G),V&&(i.search=V),Y&&(i.from=Y),W&&(i.to=W);const ie=await m.getAuditLogs(i);ds(ie.data)}catch(i){ke(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to load audit logs")}finally{Se(!1)}},[G,V,Y,W]),I=r.useCallback(async()=>{var t,c;Ce(!0),Ae("");try{const i={};H!=="ALL"&&(i.status=H);const ie=await m.getFlags(i);js(ie.data)}catch(i){Ae(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to load flags")}finally{Ce(!1)}},[H]),te=r.useCallback(async()=>{var t,c;Le(!0),Ie("");try{const i=await m.getRiskSummary();vs(i.data)}catch(i){Ie(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to load risk summary")}finally{Le(!1)}},[]),Q=r.useCallback(async()=>{var t,c;Me(!0),Be("");try{const i=await m.getDisclosures();Ss(i.data)}catch(i){Be(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to load disclosures")}finally{Me(!1)}},[]);r.useEffect(()=>{d==="overview"&&(L(),O(),se())},[d,L,O,se]),r.useEffect(()=>{d==="audit"&&K()},[d,K]),r.useEffect(()=>{d==="flags"&&I()},[d,I]),r.useEffect(()=>{d==="risk"&&te()},[d,te]),r.useEffect(()=>{d==="disclosures"&&Q()},[d,Q]);const $s=async()=>{var t,c;if(!(!x.entityId||!x.entityName.trim()||!x.reason.trim())){Fe(!0);try{await m.raiseFlag({entityType:x.entityType,entityId:Number(x.entityId),entityName:x.entityName,flagType:x.flagType,reason:x.reason}),_("Flag raised successfully"),C(!1),f({entityType:"PARTNER",entityId:"",entityName:"",flagType:"MISSING_DOCUMENT",reason:""}),d==="flags"&&I(),d==="overview"&&(L(),O())}catch(i){_(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to raise flag","error")}finally{Fe(!1)}}},Cs=async()=>{var t,c;if(!(!v||!X.trim())){Re(!0);try{await m.resolveFlag(v.id,X),_("Flag resolved successfully"),T(null),q(""),d==="flags"&&I(),d==="overview"&&(L(),O())}catch(i){_(((c=(t=i==null?void 0:i.response)==null?void 0:t.data)==null?void 0:c.message)||"Failed to resolve flag","error")}finally{Re(!1)}}},Ts=t=>{f({entityType:"PARTNER",entityId:String(t.id),entityName:t.fullName||t.firmName||t.email,flagType:"MISSING_DOCUMENT",reason:""}),C(!0)},As=()=>{localStorage.removeItem("ob_user"),ee("/login")},Es=[{key:"overview",icon:e.jsx(_s,{size:18}),label:"Overview"},{key:"audit",icon:e.jsx(Ye,{size:18}),label:"Audit Logs"},{key:"flags",icon:e.jsx(ne,{size:18}),label:"Compliance Flags"},{key:"risk",icon:e.jsx(_e,{size:18}),label:"Partner Risk"},{key:"disclosures",icon:e.jsx(Ve,{size:18}),label:"Disclosures"}],Fs={overview:"Compliance Overview",audit:"Audit Logs",flags:"Compliance Flags",risk:"Partner Risk Assessment",disclosures:"Disclosures & Consents"},A=()=>e.jsxs(lt,{children:[e.jsx(Z,{}),e.jsx(Z,{}),e.jsx(Z,{})]}),b=({message:t,onRetry:c})=>e.jsxs(h,{$borderColor:"#DC2626",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:12},children:[e.jsx(Ge,{size:18,color:"#DC2626"}),e.jsx("span",{style:{color:"#DC2626",fontWeight:600,fontSize:14},children:t})]}),e.jsxs(g,{onClick:c,children:[e.jsx(re,{size:14})," Retry"]})]}),E=({message:t})=>e.jsxs(at,{children:[e.jsx(Hs,{size:40,style:{marginBottom:12,opacity:.5}}),e.jsx("div",{style:{fontSize:15,fontWeight:500},children:t})]}),Ue=z?De.filter(t=>!t.termsAccepted||!t.declarationAccepted||!t.consentComm||!t.consentShareAmc||!t.consentShareDocs):De,Ns=()=>e.jsxs(e.Fragment,{children:[ns?e.jsx(He,{children:[1,2,3,4,5].map(t=>e.jsx(Z,{style:{height:100}},t))}):xe?e.jsx(b,{message:xe,onRetry:L}):$?e.jsxs(He,{children:[e.jsxs(h,{children:[e.jsx(P,{$color:"#DC2626",children:e.jsx(ne,{size:20})}),e.jsx(D,{children:$.openFlags}),e.jsx(M,{children:"Open Flags"})]}),e.jsxs(h,{children:[e.jsx(P,{$color:"#059669",children:e.jsx(w,{size:20})}),e.jsx(D,{children:$.resolvedToday}),e.jsx(M,{children:"Resolved Today"})]}),e.jsxs(h,{children:[e.jsx(P,{$color:"#D97706",children:e.jsx(_e,{size:20})}),e.jsx(D,{children:$.partnersUnderReview}),e.jsx(M,{children:"Partners Under Review"})]}),e.jsxs(h,{children:[e.jsx(P,{$color:"#2563EB",children:e.jsx(Ve,{size:20})}),e.jsx(D,{children:$.pendingApprovals}),e.jsx(M,{children:"Pending Approvals"})]}),e.jsxs(h,{children:[e.jsx(P,{$color:"#64748B",children:e.jsx(Ye,{size:20})}),e.jsx(D,{children:$.totalAuditLogsToday}),e.jsx(M,{children:"Audit Logs Today"})]})]}):null,e.jsxs(ut,{children:[e.jsxs("div",{children:[e.jsx(ss,{children:"Open Compliance Flags"}),as?e.jsx(A,{}):ue?e.jsx(b,{message:ue,onRetry:O}):pe.length===0?e.jsx(h,{children:e.jsx(E,{message:"No open compliance flags"})}):e.jsx(h,{style:{padding:0,overflow:"hidden"},children:e.jsx(R,{children:e.jsxs(F,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(a,{children:"Entity"}),e.jsx(a,{children:"Type"}),e.jsx(a,{children:"Flagged"}),e.jsx(a,{children:"Action"})]})}),e.jsx("tbody",{children:pe.map(t=>e.jsxs(N,{children:[e.jsx(l,{children:t.entityName}),e.jsx(l,{children:e.jsx(p,{$variant:"warning",children:t.flagType})}),e.jsx(l,{children:J(t.flaggedAt)}),e.jsx(l,{children:e.jsx(g,{onClick:()=>{T(t),q("")},children:"Resolve"})})]},t.id))})]})})})]}),e.jsxs("div",{children:[e.jsx(ss,{children:"Recent Audit Activity"}),cs?e.jsx(A,{}):fe?e.jsx(b,{message:fe,onRetry:se}):me.length===0?e.jsx(h,{children:e.jsx(E,{message:"No recent audit activity"})}):e.jsx(h,{style:{padding:0,overflow:"hidden"},children:e.jsx(R,{children:e.jsxs(F,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(a,{children:"Timestamp"}),e.jsx(a,{children:"Action"}),e.jsx(a,{children:"By"})]})}),e.jsx("tbody",{children:me.map(t=>e.jsxs(N,{children:[e.jsx(l,{children:oe(t.performedAt)}),e.jsx(l,{children:t.action}),e.jsx(l,{children:t.performedByName})]},t.id))})]})})})]})]})]}),Rs=()=>e.jsxs(e.Fragment,{children:[e.jsxs(es,{children:[e.jsxs(gt,{value:G,onChange:t=>hs(t.target.value),children:[e.jsx("option",{value:"",children:"All Entity Types"}),e.jsx("option",{value:"PARTNER",children:"Partner"}),e.jsx("option",{value:"CLIENT",children:"Client"}),e.jsx("option",{value:"USER",children:"User"}),e.jsx("option",{value:"FLAG",children:"Flag"}),e.jsx("option",{value:"PAYOUT",children:"Payout"})]}),e.jsxs(xt,{children:[e.jsx(ht,{children:e.jsx(Ys,{size:16})}),e.jsx(pt,{placeholder:"Search audit logs...",value:V,onChange:t=>ps(t.target.value)})]}),e.jsx(y,{type:"date",value:Y,onChange:t=>gs(t.target.value),style:{width:160}}),e.jsx(y,{type:"date",value:W,onChange:t=>us(t.target.value),style:{width:160}}),e.jsxs(g,{onClick:K,children:[e.jsx(re,{size:14})," Refresh"]})]}),xs?e.jsx(A,{}):we?e.jsx(b,{message:we,onRetry:K}):be.length===0?e.jsx(h,{children:e.jsx(E,{message:"No audit logs found"})}):e.jsx(h,{style:{padding:0,overflow:"hidden"},children:e.jsx(R,{children:e.jsxs(F,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(a,{children:"Timestamp"}),e.jsx(a,{children:"Action"}),e.jsx(a,{children:"Entity Type"}),e.jsx(a,{children:"Entity Name"}),e.jsx(a,{children:"Performed By"}),e.jsx(a,{children:"Old Value"}),e.jsx(a,{children:"New Value"})]})}),e.jsx("tbody",{children:be.map(t=>e.jsxs(N,{children:[e.jsx(l,{style:{whiteSpace:"nowrap"},children:oe(t.performedAt)}),e.jsx(l,{children:t.action}),e.jsx(l,{children:e.jsx(p,{$variant:"default",children:t.entityType})}),e.jsx(l,{children:t.notes||`#${t.entityId}`}),e.jsx(l,{children:t.performedByName}),e.jsx(l,{style:{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis"},children:t.oldValue||"—"}),e.jsx(l,{style:{maxWidth:150,overflow:"hidden",textOverflow:"ellipsis"},children:t.newValue||"—"})]},t.id))})]})})})]}),zs=()=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},children:[e.jsx(ct,{children:["OPEN","RESOLVED","ALL"].map(t=>e.jsx(Ze,{$active:H===t,onClick:()=>ys(t),children:t==="OPEN"?"Open":t==="RESOLVED"?"Resolved":"All"},t))}),e.jsxs(g,{$variant:"primary",onClick:()=>{f({entityType:"PARTNER",entityId:"",entityName:"",flagType:"MISSING_DOCUMENT",reason:""}),C(!0)},children:[e.jsx(Ws,{size:16})," Raise Flag"]})]}),ms?e.jsx(A,{}):Te?e.jsx(b,{message:Te,onRetry:I}):$e.length===0?e.jsx(h,{children:e.jsx(E,{message:"No compliance flags found"})}):e.jsx(h,{style:{padding:0,overflow:"hidden"},children:e.jsx(R,{children:e.jsxs(F,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(a,{children:"Entity"}),e.jsx(a,{children:"Entity Type"}),e.jsx(a,{children:"Flag Type"}),e.jsx(a,{children:"Reason"}),e.jsx(a,{children:"Flagged By"}),e.jsx(a,{children:"Flagged At"}),e.jsx(a,{children:"Status"}),e.jsx(a,{children:"Action"})]})}),e.jsx("tbody",{children:$e.map(t=>e.jsxs(N,{children:[e.jsx(l,{children:t.entityName}),e.jsx(l,{children:e.jsx(p,{$variant:"default",children:t.entityType})}),e.jsx(l,{children:e.jsx(p,{$variant:"warning",children:t.flagType})}),e.jsx(l,{style:{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis"},children:t.reason}),e.jsx(l,{children:t.flaggedByName}),e.jsx(l,{style:{whiteSpace:"nowrap"},children:J(t.flaggedAt)}),e.jsx(l,{children:e.jsx(p,{$variant:t.status==="OPEN"?"danger":t.status==="RESOLVED"?"success":"default",children:t.status})}),e.jsx(l,{children:t.status==="OPEN"?e.jsx(g,{onClick:()=>{T(t),q("")},children:"Resolve"}):e.jsx("span",{style:{fontSize:12,opacity:.6},children:t.resolvedByName?`by ${t.resolvedByName}`:"—"})})]},t.id))})]})})})]}),Ls=()=>e.jsx(e.Fragment,{children:bs?e.jsx(A,{}):Oe?e.jsx(b,{message:Oe,onRetry:te}):ze.length===0?e.jsx(h,{children:e.jsx(E,{message:"No partner risk data available"})}):e.jsx(h,{style:{padding:0,overflow:"hidden"},children:e.jsx(R,{children:e.jsxs(F,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(a,{children:"Partner"}),e.jsx(a,{children:"Type"}),e.jsx(a,{children:"Status"}),e.jsx(a,{children:"Missing ARN"}),e.jsx(a,{children:"Missing EUIN"}),e.jsx(a,{children:"Missing Bank"}),e.jsx(a,{children:"Open Flags"}),e.jsx(a,{children:"Registered"}),e.jsx(a,{children:"Action"})]})}),e.jsx("tbody",{children:ze.map(t=>e.jsxs(N,{children:[e.jsx(l,{children:t.fullName||t.firmName||t.email}),e.jsx(l,{children:e.jsx(p,{$variant:"default",children:t.partnerType})}),e.jsx(l,{children:e.jsx(p,{$variant:t.isActivated?"success":"warning",children:t.isActivated?"Active":"Pending"})}),e.jsx(l,{children:e.jsx(p,{$variant:t.missingArn?"danger":"success",children:t.missingArn?"Yes":"No"})}),e.jsx(l,{children:e.jsx(p,{$variant:t.missingEuin?"danger":"success",children:t.missingEuin?"Yes":"No"})}),e.jsx(l,{children:e.jsx(p,{$variant:t.missingBankDetails?"danger":"success",children:t.missingBankDetails?"Yes":"No"})}),e.jsx(l,{children:t.openFlagsCount>0?e.jsx(p,{$variant:"danger",children:t.openFlagsCount}):e.jsx(p,{$variant:"success",children:"0"})}),e.jsx(l,{style:{whiteSpace:"nowrap"},children:J(t.createdAt)}),e.jsx(l,{children:e.jsxs(g,{onClick:()=>Ts(t),children:[e.jsx(ne,{size:14})," Flag"]})})]},t.id))})]})})})}),Os=()=>e.jsxs(e.Fragment,{children:[e.jsxs(es,{children:[e.jsx(Ze,{$active:z,onClick:()=>ks(!z),children:z?"Showing Missing Only":"Show Only Missing Consents"}),e.jsxs(g,{onClick:Q,children:[e.jsx(re,{size:14})," Refresh"]})]}),ws?e.jsx(A,{}):Pe?e.jsx(b,{message:Pe,onRetry:Q}):Ue.length===0?e.jsx(h,{children:e.jsx(E,{message:z?"All partners have complete consents":"No disclosure data available"})}):e.jsx(h,{style:{padding:0,overflow:"hidden"},children:e.jsx(R,{children:e.jsxs(F,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(a,{children:"Partner"}),e.jsx(a,{children:"Type"}),e.jsx(a,{children:"Terms"}),e.jsx(a,{children:"Declaration"}),e.jsx(a,{children:"Comm. Consent"}),e.jsx(a,{children:"AMC Sharing"}),e.jsx(a,{children:"Doc Sharing"}),e.jsx(a,{children:"Registered"})]})}),e.jsx("tbody",{children:Ue.map(t=>e.jsxs(N,{children:[e.jsx(l,{children:t.fullName||t.email}),e.jsx(l,{children:e.jsx(p,{$variant:"default",children:t.partnerType})}),e.jsx(l,{children:e.jsx(B,{$ok:t.termsAccepted,children:t.termsAccepted?e.jsx(w,{size:16}):e.jsx(k,{size:16})})}),e.jsx(l,{children:e.jsx(B,{$ok:t.declarationAccepted,children:t.declarationAccepted?e.jsx(w,{size:16}):e.jsx(k,{size:16})})}),e.jsx(l,{children:e.jsx(B,{$ok:t.consentComm,children:t.consentComm?e.jsx(w,{size:16}):e.jsx(k,{size:16})})}),e.jsx(l,{children:e.jsx(B,{$ok:t.consentShareAmc,children:t.consentShareAmc?e.jsx(w,{size:16}):e.jsx(k,{size:16})})}),e.jsx(l,{children:e.jsx(B,{$ok:t.consentShareDocs,children:t.consentShareDocs?e.jsx(w,{size:16}):e.jsx(k,{size:16})})}),e.jsx(l,{style:{whiteSpace:"nowrap"},children:J(t.createdAt)})]},t.id))})]})})})]});return e.jsx(Ms,{theme:s?Ps:Bs,children:e.jsxs(Ks,{children:[U&&e.jsxs(dt,{$type:U.type,children:[U.type==="success"?e.jsx(w,{size:16}):e.jsx(Ge,{size:16}),U.msg]}),e.jsxs(Qs,{children:[e.jsx(Js,{children:"OngoleBulls Compliance"}),e.jsxs(Zs,{children:[Es.map(t=>e.jsxs(We,{$active:d===t.key,onClick:()=>is(t.key),children:[t.icon,t.label]},t.key)),e.jsx(et,{}),e.jsxs(We,{onClick:As,children:[e.jsx(Us,{size:18}),"Log Out"]})]})]}),e.jsxs(st,{children:[e.jsxs(tt,{children:[e.jsx(it,{children:Fs[d]}),e.jsx(rt,{children:e.jsx(nt,{onClick:o,children:s?e.jsx(Gs,{size:18}):e.jsx(Vs,{size:18})})})]}),e.jsxs(ot,{children:[d==="overview"&&Ns(),d==="audit"&&Rs(),d==="flags"&&zs(),d==="risk"&&Ls(),d==="disclosures"&&Os()]})]}),fs&&e.jsx(Xe,{onClick:()=>C(!1),children:e.jsxs(qe,{onClick:t=>t.stopPropagation(),children:[e.jsxs(Ke,{children:[e.jsx("span",{style:{fontSize:16,fontWeight:700,color:"inherit"},children:"Raise Compliance Flag"}),e.jsx(g,{onClick:()=>C(!1),children:e.jsx(k,{size:18})})]}),e.jsxs(Qe,{children:[e.jsxs(j,{children:[e.jsx(u,{children:"Entity Type"}),e.jsxs(le,{value:x.entityType,onChange:t=>f({...x,entityType:t.target.value}),children:[e.jsx("option",{value:"PARTNER",children:"Partner"}),e.jsx("option",{value:"CLIENT",children:"Client"}),e.jsx("option",{value:"USER",children:"User"})]})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Entity ID"}),e.jsx(y,{type:"number",placeholder:"Enter entity ID",value:x.entityId,onChange:t=>f({...x,entityId:t.target.value})})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Entity Name"}),e.jsx(y,{placeholder:"Enter entity name",value:x.entityName,onChange:t=>f({...x,entityName:t.target.value})})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Flag Type"}),e.jsxs(le,{value:x.flagType,onChange:t=>f({...x,flagType:t.target.value}),children:[e.jsx("option",{value:"MISSING_DOCUMENT",children:"Missing Document"}),e.jsx("option",{value:"KYC_ISSUE",children:"KYC Issue"}),e.jsx("option",{value:"REGULATORY_BREACH",children:"Regulatory Breach"}),e.jsx("option",{value:"DATA_DISCREPANCY",children:"Data Discrepancy"}),e.jsx("option",{value:"SUSPICIOUS_ACTIVITY",children:"Suspicious Activity"}),e.jsx("option",{value:"OTHER",children:"Other"})]})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Reason"}),e.jsx(ae,{placeholder:"Describe the compliance concern...",value:x.reason,onChange:t=>f({...x,reason:t.target.value})})]})]}),e.jsxs(Je,{children:[e.jsx(g,{onClick:()=>C(!1),children:"Cancel"}),e.jsx(g,{$variant:"primary",onClick:$s,disabled:Ee||!x.entityId||!x.entityName.trim()||!x.reason.trim(),children:Ee?"Submitting...":"Raise Flag"})]})]})}),v&&e.jsx(Xe,{onClick:()=>T(null),children:e.jsxs(qe,{onClick:t=>t.stopPropagation(),children:[e.jsxs(Ke,{children:[e.jsx("span",{style:{fontSize:16,fontWeight:700,color:"inherit"},children:"Resolve Flag"}),e.jsx(g,{onClick:()=>T(null),children:e.jsx(k,{size:18})})]}),e.jsxs(Qe,{children:[e.jsxs(j,{children:[e.jsx(u,{children:"Entity"}),e.jsx(y,{value:v.entityName,readOnly:!0})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Flag Type"}),e.jsx(y,{value:v.flagType,readOnly:!0})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Reason"}),e.jsx(ae,{value:v.reason,readOnly:!0})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Flagged By"}),e.jsx(y,{value:v.flaggedByName,readOnly:!0})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Flagged At"}),e.jsx(y,{value:oe(v.flaggedAt),readOnly:!0})]}),e.jsxs(j,{children:[e.jsx(u,{children:"Resolution Notes *"}),e.jsx(ae,{placeholder:"Describe how this was resolved...",value:X,onChange:t=>q(t.target.value)})]})]}),e.jsxs(Je,{children:[e.jsx(g,{onClick:()=>T(null),children:"Cancel"}),e.jsx(g,{$variant:"primary",onClick:Cs,disabled:Ne||!X.trim(),children:Ne?"Resolving...":"Mark Resolved"})]})]})})]})})}export{At as default};
