import{c as he,b as w,u as fe,G as ye,r as n,j as e,Q as je,z as o}from"./index-DpzyeW7E.js";import{d as J,l as Q}from"./theme-CVoCgdjI.js";import{L as be,a as me}from"./log-out-DQ4FEgyy.js";import{U as W}from"./user-check-C9hLSXH-.js";import{T as E}from"./triangle-alert-CgoYd9eF.js";import{C as N}from"./circle-check-big-HtEvDTp-.js";import{R as G}from"./refresh-cw-BfTJLgr5.js";import{C as ae}from"./clock-CFif83e3.js";import{S as Se}from"./search-BmsQ4217.js";import{I as ke}from"./inbox-CChkUiij.js";import{C as ve}from"./chevron-right-m3QVgGOH.js";import{X as le}from"./x-CUlFmB3t.js";import{S as Y}from"./shield-BzBb_-dh.js";import{U as $e}from"./user-Cn4dwgpp.js";import{M as we,S as Te}from"./send-CG5gpik9.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]],ce=he("ticket",ze),k={getStats:()=>w.get("/api/support/stats"),getTickets:t=>w.get("/api/support/tickets",{params:t}),getMyTickets:()=>w.get("/api/support/tickets/mine"),getTicketDetail:t=>w.get(`/api/support/tickets/${t}`),addReply:(t,s)=>w.post(`/api/support/tickets/${t}/reply`,s),updateStatus:(t,s)=>w.patch(`/api/support/tickets/${t}/status`,{status:s}),assignTicket:(t,s)=>w.patch(`/api/support/tickets/${t}/assign`,{assignedTo:String(s)}),escalateTicket:t=>w.patch(`/api/support/tickets/${t}/escalate`),getEscalations:()=>w.get("/api/support/escalations")},Ie=[{key:"overview",label:"Overview",Icon:be},{key:"tickets",label:"All Tickets",Icon:ce},{key:"mine",label:"My Tickets",Icon:W},{key:"escalations",label:"Escalations",Icon:E}],Ee={overview:"Overview",tickets:"All Tickets",mine:"My Tickets",escalations:"Escalations"},A=t=>{if(!t)return"—";try{return new Date(t).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}catch{return"—"}},Z=t=>{if(!t)return"";try{return new Date(t).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}catch{return""}},ee=t=>{if(!t)return"?";const s=t.trim().split(/\s+/);return s.length>1?(s[0][0]+s[s.length-1][0]).toUpperCase():t.substring(0,2).toUpperCase()},Ce=o.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: ${({theme:t})=>t.colors.background};
  color: ${({theme:t})=>t.colors.text};
`,Re=o.aside`
  width: 240px;
  background: ${({theme:t})=>t.colors.sidebar};
  border-right: 1px solid ${({theme:t})=>t.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 20;
`,te=o.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  border-left: 3px solid ${({$active:t,theme:s})=>t?s.colors.secondary:"transparent"};
  background: ${({$active:t,theme:s})=>t?`${s.colors.secondary}15`:"transparent"};
  color: ${({$active:t,theme:s})=>t?s.colors.secondary:s.colors.textMuted};
  font-size: 14px;
  font-weight: ${({$active:t})=>t?600:500};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  &:hover {
    background: ${({theme:t})=>`${t.colors.secondary}10`};
    color: ${({theme:t})=>t.colors.secondary};
  }
`,Le=o.div`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  background: ${({theme:t})=>t.colors.background};
`,Me=o.header`
  height: 64px;
  background: ${({theme:t})=>t.colors.header};
  border-bottom: 1px solid ${({theme:t})=>t.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`,Oe=o.div`
  padding: 24px;
`,C=o.div`
  background: ${({theme:t})=>t.colors.surface};
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 12px;
  box-shadow: ${({theme:t})=>t.shadows.sm};
  padding: 20px;
`,Be=o.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`,Ne=o.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({theme:t})=>t.colors.text};
`,Ae=o.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({theme:t})=>t.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,D=o.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`,u=o.th`
  background: ${({theme:t})=>t.colors.muted};
  color: ${({theme:t})=>t.colors.textMuted};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid ${({theme:t})=>t.colors.border};
  &:first-child { border-radius: 8px 0 0 0; }
  &:last-child { border-radius: 0 8px 0 0; }
`,P=o.tr`
  transition: background 0.1s ease;
  &:hover { background: ${({theme:t})=>`${t.colors.muted}`}; }
`,h=o.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({theme:t})=>t.colors.text};
  border-bottom: 1px solid ${({theme:t})=>t.colors.border};
  vertical-align: middle;
`;o.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${({$bg:t})=>t};
  color: ${({$color:t})=>t};
`;const T=o.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  padding: ${({$variant:t})=>t==="ghost"?"6px 8px":"10px 20px"};
  background: ${({$variant:t,theme:s})=>t==="primary"?s.colors.secondary:t==="danger"?s.colors.danger:t==="ghost"?"transparent":s.colors.surface};
  color: ${({$variant:t,theme:s})=>t==="primary"||t==="danger"?s.colors.buttonText:s.colors.text};
  border: ${({$variant:t,theme:s})=>t==="outline"?`1px solid ${s.colors.border}`:"none"};
  &:hover {
    opacity: 0.9;
    ${({$variant:t,theme:s})=>t==="outline"?`background: ${s.colors.muted};`:""}
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,De=o.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: slideIn 0.2s ease;
  @keyframes slideIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`,Pe=o.div`
  background: ${({theme:t})=>t.colors.surface};
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: ${({$width:t})=>t||560}px;
  max-height: 90vh;
  overflow: auto;
`,Fe=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({theme:t})=>t.colors.border};
`,Ke=o.div`
  padding: 24px;
