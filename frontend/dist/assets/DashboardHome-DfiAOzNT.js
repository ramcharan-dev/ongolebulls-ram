import{n as k,r as p,j as t,A as o,u as O,a0 as G,a1 as W,T as w,a2 as _,a3 as H,_ as M,a4 as U,a5 as K,a6 as q,a7 as X,G as J}from"./index-BUtZQfg4.js";import{u as E}from"./useAuth-B6l57m9g.js";import{g as Q}from"./authApi-bgCLz67z.js";import{U as Z}from"./user-check-DPQCQyZP.js";import{T as ee}from"./triangle-alert-BnBsBAPJ.js";import{P as te}from"./piggy-bank-C6BR5CJC.js";import{a as oe}from"./userApi-CURgvn4g.js";import"./adminApi-DCZJb2Pt.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"m16 3 4 4-4 4",key:"1x1c3m"}],["path",{d:"M20 7H4",key:"zbl0bi"}],["path",{d:"m8 21-4-4 4-4",key:"h9nckh"}],["path",{d:"M4 17h16",key:"g4d7ey"}]],ne=k("arrow-right-left",se);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["path",{d:"M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z",key:"ukzhwg"}],["path",{d:"M14.487 7.858A1 1 0 0 1 14 7V2",key:"1klhew"}],["path",{d:"M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516",key:"rxaxab"}],["path",{d:"M8 18h1",key:"13wk12"}]],ie=k("file-pen-line",re);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],ce=k("trending-down",ae),le=o.div`
  margin-bottom: 24px;
`,de=o.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,pe=o.p`
  font-size: 16px;
  color: ${({theme:e})=>e.colors.textMuted};
  margin: 0;
`,xe=()=>{const[e,s]=p.useState("Good Morning"),[n,r]=p.useState("Investor");return p.useEffect(()=>{const d=new Date().getHours();d<12?s("Good Morning"):d<18?s("Good Afternoon"):s("Good Evening");const l=localStorage.getItem("ob_user");if(l)try{const a=JSON.parse(l);a!=null&&a.fullName?r(a.fullName):a!=null&&a.name?r(a.name):a!=null&&a.username?r(a.username):r("Investor")}catch{r("Investor")}else r("Investor")},[]),t.jsxs(le,{children:[t.jsxs(de,{children:[e,", ",n," ",t.jsx("span",{role:"img","aria-label":"wave",children:"👋"})]}),t.jsx(pe,{children:"Start building your investment future today."})]})},ge=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`,A=o.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({theme:e})=>e.shadows.sm};
  border: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({theme:e})=>e.shadows.md};
  }
`,z=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({theme:e})=>e.colors.text};
    display: flex;
    align-items: center;
    gap: 8px;
  }
`,L=o.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  ${({$status:e,theme:s})=>{switch(e){case"Completed":case"Active":case"Verified":return`
          background-color: ${s.colors.successLight};
          color: ${s.colors.success};
        `;case"Pending":return`
          background-color: ${s.colors.warningLight};
          color: ${s.colors.warning};
        `;default:return`
          background-color: ${s.colors.dangerLight};
          color: ${s.colors.danger};
        `}}}
`,T=o.p`
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1;
`,B=o.button`
  background-color: ${({theme:e})=>e.colors.secondary};
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563EB;
  }
