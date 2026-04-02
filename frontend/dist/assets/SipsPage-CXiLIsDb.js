import{c as u,u as J,r as l,j as t,a1 as Z,T as ee,z as r,_ as B}from"./index-DAvtno57.js";import{u as te}from"./useAuth-smb9K3pw.js";import{g as oe}from"./userApi-DyIpi_LT.js";import{P as L}from"./piggy-bank-DQGHnOpS.js";import{P as T}from"./plus-C2aRT0nA.js";import{S as re}from"./search-Cg3Y7j9N.js";import{F as ne}from"./funnel-_RNxNzvz.js";import{C as se}from"./chevron-down-Cn2xIzlV.js";import{P as ie}from"./pencil-DpXJjvgN.js";import{C as ae}from"./circle-x-C32ADc5t.js";import"./authApi-ChAtNEXa.js";import"./adminApi-Bv0LjEEU.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=[["path",{d:"M16 14v2.2l1.6 1",key:"fo4ql5"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",key:"1osxxc"}],["path",{d:"M3 10h5",key:"r794hk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["circle",{cx:"16",cy:"16",r:"6",key:"qoo3c4"}]],_=u("calendar-clock",ce);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]],de=u("ellipsis-vertical",le);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],pe=u("pause",xe);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],he=u("play",ue);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["path",{d:"M21 4v16",key:"7j8fe9"}],["path",{d:"M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",key:"zs4d6"}]],me=u("skip-forward",ge),A=B`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`,fe=B`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`,be=B`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`,P=r.div`
  animation: ${A} 0.4s ease-out;
`,D=r.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`,N=r.div``,V=r.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
`,q=r.p`
  font-size: 14px;
  color: ${({theme:e})=>e.colors.textMuted};
  margin: 0;
`,ye=r.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  background-color: ${({theme:e})=>e.colors.secondary};
  color: #FFF;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);

  &:hover {
    background-color: #1D4ED8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  &:active { transform: translateY(0); }
`,K=r.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 32px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`,f=r.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: ${({theme:e})=>e.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({theme:e})=>e.shadows.md};
    border-color: ${({$accentColor:e})=>e?`${e}40`:"inherit"};
  }
`,b=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,y=r.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({theme:e})=>e.colors.textMuted};
`,j=r.div`
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({$bg:e})=>e};
  color: ${({$color:e})=>e};
`,w=r.div`
  font-size: 26px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  letter-spacing: -0.5px;
`,$=r.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({theme:e})=>e.colors.textMuted};
`,je=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`,we=r.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,$e=r.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.secondary};
  background-color: ${({theme:e})=>`${e.colors.secondary}12`};
  padding: 3px 10px;
  border-radius: 20px;
`,ve=r.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,ke=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({theme:e})=>e.colors.background};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 8px;
  padding: 8px 14px;
  width: 220px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({theme:e})=>e.colors.secondary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.12);
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    color: ${({theme:e})=>e.colors.text};
    font-size: 13px;
    width: 100%;
    &::placeholder { color: ${({theme:e})=>e.colors.textMuted}; }
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`,Se=r.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.colors.surface};
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({theme:e})=>e.colors.secondary};
    color: ${({theme:e})=>e.colors.text};
  }
`,Ie=r.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`,Ce=r.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
  animation: ${A} 0.3s ease-out;
  animation-delay: ${({$index:e})=>e*.05}s;
  animation-fill-mode: backwards;

  &:hover {
    border-color: ${({theme:e})=>`${e.colors.secondary}40`};
    box-shadow: ${({theme:e})=>e.shadows.md};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`,ze=r.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: #FFF;
  background: ${({$gradient:e})=>e};

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 16px;
  }
`,Me=r.div`
  flex: 1;
  min-width: 0;
`,Fe=r.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    white-space: normal;
    font-size: 14px;
  }
`,Pe=r.div`
  font-size: 12px;
  color: ${({theme:e})=>e.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`,O=r.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.colors.textMuted};
