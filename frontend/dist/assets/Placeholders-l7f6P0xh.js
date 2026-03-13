import{j as e,H as n}from"./index-CkvZNvxp.js";const s=n.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`,r=n.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({theme:t})=>t.colors.textMuted};
`,o=n.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${({theme:t})=>t.colors.surface};
  border-radius: 16px;
  border: 1px dashed ${({theme:t})=>t.colors.border};
  padding: 48px;
  margin-top: 24px;
`,i=n.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({theme:t})=>t.colors.text};
  margin: 0;
`,l=n.p`
  font-size: 15px;
  color: ${({theme:t})=>t.colors.textMuted};
  margin: 8px 0 0 0;
`,d=()=>e.jsxs(s,{children:[e.jsx(i,{children:"Explore Funds"}),e.jsx(l,{children:"Discover top performing mutual funds handpicked for you."}),e.jsxs(o,{children:[e.jsx(r,{children:"🔍"}),e.jsx("h3",{children:"Funds Loading..."}),e.jsx("p",{style:{color:"#64748B"},children:"We are fetching the latest mutual fund data."})]})]}),a=()=>e.jsxs(s,{children:[e.jsx(i,{children:"Your SIPs"}),e.jsx(l,{children:"Manage your systematic investment plans in one place."}),e.jsxs(o,{children:[e.jsx(r,{children:"📈"}),e.jsx("h3",{children:"No Active SIPs"}),e.jsx("p",{style:{color:"#64748B"},children:"Start your first SIP today and build long term wealth."})]})]}),x=()=>e.jsxs(s,{children:[e.jsx(i,{children:"Statements & Reports"}),e.jsx(l,{children:"Download your capital gains and transaction statements."}),e.jsxs(o,{children:[e.jsx(r,{children:"📄"}),e.jsx("h3",{children:"No Statements Generated"}),e.jsx("p",{style:{color:"#64748B"},children:"Your transaction history will appear here once you invest."})]})]}),h=()=>e.jsxs(s,{children:[e.jsx(i,{children:"Support Center"}),e.jsx(l,{children:"Get help with your investments or raise a ticket."}),e.jsxs(o,{children:[e.jsx(r,{children:"💬"}),e.jsx("h3",{children:"Need Help?"}),e.jsx("p",{style:{color:"#64748B"},children:"Use the Help icon in the top header to raise a ticket or view FAQs."})]})]});export{d as ExploreFunds,a as SIPs,x as Statements,h as Support};