`;o.div`
  padding: 16px 24px;
  border-top: 1px solid ${({theme:t})=>t.colors.border};
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;const He=o.input`
  width: 100%;
  height: 44px;
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${({theme:t})=>t.colors.text};
  background: ${({theme:t})=>t.colors.surface};
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  &:focus {
    border-color: ${({theme:t})=>t.colors.secondary};
    box-shadow: 0 0 0 3px ${({theme:t})=>`${t.colors.secondary}20`};
  }
`,Ue=o.textarea`
  width: 100%;
  min-height: 100px;
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: ${({theme:t})=>t.colors.text};
  background: ${({theme:t})=>t.colors.surface};
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
  &:focus {
    border-color: ${({theme:t})=>t.colors.secondary};
    box-shadow: 0 0 0 3px ${({theme:t})=>`${t.colors.secondary}20`};
  }
`,We=o.select`
  height: 44px;
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${({theme:t})=>t.colors.text};
  background: ${({theme:t})=>t.colors.surface};
  outline: none;
  font-family: inherit;
  cursor: pointer;
  &:focus {
    border-color: ${({theme:t})=>t.colors.secondary};
    box-shadow: 0 0 0 3px ${({theme:t})=>`${t.colors.secondary}20`};
  }
`,v=o.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({theme:t})=>t.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`,Ge=o.div`
  text-align: center;
  padding: 48px 24px;
  background: ${({theme:t})=>t.colors.surface};
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 12px;
`,_e=o.div`
  display: flex;
  justify-content: center;
  padding: 48px;
`,Ve=o.div`
  width: 28px;
  height: 28px;
  border: 3px solid ${({theme:t})=>t.colors.border};
  border-top-color: ${({theme:t})=>t.colors.secondary};
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`,se=o.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`,oe=o.button`
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  background: ${({$active:t,theme:s})=>t?s.colors.secondary:s.colors.muted};
  color: ${({$active:t,theme:s})=>t?s.colors.buttonText:s.colors.textMuted};
  &:hover {
    background: ${({$active:t,theme:s})=>t?s.colors.secondary:s.colors.border};
  }
`,Xe=o.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: ${({theme:t})=>t.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid ${({$type:t,theme:s})=>t==="success"?s.colors.success:s.colors.danger};
  max-width: 360px;
  animation: toastIn 0.3s ease;
  @keyframes toastIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`,qe=o.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px 0;
`,de=o.div`
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({$isSupport:t,theme:s})=>t?s.colors.muted:`${s.colors.secondary}15`};
  border: 1px solid ${({theme:t})=>t.colors.border};
  max-width: 85%;
  align-self: ${({$isSupport:t})=>t?"flex-end":"flex-start"};
`,Je=o(P)`
  background: ${({$severity:t,theme:s})=>t==="critical"?s.colors.dangerLight:t==="warning"?s.colors.warningLight:"transparent"};
`,Qe=o(de)`
  background: ${({theme:t})=>t.colors.warningLight};
  border-color: ${({theme:t})=>t.colors.warning};
`,Ye=o.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`,B=o.div``,Ze=o.div`
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({theme:t})=>t.colors.border};
  margin-bottom: 12px;