`,De=r.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  min-width: 110px;

  @media (max-width: 768px) {
    align-items: flex-start;
    min-width: auto;
  }
`,Ne=r.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,Be=r.div`
  font-size: 12px;
  color: ${({theme:e})=>e.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 4px;
`,Ae=r.span`
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background-color: ${({$active:e,theme:n})=>e?n.colors.successLight:n.colors.warningLight};
  color: ${({$active:e,theme:n})=>e?n.colors.success:n.colors.warning};
`,Ee=r.div`
  position: relative;
  margin-left: 8px;
`,Le=r.button`
  background: none;
  border: none;
  color: ${({theme:e})=>e.colors.textMuted};
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
    color: ${({theme:e})=>e.colors.text};
  }
`,Te=r.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 10px;
  box-shadow: ${({theme:e})=>e.shadows.lg};
  width: 180px;
  display: ${({$isOpen:e})=>e?"flex":"none"};
  flex-direction: column;
  overflow: hidden;
  z-index: 60;
  animation: ${be} 0.12s ease-out;
`,v=r.button`
  padding: 10px 14px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  color: ${({$color:e,theme:n})=>e||n.colors.text};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.12s;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
  }
`,Y=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  animation: ${A} 0.5s ease-out;
`,_e=r.div`
  width: 88px;
  height: 88px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(139, 92, 246, 0.1));
  color: ${({theme:e})=>e.colors.secondary};
  margin-bottom: 24px;
`,G=r.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  margin: 0 0 8px 0;
`,R=r.p`
  font-size: 14px;
  color: ${({theme:e})=>e.colors.textMuted};
  margin: 0 0 28px 0;
  max-width: 400px;
  line-height: 1.6;
