import{c as j,r as b,j as e,Y as D,z as s,Z as M,_ as B}from"./index-DAvtno57.js";import{u as E}from"./useAuth-smb9K3pw.js";import{g as _}from"./authApi-ChAtNEXa.js";import{U as m}from"./user-ZIGX7AGr.js";import{M as L}from"./mail-BwjpEA19.js";import{C as R}from"./calendar-BR1mueEK.js";import{B as U}from"./briefcase-DX9slIKt.js";import{L as Y}from"./lock-BTHlOlz8.js";import{F as N}from"./file-text-BGPKVQJ1.js";import{C as A}from"./circle-check-big-Cw7SYSzY.js";import{T as H}from"./triangle-alert-DDOs4YBv.js";import{C as q}from"./clock-4caYPQcX.js";import{C as O}from"./circle-x-C32ADc5t.js";import"./adminApi-Bv0LjEEU.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]],Q=j("credit-card",W);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]],k=j("hash",V);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],K=j("map-pin",G);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],X=j("phone",J),P=B`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`,Z=B`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,C=s.div`
  animation: ${P} 0.4s ease-out;
`,v=s.div`
  margin-bottom: 28px;
`,ee=s.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${({theme:r})=>r.colors.text};
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
`,re=s.p`
  font-size: 14px;
  color: ${({theme:r})=>r.colors.textMuted};
  margin: 0;
`,oe=s.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`,w=s.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${({$bg:r})=>r};
  color: ${({$color:r})=>r};
  border: 1px solid ${({$borderColor:r})=>r};
`,se=s.div`
  display: flex;
  gap: 4px;
  background-color: ${({theme:r})=>r.colors.muted};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
  overflow-x: auto;

  @media (max-width: 640px) {
    gap: 2px;
    padding: 3px;
  }
`,ie=s.button`
  flex: 1;
  padding: 11px 18px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;
  color: ${({$active:r,theme:i})=>r?i.colors.text:i.colors.textMuted};
  background-color: ${({$active:r,theme:i})=>r?i.colors.surface:"transparent"};
  box-shadow: ${({$active:r})=>r?"0 2px 8px rgba(0,0,0,0.06)":"none"};

  &:hover {
    color: ${({theme:r})=>r.colors.text};
    background-color: ${({$active:r,theme:i})=>r?i.colors.surface:"rgba(0,0,0,0.03)"};
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 12px;
    gap: 5px;
  }
`,f=s.div`
  animation: ${P} 0.3s ease-out;
`,u=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`,l=s.div`
  background-color: ${({theme:r})=>r.colors.surface};
  border: 1px solid ${({theme:r})=>r.colors.border};
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({theme:r})=>r.colors.secondary};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.06);
    transform: translateY(-1px);
  }
`,t=s.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({$bg:r})=>r||"rgba(59,130,246,0.08)"};
  color: ${({$color:r})=>r||"#3B82F6"};
`,a=s.div`
  flex: 1;
  min-width: 0;
`,c=s.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({theme:r})=>r.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`,d=s.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({theme:r})=>r.colors.text};
  word-break: break-word;
`,ne=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({theme:r})=>r.colors.surface};
  border: 1px solid ${({theme:r})=>r.colors.border};
  border-radius: 12px;
  padding: 16px 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({theme:r})=>r.colors.secondary};
    transform: translateY(-1px);
  }
`,te=s.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,le=s.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({theme:r})=>r.colors.text};
`,ae=s.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({$verified:r})=>r?"#059669":"#F59E0B"};
`,ce=s.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`,de=s.div`
  background-color: ${({theme:r})=>r.colors.surface};
  border: 1px solid ${({theme:r})=>r.colors.border};
  border-radius: 14px;
  padding: 20px 24px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  }
`,xe=s.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({theme:r})=>r.colors.text};
  margin-bottom: 6px;
`,pe=s.div`
  font-size: 13px;
  color: ${({theme:r})=>r.colors.textMuted};
  padding-left: 12px;
  border-left: 3px solid ${({theme:r})=>r.colors.secondary};
