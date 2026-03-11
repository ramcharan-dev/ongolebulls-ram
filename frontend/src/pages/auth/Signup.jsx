import React, { useState, useCallback, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendEmailOtp, verifyEmailOtp, registerClient } from '../../api/authApi';
import { saveUser } from '../../utils/storage';
import logo from '../../assets/logo4.png';
import { Check } from 'lucide-react';
import './Auth.css';

const STEPS = [
    'Basic Info', 'Profile Type', 'KYC Details',
    'Bank Details', 'Risk Profile', 'Consent'
];

// ── Common Form Input ──
const Input = memo(({ label, type = 'text', name, value, onChange, required, subtext, placeholder, disabled }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label className="auth-label">
            {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <input
            type={type} name={name} value={value} onChange={onChange} required={required}
            placeholder={placeholder} disabled={disabled}
            className="auth-input"
        />
        {subtext && <p className="auth-subtext">{subtext}</p>}
    </div>
));
Input.displayName = 'Input';

// ── Step 1: Basic Information ──
const Step1 = memo(({ personal, updatePersonal, email, setEmail, otp, setOtp, otpSent, otpVerified, handleSendOtp, handleVerifyOtp, loading }) => (
    <div className="step-content">
        <h3 className="step-title">Basic Information</h3>
        <Input label="Full Name (as per PAN)" name="fullName" value={personal.fullName} onChange={updatePersonal} required />

        <div style={{ marginBottom: '1rem' }}>
            <label className="auth-label">Email (OTP required) <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="auth-input-group">
                <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent || otpVerified} required placeholder="you@example.com"
                    className="auth-input" style={{ flex: 1 }}
                />
                {(!otpSent && !otpVerified) && (
                    <button type="button" onClick={handleSendOtp} disabled={loading || !email} className="auth-btn auth-btn-outline">
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                )}
            </div>
        </div>

        {otpSent && !otpVerified && (
            <div style={{ marginBottom: '1rem', padding: '1.25rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #bfdbfe' }}>
                <label className="auth-label">Email OTP</label>
                <input
                    type="number" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="• • • • • •"
                    className="auth-input" style={{ marginBottom: '1rem', textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.125rem' }}
                />
                <button type="button" onClick={handleVerifyOtp} disabled={loading || otp.length < 6} className="auth-btn auth-btn-success" style={{ width: '100%' }}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
            </div>
        )}

        {otpVerified && <p style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem' }}><Check size={16} /> Email verified.</p>}

        <Input label="Mobile Number" type="tel" name="mobileNumber" value={personal.mobileNumber} onChange={updatePersonal} subtext="We only collect mobile number (no OTP)." />
        <Input label="Password" type="password" name="password" value={personal.password} onChange={updatePersonal} required subtext="Strong" />
    </div>
));
Step1.displayName = 'Step1';

// ── Step 2: Profile Type ──
const Step2 = memo(({ profileType, setProfileType }) => (
    <div className="step-content">
        <h3 className="step-title">Profile Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Self', 'Relative'].map(type => (
                <label key={type} className={`radio-card ${profileType === type ? 'selected' : ''}`}>
                    <input type="radio" name="profileType" value={type} checked={profileType === type} onChange={(e) => setProfileType(e.target.value)} className="radio-input-native" />
                    <span style={{ fontWeight: 500, color: '#334155' }}>{type}</span>
                </label>
            ))}
        </div>
    </div>
));
Step2.displayName = 'Step2';

// ── Step 3: KYC Details ──
const Step3 = memo(({ kyc, updateKyc, setKycFile }) => (
    <div className="step-content">
        <h3 className="step-title">KYC Details</h3>
        <div className="grid-2-col">
            <Input label="PAN Number" name="panNumber" value={kyc.panNumber} onChange={updateKyc} required />
            <Input label="DOB" type="date" name="dob" value={kyc.dob} onChange={updateKyc} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label className="auth-label">Gender</label>
            <select name="gender" value={kyc.gender} onChange={updateKyc} className="auth-input">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label className="auth-label">Address</label>
            <textarea name="address" rows="3" value={kyc.address} onChange={updateKyc} className="auth-input" style={{ resize: 'none' }} />
        </div>

        <div className="grid-3-col">
            <Input label="Pincode" type="number" name="pincode" value={kyc.pincode} onChange={updateKyc} />
            <Input label="City" name="city" value={kyc.city} onChange={updateKyc} />
            <Input label="State" name="state" value={kyc.state} onChange={updateKyc} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
            <label className="auth-label" style={{ marginBottom: '0.75rem' }}>Upload Proof of Address (Aadhaar/Passport/Utility)</label>
            <div className="file-upload-wrapper">
                <input type="file" onChange={(e) => setKycFile(e.target.files[0])} className="file-input" />
            </div>
        </div>
    </div>
));
Step3.displayName = 'Step3';