`;function N(e,s){if(!e)return s;const n=e.toLowerCase();return n==="verified"||n==="completed"||n==="approved"?"Verified":n==="active"?"Active":n==="pending"||n==="in_progress"?"Pending":s}const he=()=>{const e=O(),{user:s}=E(),[n,r]=p.useState("Not Completed"),[d,l]=p.useState("Not Created");p.useEffect(()=>{if(!(s!=null&&s.id))return;let i=!1;return Q(s.id).then(x=>{if(i)return;const c=x.data;r(N(c==null?void 0:c.kycStatus,"Not Completed")),l(N(c==null?void 0:c.uccStatus,"Not Created"))}).catch(()=>{}),()=>{i=!0}},[s==null?void 0:s.id]);const a=n==="Verified"||n==="Active",g=d==="Active"||d==="Verified";return t.jsxs(ge,{children:[t.jsxs(A,{children:[t.jsxs(z,{children:[t.jsxs("h3",{children:[t.jsx(G,{size:20,color:"#3B82F6"})," KYC Verification"]}),t.jsx(L,{$status:n,children:n})]}),t.jsx(T,{children:"Your Know Your Customer (KYC) verification is mandatory to start investing in mutual funds as per SEBI regulations. Let's get it sorted."}),!a&&t.jsxs(B,{onClick:()=>e("/dashboard/kyc"),children:[t.jsx(ie,{size:16})," Complete KYC"]})]}),t.jsxs(A,{children:[t.jsxs(z,{children:[t.jsxs("h3",{children:[t.jsx(Z,{size:20,color:"#3B82F6"})," UCC Creation"]}),t.jsx(L,{$status:d,children:d})]}),t.jsx(T,{children:"A Unique Client Code (UCC) is required to process and track your investments on the exchange."}),!g&&t.jsxs(B,{onClick:()=>e("/dashboard/ucc"),children:[t.jsx(ee,{size:16})," Generate UCC"]})]})]})},h=({data:e=[],width:s=80,height:n=32,color:r="#3B82F6",fillOpacity:d=.12})=>{const l=p.useMemo(()=>`spark-${Math.random().toString(36).slice(2,9)}`,[]),a=p.useMemo(()=>{if(!e.length)return"";const i=Math.min(...e),c=Math.max(...e)-i||1,R=s/(e.length-1||1),S=2,I=n-S*2;return e.map((P,V)=>{const Y=V*R,D=S+I-(P-i)/c*I;return`${Y},${D}`}).join(" ")},[e,s,n]);if(!e.length)return null;const g=a.split(" ").pop();return t.jsxs("svg",{width:s,height:n,viewBox:`0 0 ${s} ${n}`,style:{display:"block"},children:[t.jsx("defs",{children:t.jsxs("linearGradient",{id:l,x1:"0",y1:"0",x2:"0",y2:"1",children:[t.jsx("stop",{offset:"0%",stopColor:r,stopOpacity:d}),t.jsx("stop",{offset:"100%",stopColor:r,stopOpacity:0})]})}),t.jsx("polygon",{points:`0,${n} ${a} ${s},${n}`,fill:`url(#${l})`}),t.jsx("polyline",{points:a,fill:"none",stroke:r,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),g&&t.jsx("circle",{cx:s,cy:parseFloat(g.split(",")[1]),r:"2.5",fill:r})]})},ue=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`,u=o.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({theme:e})=>e.shadows.sm};
  border: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({theme:e})=>e.shadows.md}, 0 0 0 1px ${({theme:e})=>`${e.colors.secondary}20`};
    border-color: ${({theme:e})=>`${e.colors.secondary}40`};
  }
`,f=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${({theme:e})=>e.colors.textMuted};
  }
`,m=o.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({$bg:e})=>e};
  color: ${({$color:e})=>e};
`,j=o.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`,b=o.div`
  margin-bottom: 10px;
`,y=o.div`
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({$color:e,theme:s})=>e||s.colors.textMuted};
`,fe=[80,95,88,110,105,125,118,140,135,150],me=[0,5,3,12,8,18,15,22,20,28],je=[0,500,500,1e3,1e3,1500,1500,2e3,2e3,2500],be=[2,1,3,0,4,2,1,5,3,2],ye=()=>t.jsxs(ue,{children:[t.jsxs(u,{children:[t.jsxs(f,{children:[t.jsx("h3",{children:"Portfolio Value"}),t.jsx(m,{$bg:"rgba(59, 130, 246, 0.1)",$color:"#3B82F6",children:t.jsx(W,{size:20})})]}),t.jsx(j,{children:"₹0.00"}),t.jsx(b,{children:t.jsx(h,{data:fe,width:220,height:36,color:"#3B82F6"})}),t.jsx(y,{children:"Across all mutual funds"})]}),t.jsxs(u,{children:[t.jsxs(f,{children:[t.jsx("h3",{children:"Today's Return"}),t.jsx(m,{$bg:"rgba(16, 185, 129, 0.1)",$color:"#10B981",children:t.jsx(w,{size:20})})]}),t.jsx(j,{children:"₹0.00"}),t.jsx(b,{children:t.jsx(h,{data:me,width:220,height:36,color:"#10B981"})}),t.jsxs(y,{$color:"#10B981",children:[t.jsx(w,{size:14})," +0.00%"]})]}),t.jsxs(u,{children:[t.jsxs(f,{children:[t.jsx("h3",{children:"Active SIPs"}),t.jsx(m,{$bg:"rgba(139, 92, 246, 0.1)",$color:"#8B5CF6",children:t.jsx(te,{size:20})})]}),t.jsx(j,{children:"₹0 / mo"}),t.jsx(b,{children:t.jsx(h,{data:je,width:220,height:36,color:"#8B5CF6"})}),t.jsx(y,{children:"0 Ongoing SIPs"})]}),t.jsxs(u,{children:[t.jsxs(f,{children:[t.jsx("h3",{children:"Recent Transactions"}),t.jsx(m,{$bg:"rgba(245, 158, 11, 0.1)",$color:"#F59E0B",children:t.jsx(ne,{size:20})})]}),t.jsx(j,{style:{fontSize:"20px",marginTop:"4px"},children:"No recent activity"}),t.jsx(b,{children:t.jsx(h,{data:be,width:220,height:36,color:"#F59E0B"})}),t.jsx(y,{children:"Your latest transactions will appear here"})]})]});U.register(K,q,X);const ve=M`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`,$e=o.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({theme:e})=>e.shadows.sm};
  animation: ${ve} 0.4s ease-out;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({theme:e})=>e.shadows.md};
    transform: translateY(-2px);
  }
