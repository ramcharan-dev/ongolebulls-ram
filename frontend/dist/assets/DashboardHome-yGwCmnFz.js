import{c as h,r as p,j as e,H as s,u as v,S as k,J as w,T as m}from"./index-C4XemGI7.js";import{T as C}from"./triangle-alert-CUAdhWQf.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"m16 3 4 4-4 4",key:"1x1c3m"}],["path",{d:"M20 7H4",key:"zbl0bi"}],["path",{d:"m8 21-4-4 4-4",key:"h9nckh"}],["path",{d:"M4 17h16",key:"g4d7ey"}]],S=h("arrow-right-left",z);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z",key:"ukzhwg"}],["path",{d:"M14.487 7.858A1 1 0 0 1 14 7V2",key:"1klhew"}],["path",{d:"M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516",key:"rxaxab"}],["path",{d:"M8 18h1",key:"13wk12"}]],I=h("file-pen-line",M);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",key:"1piglc"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M2 8v1a2 2 0 0 0 2 2h1",key:"1env43"}]],B=h("piggy-bank",N);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],H=h("user-check",G),Y=s.div`
  margin-bottom: 24px;
`,A=s.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({theme:o})=>o.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,F=s.p`
  font-size: 16px;
  color: ${({theme:o})=>o.colors.textMuted};
  margin: 0;
`,T=()=>{const[o,t]=p.useState("Good Morning"),[i,n]=p.useState("Investor");return p.useEffect(()=>{const g=new Date().getHours();g<12?t("Good Morning"):g<18?t("Good Afternoon"):t("Good Evening");const u=localStorage.getItem("ob_user");if(u)try{const r=JSON.parse(u);r!=null&&r.fullName?n(r.fullName):r!=null&&r.name?n(r.name):r!=null&&r.username?n(r.username):n("Investor")}catch{n("Investor")}else n("Investor")},[]),e.jsxs(Y,{children:[e.jsxs(A,{children:[o,", ",i," ",e.jsx("span",{role:"img","aria-label":"wave",children:"👋"})]}),e.jsx(F,{children:"Start building your investment future today."})]})},_=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`,f=s.div`
  background-color: ${({theme:o})=>o.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({theme:o})=>o.shadows.sm};
  border: 1px solid ${({theme:o})=>o.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({theme:o})=>o.shadows.md};
  }
`,j=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({theme:o})=>o.colors.text};
    display: flex;
    align-items: center;
    gap: 8px;
  }
`,b=s.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${({$status:o,theme:t})=>{switch(o){case"Completed":case"Active":case"Verified":return`
          background-color: ${t.colors.successLight};
          color: ${t.colors.success};
        `;case"Pending":return`
          background-color: ${t.colors.warningLight};
          color: ${t.colors.warning};
        `;default:return`
          background-color: ${t.colors.dangerLight};
          color: ${t.colors.danger};
        `}}}
`,y=s.p`
  color: ${({theme:o})=>o.colors.textMuted};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1;
`,$=s.button`
  background-color: ${({theme:o})=>o.colors.secondary};
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
`,U=()=>{const o=v(),t="Not Completed",i="Not Created";return e.jsxs(_,{children:[e.jsxs(f,{children:[e.jsxs(j,{children:[e.jsxs("h3",{children:[e.jsx(k,{size:20,color:"#3B82F6"})," KYC Verification"]}),e.jsx(b,{$status:t,children:t})]}),e.jsx(y,{children:"Your Know Your Customer (KYC) verification is mandatory to start investing in mutual funds as per SEBI regulations. Let's get it sorted."}),e.jsxs($,{onClick:()=>o("/dashboard/kyc"),children:[e.jsx(I,{size:16})," Complete KYC"]})]}),e.jsxs(f,{children:[e.jsxs(j,{children:[e.jsxs("h3",{children:[e.jsx(H,{size:20,color:"#3B82F6"})," UCC Creation"]}),e.jsx(b,{$status:i,children:i})]}),e.jsx(y,{children:"A Unique Client Code (UCC) is required to process and track your investments on the exchange."}),e.jsxs($,{onClick:()=>o("/dashboard/ucc"),children:[e.jsx(C,{size:16})," Generate UCC"]})]})]})},V=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`,a=s.div`
  background-color: ${({theme:o})=>o.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({theme:o})=>o.shadows.sm};
  border: 1px solid ${({theme:o})=>o.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({theme:o})=>o.shadows.md};
  }
`,c=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${({theme:o})=>o.colors.textMuted};
  }
`,l=s.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({$bg:o})=>o};
  color: ${({$color:o})=>o};
`,d=s.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({theme:o})=>o.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`,x=s.div`
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({$color:o,theme:t})=>o||t.colors.textMuted};
`,E=()=>e.jsxs(V,{children:[e.jsxs(a,{children:[e.jsxs(c,{children:[e.jsx("h3",{children:"Portfolio Value"}),e.jsx(l,{$bg:"rgba(59, 130, 246, 0.1)",$color:"#3B82F6",children:e.jsx(w,{size:20})})]}),e.jsx(d,{children:"₹0.00"}),e.jsx(x,{children:"Across all mutual funds"})]}),e.jsxs(a,{children:[e.jsxs(c,{children:[e.jsx("h3",{children:"Today's Return"}),e.jsx(l,{$bg:"rgba(16, 185, 129, 0.1)",$color:"#10B981",children:e.jsx(m,{size:20})})]}),e.jsx(d,{children:"₹0.00"}),e.jsxs(x,{$color:"#10B981",children:[e.jsx(m,{size:14})," +0.00%"]})]}),e.jsxs(a,{children:[e.jsxs(c,{children:[e.jsx("h3",{children:"Active SIPs"}),e.jsx(l,{$bg:"rgba(139, 92, 246, 0.1)",$color:"#8B5CF6",children:e.jsx(B,{size:20})})]}),e.jsx(d,{children:"₹0 / mo"}),e.jsx(x,{children:"0 Ongoing SIPs"})]}),e.jsxs(a,{children:[e.jsxs(c,{children:[e.jsx("h3",{children:"Recent Transactions"}),e.jsx(l,{$bg:"rgba(245, 158, 11, 0.1)",$color:"#F59E0B",children:e.jsx(S,{size:20})})]}),e.jsx(d,{style:{fontSize:"20px",marginTop:"4px"},children:"No recent activity"}),e.jsx(x,{children:"Your latest transactions will appear here"})]})]}),L=s.div`
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,P=s.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({theme:o})=>o.colors.text};
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({theme:o})=>o.colors.border};
`,R=()=>e.jsxs(L,{children:[e.jsx(T,{}),e.jsx(U,{}),e.jsx(P,{children:"Portfolio Overview"}),e.jsx(E,{})]});export{R as DashboardHome};