// ── Step 4: Bank Details ──
const Step4 = memo(({ bank, updateBank, setChequeFile }) => (
    <div className="step-content">
        <h3 className="step-title">Bank Details</h3>
        <div className="grid-2-col">
            <Input label="Account Holder Name" name="accountHolderName" value={bank.accountHolderName} onChange={updateBank} required />
            <Input label="Bank Name" name="bankName" value={bank.bankName} onChange={updateBank} required />
            <Input label="Account Number" type="number" name="accountNumber" value={bank.accountNumber} onChange={updateBank} required />
            <Input label="IFSC Code" name="ifsc" value={bank.ifsc} onChange={updateBank} required />
        </div>
        <div style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
            <label className="auth-label" style={{ marginBottom: '0.75rem' }}>Upload Cancelled Cheque / Passbook</label>
            <div className="file-upload-wrapper" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input type="file" onChange={(e) => setChequeFile(e.target.files[0])} className="file-input" />
                <p className="auth-subtext" style={{ marginLeft: '0.5rem' }}>Ensure name matches PAN or provide declaration.</p>
            </div>
        </div>
    </div>
));
Step4.displayName = 'Step4';

// ── Step 5: Risk Profile ──
const Step5 = memo(({ risk, updateRisk }) => {
    const questions = [
        { id: 'q1', text: '1. How would you react if ₹1,00,000 drops to ₹90,000 in a month?', options: ['Withdraw everything', 'Wait and watch', 'Invest more'] },
        { id: 'q2', text: '2. Primary goal?', options: ['Capital protection', 'Moderate growth', 'High returns'] },
        { id: 'q3', text: '3. Investment horizon?', options: ['<1 year', '1-3 years', '>3 years'] },
        { id: 'q4', text: '4. % of income to invest?', options: ['<10%', '10-30%', '>30%'] },
        { id: 'q5', text: '5. Monthly income (optional)', options: ['< ₹25,000', '₹25,000-₹75,000', '> ₹75,000'] }
    ];

    return (
        <div className="step-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 className="step-title" style={{ marginBottom: '0' }}>Risk Profile (Quick Quiz)</h3>
            {questions.map((q) => (
                <div key={q.id}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b', marginBottom: '0.75rem' }}>{q.text}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        {q.options.map(opt => (
                            <label key={opt} className={`radio-pill ${risk[q.id] === opt ? 'selected' : ''}`}>
                                <input type="radio" name={q.id} value={opt} checked={risk[q.id] === opt} onChange={updateRisk} style={{ display: 'none' }} />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});
Step5.displayName = 'Step5';

// ── Step 6: Declarations ──
const Step6 = memo(({ consent, updateConsent }) => {
    const items = [
        { id: 'accurate', text: 'I declare information is accurate.' },
        { id: 'shareProviders', text: 'Authorize platform to share data with providers.' },
        { id: 'shareDocs', text: 'Share documents with AMCs and RTAs.' },
        { id: 'notifications', text: 'Consent to WhatsApp/SMS/Email notifications.' },
        { id: 'risks', text: 'I understand that mutual funds are subject to market risks.' }
    ];

    return (
        <div className="step-content">
            <div style={{ paddingBottom: '0.5rem' }}>
                <h3 className="step-title" style={{ marginBottom: '0.25rem' }}>Declarations & Consent</h3>
                <p className="auth-subtext">Please read and accept the following to proceed.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {items.map(item => (
                    <label key={item.id} className="checkbox-item">
                        <input type="checkbox" name={item.id} checked={consent[item.id] || false} onChange={updateConsent} className="checkbox-native" />
                        <span style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{item.text}</span>
                    </label>
                ))}
            </div>
        </div>
    );
});
Step6.displayName = 'Step6';

// ── Main Component ──
export default function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // States
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [personal, setPersonal] = useState({ fullName: '', mobileNumber: '', password: '' });
    const [profileType, setProfileType] = useState('Self');
    const [kyc, setKyc] = useState({ panNumber: '', dob: '', gender: '', address: '', city: '', state: '', pincode: '' });
    const [kycFile, setKycFile] = useState(null);

    const [bank, setBank] = useState({ accountHolderName: '', bankName: '', accountNumber: '', ifsc: '' });
    const [chequeFile, setChequeFile] = useState(null);

    const [risk, setRisk] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '' });
    const [consent, setConsent] = useState({ accurate: false, shareProviders: false, shareDocs: false, notifications: false, risks: false });

    // Callbacks
    const updatePersonal = useCallback((e) => setPersonal(p => ({ ...p, [e.target.name]: e.target.value })), []);
    const updateKyc = useCallback((e) => setKyc(p => ({ ...p, [e.target.name]: e.target.value })), []);
    const updateBank = useCallback((e) => setBank(p => ({ ...p, [e.target.name]: e.target.value })), []);
    const updateRisk = useCallback((e) => setRisk(p => ({ ...p, [e.target.name]: e.target.value })), []);
    const updateConsent = useCallback((e) => setConsent(p => ({ ...p, [e.target.name]: e.target.checked })), []);

    const handleNext = useCallback(() => {
        setError('');
        if (step === 0 && (!otpVerified || !personal.fullName || !personal.password)) {
            setError('Please verify email and fill all required fields.');
            return;
        }
        setStep(s => Math.min(STEPS.length - 1, s + 1));
    }, [step, otpVerified, personal]);

    const handleBack = useCallback(() => {
        setError('');
        setStep(s => Math.max(0, s - 1));
    }, []);

    const handleSendOtp = useCallback(async () => {
        setError(''); setLoading(true);
        try {
            await sendEmailOtp(email);
            setOtpSent(true);
        } catch (e) { setError(e.userMessage || 'Failed to send OTP.'); }
        finally { setLoading(false); }
    }, [email]);

    const handleVerifyOtp = useCallback(async () => {
        setError(''); setLoading(true);
        try {
            const res = await verifyEmailOtp(email, otp);
            if (res.data?.status === 'verified') setOtpVerified(true);
            else setError('Incorrect OTP.');
        } catch (e) { setError(e.userMessage || 'OTP verification failed.'); }
        finally { setLoading(false); }
    }, [email, otp]);

    const handleSubmit = useCallback(async () => {
        setError('');
        const allConsented = Object.values(consent).every(Boolean);
        if (!allConsented) {
            setError('Please accept all declarations to proceed.');
            return;
        }
        setLoading(true);
        try {
            const data = {
                email, ...personal, ...kyc, ...bank, profileType, riskAnswers: JSON.stringify(risk),
                consentDeclared: true,
            };
            const fd = new FormData();
            fd.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            if (kycFile) fd.append('kycFile', kycFile);
            if (chequeFile) fd.append('chequeFile', chequeFile);

            const res = await registerClient(fd);
            saveUser({ id: res.data.id, email: res.data.email });
            navigate('/dashboard');
        } catch (e) { setError(e.userMessage || 'Registration failed.'); }
        finally { setLoading(false); }
    }, [email, personal, kyc, bank, profileType, risk, consent, kycFile, chequeFile, navigate]);

    return (
        <div className="auth-page auth-page-signup">
            <div className="auth-card auth-card-signup">
                <div className="auth-logo-container">
                    <img src={logo} alt="OngoleBulls" className="auth-logo" />
                </div>

                {/* Crisp Visual Stepper */}
                <div className="stepper-container">
                    <div className="stepper-bg-line" />
                    <div
                        className="stepper-progress-line"
                        style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
                    />

                    <div className="stepper-steps-wrapper">
                        {STEPS.map((label, i) => {
                            const active = i <= step;
                            const completed = i < step;

                            let circleClass = "stepper-circle ";
                            if (completed) circleClass += "completed";
                            else if (active) circleClass += "active";
                            else circleClass += "upcoming";

                            let labelClass = "stepper-label ";
                            if (active) labelClass += "active";
                            else labelClass += "upcoming";

                            return (
                                <div key={label} className="stepper-step">
                                    <div className={circleClass}>
                                        {completed ? <Check size={16} strokeWidth={3} /> : i + 1}
                                    </div>
                                    <span className={labelClass}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Dynamic Content Container */}
                <div style={{ minHeight: '400px', paddingBottom: '1.5rem', marginTop: '3.5rem' }}>
                    {step === 0 && <Step1 personal={personal} updatePersonal={updatePersonal} email={email} setEmail={setEmail} otp={otp} setOtp={setOtp} otpSent={otpSent} otpVerified={otpVerified} handleSendOtp={handleSendOtp} handleVerifyOtp={handleVerifyOtp} loading={loading} />}
                    {step === 1 && <Step2 profileType={profileType} setProfileType={setProfileType} />}
                    {step === 2 && <Step3 kyc={kyc} updateKyc={updateKyc} setKycFile={setKycFile} />}
                    {step === 3 && <Step4 bank={bank} updateBank={updateBank} setChequeFile={setChequeFile} />}
                    {step === 4 && <Step5 risk={risk} updateRisk={updateRisk} />}
                    {step === 5 && <Step6 consent={consent} updateConsent={updateConsent} />}
                </div>

                {/* Navigation Actions */}
                <div className="auth-actions">
                    <button
                        onClick={handleBack}
                        className="auth-btn auth-btn-secondary"
                        style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}
                    >
                        ← Back
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button onClick={handleNext} className="auth-btn auth-btn-dark">
                            Continue
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={loading} className="auth-btn auth-btn-success" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {loading ? 'Processing...' : 'Complete Signup & Proceed'}
                        </button>
                    )}
                </div>

                {step === 0 && (
                    <p className="auth-footer-text" style={{ marginTop: '2.5rem' }}>
                        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
}
