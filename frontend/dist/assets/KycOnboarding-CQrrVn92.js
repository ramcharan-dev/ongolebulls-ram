import{j as e,H as o,r as A,M as pe,P as he}from"./index-BPqVmEPj.js";const xe=o.section`
  background: ${({theme:a})=>a.colors.surface};
  border: 1px solid ${({theme:a})=>a.colors.border};
  border-radius: 16px;
  box-shadow: ${({theme:a})=>a.shadows.sm};
  padding: 16px;
`,fe=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  p {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: ${({theme:a})=>a.colors.textMuted};
  }
`,ge=o.div`
  margin-top: 10px;
  height: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    width: ${({$progress:a})=>`${a}%`};
    background: linear-gradient(90deg, #2563eb, #06b6d4);
    transition: width 220ms ease;
  }
`,be=o.div`
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 2px;
`,je=o.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-start;
  min-width: max-content;
`,Ne=o.li`
  display: flex;
  align-items: flex-start;
`,Ae=o.button`
  width: 92px;
  border: none;
  background: transparent;
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 0;
  cursor: ${({$clickable:a})=>a?"pointer":"default"};

  &:disabled {
    pointer-events: none;
  }
`,ve=o.span`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 2px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;

  ${({$done:a,$active:n})=>a?`
        border-color: #16a34a;
        background: #16a34a;
        color: #ffffff;
      `:n?`
        border-color: #2563eb;
        background: #eff6ff;
        color: #1d4ed8;
      `:`
      border-color: #cbd5e1;
      background: #f8fafc;
      color: #64748b;
    `}
`,ye=o.span`
  font-size: 11px;
  text-align: center;
  color: #334155;
  font-weight: 700;
`,ke=o.span`
  width: 26px;
  height: 2px;
  margin-top: 16px;
  background: ${({$done:a})=>a?"#22c55e":"#dbe4ef"};
`;function Se({steps:a,currentStep:n,onStepClick:r}){const i=Math.round((n+1)/a.length*100);return e.jsxs(xe,{children:[e.jsxs(fe,{children:[e.jsx("p",{children:"KYC onboarding progress"}),e.jsxs("p",{children:[i,"% complete"]})]}),e.jsx(ge,{$progress:i,"aria-hidden":"true",children:e.jsx("span",{})}),e.jsx(be,{children:e.jsx(je,{children:a.map((s,d)=>{const h=d<n,b=d===n,x=d<=n;return e.jsxs(Ne,{children:[e.jsxs(Ae,{type:"button",disabled:!x,onClick:()=>x&&r(d),$clickable:x,children:[e.jsx(ve,{$done:h,$active:b,children:h?"✓":d+1}),e.jsx(ye,{children:s})]}),d<a.length-1?e.jsx(ke,{$done:h,"aria-hidden":"true"}):null]},s)})})})]})}const Pe=o.footer`
  margin-top: 14px;
  border-top: 1px solid ${({theme:a})=>a.colors.border};
  padding-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`,we=o.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`,W=o.button`
  height: 42px;
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  ${({$variant:a})=>a==="primary"?`
        background: linear-gradient(135deg, #2563eb, #1e3a8a);
        color: #ffffff;
      `:`
      background: #ffffff;
      border-color: #cbd5e1;
      color: #334155;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,De=o.span`
  color: ${({theme:a})=>a.colors.textMuted};
  font-size: 12px;
`;function Ce({currentStep:a,totalSteps:n,onPrev:r,onNext:i,nextDisabled:s,nextLabel:d}){return e.jsxs(Pe,{children:[e.jsxs(De,{children:["Step ",a+1," of ",n]}),e.jsxs(we,{children:[e.jsx(W,{type:"button",onClick:r,disabled:a===0,children:"Previous"}),e.jsx(W,{type:"button",$variant:"primary",onClick:i,disabled:s,children:d})]})]})}const S=o.section`
  background: ${({theme:a})=>a.colors.surface};
  border: 1px solid ${({theme:a})=>a.colors.border};
  border-radius: 16px;
  box-shadow: ${({theme:a})=>a.shadows.sm};
  padding: 24px;
`,P=o.h2`
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: ${({theme:a})=>a.colors.text};
`,w=o.p`
  margin: 8px 0 0;
  color: ${({theme:a})=>a.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`,B=o.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`,Q=o.div`
  grid-column: 1 / -1;
`,m=o.label`
  display: block;
`,p=o.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({theme:a})=>a.colors.text};
  font-weight: 600;
`,f=o.span`
  color: ${({theme:a})=>a.colors.danger};
`,ee=`
  margin-top: 8px;
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  padding: 0 12px;
  font-size: 14px;
  transition: border-color 140ms ease, box-shadow 140ms ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  &:disabled {
    background: #f8fafc;
    color: #64748b;
  }
`,g=o.input`
  ${ee}
`,L=o.select`
  ${ee}
`,ae=o.textarea`
  margin-top: 8px;
  width: 100%;
  min-height: 98px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  padding: 10px 12px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 140ms ease, box-shadow 140ms ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  &:disabled {
    background: #f8fafc;
    color: #64748b;
  }
`,u=o.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${({theme:a})=>a.colors.danger};
  font-weight: 600;
`,$e=o.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${({theme:a})=>a.colors.textMuted};
`,Y=o.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`,Ee=o.label`
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({theme:a})=>a.colors.text};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
  }
`,G=o.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid;

  ${({$state:a})=>a==="success"?`
        color: #065f46;
        background: #ecfdf5;
        border-color: #a7f3d0;
      `:a==="error"?`
        color: #991b1b;
        background: #fef2f2;
        border-color: #fecaca;
      `:a==="loading"?`
        color: #1e40af;
        background: #eff6ff;
        border-color: #bfdbfe;
      `:`
      color: #475569;
      background: #f8fafc;
      border-color: #e2e8f0;
    `}
`,q=o.button`
  height: 40px;
  border: none;
  border-radius: 10px;
  padding: 0 14px;
  background: linear-gradient(135deg, #2563eb, #1e3a8a);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`,Be=["Single","Married","Divorced","Widowed"];function Ie({data:a,errors:n,onChange:r}){return e.jsxs(S,{children:[e.jsx(P,{children:"Personal Details"}),e.jsx(w,{children:"Provide your personal information exactly as per official records."}),e.jsxs(B,{children:[e.jsxs(m,{children:[e.jsxs(p,{children:["Full Name ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.fullName||"",onChange:i=>r("fullName",i.target.value),placeholder:"Enter full name"}),n.fullName?e.jsx(u,{children:n.fullName}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Date of Birth ",e.jsx(f,{children:"*"})]}),e.jsx(g,{type:"date",value:a.dob||"",onChange:i=>r("dob",i.target.value)}),n.dob?e.jsx(u,{children:n.dob}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Gender ",e.jsx(f,{children:"*"})]}),e.jsxs(L,{value:a.gender||"",onChange:i=>r("gender",i.target.value),children:[e.jsx("option",{value:"",children:"Select gender"}),e.jsx("option",{value:"Male",children:"Male"}),e.jsx("option",{value:"Female",children:"Female"}),e.jsx("option",{value:"Other",children:"Other"})]}),n.gender?e.jsx(u,{children:n.gender}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Marital Status ",e.jsx(f,{children:"*"})]}),e.jsxs(L,{value:a.maritalStatus||"",onChange:i=>r("maritalStatus",i.target.value),children:[e.jsx("option",{value:"",children:"Select marital status"}),Be.map(i=>e.jsx("option",{value:i,children:i},i))]}),n.maritalStatus?e.jsx(u,{children:n.maritalStatus}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Father's Name ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.fatherName||"",onChange:i=>r("fatherName",i.target.value),placeholder:"As per PAN/KYC records"}),n.fatherName?e.jsx(u,{children:n.fatherName}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Mother's Name ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.motherName||"",onChange:i=>r("motherName",i.target.value),placeholder:"As per records"}),n.motherName?e.jsx(u,{children:n.motherName}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Email ID ",e.jsx(f,{children:"*"})]}),e.jsx(g,{type:"email",value:a.email||"",onChange:i=>r("email",i.target.value),placeholder:"name@example.com"}),n.email?e.jsx(u,{children:n.email}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Mobile Number ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.mobile||"",onChange:i=>r("mobile",i.target.value),maxLength:10,placeholder:"10-digit number"}),n.mobile?e.jsx(u,{children:n.mobile}):null]})]})]})}function Te({data:a,errors:n,panStatus:r,onChange:i,onVerifyPan:s}){return e.jsxs(S,{children:[e.jsx(P,{children:"PAN Verification"}),e.jsx(w,{children:"Verify your PAN details before continuing."}),e.jsxs(B,{children:[e.jsxs(m,{children:[e.jsxs(p,{children:["PAN Number ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.panNumber||"",onChange:d=>i("panNumber",d.target.value.toUpperCase()),maxLength:10,placeholder:"ABCDE1234F"}),n.panNumber?e.jsx(u,{children:n.panNumber}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Name as per PAN ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.nameAsPerPan||"",onChange:d=>i("nameAsPerPan",d.target.value),placeholder:"Enter exact PAN name"}),n.nameAsPerPan?e.jsx(u,{children:n.nameAsPerPan}):null]})]}),e.jsxs(Y,{children:[e.jsx(q,{type:"button",onClick:s,disabled:r.state==="loading",children:r.state==="loading"?"Verifying...":"Verify PAN"}),e.jsx(G,{$state:r.state,children:r.message||"PAN not verified yet"})]}),n.panVerification?e.jsx(u,{children:n.panVerification}):null]})}function Oe({data:a,errors:n,aadhaarStatus:r,onChange:i,onSendOtp:s,onVerifyOtp:d}){return e.jsxs(S,{children:[e.jsx(P,{children:"Aadhaar Verification"}),e.jsx(w,{children:"Use OTP-based Aadhaar verification to continue your KYC journey."}),e.jsxs(B,{children:[e.jsxs(m,{children:[e.jsxs(p,{children:["Aadhaar Number ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.aadhaarNumber||"",onChange:h=>i("aadhaarNumber",h.target.value.replace(/\D/g,"")),maxLength:12,placeholder:"12-digit Aadhaar number"}),n.aadhaarNumber?e.jsx(u,{children:n.aadhaarNumber}):null]}),r.otpSent?e.jsxs(m,{children:[e.jsxs(p,{children:["Aadhaar OTP ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.otp||"",onChange:h=>i("otp",h.target.value.replace(/\D/g,"")),maxLength:6,placeholder:"Enter 6-digit OTP"}),n.otp?e.jsx(u,{children:n.otp}):null]}):null]}),e.jsxs(Y,{children:[e.jsx(q,{type:"button",onClick:s,disabled:r.loading||r.verified,children:r.loading&&!r.otpSent?"Sending OTP...":"Send OTP"}),r.otpSent?e.jsx(q,{type:"button",onClick:d,disabled:r.loading||r.verified,children:r.loading?"Verifying OTP...":r.verified?"OTP Verified":"Verify OTP"}):null,e.jsx(G,{$state:r.state,children:r.message||"Aadhaar not verified yet"})]}),n.aadhaarVerification?e.jsx(u,{children:n.aadhaarVerification}):null]})}const Re=["Andhra Pradesh","Delhi","Gujarat","Karnataka","Maharashtra","Tamil Nadu","Telangana","West Bengal"];function Fe({data:a,errors:n,onChange:r,onToggleSameAsAadhaar:i}){return e.jsxs(S,{children:[e.jsx(P,{children:"Address Details"}),e.jsx(w,{children:"Enter your current communication address for KYC records."}),e.jsxs(Ee,{children:[e.jsx("input",{type:"checkbox",checked:!!a.sameAsAadhaarAddress,onChange:s=>i(s.target.checked)}),e.jsx("span",{children:"Same as Aadhaar Address"})]}),e.jsxs(B,{children:[e.jsx(Q,{children:e.jsxs(m,{children:[e.jsxs(p,{children:["Current Address ",e.jsx(f,{children:"*"})]}),e.jsx(ae,{value:a.currentAddress||"",onChange:s=>r("currentAddress",s.target.value),placeholder:"Flat, Street, Area",disabled:!!a.sameAsAadhaarAddress}),n.currentAddress?e.jsx(u,{children:n.currentAddress}):null]})}),e.jsxs(m,{children:[e.jsxs(p,{children:["City ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.city||"",onChange:s=>r("city",s.target.value),placeholder:"City",disabled:!!a.sameAsAadhaarAddress}),n.city?e.jsx(u,{children:n.city}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["State ",e.jsx(f,{children:"*"})]}),e.jsxs(L,{value:a.state||"",onChange:s=>r("state",s.target.value),disabled:!!a.sameAsAadhaarAddress,children:[e.jsx("option",{value:"",children:"Select state"}),Re.map(s=>e.jsx("option",{value:s,children:s},s))]}),n.state?e.jsx(u,{children:n.state}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Pincode ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.pincode||"",onChange:s=>r("pincode",s.target.value.replace(/\D/g,"")),maxLength:6,placeholder:"6-digit pincode",disabled:!!a.sameAsAadhaarAddress}),n.pincode?e.jsx(u,{children:n.pincode}):null]})]})]})}function Ke({data:a,errors:n,onChange:r,ifscLookupState:i,onIFSCBlur:s}){return e.jsxs(S,{children:[e.jsx(P,{children:"Bank Details"}),e.jsx(w,{children:"Your bank account will be used for payouts and redemption credits."}),e.jsxs(B,{children:[e.jsxs(m,{children:[e.jsxs(p,{children:["Bank Account Number ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.accountNumber||"",onChange:d=>r("accountNumber",d.target.value.replace(/\D/g,"")),placeholder:"Enter account number"}),n.accountNumber?e.jsx(u,{children:n.accountNumber}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Confirm Account Number ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.confirmAccountNumber||"",onChange:d=>r("confirmAccountNumber",d.target.value.replace(/\D/g,"")),placeholder:"Re-enter account number"}),n.confirmAccountNumber?e.jsx(u,{children:n.confirmAccountNumber}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["IFSC Code ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.ifscCode||"",onChange:d=>r("ifscCode",d.target.value.toUpperCase()),onBlur:s,maxLength:11,placeholder:"SBIN0001234"}),n.ifscCode?e.jsx(u,{children:n.ifscCode}):null]}),e.jsxs(m,{children:[e.jsxs(p,{children:["Bank Name ",e.jsx(f,{children:"*"})]}),e.jsx(g,{value:a.bankName||"",onChange:d=>r("bankName",d.target.value),placeholder:"Auto-fetched from IFSC"}),n.bankName?e.jsx(u,{children:n.bankName}):null]})]}),e.jsx(Y,{children:e.jsx(G,{$state:i.state,children:i.message||"Enter IFSC to auto-fetch bank name"})})]})}const Me=["Spouse","Father","Mother","Son","Daughter","Sibling","Other"];function Ue({data:a,errors:n,onChange:r}){return e.jsxs(S,{children:[e.jsx(P,{children:"Nominee Details"}),e.jsx(w,{children:"Nominee details are optional but strongly recommended for smoother claim processing."}),e.jsxs(B,{children:[e.jsxs(m,{children:[e.jsx(p,{children:"Nominee Name"}),e.jsx(g,{value:a.nomineeName||"",onChange:i=>r("nomineeName",i.target.value),placeholder:"Nominee full name"}),n.nomineeName?e.jsx(u,{children:n.nomineeName}):null]}),e.jsxs(m,{children:[e.jsx(p,{children:"Relationship"}),e.jsxs(L,{value:a.relationship||"",onChange:i=>r("relationship",i.target.value),children:[e.jsx("option",{value:"",children:"Select relationship"}),Me.map(i=>e.jsx("option",{value:i,children:i},i))]}),n.relationship?e.jsx(u,{children:n.relationship}):null]}),e.jsxs(m,{children:[e.jsx(p,{children:"Nominee Date of Birth"}),e.jsx(g,{type:"date",value:a.nomineeDob||"",onChange:i=>r("nomineeDob",i.target.value)}),n.nomineeDob?e.jsx(u,{children:n.nomineeDob}):null]}),e.jsx(Q,{children:e.jsxs(m,{children:[e.jsx(p,{children:"Nominee Address"}),e.jsx(ae,{value:a.nomineeAddress||"",onChange:i=>r("nomineeAddress",i.target.value),placeholder:"Nominee address"}),n.nomineeAddress?e.jsx(u,{children:n.nomineeAddress}):null]})})]}),e.jsx($e,{children:"If nominee details are entered, all nominee fields become mandatory."})]})}const ze=o.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`,Ve=o.label`
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 14px;
  cursor: pointer;

  strong {
    display: block;
    margin-bottom: 6px;
    color: #1e293b;
    font-size: 14px;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }

  input {
    display: none;
  }
`,Le=o.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
`,qe=o.div`
  margin-top: 10px;
`,Ge=[{key:"panCardImage",label:"PAN Card Image"},{key:"aadhaarFrontImage",label:"Aadhaar Front"},{key:"aadhaarBackImage",label:"Aadhaar Back"},{key:"signatureImage",label:"Signature Photo"}];function Xe({data:a,errors:n,onFileChange:r}){return e.jsxs(S,{children:[e.jsx(P,{children:"Identity Upload"}),e.jsx(w,{children:"Upload clear images for all mandatory documents."}),e.jsx(ze,{children:Ge.map(i=>{var h;const s=a[i.key]||null,d=(s==null?void 0:s.preview)||"";return e.jsxs(Ve,{children:[d?e.jsx(Le,{src:d,alt:`${i.label} preview`}):null,e.jsxs("strong",{children:[i.label," ",e.jsx(f,{children:"*"})]}),e.jsx("p",{children:((h=s==null?void 0:s.file)==null?void 0:h.name)||"Tap to upload image"}),e.jsx("input",{type:"file",accept:"image/*",onChange:b=>{var N;const x=(N=b.target.files)==null?void 0:N[0];x&&r(i.key,x)}})]},i.key)})}),n.documents?e.jsx(qe,{children:e.jsx(u,{children:n.documents})}):null]})}const Ye=o.label`
  margin-top: 18px;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
  cursor: pointer;
  padding: 18px;

  strong {
    font-size: 16px;
    color: #1e293b;
  }

  p {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 13px;
  }

  input {
    display: none;
  }
`,_e=o.img`
  width: min(280px, 100%);
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid #cbd5e1;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.09);
`;function He({data:a,errors:n,onSelfieUpload:r}){var s,d,h;const i=(s=a==null?void 0:a.selfie)==null?void 0:s.preview;return e.jsxs(S,{children:[e.jsx(P,{children:"Live Selfie Verification"}),e.jsx(w,{children:"Please take a clear selfie for identity verification."}),e.jsxs(Ye,{children:[i?e.jsx(_e,{src:i,alt:"Selfie preview"}):null,e.jsx("strong",{children:i?"Retake Selfie":"Capture Selfie"}),e.jsx("p",{children:i?(h=(d=a==null?void 0:a.selfie)==null?void 0:d.file)==null?void 0:h.name:"Use front camera with clear lighting"}),e.jsx("input",{type:"file",accept:"image/*",capture:"user",onChange:b=>{var N;const x=(N=b.target.files)==null?void 0:N[0];x&&r(x)}})]}),n.selfie?e.jsx(u,{children:n.selfie}):null]})}const We=o.div`
  margin-top: 18px;
  display: grid;
  gap: 12px;
`,T=o.section`
  border: 1px solid #dbe4ef;
  border-radius: 12px;
  background: #f8fbff;
  padding: 14px;
`,O=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  h3 {
    margin: 0;
    font-size: 14px;
    color: #1e293b;
  }
`,R=o.button`
  height: 30px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`,F=o.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`,Ze=o.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 8px;

  span {
    display: block;
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    color: #0f172a;
    word-break: break-word;
  }
`,Je=o.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;function j({label:a,value:n}){return e.jsxs(Ze,{children:[e.jsx("span",{children:a}),e.jsx("strong",{children:n||"N/A"})]})}function Qe(a){return!a||a.length<4?a:`XXXXXXXX${a.slice(-4)}`}function ea({kycData:a,onEditStep:n,onSubmit:r,submitState:i}){const{personalDetails:s,panDetails:d,aadhaarDetails:h,bankDetails:b,nomineeDetails:x}=a;return e.jsxs(S,{children:[e.jsx(P,{children:"Review & Submit"}),e.jsx(w,{children:"Review all details carefully before final submission."}),e.jsxs(We,{children:[e.jsxs(T,{children:[e.jsxs(O,{children:[e.jsx("h3",{children:"Personal Details"}),e.jsx(R,{type:"button",onClick:()=>n(0),children:"Edit"})]}),e.jsxs(F,{children:[e.jsx(j,{label:"Full Name",value:s.fullName}),e.jsx(j,{label:"Date of Birth",value:s.dob}),e.jsx(j,{label:"Gender",value:s.gender}),e.jsx(j,{label:"Mobile",value:s.mobile}),e.jsx(j,{label:"Email",value:s.email}),e.jsx(j,{label:"Marital Status",value:s.maritalStatus})]})]}),e.jsxs(T,{children:[e.jsxs(O,{children:[e.jsx("h3",{children:"PAN Details"}),e.jsx(R,{type:"button",onClick:()=>n(1),children:"Edit"})]}),e.jsxs(F,{children:[e.jsx(j,{label:"PAN Number",value:d.panNumber}),e.jsx(j,{label:"Name as per PAN",value:d.nameAsPerPan})]})]}),e.jsxs(T,{children:[e.jsxs(O,{children:[e.jsx("h3",{children:"Aadhaar Details"}),e.jsx(R,{type:"button",onClick:()=>n(2),children:"Edit"})]}),e.jsxs(F,{children:[e.jsx(j,{label:"Aadhaar Number",value:Qe(h.aadhaarNumber)}),e.jsx(j,{label:"OTP Verified",value:h.verified?"Yes":"No"})]})]}),e.jsxs(T,{children:[e.jsxs(O,{children:[e.jsx("h3",{children:"Bank Details"}),e.jsx(R,{type:"button",onClick:()=>n(4),children:"Edit"})]}),e.jsxs(F,{children:[e.jsx(j,{label:"Account Number",value:b.accountNumber}),e.jsx(j,{label:"IFSC",value:b.ifscCode}),e.jsx(j,{label:"Bank Name",value:b.bankName})]})]}),e.jsxs(T,{children:[e.jsxs(O,{children:[e.jsx("h3",{children:"Nominee Details"}),e.jsx(R,{type:"button",onClick:()=>n(5),children:"Edit"})]}),e.jsxs(F,{children:[e.jsx(j,{label:"Nominee Name",value:x.nomineeName}),e.jsx(j,{label:"Relationship",value:x.relationship}),e.jsx(j,{label:"Date of Birth",value:x.nomineeDob}),e.jsx(j,{label:"Address",value:x.nomineeAddress})]})]})]}),e.jsxs(Je,{children:[e.jsx(q,{type:"button",onClick:r,disabled:i.state==="loading"||i.state==="success",children:i.state==="loading"?"Submitting...":i.state==="success"?"Submitted":"Submit KYC"}),e.jsx(G,{$state:i.state,children:i.message||"Ready to submit"})]})]})}const aa=/^[A-Z]{5}[0-9]{4}[A-Z]$/,na={SBIN:"State Bank of India",HDFC:"HDFC Bank",ICIC:"ICICI Bank",KKBK:"Kotak Mahindra Bank",AXIS:"Axis Bank",PUNB:"Punjab National Bank"};async function sa({panNumber:a,nameAsPerPan:n}){return new Promise((r,i)=>{setTimeout(()=>{if(!aa.test((a||"").toUpperCase())){i(new Error("Invalid PAN format. Use format: ABCDE1234F"));return}if(!n||n.trim().length<3){i(new Error("Name as per PAN is required for verification."));return}r({success:!0,message:"PAN verified successfully."})},900)})}async function ia({aadhaarNumber:a}){return new Promise((n,r)=>{setTimeout(()=>{if(!/^\d{12}$/.test(a||"")){r(new Error("Aadhaar number must be 12 digits."));return}n({success:!0,otpToken:`aadhaar_${Date.now()}`,message:"OTP sent to Aadhaar-linked mobile number."})},900)})}async function ra({otp:a}){return new Promise((n,r)=>{setTimeout(()=>{if(!/^\d{6}$/.test(a||"")){r(new Error("Enter a valid 6-digit OTP."));return}if(a!=="123456"){r(new Error("Incorrect OTP. Use 123456 for demo verification."));return}n({success:!0,message:"Aadhaar OTP verified successfully."})},850)})}async function ta(a){return new Promise(n=>{setTimeout(()=>{const i=(a||"").toUpperCase().trim().slice(0,4);n({bankName:na[i]||""})},500)})}async function la(a){return new Promise(n=>{setTimeout(()=>{n({success:!0,referenceId:`KYC-${Date.now()}`,message:"KYC submitted successfully. We will update your verification status shortly.",payload:a})},1300)})}const E=["Personal","PAN","Aadhaar","Address","Bank","Nominee","Upload","Selfie","Review"],Z={personalDetails:{fullName:"",dob:"",gender:"",fatherName:"",motherName:"",maritalStatus:"",email:"",mobile:""},panDetails:{panNumber:"",nameAsPerPan:"",verified:!1},aadhaarDetails:{aadhaarNumber:"",otp:"",verified:!1},addressDetails:{sameAsAadhaarAddress:!1,currentAddress:"",city:"",state:"",pincode:""},bankDetails:{accountNumber:"",confirmAccountNumber:"",ifscCode:"",bankName:""},nomineeDetails:{nomineeName:"",relationship:"",nomineeDob:"",nomineeAddress:""},documents:{panCardImage:null,aadhaarFrontImage:null,aadhaarBackImage:null,signatureImage:null,selfie:null}},oa=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,da=/^[6-9]\d{9}$/,ca=/^[A-Z]{5}[0-9]{4}[A-Z]$/,ua=/^\d{12}$/,ma=/^\d{6}$/,pa=/^\d{6}$/,ne=/^[A-Z]{4}0[A-Z0-9]{6}$/;function J(a,n,r,i){var d,h,b,x,N,v,K,D,M,C,U,z,y,V;const s={};if(a===0){const c=n.personalDetails;(d=c.fullName)!=null&&d.trim()||(s.fullName="Full name is required."),c.dob||(s.dob="Date of birth is required."),c.gender||(s.gender="Gender is required."),(h=c.fatherName)!=null&&h.trim()||(s.fatherName="Father name is required."),(b=c.motherName)!=null&&b.trim()||(s.motherName="Mother name is required."),c.maritalStatus||(s.maritalStatus="Marital status is required."),oa.test(c.email||"")||(s.email="Enter a valid email."),da.test(c.mobile||"")||(s.mobile="Enter a valid 10-digit mobile number.")}if(a===1){const c=n.panDetails;ca.test(c.panNumber||"")||(s.panNumber="PAN format must be ABCDE1234F."),(x=c.nameAsPerPan)!=null&&x.trim()||(s.nameAsPerPan="Name as per PAN is required."),r.state!=="success"&&(s.panVerification="Verify PAN to continue.")}if(a===2){const c=n.aadhaarDetails;ua.test(c.aadhaarNumber||"")||(s.aadhaarNumber="Aadhaar number must be 12 digits."),i.otpSent||(s.aadhaarVerification="Send OTP and verify Aadhaar to continue."),i.otpSent&&!ma.test(c.otp||"")&&(s.otp="Enter a valid 6-digit OTP."),i.verified||(s.aadhaarVerification="Aadhaar OTP verification is pending.")}if(a===3){const c=n.addressDetails;(N=c.currentAddress)!=null&&N.trim()||(s.currentAddress="Address is required."),(v=c.city)!=null&&v.trim()||(s.city="City is required."),(K=c.state)!=null&&K.trim()||(s.state="State is required."),pa.test(c.pincode||"")||(s.pincode="Pincode must be 6 digits.")}if(a===4){const c=n.bankDetails;(D=c.accountNumber)!=null&&D.trim()||(s.accountNumber="Account number is required."),(M=c.confirmAccountNumber)!=null&&M.trim()||(s.confirmAccountNumber="Please confirm account number."),c.accountNumber&&c.confirmAccountNumber&&c.accountNumber!==c.confirmAccountNumber&&(s.confirmAccountNumber="Account numbers do not match."),ne.test(c.ifscCode||"")||(s.ifscCode="Enter valid IFSC code."),(C=c.bankName)!=null&&C.trim()||(s.bankName="Bank name is required.")}if(a===5){const c=n.nomineeDetails;Object.values(c).some(X=>String(X||"").trim())&&((U=c.nomineeName)!=null&&U.trim()||(s.nomineeName="Nominee name is required."),(z=c.relationship)!=null&&z.trim()||(s.relationship="Relationship is required."),(y=c.nomineeDob)!=null&&y.trim()||(s.nomineeDob="Nominee DOB is required."),(V=c.nomineeAddress)!=null&&V.trim()||(s.nomineeAddress="Nominee address is required."))}if(a===6){const c=n.documents;(!c.panCardImage||!c.aadhaarFrontImage||!c.aadhaarBackImage||!c.signatureImage)&&(s.documents="Upload PAN, Aadhaar front/back, and signature to continue.")}return a===7&&(n.documents.selfie||(s.selfie="Selfie capture is required before review.")),s}const ha=he`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`,xa=o.div`
  display: grid;
  gap: 14px;
`,fa=o.header`
  background: ${({theme:a})=>a.colors.surface};
  border: 1px solid ${({theme:a})=>a.colors.border};
  border-radius: 16px;
  box-shadow: ${({theme:a})=>a.shadows.sm};
  padding: 18px;

  h1 {
    margin: 0;
    font-size: 28px;
    color: ${({theme:a})=>a.colors.text};
    letter-spacing: -0.01em;
  }

  p {
    margin: 8px 0 0;
    color: ${({theme:a})=>a.colors.textMuted};
    font-size: 14px;
    line-height: 1.6;
  }
`,ga=o.div`
  animation: ${ha} 220ms ease;
`,ba=o.div`
  border-radius: 10px;
  border: 1px solid ${({theme:a})=>a.colors.warningLight};
  background: #fffbeb;
  color: ${({theme:a})=>a.colors.warning};
  font-size: 12px;
  font-weight: 600;
  padding: 10px 12px;
`;function Na(){const[a,n]=A.useState(Z),[r,i]=A.useState(0),[s,d]=A.useState({}),h=A.useRef(Z.documents),[b,x]=A.useState({state:"idle",message:""}),[N,v]=A.useState({state:"idle",loading:!1,otpSent:!1,verified:!1,message:""}),[K,D]=A.useState({state:"idle",message:""}),[M,C]=A.useState({state:"idle",message:""});A.useEffect(()=>{const t=pe();t&&n(l=>({...l,personalDetails:{...l.personalDetails,fullName:l.personalDetails.fullName||t.fullName||t.name||"",email:l.personalDetails.email||t.email||"",mobile:l.personalDetails.mobile||t.mobile||t.phone||""}}))},[]),A.useEffect(()=>{h.current=a.documents},[a.documents]),A.useEffect(()=>()=>{const t=h.current||{};Object.values(t).forEach(l=>{l!=null&&l.preview&&l.preview.startsWith("blob:")&&URL.revokeObjectURL(l.preview)})},[]);const U=A.useMemo(()=>J(r,a,b,N),[r,a,b,N]),z=Object.keys(U).length===0,y=(t,l,k)=>{n($=>({...$,[t]:{...$[t],[l]:k}})),d({}),C({state:"idle",message:""})},V=(t,l)=>{y("panDetails",t,l),x({state:"idle",message:""})},c=(t,l)=>{y("aadhaarDetails",t,l),t==="aadhaarNumber"&&(v({state:"idle",loading:!1,otpSent:!1,verified:!1,message:""}),n(k=>({...k,aadhaarDetails:{...k.aadhaarDetails,otp:"",verified:!1}})))},_=t=>{n(l=>({...l,addressDetails:{...l.addressDetails,sameAsAadhaarAddress:t,currentAddress:t?"Aadhaar linked address (auto-filled)":l.addressDetails.currentAddress,city:t?"Hyderabad":l.addressDetails.city,state:t?"Telangana":l.addressDetails.state,pincode:t?"500001":l.addressDetails.pincode}})),d({})},X=(t,l)=>{y("bankDetails",t,l),t==="ifscCode"&&D({state:"idle",message:""})},se=async()=>{const t=(a.bankDetails.ifscCode||"").toUpperCase();if(!ne.test(t)){D({state:"error",message:"Invalid IFSC format. Use e.g. SBIN0001234"});return}D({state:"loading",message:"Fetching bank name from IFSC..."});const l=await ta(t);if(l.bankName){n(k=>({...k,bankDetails:{...k.bankDetails,bankName:l.bankName}})),D({state:"success",message:`Bank detected: ${l.bankName}`});return}D({state:"error",message:"Bank not found. Please enter bank name manually."})},H=(t,l)=>{const k=URL.createObjectURL(l);n($=>{const I=$.documents[t];return I!=null&&I.preview&&I.preview.startsWith("blob:")&&URL.revokeObjectURL(I.preview),{...$,documents:{...$.documents,[t]:{file:l,preview:k}}}}),d({})},ie=t=>{H("selfie",t)},re=async()=>{try{x({state:"loading",message:"Verifying PAN details..."});const t=await sa(a.panDetails);x({state:"success",message:t.message}),n(l=>({...l,panDetails:{...l.panDetails,verified:!0}})),d({})}catch(t){x({state:"error",message:t.message||"PAN verification failed."}),n(l=>({...l,panDetails:{...l.panDetails,verified:!1}}))}},te=async()=>{try{v(l=>({...l,state:"loading",loading:!0,message:"Sending OTP..."}));const t=await ia({aadhaarNumber:a.aadhaarDetails.aadhaarNumber});v({state:"success",loading:!1,otpSent:!0,verified:!1,message:t.message}),d({})}catch(t){v({state:"error",loading:!1,otpSent:!1,verified:!1,message:t.message||"Unable to send OTP."})}},le=async()=>{try{v(l=>({...l,state:"loading",loading:!0,message:"Verifying OTP..."}));const t=await ra({otp:a.aadhaarDetails.otp});v({state:"success",loading:!1,otpSent:!0,verified:!0,message:t.message}),n(l=>({...l,aadhaarDetails:{...l.aadhaarDetails,verified:!0}})),d({})}catch(t){v(l=>({...l,state:"error",loading:!1,verified:!1,message:t.message||"OTP verification failed."})),n(l=>({...l,aadhaarDetails:{...l.aadhaarDetails,verified:!1}}))}},oe=()=>{const t=J(r,a,b,N);if(Object.keys(t).length>0){d(t);return}d({}),i(l=>Math.min(l+1,E.length-1))},de=()=>{d({}),i(t=>Math.max(t-1,0))},ce=async()=>{try{C({state:"loading",message:"Submitting KYC application..."});const t=await la(a);C({state:"success",message:`${t.message} Ref: ${t.referenceId}`})}catch(t){C({state:"error",message:t.message||"KYC submission failed."})}},ue=(()=>{switch(r){case 0:return e.jsx(Ie,{data:a.personalDetails,errors:s,onChange:(t,l)=>y("personalDetails",t,l)});case 1:return e.jsx(Te,{data:a.panDetails,errors:s,panStatus:b,onChange:V,onVerifyPan:re});case 2:return e.jsx(Oe,{data:a.aadhaarDetails,errors:s,aadhaarStatus:N,onChange:c,onSendOtp:te,onVerifyOtp:le});case 3:return e.jsx(Fe,{data:a.addressDetails,errors:s,onChange:(t,l)=>y("addressDetails",t,l),onToggleSameAsAadhaar:_});case 4:return e.jsx(Ke,{data:a.bankDetails,errors:s,onChange:X,ifscLookupState:K,onIFSCBlur:se});case 5:return e.jsx(Ue,{data:a.nomineeDetails,errors:s,onChange:(t,l)=>y("nomineeDetails",t,l)});case 6:return e.jsx(Xe,{data:a.documents,errors:s,onFileChange:H});case 7:return e.jsx(He,{data:a.documents,errors:s,onSelfieUpload:ie});case 8:return e.jsx(ea,{kycData:a,onEditStep:t=>{i(t),d({})},onSubmit:ce,submitState:M});default:return null}})(),me=r===E.length-2?"Review & Submit":"Next";return e.jsxs(xa,{children:[e.jsxs(fa,{children:[e.jsx("h1",{children:"Complete KYC"}),e.jsx("p",{children:"Secure, step-by-step KYC onboarding to activate your investment account."})]}),e.jsx(Se,{steps:E,currentStep:r,onStepClick:t=>i(t)}),r!==E.length-1&&Object.keys(s).length>0?e.jsx(ba,{children:"Please resolve highlighted fields to continue."}):null,e.jsx(ga,{children:ue},r),r!==E.length-1?e.jsx(Ce,{currentStep:r,totalSteps:E.length,onPrev:de,onNext:oe,nextDisabled:!z,nextLabel:me}):null]})}export{Na as default};