`,Ce=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`,we=o.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,ke=o.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
`,Se=o.div`
  width: 100%;
  max-width: 220px;
  margin: 0 auto 20px;
`,Ie=o.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`,Ae=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
`,ze=o.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Le=o.div`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background-color: ${({$color:e})=>e};
`,Te=o.span`
  font-weight: 500;
  color: ${({theme:e})=>e.colors.text};
`,Be=o.span`
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,Ne=o.span`
  font-weight: 500;
  color: ${({theme:e})=>e.colors.textMuted};
  margin-left: 6px;
  font-size: 12px;
`,Fe=o.div`
  text-align: center;
  padding: 40px 16px;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: 14px;
`,v=["#3B82F6","#10B981","#F59E0B","#8B5CF6","#EF4444","#06B6D4","#EC4899"],$=[{assetClass:"Equity",totalValue:45e3},{assetClass:"Debt",totalValue:25e3},{assetClass:"Gold",totalValue:15e3},{assetClass:"Hybrid",totalValue:1e4},{assetClass:"Others",totalValue:5e3}],Me=()=>{const{user:e}=E(),[s,n]=p.useState([]),[r,d]=p.useState(!0);p.useEffect(()=>{if(!(e!=null&&e.id)){n($),d(!1);return}let i=!1;return oe(e.id).then(x=>{if(!i){const c=x.data;n(c!=null&&c.length?c:$)}}).catch(()=>{n($)}).finally(()=>{i||d(!1)}),()=>{i=!0}},[e==null?void 0:e.id]);const l=s.reduce((i,x)=>i+(x.totalValue||0),0),a={labels:s.map(i=>i.assetClass),datasets:[{data:s.map(i=>i.totalValue),backgroundColor:v.slice(0,s.length),borderWidth:0,hoverOffset:6}]},g={responsive:!0,maintainAspectRatio:!0,cutout:"68%",plugins:{legend:{display:!1},tooltip:{backgroundColor:"#1E293B",titleFont:{size:13,weight:600},bodyFont:{size:12},padding:10,cornerRadius:8,callbacks:{label:i=>{const x=l?(i.raw/l*100).toFixed(1):0;return` ₹${i.raw.toLocaleString("en-IN")} (${x}%)`}}}}};return r?null:t.jsxs($e,{children:[t.jsxs(Ce,{children:[t.jsx(we,{children:"Asset Allocation"}),t.jsx(ke,{children:t.jsx(_,{size:18})})]}),l===0?t.jsx(Fe,{children:"No investments yet"}):t.jsxs(t.Fragment,{children:[t.jsx(Se,{children:t.jsx(H,{data:a,options:g})}),t.jsx(Ie,{children:s.map((i,x)=>{const c=l?(i.totalValue/l*100).toFixed(1):0;return t.jsxs(Ae,{children:[t.jsxs(ze,{children:[t.jsx(Le,{$color:v[x%v.length]}),t.jsx(Te,{children:i.assetClass})]}),t.jsxs("div",{children:[t.jsxs(Be,{children:["₹",i.totalValue.toLocaleString("en-IN")]}),t.jsxs(Ne,{children:[c,"%"]})]})]},i.assetClass)})})]})]})},Ee=M`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`,Re=o.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  box-shadow: ${({theme:e})=>e.shadows.sm};
  overflow: hidden;
  animation: ${Ee} 0.4s ease-out;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({theme:e})=>e.shadows.md};
  }
