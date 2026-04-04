import{c as C,j as o,l as ie,z as r,a8 as ae,N as le,r as n,b as ce,u as K,T as de,U as pe,_ as M,S as xe,G as ue,Q as he,O as ge}from"./index-DpzyeW7E.js";import{d as fe,l as me}from"./theme-CVoCgdjI.js";import{X as E}from"./x-CUlFmB3t.js";import{L as be,a as ye}from"./log-out-DQ4FEgyy.js";import{R as je}from"./receipt-C07Qs6em.js";import{F as $e}from"./file-text-BzkZ6ee9.js";import{U as Q}from"./user-Cn4dwgpp.js";import{S as ve,M as ke}from"./send-CG5gpik9.js";import{S as W}from"./search-BmsQ4217.js";import{c as we}from"./userApi-DLkjYtkP.js";import{u as G}from"./useAuth-BoGKREYP.js";import{C as Ce,S as Se}from"./sparkles-D0v4crUd.js";import{C as ze}from"./chevron-down-CrIE-aWi.js";import{S as Me,M as Ie}from"./sun-BYs6kdqX.js";import{B as Fe}from"./bell-BbSF_pGa.js";import{C as Ne}from"./circle-alert-BFOOwxKR.js";import{S as Oe}from"./settings-BT1AKETx.js";import{U as Re}from"./user-check-C9hLSXH-.js";import"./authApi-CLnoCnYs.js";import"./adminApi-BbnHeyQ3.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],Be=C("book-open",De);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 8v8",key:"napkw2"}],["path",{d:"m8 12 4 4 4-4",key:"k98ssh"}]],Ee=C("circle-arrow-down",Te);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],V=C("circle-question-mark",Le);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=[["path",{d:"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",key:"11bfej"}]],Pe=C("command",Ae);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],_e=C("menu",Ue);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]],He=C("paperclip",qe),Ye=r.aside`
  background-color: ${({theme:e})=>e.colors.sidebar};
  width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  border-right: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  z-index: 50;

  @media (max-width: 1024px) {
    transform: ${({$isOpen:e})=>e?"translateX(0)":"translateX(-100%)"};
  }
`,Ke=r.div`
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
`,Qe=r.div`
  display: flex;
  align-items: center;
  justify-content: center;
`,We=r.img`
  height: 68px;
  width: auto;
  object-fit: contain;
`,Ge=r.button`
  background: none;
  border: none;
  color: ${({theme:e})=>e.colors.textMuted};
  cursor: pointer;
  display: none;
  padding: 4px;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    color: ${({theme:e})=>e.colors.primary};
  }
`,Ve=r.nav`
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`,Xe=r(le)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${({theme:e})=>e.colors.textMuted};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
    color: ${({theme:e})=>e.colors.primary};
  }

  &.active {
    background-color: ${({theme:e})=>e.colors.primary};
    color: ${({theme:e})=>e.colors.background};
    box-shadow: ${({theme:e})=>e.shadows.md};
  }
`,Je=r.div`
  display: flex;
  align-items: center;
  justify-content: center;
`,Ze=({isOpen:e,toggleSidebar:t})=>{const p=[{name:"Dashboard",path:"/dashboard",icon:o.jsx(be,{size:20})},{name:"Explore Funds",path:"/dashboard/explore",icon:o.jsx(ae,{size:20})},{name:"SIPs",path:"/dashboard/sips",icon:o.jsx(je,{size:20})},{name:"Statements",path:"/dashboard/statements",icon:o.jsx($e,{size:20})},{name:"My Profile",path:"/dashboard/profile",icon:o.jsx(Q,{size:20})},{name:"Support / Help",path:"/dashboard/support",icon:o.jsx(V,{size:20})}];return o.jsxs(Ye,{$isOpen:e,children:[o.jsxs(Ke,{children:[o.jsxs(Qe,{children:[o.jsx("h1",{children:"OngoleBulls"}),o.jsx(We,{src:ie,alt:"OngoleBulls"})]}),o.jsx(Ge,{onClick:t,children:o.jsx(E,{size:20})})]}),o.jsx(Ve,{children:p.map(i=>o.jsxs(Xe,{to:i.path,end:i.path==="/dashboard",onClick:()=>{window.innerWidth<=1024&&t()},children:[o.jsx(Je,{children:i.icon}),i.name]},i.name))})]})},eo=r.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`,oo=r.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: ${({theme:e})=>e.shadows.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`,ro=r.div`
  padding: 24px;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: ${({theme:e})=>e.colors.text};
  }
