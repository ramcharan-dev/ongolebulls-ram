import { useState } from 'react';
import { submitKycDocuments } from '../../api/documentApi';
import { getUser } from '../../utils/storage';

export default function KycDocuments() {
  const user = getUser();
  const [form, setForm] = useState({
    investorName: user?.fullName || '', investorEmail: user?.email || '',
    investorPhone: '', investorDOB: '', panNumber: '', aadhaarNumber: '',
    investorAddress: '', bankAccountName: '', bankName: '',
    bankAccountNumber: '', bankIFSC: '', bankBranch: '',
    bankAccountType: 'SAVINGS', bankProofType: 'CANCELLED_CHEQUE',
    taxResidencyCountry: 'India', riskProfile: 'MODERATE',
  });
  const [files, setFiles]     = useState({});
  const [nominees, setNominees] = useState([{ nomineeName:'', relationship:'', dateOfBirth:'', allocationPercentage:'', nomineeAddress:'' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile = (e) => setFiles((p) => ({ ...p, [e.target.name]: e.target.files[0] }));

  const updateNominee = (i, key, val) =>
    setNominees((prev) => prev.map((n, idx) => idx === i ? { ...n, [key]: val } : n));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      Object.entries(files).forEach(([k,v]) => v && fd.append(k, v));
      nominees.forEach((n, i) => {
        if (!n.nomineeName) return;
        Object.entries(n).forEach(([k,v]) => fd.append(`nominees[${i}].${k}`, v));
      });
      const res = await submitKycDocuments(fd);
      setSuccess(`Documents submitted successfully! Reference ID: ${res.data.id}`);
    } catch (err) {
      setError(err.userMessage || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type='text', required=false, options=null }) => (
    <div className="form-group">
      <label>{label}{required && ' *'}</label>
      {options ? (
        <select name={name} value={form[name]} onChange={handle}>
          {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={form[name]} onChange={handle} required={required} />
      )}
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 700 }}>
      <h1 className="page-title">KYC Document Submission</h1>
      <p className="text-muted mb-2">Submit your KYC, bank details, and nominee information for account verification.</p>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Personal Details */}
        <div className="card" style={{ marginBottom:'1.25rem' }}>
          <h3 className="section-title">Personal Details</h3>
          <div className="grid-2">
            <Field label="Full Name"    name="investorName"  required />
            <Field label="Email"        name="investorEmail" type="email" required />
            <Field label="Phone"        name="investorPhone" required />
            <Field label="Date of Birth" name="investorDOB"  type="date" required />
            <Field label="PAN Number"   name="panNumber"     required />
            <Field label="Aadhaar Number" name="aadhaarNumber" />
          </div>
          <div className="form-group">
            <label>Address *</label>
            <textarea name="investorAddress" rows={2} value={form.investorAddress} onChange={handle} required style={{ resize:'vertical' }} />
          </div>
          <div className="grid-2">
            <Field label="Tax Residency Country" name="taxResidencyCountry" />
            <Field label="Risk Profile" name="riskProfile" options={[
              {v:'CONSERVATIVE',l:'Conservative'},{v:'MODERATE',l:'Moderate'},{v:'AGGRESSIVE',l:'Aggressive'}
            ]} />
          </div>
        </div>

        {/* Bank Details */}
        <div className="card" style={{ marginBottom:'1.25rem' }}>
          <h3 className="section-title">Bank Details</h3>
          <div className="grid-2">
            <Field label="Account Holder Name" name="bankAccountName" required />
            <Field label="Bank Name" name="bankName" required />
            <Field label="Account Number" name="bankAccountNumber" required />
            <Field label="IFSC Code" name="bankIFSC" required />
            <Field label="Branch" name="bankBranch" />
            <Field label="Account Type" name="bankAccountType" options={[
              {v:'SAVINGS',l:'Savings'},{v:'CURRENT',l:'Current'}
            ]} />
            <Field label="Bank Proof Type" name="bankProofType" options={[
              {v:'CANCELLED_CHEQUE',l:'Cancelled Cheque'},{v:'PASSBOOK',l:'Passbook'},{v:'BANK_STATEMENT',l:'Bank Statement'}
            ]} />
          </div>
        </div>

        {/* Document Uploads */}
        <div className="card" style={{ marginBottom:'1.25rem' }}>
          <h3 className="section-title">Document Uploads <span className="text-muted">(optional)</span></h3>
          <div className="grid-2">
            {[
              ['panCardFile','PAN Card'],['aadhaarCardFile','Aadhaar Card'],
              ['photographFile','Photograph'],['bankProofFile','Bank Proof'],['signatureFile','Signature']
            ].map(([name, label]) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <input type="file" name={name} accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
              </div>
            ))}
          </div>
        </div>

        {/* Nominees */}
        <div className="card" style={{ marginBottom:'1.25rem' }}>
          <h3 className="section-title">Nominees <span className="text-muted">(up to 3)</span></h3>
          {nominees.map((nom, i) => (
            <div key={i} style={{ borderBottom: i < nominees.length-1 ? '1px dashed #e5e7eb' : 'none', paddingBottom:'1rem', marginBottom:'1rem' }}>
              <p style={{ fontWeight:600, fontSize:13, marginBottom:8, color:'#6b7280' }}>Nominee {i+1}</p>
              <div className="grid-2">
                {[['nomineeName','Name'],['relationship','Relationship'],['dateOfBirth','Date of Birth'],
                  ['allocationPercentage','Allocation %'],['nomineeAddress','Address']].map(([k,l]) => (
                  <div className="form-group" key={k}>
                    <label>{l}</label>
                    <input type={k==='dateOfBirth'?'date':k==='allocationPercentage'?'number':'text'}
                      value={nom[k]} onChange={e => updateNominee(i, k, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {nominees.length < 3 && (
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => setNominees(p => [...p, { nomineeName:'', relationship:'', dateOfBirth:'', allocationPercentage:'', nomineeAddress:'' }])}>
              + Add Nominee
            </button>
          )}
        </div>

        <button className="btn btn-primary btn-block" style={{ padding:'.8rem' }} disabled={loading}>
          {loading ? 'Submitting Documents…' : 'Submit KYC Documents'}
        </button>
      </form>
    </div>
  );
}