`,Ve=r.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  background-color: ${({theme:e})=>e.colors.secondary};
  color: #FFF;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);

  &:hover {
    background-color: #1D4ED8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  }

  &:active { transform: translateY(0); }
`,i=r.div`
  background: linear-gradient(
    90deg,
    ${({theme:e})=>e.colors.muted} 25%,
    ${({theme:e})=>e.colors.border} 50%,
    ${({theme:e})=>e.colors.muted} 75%
  );
  background-size: 800px 100%;
  animation: ${fe} 1.4s infinite;
  border-radius: ${({$radius:e})=>e||"8px"};
  height: ${({$h:e})=>e||"20px"};
  width: ${({$w:e})=>e||"100%"};
`,qe=r(K)``,Oe=r.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`,Ye=r.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`,U=["linear-gradient(135deg, #3B82F6, #2563EB)","linear-gradient(135deg, #10B981, #059669)","linear-gradient(135deg, #8B5CF6, #7C3AED)","linear-gradient(135deg, #F59E0B, #D97706)","linear-gradient(135deg, #EF4444, #DC2626)","linear-gradient(135deg, #EC4899, #DB2777)","linear-gradient(135deg, #06B6D4, #0891B2)"],Ge=[{id:1,fundName:"HDFC Mid-Cap Opportunities Fund - Growth",sipAmount:5e3,frequency:"Monthly",nextInstallmentDate:"2026-04-05",status:"Active",totalInvested:6e4,currentValue:68400,category:"Mid Cap",folioNumber:"FOL-1234567"},{id:2,fundName:"SBI Bluechip Fund - Direct Growth",sipAmount:1e4,frequency:"Monthly",nextInstallmentDate:"2026-04-10",status:"Active",totalInvested:12e4,currentValue:142800,category:"Large Cap",folioNumber:"FOL-2345678"},{id:3,fundName:"Axis Long Term Equity Fund - ELSS",sipAmount:2500,frequency:"Monthly",nextInstallmentDate:"2026-04-15",status:"Active",totalInvested:3e4,currentValue:33750,category:"ELSS",folioNumber:"FOL-3456789"},{id:4,fundName:"ICICI Prudential Technology Fund - Growth",sipAmount:3e3,frequency:"Monthly",nextInstallmentDate:"2026-04-07",status:"Paused",totalInvested:36e3,currentValue:39600,category:"Sectoral",folioNumber:"FOL-4567890"},{id:5,fundName:"Mirae Asset Large Cap Fund - Direct Growth",sipAmount:7500,frequency:"Monthly",nextInstallmentDate:"2026-04-12",status:"Active",totalInvested:9e4,currentValue:104400,category:"Large Cap",folioNumber:"FOL-5678901"}];function p(e){return e==null?"₹0":"₹"+Number(e).toLocaleString("en-IN")}function Re(e){return e?new Date(e).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"—"}function Ue(e){if(!e)return"??";const n=e.split(/[\s-]+/).filter(Boolean);return n.length>=2?(n[0][0]+n[1][0]).toUpperCase():n[0].substring(0,2).toUpperCase()}function Ke(e){const n=new Date,a=new Date(n.getTime()+7*24*60*60*1e3);return e.filter(d=>d.status==="Active"&&new Date(d.nextInstallmentDate)<=a).length}const it=()=>{const e=J(),{user:n}=te(),[a,d]=l.useState([]),[H,k]=l.useState(!0),[x,Q]=l.useState(""),[S,I]=l.useState(null),C=l.useRef(null);l.useEffect(()=>{let o=!1;return k(!0),(async()=>{var m;try{if(n!=null&&n.id){const F=(m=(await oe(n.id)).data)==null?void 0:m.sips;if(!o&&F&&F.length>0){d(F),k(!1);return}}}catch{}await new Promise(c=>setTimeout(c,600)),o||(d(Ge),k(!1))})(),()=>{o=!0}},[n==null?void 0:n.id]),l.useEffect(()=>{const o=s=>{C.current&&!C.current.contains(s.target)&&I(null)};return document.addEventListener("mousedown",o),()=>document.removeEventListener("mousedown",o)},[]);const z=a.filter(o=>o.status==="Active"),W=z.reduce((o,s)=>o+(s.sipAmount||0),0),h=a.reduce((o,s)=>o+(s.totalInvested||0),0),E=a.reduce((o,s)=>o+(s.currentValue||0),0),X=Ke(a),M=a.filter(o=>!x||(o.fundName||"").toLowerCase().includes(x.toLowerCase())),g=l.useCallback((o,s)=>{I(null),d(m=>m.map(c=>{if(c.id!==s)return c;switch(o){case"pause":return{...c,status:c.status==="Paused"?"Active":"Paused"};case"cancel":return null;default:return c}}).filter(Boolean))},[]);return H?t.jsxs(P,{children:[t.jsx(D,{children:t.jsxs(N,{children:[t.jsx(i,{$h:"28px",$w:"160px"}),t.jsx(i,{$h:"14px",$w:"300px",style:{marginTop:8}})]})}),t.jsx(qe,{children:[1,2,3,4].map(o=>t.jsxs(Oe,{children:[t.jsx(i,{$h:"14px",$w:"120px"}),t.jsx(i,{$h:"28px",$w:"100px"}),t.jsx(i,{$h:"12px",$w:"80px"})]},o))}),t.jsx(i,{$h:"18px",$w:"140px",style:{marginBottom:16}}),[1,2,3].map(o=>t.jsxs(Ye,{style:{marginBottom:12},children:[t.jsx(i,{$h:"48px",$w:"48px",$radius:"12px"}),t.jsxs("div",{style:{flex:1},children:[t.jsx(i,{$h:"16px",$w:"70%"}),t.jsx(i,{$h:"12px",$w:"40%",style:{marginTop:6}})]}),t.jsx(i,{$h:"20px",$w:"80px"})]},o))]}):a.length===0?t.jsxs(P,{children:[t.jsx(D,{children:t.jsxs(N,{children:[t.jsx(V,{children:"Your SIPs"}),t.jsx(q,{children:"Manage your systematic investment plans in one place."})]})}),t.jsxs(Y,{children:[t.jsx(_e,{children:t.jsx(L,{size:40})}),t.jsx(G,{children:"No Active SIPs"}),t.jsx(R,{children:"Start a Systematic Investment Plan to invest a fixed amount regularly in mutual funds. SIPs help you build long-term wealth with the power of compounding and rupee cost averaging."}),t.jsxs(Ve,{onClick:()=>e("/dashboard/explore"),children:[t.jsx(T,{size:18}),"Start your first SIP"]})]})]}):t.jsxs(P,{children:[t.jsxs(D,{children:[t.jsxs(N,{children:[t.jsx(V,{children:"Your SIPs"}),t.jsx(q,{children:"Manage your systematic investment plans in one place."})]}),t.jsxs(ye,{onClick:()=>e("/dashboard/explore"),children:[t.jsx(T,{size:18}),"New SIP"]})]}),t.jsxs(K,{children:[t.jsxs(f,{$accentColor:"#3B82F6",children:[t.jsxs(b,{children:[t.jsx(y,{children:"Total Monthly SIP"}),t.jsx(j,{$bg:"rgba(59,130,246,0.1)",$color:"#3B82F6",children:t.jsx(Z,{size:20})})]}),t.jsx(w,{children:p(W)}),t.jsxs($,{children:[z.length," active SIP",z.length!==1?"s":""]})]}),t.jsxs(f,{$accentColor:"#F59E0B",children:[t.jsxs(b,{children:[t.jsx(y,{children:"Upcoming Deductions"}),t.jsx(j,{$bg:"rgba(245,158,11,0.1)",$color:"#F59E0B",children:t.jsx(_,{size:20})})]}),t.jsx(w,{children:X}),t.jsx($,{children:"Due this week"})]}),t.jsxs(f,{$accentColor:"#8B5CF6",children:[t.jsxs(b,{children:[t.jsx(y,{children:"Total Invested via SIPs"}),t.jsx(j,{$bg:"rgba(139,92,246,0.1)",$color:"#8B5CF6",children:t.jsx(L,{size:20})})]}),t.jsx(w,{children:p(h)}),t.jsx($,{children:"Across all SIPs"})]}),t.jsxs(f,{$accentColor:"#10B981",children:[t.jsxs(b,{children:[t.jsx(y,{children:"Current Value"}),t.jsx(j,{$bg:"rgba(16,185,129,0.1)",$color:"#10B981",children:t.jsx(ee,{size:20})})]}),t.jsx(w,{children:p(E)}),t.jsx($,{children:h>0?`${((E-h)/h*100).toFixed(1)}% returns`:"No returns yet"})]})]}),t.jsxs(je,{children:[t.jsxs(we,{children:["Active Plans",t.jsx($e,{children:M.length})]}),t.jsxs(ve,{children:[t.jsxs(ke,{children:[t.jsx(re,{size:16,color:"currentColor"}),t.jsx("input",{placeholder:"Search SIPs...",value:x,onChange:o=>Q(o.target.value)})]}),t.jsxs(Se,{children:[t.jsx(ne,{size:14}),"Filter",t.jsx(se,{size:14})]})]})]}),t.jsx(Ie,{children:M.map((o,s)=>t.jsxs(Ce,{$index:s,children:[t.jsx(ze,{$gradient:U[s%U.length],children:Ue(o.fundName)}),t.jsxs(Me,{children:[t.jsx(Fe,{children:o.fundName}),t.jsxs(Pe,{children:[t.jsx("span",{children:o.category||o.frequency}),t.jsx(O,{}),t.jsxs("span",{children:["Folio: ",o.folioNumber||"—"]}),t.jsx(O,{}),t.jsxs("span",{children:["Invested: ",p(o.totalInvested)]})]})]}),t.jsx(Ae,{$active:o.status==="Active",children:o.status}),t.jsxs(De,{children:[t.jsxs(Ne,{children:[p(o.sipAmount),"/mo"]}),t.jsxs(Be,{children:[t.jsx(_,{size:12}),"Next: ",Re(o.nextInstallmentDate)]})]}),t.jsxs(Ee,{ref:S===o.id?C:null,children:[t.jsx(Le,{onClick:()=>I(S===o.id?null:o.id),children:t.jsx(de,{size:18})}),t.jsxs(Te,{$isOpen:S===o.id,children:[t.jsxs(v,{onClick:()=>g("edit",o.id),children:[t.jsx(ie,{size:15}),"Edit SIP"]}),t.jsxs(v,{onClick:()=>g("pause",o.id),children:[o.status==="Paused"?t.jsx(he,{size:15}):t.jsx(pe,{size:15}),o.status==="Paused"?"Resume SIP":"Pause SIP"]}),t.jsxs(v,{onClick:()=>g("skip",o.id),children:[t.jsx(me,{size:15}),"Skip Installment"]}),t.jsxs(v,{$color:"#DC2626",onClick:()=>g("cancel",o.id),children:[t.jsx(ae,{size:15}),"Cancel SIP"]})]})]})]},o.id))}),M.length===0&&x&&t.jsxs(Y,{style:{padding:"40px 24px"},children:[t.jsxs(G,{style:{fontSize:16},children:['No SIPs match "',x,'"']}),t.jsx(R,{style:{marginBottom:0},children:"Try a different search term."})]})]})};export{it as SipsPage};