`,re=o.button`
  flex: 1;
  padding: 8px 16px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  background: ${({$active:t,theme:s})=>t?s.colors.secondary:s.colors.surface};
  color: ${({$active:t,theme:s})=>t?s.colors.buttonText:s.colors.textMuted};
  transition: all 0.15s ease;
`;function _({priority:t}){const s={HIGH:{bg:"dangerLight",color:"danger"},MEDIUM:{bg:"warningLight",color:"warning"},LOW:{bg:"muted",color:"textMuted"}},l=s[t]||s.LOW;return e.jsx(R,{$bgKey:l.bg,$colorKey:l.color,children:t})}const R=o.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${({$bgKey:t,theme:s})=>s.colors[t]};
  color: ${({$colorKey:t,theme:s})=>s.colors[t]};
`;function V({status:t}){const s={OPEN:{bg:"warningLight",color:"warning",icon:e.jsx(ae,{size:12})},IN_PROGRESS:{bg:"muted",color:"secondary",icon:e.jsx(G,{size:12})},RESOLVED:{bg:"successLight",color:"success",icon:e.jsx(N,{size:12})},CLOSED:{bg:"muted",color:"textMuted"}},l=s[t]||s.OPEN;return e.jsxs(R,{$bgKey:l.bg,$colorKey:l.color,children:[l.icon," ",t.replace("_"," ")]})}function pe({category:t}){return e.jsx(R,{$bgKey:"muted",$colorKey:"text",children:t.replace(/_/g," ")})}function _t(){const t=fe(),{isDark:s,toggleTheme:l}=ye(),c=JSON.parse(localStorage.getItem("ob_user")||"{}");n.useEffect(()=>{c.role!=="SUPPORT"&&t("/login")},[c.role,t]);const[i,m]=n.useState("overview"),[x,f]=n.useState(null);n.useEffect(()=>{if(!x)return;const p=setTimeout(()=>f(null),3e3);return()=>clearTimeout(p)},[x]);const g=(p,S)=>f({type:p,message:S}),j=()=>{localStorage.removeItem("ob_user"),t("/login")};return c.role!=="SUPPORT"?null:e.jsx(je,{theme:s?J:Q,children:e.jsxs(Ce,{children:[e.jsxs(Re,{children:[e.jsxs("div",{style:{padding:"20px 16px 16px",borderBottom:`1px solid ${s?J.colors.border:Q.colors.border}`},children:[e.jsx(et,{children:"OngoleBulls Invest"}),e.jsx(tt,{children:"Support Dashboard"})]}),e.jsxs(st,{children:[e.jsx(xe,{children:ee(c.fullName||c.name)}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx(rt,{children:c.fullName||c.name||"Support"}),e.jsx(it,{children:"Support"})]})]}),e.jsx("nav",{style:{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2},children:Ie.map(({key:p,label:S,Icon:r})=>e.jsxs(te,{$active:i===p,onClick:()=>m(p),children:[e.jsx(r,{size:18})," ",S]},p))}),e.jsx(nt,{children:e.jsxs(te,{onClick:j,children:[e.jsx(me,{size:16})," Logout"]})})]}),e.jsxs(Le,{children:[e.jsxs(Me,{children:[e.jsx(at,{children:Ee[i]}),e.jsxs(lt,{children:[e.jsx("button",{onClick:l,title:s?"Switch to Light Mode":"Switch to Dark Mode",style:{background:"none",border:`1px solid ${s?"#334155":"#e2e8f0"}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",transition:"all 0.2s ease",color:"inherit"},children:s?"☀️":"🌙"}),e.jsx(ct,{children:c.fullName||c.name}),e.jsx(ot,{children:ee(c.fullName||c.name)})]})]}),e.jsxs(Oe,{children:[i==="overview"&&e.jsx(dt,{showToast:g,userId:c.id}),i==="tickets"&&e.jsx(wt,{showToast:g,userId:c.id}),i==="mine"&&e.jsx(It,{showToast:g,userId:c.id}),i==="escalations"&&e.jsx(Et,{showToast:g,userId:c.id})]})]}),x&&e.jsxs(Xe,{$type:x.type,children:[x.type==="success"?e.jsx(N,{size:16}):e.jsx(E,{size:16}),e.jsx("span",{style:{fontSize:14},children:x.message})]})]})})}const et=o.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({theme:t})=>t.colors.text};
  letter-spacing: -0.2px;
`,tt=o.div`
  font-size: 11px;
  color: ${({theme:t})=>t.colors.textMuted};
  margin-top: 2px;
`,st=o.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${({theme:t})=>t.colors.border};
  display: flex;
  align-items: center;
  gap: 10px;
`,xe=o.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({theme:t})=>t.colors.secondary}, #1D4ED8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
`,ot=o(xe)`
  width: 32px;
  height: 32px;
  font-size: 12px;
`,rt=o.div`
  color: ${({theme:t})=>t.colors.text};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,it=o.span`
  display: inline-block;
  margin-top: 3px;
  padding: 2px 8px;
  border-radius: 10px;
  background: ${({theme:t})=>t.colors.secondary};
  color: #fff;
  font-size: 10px;
  font-weight: 600;
`,nt=o.div`
  padding: 8px 8px 16px;
  border-top: 1px solid ${({theme:t})=>t.colors.border};
`,at=o.span`
  font-size: 18px;
  font-weight: 600;
  color: ${({theme:t})=>t.colors.text};
`,lt=o.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,ct=o.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({theme:t})=>t.colors.text};
`;function L(){return e.jsx(_e,{children:e.jsx(Ve,{})})}function X({text:t}){return e.jsxs(Ge,{children:[e.jsx(ke,{size:40,style:{marginBottom:12,opacity:.4}}),e.jsx("p",{style:{fontSize:14,opacity:.6},children:t})]})}function M({msg:t,onRetry:s}){return e.jsxs(C,{style:{textAlign:"center",padding:32},children:[e.jsx("p",{style:{marginBottom:12,color:"inherit"},children:t}),e.jsxs(T,{$variant:"outline",onClick:s,children:[e.jsx(G,{size:14})," Retry"]})]})}function dt({showToast:t,userId:s}){const[l,c]=n.useState(null),[i,m]=n.useState([]),[x,f]=n.useState(!0),[g,j]=n.useState(""),p=n.useCallback(async()=>{f(!0),j("");try{const[a,$]=await Promise.all([k.getStats(),k.getTickets({})]);c(a.data),m($.data)}catch{j("Failed to load overview data")}finally{f(!1)}},[]);if(n.useEffect(()=>{p()},[p]),x)return e.jsx(L,{});if(g)return e.jsx(M,{msg:g,onRetry:p});if(!l)return null;const S=[{label:"Open Tickets",value:l.openTickets,icon:e.jsx(ce,{size:20}),bgKey:"warningLight",colorKey:"warning"},{label:"In Progress",value:l.inProgressTickets,icon:e.jsx(G,{size:20}),bgKey:"muted",colorKey:"secondary"},{label:"Resolved Today",value:l.resolvedToday,icon:e.jsx(N,{size:20}),bgKey:"successLight",colorKey:"success"},{label:"My Open Tickets",value:l.myOpenTickets,icon:e.jsx(W,{size:20}),bgKey:"muted",colorKey:"secondary"},{label:"High Priority Open",value:l.highPriorityOpen,icon:e.jsx(E,{size:20}),bgKey:"dangerLight",colorKey:"danger"},{label:"Avg Resolution (hrs)",value:l.avgResolutionHours,icon:e.jsx(ae,{size:20}),bgKey:"muted",colorKey:"textMuted"}],r=i.filter(a=>a.priority==="HIGH"&&a.status==="OPEN").slice(0,5),d=i.filter(a=>a.status==="RESOLVED").sort((a,$)=>new Date($.resolvedAt||$.updatedAt).getTime()-new Date(a.resolvedAt||a.updatedAt).getTime()).slice(0,5);return e.jsxs(e.Fragment,{children:[e.jsx(Be,{children:S.map(a=>e.jsxs(C,{children:[e.jsxs(pt,{children:[e.jsx(xt,{$bgKey:a.bgKey,$colorKey:a.colorKey,children:a.icon}),e.jsx(Ae,{children:a.label})]}),e.jsx(Ne,{children:a.value})]},a.label))}),e.jsxs(gt,{children:[e.jsxs(C,{children:[e.jsxs(ie,{children:[e.jsx(E,{size:18})," High Priority Tickets"]}),r.length===0?e.jsx("p",{style:{fontSize:14,opacity:.5},children:"No high priority open tickets."}):e.jsx(F,{children:e.jsxs(D,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(u,{children:"Ticket ID"}),e.jsx(u,{children:"Subject"}),e.jsx(u,{children:"Raised By"}),e.jsx(u,{children:"Status"})]})}),e.jsx("tbody",{children:r.map(a=>e.jsxs(P,{children:[e.jsx(h,{children:e.jsx(K,{children:a.ticketId})}),e.jsx(h,{style:{fontWeight:500},children:a.subject}),e.jsx(h,{children:a.raisedByName}),e.jsx(h,{children:e.jsx(V,{status:a.status})})]},a.id))})]})})]}),e.jsxs(C,{children:[e.jsxs(ie,{children:[e.jsx(N,{size:18})," Recently Resolved"]}),d.length===0?e.jsx("p",{style:{fontSize:14,opacity:.5},children:"No recently resolved tickets."}):e.jsx(F,{children:e.jsxs(D,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(u,{children:"Ticket ID"}),e.jsx(u,{children:"Subject"}),e.jsx(u,{children:"Resolved"})]})}),e.jsx("tbody",{children:d.map(a=>e.jsxs(P,{children:[e.jsx(h,{children:e.jsx(K,{children:a.ticketId})}),e.jsx(h,{style:{fontWeight:500},children:a.subject}),e.jsx(h,{children:A(a.resolvedAt||a.updatedAt)})]},a.id))})]})})]})]})]})}const pt=o.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`,xt=o.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({$bgKey:t,theme:s})=>s.colors[t]};
  color: ${({$colorKey:t,theme:s})=>s.colors[t]};
  display: flex;
  align-items: center;
  justify-content: center;
`,gt=o.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`,ie=o.h3`
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${({theme:t})=>t.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`,F=o.div`
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid ${({theme:t})=>t.colors.border};
`,K=o.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  color: ${({theme:t})=>t.colors.secondary};
`;function ut({ticketId:t,onClose:s,showToast:l,onRefresh:c}){const[i,m]=n.useState(null),[x,f]=n.useState(!0),[g,j]=n.useState(""),[p,S]=n.useState(""),[r,d]=n.useState(!1),[a,$]=n.useState(!1),[z,O]=n.useState(""),I=n.useCallback(async()=>{f(!0),j("");try{const y=await k.getTicketDetail(t);m(y.data),O(y.data.status)}catch{j("Failed to load ticket details")}finally{f(!1)}},[t]);n.useEffect(()=>{I()},[I]);const b=async()=>{if(p.trim()){$(!0);try{await k.addReply(t,{message:p.trim(),isInternal:r}),S(""),l("success",r?"Internal note added":"Reply sent"),I(),c()}catch{l("error","Failed to send reply")}finally{$(!1)}}},H=async()=>{if(!(!i||z===i.status))try{await k.updateStatus(t,z),l("success",`Status updated to ${z.replace("_"," ")}`),I(),c()}catch{l("error","Failed to update status")}};return e.jsx(De,{onClick:s,children:e.jsxs(Pe,{$width:640,onClick:y=>y.stopPropagation(),children:[e.jsxs(Fe,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"},children:[e.jsx("span",{style:{fontSize:18,fontWeight:600},children:x?"Loading...":i?i.ticketId:"Ticket"}),i&&e.jsxs(e.Fragment,{children:[e.jsx(V,{status:i.status}),e.jsx(_,{priority:i.priority})]})]}),e.jsx(T,{$variant:"ghost",onClick:s,children:e.jsx(le,{size:20})})]}),e.jsxs(Ke,{children:[x&&e.jsx(L,{}),g&&e.jsx(M,{msg:g,onRetry:I}),i&&!x&&e.jsxs(e.Fragment,{children:[e.jsx(ht,{children:i.subject}),e.jsxs(Ye,{children:[e.jsxs(B,{children:[e.jsx(v,{children:"Raised By"}),e.jsxs(U,{children:[i.raisedByName," (",i.raisedByEmail,")"]})]}),e.jsxs(B,{children:[e.jsx(v,{children:"Category"}),e.jsx("div",{children:e.jsx(pe,{category:i.category})})]}),e.jsxs(B,{children:[e.jsx(v,{children:"Created"}),e.jsxs(U,{children:[A(i.createdAt)," ",Z(i.createdAt)]})]}),e.jsxs(B,{children:[e.jsx(v,{children:"Assigned To"}),e.jsx(U,{children:i.assignedToName||"Unassigned"})]})]}),e.jsxs("div",{style:{marginBottom:20},children:[e.jsx(v,{children:"Description"}),e.jsx(ft,{children:i.description})]}),e.jsxs(v,{children:["Conversation (",i.replies.length,")"]}),e.jsxs(qe,{children:[i.replies.length===0&&e.jsx("p",{style:{textAlign:"center",fontSize:14,opacity:.5,padding:16},children:"No replies yet."}),i.replies.map(y=>{const q=y.isFromSupport?y.message.startsWith("[Internal]"):!1,ue=q?Qe:de;return e.jsxs(ue,{$isSupport:y.isFromSupport,children:[e.jsxs(yt,{children:[e.jsx(jt,{$isSupport:y.isFromSupport,children:y.isFromSupport?e.jsx(Y,{size:12}):e.jsx($e,{size:12})}),e.jsx(bt,{children:y.repliedBy}),e.jsxs(mt,{children:[A(y.createdAt)," ",Z(y.createdAt)]}),y.isFromSupport&&q&&e.jsx(R,{$bgKey:"warningLight",$colorKey:"warning",style:{fontSize:10,padding:"2px 6px"},children:"Internal"})]}),e.jsx(St,{children:y.message})]},y.id)})]}),e.jsxs(kt,{children:[e.jsx(v,{children:"Reply"}),e.jsxs(Ze,{children:[e.jsxs(re,{$active:!r,onClick:()=>d(!1),children:[e.jsx(we,{size:14})," Public Reply"]}),e.jsxs(re,{$active:r,onClick:()=>d(!0),children:[e.jsx(Y,{size:14})," Internal Note"]})]}),e.jsx(Ue,{placeholder:r?"Write an internal note...":"Type your reply...",value:p,onChange:y=>S(y.target.value)}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:8},children:e.jsxs(T,{$variant:"primary",onClick:b,disabled:a||!p.trim(),children:[e.jsx(Te,{size:14})," ",a?"Sending...":"Send"]})})]}),e.jsxs(vt,{children:[e.jsx(v,{style:{marginBottom:0,alignSelf:"center"},children:"Change Status"}),e.jsxs(We,{value:z,onChange:y=>O(y.target.value),children:[e.jsx("option",{value:"OPEN",children:"Open"}),e.jsx("option",{value:"IN_PROGRESS",children:"In Progress"}),e.jsx("option",{value:"RESOLVED",children:"Resolved"}),e.jsx("option",{value:"CLOSED",children:"Closed"})]}),e.jsx(T,{$variant:"outline",onClick:H,disabled:z===i.status,children:"Update"})]})]})]})]})})}const ht=o.h2`
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: ${({theme:t})=>t.colors.text};
`,U=o.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({theme:t})=>t.colors.text};
  margin-top: 2px;
`,ft=o.div`
  background: ${({theme:t})=>t.colors.muted};
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({theme:t})=>t.colors.text};
  white-space: pre-wrap;
`,yt=o.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`,jt=o.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({$isSupport:t,theme:s})=>t?s.colors.secondary:s.colors.muted};
  color: ${({$isSupport:t,theme:s})=>t?"#fff":s.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
`,bt=o.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({theme:t})=>t.colors.text};
`,mt=o.span`
  font-size: 11px;
  color: ${({theme:t})=>t.colors.textMuted};
`,St=o.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({theme:t})=>t.colors.text};
  white-space: pre-wrap;
`,kt=o.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${({theme:t})=>t.colors.border};
`,vt=o.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({theme:t})=>t.colors.border};
  display: flex;
  align-items: center;
  gap: 12px;
`;function ge({tickets:t,showToast:s,onRefresh:l,userId:c,showAssign:i=!1,showUnassign:m=!1}){const[x,f]=n.useState(null),[g,j]=n.useState(null),p=async r=>{j(r);try{await k.assignTicket(r,c),s("success","Ticket assigned to you"),l()}catch{s("error","Failed to assign ticket")}finally{j(null)}},S=async r=>{j(r);try{await k.assignTicket(r,0),s("success","Ticket unassigned"),l()}catch{s("error","Failed to unassign ticket")}finally{j(null)}};return e.jsxs(e.Fragment,{children:[e.jsx(F,{children:e.jsxs(D,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(u,{children:"Ticket ID"}),e.jsx(u,{children:"Subject"}),e.jsx(u,{children:"Raised By"}),e.jsx(u,{children:"Category"}),e.jsx(u,{children:"Priority"}),e.jsx(u,{children:"Status"}),e.jsx(u,{children:"Created"}),e.jsx(u,{children:"Assigned To"}),e.jsx(u,{children:"Actions"})]})}),e.jsx("tbody",{children:t.map(r=>e.jsxs(P,{children:[e.jsx(h,{children:e.jsx(K,{children:r.ticketId})}),e.jsx(h,{style:{fontWeight:500,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r.subject}),e.jsxs(h,{children:[e.jsx("div",{style:{fontSize:14,fontWeight:500},children:r.raisedByName}),e.jsx("div",{style:{fontSize:12,opacity:.6},children:r.raisedByEmail})]}),e.jsx(h,{children:e.jsx(pe,{category:r.category})}),e.jsx(h,{children:e.jsx(_,{priority:r.priority})}),e.jsx(h,{children:e.jsx(V,{status:r.status})}),e.jsx(h,{children:A(r.createdAt)}),e.jsx(h,{children:r.assignedToName||e.jsx("span",{style:{opacity:.4},children:"Unassigned"})}),e.jsx(h,{children:e.jsxs($t,{children:[e.jsxs(T,{$variant:"outline",onClick:()=>f(r.id),style:{padding:"6px 12px",fontSize:12},children:[e.jsx(ve,{size:12})," View & Reply"]}),i&&!r.assignedTo&&e.jsxs(T,{$variant:"primary",onClick:()=>p(r.id),disabled:g===r.id,style:{padding:"6px 12px",fontSize:12},children:[e.jsx(W,{size:12})," Assign to Me"]}),m&&r.assignedTo===c&&e.jsxs(T,{$variant:"outline",onClick:()=>S(r.id),disabled:g===r.id,style:{padding:"6px 12px",fontSize:12},children:[e.jsx(le,{size:12})," Unassign"]})]})})]},r.id))})]})}),x!==null&&e.jsx(ut,{ticketId:x,onClose:()=>f(null),showToast:s,onRefresh:l})]})}const $t=o.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;function wt({showToast:t,userId:s}){const[l,c]=n.useState([]),[i,m]=n.useState(!0),[x,f]=n.useState(""),[g,j]=n.useState(""),[p,S]=n.useState(""),[r,d]=n.useState(""),a=n.useCallback(async()=>{m(!0),f("");try{const b={};g&&(b.status=g),p&&(b.priority=p),r&&(b.search=r);const H=await k.getTickets(b);c(H.data)}catch{f("Failed to load tickets")}finally{m(!1)}},[g,p,r]);n.useEffect(()=>{a()},[a]);const $=["","OPEN","IN_PROGRESS","RESOLVED","CLOSED"],z={"":"All",OPEN:"Open",IN_PROGRESS:"In Progress",RESOLVED:"Resolved",CLOSED:"Closed"},O=["","HIGH","MEDIUM","LOW"],I={"":"All",HIGH:"High",MEDIUM:"Medium",LOW:"Low"};return e.jsxs(e.Fragment,{children:[e.jsxs(Tt,{children:[e.jsxs(ne,{children:[e.jsx(v,{children:"Status"}),e.jsx(se,{children:$.map(b=>e.jsx(oe,{$active:g===b,onClick:()=>j(b),children:z[b]},b))})]}),e.jsxs(ne,{children:[e.jsx(v,{children:"Priority"}),e.jsx(se,{children:O.map(b=>e.jsx(oe,{$active:p===b,onClick:()=>S(b),children:I[b]},b))})]}),e.jsxs(zt,{children:[e.jsx(Se,{size:16,style:{position:"absolute",left:12,top:14,opacity:.4}}),e.jsx(He,{placeholder:"Search by subject or name...",value:r,onChange:b=>d(b.target.value),style:{paddingLeft:36}})]})]}),i&&e.jsx(L,{}),x&&e.jsx(M,{msg:x,onRetry:a}),!i&&!x&&l.length===0&&e.jsx(X,{text:"No tickets found matching your filters."}),!i&&!x&&l.length>0&&e.jsx(ge,{tickets:l,showToast:t,onRefresh:a,userId:s,showAssign:!0})]})}const Tt=o(C)`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`,ne=o.div``,zt=o.div`
  position: relative;
  max-width: 360px;
`;function It({showToast:t,userId:s}){const[l,c]=n.useState([]),[i,m]=n.useState(!0),[x,f]=n.useState(""),g=n.useCallback(async()=>{m(!0),f("");try{const j=await k.getMyTickets();c(j.data)}catch{f("Failed to load your tickets")}finally{m(!1)}},[]);return n.useEffect(()=>{g()},[g]),i?e.jsx(L,{}):x?e.jsx(M,{msg:x,onRetry:g}):l.length===0?e.jsx(X,{text:"You have no tickets assigned to you."}):e.jsx(ge,{tickets:l,showToast:t,onRefresh:g,userId:s,showUnassign:!0})}function Et({showToast:t,userId:s}){const[l,c]=n.useState([]),[i,m]=n.useState(!0),[x,f]=n.useState(""),[g,j]=n.useState(null),p=n.useCallback(async()=>{m(!0),f("");try{const d=await k.getEscalations();c(d.data)}catch{f("Failed to load escalations")}finally{m(!1)}},[]);n.useEffect(()=>{p()},[p]);const S=async d=>{j(d);try{await k.escalateTicket(d),t("success","Ticket escalated"),p()}catch{t("error","Failed to escalate ticket")}finally{j(null)}},r=d=>d>48?"critical":d>24?"warning":"normal";return i?e.jsx(L,{}):x?e.jsx(M,{msg:x,onRetry:p}):l.length===0?e.jsx(X,{text:"No escalated or overdue tickets."}):e.jsx(F,{children:e.jsxs(D,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(u,{children:"Ticket ID"}),e.jsx(u,{children:"Subject"}),e.jsx(u,{children:"Raised By"}),e.jsx(u,{children:"Priority"}),e.jsx(u,{children:"Hours Open"}),e.jsx(u,{children:"Replies"}),e.jsx(u,{children:"Assigned To"}),e.jsx(u,{children:"Action"})]})}),e.jsx("tbody",{children:l.map(d=>e.jsxs(Je,{$severity:r(d.hoursOpen),children:[e.jsx(h,{children:e.jsx(K,{children:d.ticketId})}),e.jsx(h,{style:{fontWeight:500},children:d.subject}),e.jsx(h,{children:d.raisedByName}),e.jsx(h,{children:e.jsx(_,{priority:d.priority})}),e.jsx(h,{children:e.jsxs(Ct,{$severity:r(d.hoursOpen),children:[d.hoursOpen,"h"]})}),e.jsx(h,{children:d.replyCount}),e.jsx(h,{children:d.assignedToName||e.jsx("span",{style:{opacity:.4},children:"Unassigned"})}),e.jsx(h,{children:d.isEscalated?e.jsxs(R,{$bgKey:"dangerLight",$colorKey:"danger",children:[e.jsx(E,{size:12})," Escalated"]}):e.jsxs(T,{$variant:"danger",onClick:()=>S(d.id),disabled:g===d.id,style:{padding:"6px 12px",fontSize:12},children:[e.jsx(E,{size:12})," Escalate"]})})]},d.id))})]})})}const Ct=o.span`
  font-weight: 700;
  font-size: 14px;
  color: ${({$severity:t,theme:s})=>t==="critical"?s.colors.danger:t==="warning"?s.colors.warning:s.colors.text};
`;export{_t as default};