`,to=r.button`
  background: none;
  border: none;
  color: ${({theme:e})=>e.colors.textMuted};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
    color: ${({theme:e})=>e.colors.primary};
  }
`,so=r.form`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`,z=r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: ${({theme:e})=>e.colors.text};
  }
`,no=r.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.colors.background};
  color: ${({theme:e})=>e.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({theme:e})=>e.colors.secondary};
    box-shadow: 0 0 0 2px ${({theme:e})=>"rgba(59, 130, 246, 0.2)"};
  }
`,io=r.select`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.colors.background};
  color: ${({theme:e})=>e.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;

  &:focus {
    border-color: ${({theme:e})=>e.colors.secondary};
    box-shadow: 0 0 0 2px ${({theme:e})=>"rgba(59, 130, 246, 0.2)"};
  }
`,ao=r.textarea`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.colors.background};
  color: ${({theme:e})=>e.colors.text};
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({theme:e})=>e.colors.secondary};
    box-shadow: 0 0 0 2px ${({theme:e})=>"rgba(59, 130, 246, 0.2)"};
  }
`,lo=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,co=r.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({theme:e})=>e.colors.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: ${({theme:e})=>"rgba(59, 130, 246, 0.1)"};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({theme:e})=>"rgba(59, 130, 246, 0.15)"};
  }

  input {
    display: none;
  }
`,po=r.div`
  padding: 24px;
  border-top: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: ${({theme:e})=>e.colors.background};
`,U=r.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  ${({$variant:e,theme:t})=>e==="secondary"?`
        background-color: transparent;
        color: ${t.colors.text};
        border: 1px solid ${t.colors.border};

        &:hover {
          background-color: ${t.colors.muted};
        }
      `:`
      background-color: ${t.colors.secondary};
      color: #FFF;
      border: none;

      &:hover {
        background-color: #2563EB;
      }
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    `}
`,xo=({onClose:e})=>{const[t,p]=n.useState(!1),[i,m]=n.useState({subject:"",category:"",description:""}),u=g=>{const{name:f,value:y}=g.target;m(h=>({...h,[f]:y}))},l=async g=>{g.preventDefault(),p(!0);try{const f=localStorage.getItem("token");await new Promise(y=>setTimeout(y,1e3)),alert("Ticket raised successfully"),e()}catch(f){console.error(f),alert("Failed to raise ticket")}finally{p(!1)}};return o.jsx(eo,{children:o.jsxs(oo,{onClick:g=>g.stopPropagation(),children:[o.jsxs(ro,{children:[o.jsx("h2",{children:"Raise Support Ticket"}),o.jsx(to,{onClick:e,children:o.jsx(E,{size:20})})]}),o.jsxs(so,{id:"ticket-form",onSubmit:l,children:[o.jsxs(z,{children:[o.jsx("label",{htmlFor:"subject",children:"Subject"}),o.jsx(no,{id:"subject",name:"subject",required:!0,placeholder:"Brief summary of your issue",value:i.subject,onChange:u})]}),o.jsxs(z,{children:[o.jsx("label",{htmlFor:"category",children:"Issue Category"}),o.jsxs(io,{id:"category",name:"category",required:!0,value:i.category,onChange:u,children:[o.jsx("option",{value:"",disabled:!0,children:"Select a category"}),o.jsx("option",{value:"kyc",children:"KYC/Onboarding Issue"}),o.jsx("option",{value:"payment",children:"Payment/Transaction Failure"}),o.jsx("option",{value:"sip",children:"SIP Setup Problem"}),o.jsx("option",{value:"portfolio",children:"Portfolio Discrepancy"}),o.jsx("option",{value:"other",children:"Other"})]})]}),o.jsxs(z,{children:[o.jsx("label",{htmlFor:"description",children:"Description"}),o.jsx(ao,{id:"description",name:"description",required:!0,placeholder:"Please provide details about your issue...",value:i.description,onChange:u})]}),o.jsxs(z,{children:[o.jsx("label",{children:"Attachments (Optional)"}),o.jsxs(lo,{children:[o.jsxs(co,{children:[o.jsx(He,{size:16}),"Attach File",o.jsx("input",{type:"file"})]}),o.jsx("span",{style:{fontSize:"13px",color:"#64748B"},children:"Max size: 5MB"})]})]})]}),o.jsxs(po,{children:[o.jsx(U,{type:"button",$variant:"secondary",onClick:e,disabled:t,children:"Cancel"}),o.jsx(U,{type:"submit",form:"ticket-form",disabled:t,children:t?"Submitting...":o.jsxs(o.Fragment,{children:[o.jsx(ve,{size:16}),"Submit Ticket"]})})]})]})})},uo=()=>ce.get("/api/funds"),ho=M`
  from { opacity: 0; }
  to   { opacity: 1; }