`,Pe=o.div`
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`,Ve=o.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,Ye=o.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
`,De=o.div`
  display: flex;
  gap: 0;
  padding: 0 20px;
  margin-bottom: 4px;
`,C=o.button`
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({$active:e,theme:s})=>e?s.colors.secondary:s.colors.textMuted};
  border-bottom: 2px solid ${({$active:e,theme:s})=>e?s.colors.secondary:"transparent"};
  transition: all 0.2s;

  &:hover {
    color: ${({theme:e})=>e.colors.text};
  }
`,Oe=o.div`
  padding: 4px 0;
  flex: 1;
`,Ge=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  transition: background-color 0.12s;
  cursor: pointer;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
  }
`,We=o.div`
  display: flex;
  flex-direction: column;
`,_e=o.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  letter-spacing: 0.2px;
`,He=o.div`
  font-size: 11px;
  color: ${({theme:e})=>e.colors.textMuted};
  margin-top: 2px;
`,Ue=o.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`,Ke=o.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,qe=o.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: ${({$positive:e})=>e?"#059669":"#DC2626"};
  margin-top: 2px;
`,Xe=o.button`
  display: block;
  width: 100%;
  padding: 14px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.secondary};
  background: transparent;
  border: none;
  border-top: 1px solid ${({theme:e})=>e.colors.border};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
  }
`,Je=[{name:"NIFTY 50",sector:"Index",price:"24,560.10",change:"+1.20",pct:"+0.52",positive:!0},{name:"SENSEX",sector:"Index",price:"80,123.45",change:"+640.30",pct:"+0.81",positive:!0},{name:"NIFTY BANK",sector:"Index",price:"52,340.80",change:"-120.50",pct:"-0.23",positive:!1}],Qe=[{name:"RELIANCE",sector:"Energy",price:"₹2,945.60",change:"+62.40",pct:"+2.16",positive:!0},{name:"TCS",sector:"IT",price:"₹4,120.35",change:"+48.70",pct:"+1.20",positive:!0},{name:"HDFCBANK",sector:"Banking",price:"₹1,740.90",change:"+28.15",pct:"+1.64",positive:!0},{name:"INFY",sector:"IT",price:"₹1,890.25",change:"+22.80",pct:"+1.22",positive:!0},{name:"BHARTIARTL",sector:"Telecom",price:"₹1,650.40",change:"+18.90",pct:"+1.16",positive:!0}],Ze=[{name:"TATAMOTORS",sector:"Auto",price:"₹890.60",change:"-24.30",pct:"-2.66",positive:!1},{name:"ADANIENT",sector:"Infra",price:"₹2,340.15",change:"-48.70",pct:"-2.04",positive:!1},{name:"SUNPHARMA",sector:"Pharma",price:"₹1,420.80",change:"-18.40",pct:"-1.28",positive:!1},{name:"WIPRO",sector:"IT",price:"₹510.25",change:"-6.30",pct:"-1.22",positive:!1},{name:"COALINDIA",sector:"Mining",price:"₹380.90",change:"-4.20",pct:"-1.09",positive:!1}],et=()=>{const[e,s]=p.useState("indices"),n=e==="indices"?Je:e==="gainers"?Qe:Ze;return t.jsxs(Re,{children:[t.jsxs(Pe,{children:[t.jsx(Ve,{children:"Market Watch"}),t.jsx(Ye,{children:t.jsx(J,{size:18})})]}),t.jsxs(De,{children:[t.jsx(C,{$active:e==="indices",onClick:()=>s("indices"),children:"Indices"}),t.jsx(C,{$active:e==="gainers",onClick:()=>s("gainers"),children:"Top Gainers"}),t.jsx(C,{$active:e==="losers",onClick:()=>s("losers"),children:"Top Losers"})]}),t.jsx(Oe,{children:n.map(r=>t.jsxs(Ge,{children:[t.jsxs(We,{children:[t.jsx(_e,{children:r.name}),t.jsx(He,{children:r.sector})]}),t.jsxs(Ue,{children:[t.jsx(Ke,{children:r.price}),t.jsxs(qe,{$positive:r.positive,children:[r.positive?t.jsx(w,{size:12}):t.jsx(ce,{size:12}),r.change," (",r.pct,"%)"]})]})]},r.name))}),t.jsx(Xe,{children:"View All Stocks →"})]})},tt=o.div`
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,F=o.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
`,ot=o.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,pt=()=>t.jsxs(tt,{children:[t.jsx(xe,{}),t.jsx(he,{}),t.jsx(F,{children:"Portfolio Overview"}),t.jsx(ye,{}),t.jsx(F,{children:"Insights & Markets"}),t.jsxs(ot,{children:[t.jsx(Me,{}),t.jsx(et,{})]})]});export{pt as DashboardHome};