`,he=s.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`,y=s.div`
  background: linear-gradient(90deg, ${({theme:r})=>r.colors.muted} 25%, ${({theme:r})=>r.colors.border} 50%, ${({theme:r})=>r.colors.muted} 75%);
  background-size: 400px 100%;
  animation: ${Z} 1.4s infinite;
  border-radius: 8px;
  height: ${({$h:r})=>r||"20px"};
  width: ${({$w:r})=>r||"100%"};
`;function ge(r){return!r||r.length<4?r||"—":r.substring(0,2)+"****"+r.substring(r.length-2)}function be(r){return!r||r.length<4?r||"—":"****"+r.substring(r.length-4)}function z(r){const i=(r||"").toLowerCase();return i==="verified"||i==="active"||i==="completed"||i==="approved"?{icon:e.jsx(A,{size:16}),bg:"rgba(5,150,105,0.08)",color:"#059669",borderColor:"rgba(5,150,105,0.2)",label:"Verified"}:i==="pending"||i==="in_progress"?{icon:e.jsx(q,{size:16}),bg:"rgba(245,158,11,0.08)",color:"#D97706",borderColor:"rgba(245,158,11,0.2)",label:"Pending"}:{icon:e.jsx(O,{size:16}),bg:"rgba(220,38,38,0.08)",color:"#DC2626",borderColor:"rgba(220,38,38,0.2)",label:"Not Completed"}}const fe=[{key:"personal",label:"Personal Info",icon:e.jsx(m,{size:16})},{key:"bank",label:"Bank Details",icon:e.jsx(Q,{size:16})},{key:"documents",label:"Documents",icon:e.jsx(N,{size:16})},{key:"risk",label:"Risk Profile",icon:e.jsx(M,{size:16})}],me=["What is your primary financial goal?","What is your investment time horizon?","How would you react to a 20% drop in your portfolio?","What percentage of your income do you invest?","How experienced are you with equity investments?"],je=[{name:"PAN Card",key:"panNumber"},{name:"Aadhaar Card",key:"aadhaarNumber"},{name:"Address Proof",key:"addressProof"},{name:"Cancelled Cheque",key:"chequeFile"},{name:"Signature",key:"signatureFile"}],Te=()=>{const{user:r}=E(),[i,S]=b.useState("personal"),[F,T]=b.useState(null),[I,$]=b.useState(!0);b.useEffect(()=>{if(!(r!=null&&r.id)){$(!1);return}let n=!1;return _(r.id).then(x=>{n||T(x.data)}).catch(()=>{}).finally(()=>{n||$(!1)}),()=>{n=!0}},[r==null?void 0:r.id]);const o={...r,...F},p=z(o.kycStatus),h=z(o.uccStatus);let g=[];try{o.riskAnswers&&(g=typeof o.riskAnswers=="string"?JSON.parse(o.riskAnswers):o.riskAnswers)}catch{}return I?e.jsxs(C,{children:[e.jsxs(v,{children:[e.jsx(y,{$h:"28px",$w:"200px"}),e.jsx(y,{$h:"16px",$w:"300px",style:{marginTop:10}})]}),e.jsx(u,{children:[1,2,3,4].map(n=>e.jsx(y,{$h:"90px"},n))})]}):e.jsxs(C,{children:[e.jsxs(v,{children:[e.jsx(ee,{children:"My Profile"}),e.jsx(re,{children:"View and manage your account information"})]}),e.jsxs(oe,{children:[e.jsxs(w,{$bg:p.bg,$color:p.color,$borderColor:p.borderColor,children:[p.icon,"KYC: ",p.label]}),e.jsxs(w,{$bg:h.bg,$color:h.color,$borderColor:h.borderColor,children:[h.icon,"UCC: ",h.label]})]}),e.jsx(se,{children:fe.map(n=>e.jsxs(ie,{$active:i===n.key,onClick:()=>S(n.key),children:[n.icon,n.label]},n.key))}),i==="personal"&&e.jsx(f,{children:e.jsxs(u,{children:[e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(59,130,246,0.08)",$color:"#3B82F6",children:e.jsx(m,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Full Name"}),e.jsx(d,{children:o.fullName||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(16,185,129,0.08)",$color:"#10B981",children:e.jsx(L,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Email Address"}),e.jsx(d,{children:o.email||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(139,92,246,0.08)",$color:"#8B5CF6",children:e.jsx(X,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Mobile Number"}),e.jsx(d,{children:o.mobileNumber||o.mobile||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(245,158,11,0.08)",$color:"#F59E0B",children:e.jsx(k,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"PAN Number"}),e.jsx(d,{children:ge(o.panNumber)})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(236,72,153,0.08)",$color:"#EC4899",children:e.jsx(R,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Date of Birth"}),e.jsx(d,{children:o.dob||o.dateOfBirth||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(99,102,241,0.08)",$color:"#6366F1",children:e.jsx(U,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Gender"}),e.jsx(d,{children:o.gender||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(20,184,166,0.08)",$color:"#14B8A6",children:e.jsx(K,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Address"}),e.jsx(d,{children:[o.address,o.city,o.state,o.pincode].filter(Boolean).join(", ")||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(234,88,12,0.08)",$color:"#EA580C",children:e.jsx(m,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Profile Type"}),e.jsx(d,{children:o.profileType||"Self"})]})]})]})},"personal"),i==="bank"&&e.jsx(f,{children:e.jsxs(u,{children:[e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(59,130,246,0.08)",$color:"#3B82F6",children:e.jsx(D,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Bank Name"}),e.jsx(d,{children:o.bankName||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(16,185,129,0.08)",$color:"#10B981",children:e.jsx(m,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Account Holder"}),e.jsx(d,{children:o.accountHolderName||o.fullName||"—"})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(139,92,246,0.08)",$color:"#8B5CF6",children:e.jsx(Y,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"Account Number"}),e.jsx(d,{children:be(o.accountNumber)})]})]}),e.jsxs(l,{children:[e.jsx(t,{$bg:"rgba(245,158,11,0.08)",$color:"#F59E0B",children:e.jsx(k,{size:20})}),e.jsxs(a,{children:[e.jsx(c,{children:"IFSC Code"}),e.jsx(d,{children:o.ifsc||o.ifscCode||"—"})]})]})]})},"bank"),i==="documents"&&e.jsx(f,{children:e.jsx(ce,{children:je.map(n=>{const x=!!o[n.key];return e.jsxs(ne,{children:[e.jsxs(te,{children:[e.jsx(t,{$bg:"rgba(59,130,246,0.08)",$color:"#3B82F6",children:e.jsx(N,{size:18})}),e.jsx(le,{children:n.name})]}),e.jsxs(ae,{$verified:x,children:[x?e.jsx(A,{size:14}):e.jsx(H,{size:14}),x?"Uploaded":"Not Uploaded"]})]},n.key)})})},"documents"),i==="risk"&&e.jsx(f,{children:e.jsx(he,{children:me.map((n,x)=>e.jsxs(de,{children:[e.jsxs(xe,{children:["Q",x+1,". ",n]}),e.jsx(pe,{children:Array.isArray(g)&&g[x]||g&&g[`q${x+1}`]||"—"})]},x))})},"risk")]})};export{Te as ProfilePage};
