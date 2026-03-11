import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendEmailOtp, verifyEmailOtp, registerClient } from '../../api/authApi';
import { saveUser } from '../../utils/storage';

const STEPS = ['Verify Email', 'Personal Info', 'KYC & Bank', 'Review & Submit'];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // Step 0 — OTP
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Step 1 — Personal info
  const [personal, setPersonal] = useState({
    fullName: '', mobileNumber: '', password: '',
    dob: '', gender: '', address: '', city: '', state: '', pincode: '',
  });

  // Step 2 — KYC + Bank
  const [kyc, setKyc] = useState({
    panNumber: '', aadhaarNumber: '', occupation: '',
    annualIncomeRange: '', riskTolerance: 'MODERATE',
    accountHolderName: '', bankName: '', accountNumber: '', ifsc: '',
    nomineeName: '', nomineeRelation: '',
  });
  const [kycFile, setKycFile]       = useState(null);
  const [chequeFile, setChequeFile] = useState(null);

  const err = (msg) => setError(msg);
  const clr = ()    => setError('');

  // ── Step 0: OTP flow ────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    clr(); setLoading(true);
    try {
      await sendEmailOtp(email);
      setOtpSent(true);
    } catch (e) { err(e.userMessage || 'Failed to send OTP.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    clr(); setLoading(true);
    try {
      const res = await verifyEmailOtp(email, otp);
      if (res.data?.status === 'verified') {
        setOtpVerified(true); setStep(1);
      } else { err('Incorrect OTP. Please try again.'); }
    } catch (e) { err(e.userMessage || 'OTP verification failed.'); }
    finally { setLoading(false); }
  };

  // ── Final submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    clr(); setLoading(true);
    try {
      const data = {
        email,
        ...personal,
        ...kyc,
        consentDeclared: true,
        consentShareWithProviders: true,
        consentShareDocs: true,
        consentComm: true,
        understoodMarketRisk: true,
        consentShareWithAmc: true,
        riskProfile: { riskCategory: kyc.riskTolerance, riskScore: 0, riskAnswersJson: '' },
      };

      const fd = new FormData();
      fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      if (kycFile)    fd.append('kycFile', kycFile);
      if (chequeFile) fd.append('chequeFile', chequeFile);

      const res = await registerClient(fd);
      saveUser({ id: res.data.id, email: res.data.email });
      setSuccess('Registration successful! Redirecting to your dashboard…');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (e) { err(e.userMessage || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  const updatePersonal = (e) =>
    setPersonal((p) => ({ ...p, [e.target.name]: e.target.value }));
  const updateKyc = (e) =>
    setKyc((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div style={{ maxWidth: 560, margin: '3rem auto', padding: '0 1.5rem' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i <= step ? '#16a34a' : '#e5e7eb',
          }} />
        ))}
      </div>
      <p className="text-muted" style={{ marginBottom: '1rem', fontSize: 13 }}>
        Step {step + 1} of {STEPS.length} — <b>{STEPS[step]}</b>
      </p>

      <div className="card">
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* ── Step 0: Email OTP ── */}
        {step === 0 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Verify Your Email</h3>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" disabled={otpSent} />
            </div>
            {!otpSent ? (
              <button className="btn btn-primary btn-block" onClick={handleSendOtp} disabled={loading || !email}>
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            ) : (
              <>
                <div className="form-group">
                  <label>Enter OTP</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP" maxLength={6} />
                </div>
                <button className="btn btn-primary btn-block" onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}>
                  {loading ? 'Verifying…' : 'Verify OTP'}
                </button>
                <button className="btn btn-outline btn-block mt-1 btn-sm"
                  onClick={() => { setOtpSent(false); setOtp(''); }}>
                  Change Email
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Step 1: Personal Info ── */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Personal Information</h3>
            {['fullName','mobileNumber','password','dob','gender','address','city','state','pincode'].map((field) => (
              <div className="form-group" key={field}>
                <label style={{ textTransform: 'capitalize' }}>
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={field === 'password' ? 'password' : field === 'dob' ? 'date' : 'text'}
                  name={field} value={personal[field]} onChange={updatePersonal}
                  required
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { clr(); setStep(2); }}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: KYC + Bank ── */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>KYC & Bank Details</h3>
            {['panNumber','aadhaarNumber','occupation','annualIncomeRange'].map((f) => (
              <div className="form-group" key={f}>
                <label style={{ textTransform: 'capitalize' }}>{f.replace(/([A-Z])/g,' $1')}</label>
                <input type="text" name={f} value={kyc[f]} onChange={updateKyc} />
              </div>
            ))}
            <div className="form-group">
              <label>Risk Tolerance</label>
              <select name="riskTolerance" value={kyc.riskTolerance} onChange={updateKyc}>
                <option value="CONSERVATIVE">Conservative</option>
                <option value="MODERATE">Moderate</option>
                <option value="AGGRESSIVE">Aggressive</option>
              </select>
            </div>
            <hr style={{ margin: '1rem 0', borderColor: '#e5e7eb' }} />
            {['accountHolderName','bankName','accountNumber','ifsc','nomineeName','nomineeRelation'].map((f) => (
              <div className="form-group" key={f}>
                <label style={{ textTransform: 'capitalize' }}>{f.replace(/([A-Z])/g,' $1')}</label>
                <input type="text" name={f} value={kyc[f]} onChange={updateKyc} />
              </div>
            ))}
            <div className="form-group">
              <label>KYC Document (optional)</label>
              <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setKycFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Cancelled Cheque (optional)</label>
              <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setChequeFile(e.target.files[0])} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { clr(); setStep(3); }}>
                Review
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review & Submit ── */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Review & Submit</h3>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
              <p><b>Email:</b> {email}</p>
              <p><b>Full Name:</b> {personal.fullName}</p>
              <p><b>Mobile:</b> {personal.mobileNumber}</p>
              <p><b>City:</b> {personal.city}, {personal.state}</p>
              <p><b>PAN:</b> {kyc.panNumber}</p>
              <p><b>Bank:</b> {kyc.bankName}</p>
              <p><b>Risk Profile:</b> {kyc.riskTolerance}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting…' : 'Create Account'}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center mt-3" style={{ fontSize: 14 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