`,go=M`
  from { opacity: 0; transform: translateY(-16px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`,fo=r.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding-top: 14vh;
  animation: ${ho} 0.15s ease-out;
`,mo=r.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: 480px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${go} 0.2s ease-out;
  align-self: flex-start;
`,bo=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
`,yo=r.div`
  color: ${({theme:e})=>e.colors.textMuted};
  display: flex;
  align-items: center;
`,jo=r.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: ${({theme:e})=>e.colors.text};
  font-size: 16px;
  font-weight: 500;

  &::placeholder {
    color: ${({theme:e})=>e.colors.textMuted};
    font-weight: 400;
  }
`,$o=r.button`
  background: ${({theme:e})=>e.colors.muted};
  border: 1px solid ${({theme:e})=>e.colors.border};
  color: ${({theme:e})=>e.colors.textMuted};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: ${({theme:e})=>e.colors.text};
    background: ${({theme:e})=>e.colors.border};
  }
`,vo=r.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`,X=r.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: ${({$active:e,theme:t})=>e?t.colors.muted:"transparent"};
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.12s;
  color: ${({theme:e})=>e.colors.text};

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
  }
`,ko=r.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
`,wo=r.div`
  flex: 1;
  min-width: 0;
`,Co=r.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,So=r.div`
  font-size: 12px;
  color: ${({theme:e})=>e.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 1px;
`,zo=r.div`
  color: ${({theme:e})=>e.colors.textMuted};
  opacity: 0;
  transition: opacity 0.15s;

  ${X}:hover & { opacity: 1; }
`,_=r.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: 14px;
`,Mo=r.div`
  padding: 10px 20px;
  border-top: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: ${({theme:e})=>e.colors.textMuted};
`,R=r.span`
  font-size: 11px;
  font-weight: 600;
  background: ${({theme:e})=>e.colors.muted};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 4px;
  padding: 1px 5px;
  margin-right: 4px;
`,Io=({onClose:e})=>{const t=K(),p=n.useRef(null),[i,m]=n.useState(""),[u,l]=n.useState([]),[g,f]=n.useState([]),[y,h]=n.useState(!1),[j,b]=n.useState(0);n.useEffect(()=>{var s;(s=p.current)==null||s.focus()},[]),n.useEffect(()=>{let s=!1;return h(!0),uo().then(c=>{s||f(c.data||[])}).catch(()=>{}).finally(()=>{s||h(!1)}),()=>{s=!0}},[]),n.useEffect(()=>{if(!i.trim()){l(g.slice(0,8)),b(0);return}const s=i.toLowerCase(),c=g.filter(v=>(v.name||"").toLowerCase().includes(s)||(v.type||"").toLowerCase().includes(s)||(v.assetType||"").toLowerCase().includes(s)).slice(0,10);l(c),b(0)},[i,g]);const $=n.useCallback(s=>{if(s.key==="Escape"){e();return}s.key==="ArrowDown"&&(s.preventDefault(),b(c=>Math.min(c+1,u.length-1))),s.key==="ArrowUp"&&(s.preventDefault(),b(c=>Math.max(c-1,0))),s.key==="Enter"&&u[j]&&(e(),t("/dashboard/explore"))},[u,j,e,t]),S=()=>{e(),t("/dashboard/explore")};return o.jsx(fo,{onClick:e,children:o.jsxs(mo,{onClick:s=>s.stopPropagation(),onKeyDown:$,children:[o.jsxs(bo,{children:[o.jsx(yo,{children:o.jsx(W,{size:20})}),o.jsx(jo,{ref:p,placeholder:"Search stocks, mutual funds, or symbols...",value:i,onChange:s=>m(s.target.value)}),o.jsx($o,{onClick:e,children:"ESC"})]}),o.jsx(vo,{children:y?o.jsx(_,{children:"Loading funds..."}):u.length===0?o.jsx(_,{children:i?`No results for "${i}"`:"No funds available"}):u.map((s,c)=>o.jsxs(X,{$active:c===j,onClick:S,onMouseEnter:()=>b(c),children:[o.jsx(ko,{children:o.jsx(de,{size:18})}),o.jsxs(wo,{children:[o.jsx(Co,{children:s.name}),o.jsxs(So,{children:[s.type&&o.jsx("span",{children:s.type}),s.risk&&o.jsxs("span",{children:["• ",s.risk," Risk"]}),s.nav&&o.jsxs("span",{children:["• NAV ₹",s.nav]})]})]}),o.jsx(zo,{children:o.jsx(pe,{size:16})})]},s.id||c))}),o.jsxs(Mo,{children:[o.jsxs("span",{children:[o.jsx(R,{children:"↑↓"})," Navigate"]}),o.jsxs("span",{children:[o.jsx(R,{children:"↵"})," Select"]}),o.jsxs("span",{children:[o.jsx(R,{children:"Esc"})," Close"]})]})]})})},Fo=M`
  from { opacity: 0; }
  to   { opacity: 1; }
`,No=M`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`,Oo=r.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${Fo} 0.15s ease-out;
`,Ro=r.div`
  background-color: ${({theme:e})=>e.colors.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${No} 0.25s ease-out;
`,Do=r.div`
  padding: 24px;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: ${({theme:e})=>e.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
  }
`,Bo=r.button`
  background: none;
  border: none;
  color: ${({theme:e})=>e.colors.textMuted};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
    color: ${({theme:e})=>e.colors.text};
  }
`,To=r.form`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`,q=r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: ${({theme:e})=>e.colors.text};
    letter-spacing: 0.2px;
  }
`,Eo=r.input`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.colors.background};
  color: ${({theme:e})=>e.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({theme:e})=>e.colors.secondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  &::placeholder {
    color: ${({theme:e})=>e.colors.textMuted};
  }
`,Lo=r.select`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background-color: ${({theme:e})=>e.colors.background};
  color: ${({theme:e})=>e.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${({theme:e})=>e.colors.secondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }
`,Ao=r.div`
  padding: 20px 24px;
  border-top: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: ${({theme:e})=>e.colors.background};
`,H=r.button`
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  ${({$variant:e,theme:t})=>e==="secondary"?`
        background-color: transparent;
        color: ${t.colors.text};
        border: 1px solid ${t.colors.border};
        &:hover { background-color: ${t.colors.muted}; }
      `:`
      background-color: ${t.colors.secondary};
      color: #FFF;
      border: none;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
      &:hover { background-color: #1D4ED8; transform: translateY(-1px); }
      &:active { transform: translateY(0); }
      &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    `}
`,Po=r.div`
  padding: 32px 24px;
  text-align: center;
  color: ${({theme:e})=>e.colors.success};
  font-size: 15px;
  font-weight: 600;
`,Uo=({onClose:e})=>{const{user:t}=G(),[p,i]=n.useState(!1),[m,u]=n.useState(!1),[l,g]=n.useState({fundName:"",amount:""}),f=h=>{const{name:j,value:b}=h.target;g($=>({...$,[j]:b}))},y=async h=>{if(h.preventDefault(),!(!l.fundName||!l.amount)){i(!0);try{await we({userId:t==null?void 0:t.id,fundName:l.fundName,amount:parseFloat(l.amount)}),u(!0),setTimeout(()=>e(),1800)}catch{alert("Redemption request failed. Please try again.")}finally{i(!1)}}};return o.jsx(Oo,{onClick:e,children:o.jsxs(Ro,{onClick:h=>h.stopPropagation(),children:[o.jsxs(Do,{children:[o.jsxs("h2",{children:[o.jsx(Ee,{size:22,color:"#3B82F6"}),"Redeem Investment"]}),o.jsx(Bo,{onClick:e,children:o.jsx(E,{size:20})})]}),m?o.jsx(Po,{children:"Redemption request submitted successfully!"}):o.jsxs(o.Fragment,{children:[o.jsxs(To,{id:"redeem-form",onSubmit:y,children:[o.jsxs(q,{children:[o.jsx("label",{htmlFor:"fundName",children:"Fund Name"}),o.jsxs(Lo,{id:"fundName",name:"fundName",required:!0,value:l.fundName,onChange:f,children:[o.jsx("option",{value:"",disabled:!0,children:"Select a fund to redeem"}),o.jsx("option",{value:"HDFC Mid-Cap Opportunities",children:"HDFC Mid-Cap Opportunities"}),o.jsx("option",{value:"SBI Bluechip Fund",children:"SBI Bluechip Fund"}),o.jsx("option",{value:"ICICI Pru Technology Fund",children:"ICICI Pru Technology Fund"}),o.jsx("option",{value:"Axis Long Term Equity",children:"Axis Long Term Equity"}),o.jsx("option",{value:"Mirae Asset Large Cap",children:"Mirae Asset Large Cap"})]})]}),o.jsxs(q,{children:[o.jsx("label",{htmlFor:"amount",children:"Amount (₹)"}),o.jsx(Eo,{id:"amount",name:"amount",type:"number",min:"100",step:"100",required:!0,placeholder:"Enter amount to redeem",value:l.amount,onChange:f})]})]}),o.jsxs(Ao,{children:[o.jsx(H,{type:"button",$variant:"secondary",onClick:e,disabled:p,children:"Cancel"}),o.jsx(H,{type:"submit",form:"redeem-form",disabled:p,children:p?"Processing...":"Submit Redemption"})]})]})]})})},_o=r.header`
  height: 72px;
  background-color: ${({theme:e})=>e.colors.header};
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 40;
`,qo=r.div`
  display: flex;
  align-items: center;
  gap: 16px;
`,Ho=r.button`
  background: none;
  border: none;
  color: ${({theme:e})=>e.colors.text};
  cursor: pointer;
  display: none;
  padding: 8px;
  border-radius: 8px;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
  }
`,Yo=r.div`
  display: flex;
  align-items: center;
  background-color: ${({theme:e})=>e.colors.background};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 8px;
  padding: 8px 16px;
  width: 300px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({theme:e})=>e.colors.secondary};
  }

  &:focus-within {
    border-color: ${({theme:e})=>e.colors.secondary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  @media (max-width: 768px) {
    display: none;
  }
`,Ko=r.span`
  flex: 1;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: 14px;
  margin-left: 8px;
  user-select: none;
`,Qo=r.span`
  font-size: 11px;
  font-weight: 600;
  background: ${({theme:e})=>e.colors.muted};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 4px;
  padding: 2px 6px;
  color: ${({theme:e})=>e.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 2px;
`,Wo=r.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1024px) {
    display: none;
  }
`,Go=r.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;

  span.label {
    color: ${({theme:e})=>e.colors.textMuted};
    text-transform: uppercase;
    font-weight: 600;
  }

  span.value {
    color: ${({theme:e})=>e.colors.text};
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;

    &.up { color: ${({theme:e})=>e.colors.success}; }
    &.down { color: ${({theme:e})=>e.colors.danger}; }
  }
`,Vo=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,Xo=r.button`
  background-color: ${({theme:e})=>e.colors.secondary};
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);

  &:hover {
    background-color: #1D4ED8;
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
`,Jo=r.button`
  background-color: transparent;
  color: ${({theme:e})=>e.colors.text};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
    border-color: ${({theme:e})=>e.colors.textMuted};
  }
`,Zo=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 12px;
  border-right: 1px solid ${({theme:e})=>e.colors.divider};
  padding-right: 20px;

  @media (max-width: 1024px) {
    display: none;
  }
`,D=r.button`
  background: none;
  border: none;
  color: ${({theme:e})=>e.colors.textMuted};
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
    color: ${({theme:e})=>e.colors.primary};
  }
`,er=r.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #EF4444;
  border: 2px solid ${({theme:e})=>e.colors.header};
`,B=r.div`
  position: relative;
`,T=r.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: ${({theme:e})=>e.colors.surface};
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 12px;
  box-shadow: ${({theme:e})=>e.shadows.lg};
  width: ${({$width:e})=>e||"240px"};
  display: ${({$isOpen:e})=>e?"flex":"none"};
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
`,w=r.button`
  padding: 12px 16px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({$color:e,theme:t})=>e||t.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
  }
`,Y=r.div`
  height: 1px;
  background-color: ${({theme:e})=>e.colors.divider};
`,or=r.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: ${({theme:e})=>e.colors.text};
  }
`,rr=r.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.secondary};
  cursor: pointer;
  padding: 0;

  &:hover { text-decoration: underline; }
`,tr=r.div`
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  background-color: ${({$unread:e,theme:t})=>e?`${t.colors.secondary}08`:"transparent"};

  &:hover {
    background-color: ${({theme:e})=>e.colors.muted};
  }
`,sr=r.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({$bg:e})=>e||"rgba(59,130,246,0.1)"};
  color: ${({$color:e})=>e||"#3B82F6"};
`,nr=r.div`
  flex: 1;
  min-width: 0;
`,ir=r.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
`,ar=r.div`
  font-size: 11px;
  color: ${({theme:e})=>e.colors.textMuted};
  margin-top: 2px;
`,lr=r.div`
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.colors.secondary};
  margin-top: 6px;
`,cr=r.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({theme:e})=>e.colors.primary};
  color: ${({theme:e})=>e.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 0 3px ${({theme:e})=>`${e.colors.secondary}30`};
  }
`,dr=r.div`
  padding: 16px;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
`,pr=r.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
  margin-bottom: 2px;
`,xr=r.div`
  font-size: 12px;
  color: ${({theme:e})=>e.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,ur=[{label:"NIFTY 50",value:"24,560.10",change:"+294.70",pct:"+1.2%",positive:!0},{label:"SENSEX",value:"80,123.45",change:"+640.30",pct:"+0.8%",positive:!0}],hr=[{id:1,title:"KYC Verification Pending",time:"2 hours ago",unread:!0,icon:o.jsx(xe,{size:18}),bg:"rgba(245,158,11,0.1)",color:"#D97706"},{id:2,title:"Complete your UCC Registration",time:"1 day ago",unread:!0,icon:o.jsx(Re,{size:18}),bg:"rgba(59,130,246,0.1)",color:"#3B82F6"},{id:3,title:"Welcome to OngoleBulls!",time:"3 days ago",unread:!1,icon:o.jsx(Se,{size:18}),bg:"rgba(16,185,129,0.1)",color:"#10B981"}],gr=({toggleSidebar:e,toggleTheme:t,isDark:p})=>{const i=K(),{logout:m}=G(),[u,l]=n.useState(!1),[g,f]=n.useState(!1),[y,h]=n.useState(!1),[j,b]=n.useState(!1),[$,S]=n.useState(!1),[s,c]=n.useState(!1),[v,J]=n.useState(hr),[Z,ee]=n.useState("Investor"),[L,oe]=n.useState(""),[re,I]=n.useState("OB"),F=n.useRef(null),N=n.useRef(null),O=n.useRef(null);n.useEffect(()=>{const a=localStorage.getItem("ob_user");let x="Investor",P="";if(a)try{const d=JSON.parse(a);d!=null&&d.fullName?x=d.fullName:d!=null&&d.name?x=d.name:d!=null&&d.username&&(x=d.username),d!=null&&d.email&&(P=d.email)}catch{}ee(x),oe(P);const k=x.trim().split(/\s+/);k.length>=2?I((k[0][0]+k[1][0]).toUpperCase()):k.length===1&&k[0].length>0?I(k[0].substring(0,2).toUpperCase()):I("OB")},[]),n.useEffect(()=>{const a=x=>{F.current&&!F.current.contains(x.target)&&l(!1),N.current&&!N.current.contains(x.target)&&S(!1),O.current&&!O.current.contains(x.target)&&c(!1)};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[]),n.useEffect(()=>{const a=x=>{(x.metaKey||x.ctrlKey)&&x.key==="k"&&(x.preventDefault(),h(!0))};return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[]);const te=()=>{l(!1),f(!0)},se=()=>{J(a=>a.map(x=>({...x,unread:!1})))},ne=async()=>{c(!1),await m(),i("/login")},A=v.filter(a=>a.unread).length;return o.jsxs(o.Fragment,{children:[o.jsxs(_o,{children:[o.jsxs(qo,{children:[o.jsx(Ho,{onClick:e,children:o.jsx(_e,{size:24})}),o.jsxs(Yo,{onClick:()=>h(!0),children:[o.jsx(W,{size:18,color:"currentColor"}),o.jsx(Ko,{children:"Search stocks, funds, or symbols..."}),o.jsxs(Qo,{children:[o.jsx(Pe,{size:11}),"K"]})]})]}),o.jsx(Wo,{children:ur.map(a=>o.jsxs(Go,{children:[o.jsx("span",{className:"label",children:a.label}),o.jsxs("span",{className:`value ${a.positive?"up":"down"}`,children:[a.value," ",a.positive?o.jsx(Ce,{size:14}):o.jsx(ze,{size:14})," ",a.pct]})]},a.label))}),o.jsxs(Vo,{children:[o.jsxs(Zo,{children:[o.jsx(Xo,{onClick:()=>i("/dashboard/explore"),children:"Invest"}),o.jsx(Jo,{onClick:()=>b(!0),children:"Redeem"})]}),o.jsx(D,{onClick:t,title:"Toggle Theme",children:p?o.jsx(Me,{size:20}):o.jsx(Ie,{size:20})}),o.jsxs(B,{ref:N,children:[o.jsxs(D,{title:"Notifications",onClick:()=>S(!$),children:[o.jsx(Fe,{size:20}),A>0&&o.jsx(er,{})]}),o.jsxs(T,{$isOpen:$,$width:"320px",children:[o.jsxs(or,{children:[o.jsx("h4",{children:"Notifications"}),A>0&&o.jsx(rr,{onClick:se,children:"Mark all read"})]}),v.map(a=>o.jsxs(tr,{$unread:a.unread,children:[o.jsx(sr,{$bg:a.bg,$color:a.color,children:a.icon}),o.jsxs(nr,{children:[o.jsx(ir,{children:a.title}),o.jsx(ar,{children:a.time})]}),a.unread&&o.jsx(lr,{})]},a.id))]})]}),o.jsxs(B,{ref:F,children:[o.jsx(D,{title:"Help & Support",onClick:()=>l(!u),children:o.jsx(V,{size:20})}),o.jsxs(T,{$isOpen:u,children:[o.jsxs(w,{onClick:te,children:[o.jsx(Ne,{size:18}),"Raise Support Ticket"]}),o.jsx(Y,{}),o.jsxs(w,{onClick:()=>{l(!1),i("/dashboard/support")},children:[o.jsx(ke,{size:18}),"Contact Support"]}),o.jsxs(w,{onClick:()=>{l(!1),i("/dashboard/support")},children:[o.jsx(Be,{size:18}),"FAQ"]})]})]}),o.jsxs(B,{ref:O,children:[o.jsx(cr,{onClick:()=>c(!s),children:re}),o.jsxs(T,{$isOpen:s,$width:"260px",children:[o.jsxs(dr,{children:[o.jsx(pr,{children:Z}),L&&o.jsx(xr,{children:L})]}),o.jsxs(w,{onClick:()=>{c(!1),i("/dashboard/profile")},children:[o.jsx(Q,{size:18}),"My Profile"]}),o.jsxs(w,{onClick:()=>{c(!1),i("/dashboard/support")},children:[o.jsx(Oe,{size:18}),"Settings"]}),o.jsx(Y,{}),o.jsxs(w,{$color:"#DC2626",onClick:ne,children:[o.jsx(ye,{size:18}),"Sign Out"]})]})]})]})]}),g&&o.jsx(xo,{onClose:()=>f(!1)}),y&&o.jsx(Io,{onClose:()=>h(!1)}),j&&o.jsx(Uo,{onClose:()=>b(!1)})]})},fr=r.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: ${({theme:e})=>e.colors.background};
  font-family: ${({theme:e})=>e.typography.fontFamily};
  color: ${({theme:e})=>e.colors.text};
  overflow-x: hidden;
`,mr=r.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease-in-out;
  margin-left: 260px; /* Sidebar width */
  width: auto;
  max-width: none;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
  }
`,br=r.div`
  padding: 28px 24px;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px 10px;
  }
`,Ar=()=>{const[e,t]=n.useState(!1),{isDark:p,toggleTheme:i}=ue(),m=()=>{t(!e)};return o.jsx(he,{theme:p?fe:me,children:o.jsxs(fr,{children:[o.jsx(Ze,{isOpen:e,toggleSidebar:m}),o.jsxs(mr,{children:[o.jsx(gr,{toggleSidebar:m,toggleTheme:i,isDark:p}),o.jsx(br,{children:o.jsx(ge,{})})]})]})})};export{Ar as UserDashboardLayout};
