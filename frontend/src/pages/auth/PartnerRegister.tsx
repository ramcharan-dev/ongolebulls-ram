import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { sendEmailOtp, verifyEmailOtp } from '../../api/authApi';
import api from '../../api/axiosConfig';
import logo from '../../assets/logo4.png';

/* ─── Constants ───────────────────────────────────────────────────────── */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const INITIAL_FORM = {
  partnerType: '', mobile: '', otp: '', email: '', password: '', confirmPassword: '',
  termsAccepted: false, fullName: '', pan: '', arn: '', euin: '',
  bankAccount: '', ifsc: '', bankName: '', firmName: '', authorizedPerson: '', euinHolderName: '',
};

const BENEFITS = [
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Earn Trail Commission', desc: 'Earn consistent trail income on every SIP and investment your clients make. Monthly payouts, transparent tracking.' },
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Real-time Portfolio Tracking', desc: 'Monitor all your clients\' portfolios in one place. CAS upload, AMC-wise breakdown, and COB opportunities.' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Dedicated Relationship Manager', desc: 'Every partner gets a dedicated RM for onboarding, query resolution, and business growth guidance.' },
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'SEBI Compliant Platform', desc: 'Built for ARN-registered distributors. Full compliance with SEBI and AMFI regulations. Your data is secure.' },
  { icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', title: 'Digital Onboarding for Clients', desc: 'Share smart links. Your clients onboard digitally — no paperwork, no hassle, fully tracked.' },
];

/* ─── Injected CSS ────────────────────────────────────────────────────── */
const CSS = `
  .pr-input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .pr-select:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .pr-submit:hover:not(:disabled) { background: linear-gradient(135deg, #334155, #1e3a5f) !important; transform: translateY(-1px); }
  .pr-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .pr-otp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  @keyframes pr-spin { to { transform: rotate(360deg); } }
  .pr-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: pr-spin 0.6s linear infinite; display: inline-block; }
  @media (max-width: 768px) {
    .pr-left-panel { display: none !important; }
    .pr-right-panel { width: 100% !important; padding: 24px 20px !important; }
    .pr-root { flex-direction: column !important; }
  }
`;

/* ─── Reusable style objects ──────────────────────────────────────────── */
const s = {
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 } as React.CSSProperties,
  input: { width: '100%', height: 48, border: '1px solid #e2e8f0', borderRadius: 8, padding: '0 16px', fontSize: 15, color: '#0f172a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', background: '#fff', transition: 'border-color 0.15s, box-shadow 0.15s' } as React.CSSProperties,
  select: { width: '100%', height: 48, border: '1px solid #e2e8f0', borderRadius: 8, padding: '0 16px', fontSize: 15, color: '#0f172a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', background: '#fff', cursor: 'pointer', appearance: 'auto' as const } as React.CSSProperties,
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } as React.CSSProperties,
  error: { color: '#b91c1c', fontSize: 12, marginTop: 4 } as React.CSSProperties,
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 16px', paddingBottom: 8, borderBottom: '1px solid #e2e8f0' } as React.CSSProperties,
  section: { marginBottom: 28 } as React.CSSProperties,
  eyeBtn: { position: 'absolute' as const, right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 } as React.CSSProperties,
  pwWrap: { position: 'relative' as const } as React.CSSProperties,
  accordion: (show: boolean) => ({ maxHeight: show ? 1200 : 0, opacity: show ? 1 : 0, overflow: 'hidden' as const, transition: 'max-height 0.35s ease, opacity 0.3s ease' }) as React.CSSProperties,
};

/* ═══════════════════════════════════════════════════════════════════════ */
export default function PartnerRegister() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [referralId, setReferralId] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const refParam = searchParams.get('ref');
    if (typeParam === 'INDIVIDUAL_PARTNER' || typeParam === 'NON_INDIVIDUAL_PARTNER') {
      setForm(p => ({ ...p, partnerType: typeParam }));
    }
    if (refParam) {
      setReferralId(refParam);
      api.get(`/api/auth/referrer-info?ref=${refParam}`)
        .then(res => { if (res.data?.referrerName) setReferrerName(res.data.referrerName); })
        .catch(() => {});
    }
  }, [searchParams]);

  const isIndividual = form.partnerType === 'INDIVIDUAL_PARTNER';
  const typeSelected = form.partnerType === 'INDIVIDUAL_PARTNER' || form.partnerType === 'NON_INDIVIDUAL_PARTNER';

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setForm(p => ({ ...p, [target.name]: value }));
    setErrors(p => ({ ...p, [target.name]: '' }));
  };

  const handleSendOtp = async () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { setOtpError('Enter a valid email address first.'); return; }
    setOtpError(''); setOtpLoading(true);
    try { await sendEmailOtp(form.email); setOtpSent(true); }
    catch (err: any) { setOtpError(err.userMessage || 'Failed to send OTP.'); }
    finally { setOtpLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!form.otp.trim()) return;
    setOtpError(''); setOtpLoading(true);
    try {
      const res = await verifyEmailOtp(form.email, form.otp);
      if (res.data.status === 'verified') setOtpVerified(true);
      else setOtpError('Invalid OTP. Please try again.');
    } catch (err: any) { setOtpError(err.userMessage || 'OTP verification failed.'); }
    finally { setOtpLoading(false); }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.partnerType) e.partnerType = 'Select a partner type.';
    if (!form.mobile || !/^[0-9]{10}$/.test(form.mobile)) e.mobile = 'Must be exactly 10 digits.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.termsAccepted) e.termsAccepted = 'You must accept the terms.';
    if (isIndividual) {
      if (!form.fullName.trim()) e.fullName = 'Required.'; if (!PAN_REGEX.test(form.pan)) e.pan = 'Invalid PAN.';
      if (!form.arn.trim()) e.arn = 'Required.'; if (!form.euin.trim()) e.euin = 'Required.';
      if (!form.bankAccount.trim()) e.bankAccount = 'Required.'; if (!form.ifsc.trim()) e.ifsc = 'Required.'; if (!form.bankName.trim()) e.bankName = 'Required.';
    } else if (form.partnerType === 'NON_INDIVIDUAL_PARTNER') {
      if (!form.firmName.trim()) e.firmName = 'Required.'; if (!form.authorizedPerson.trim()) e.authorizedPerson = 'Required.';
      if (!PAN_REGEX.test(form.pan)) e.pan = 'Invalid PAN.'; if (!form.arn.trim()) e.arn = 'Required.';
      if (!form.euinHolderName.trim()) e.euinHolderName = 'Required.'; if (!form.euin.trim()) e.euin = 'Required.';
      if (!form.bankAccount.trim()) e.bankAccount = 'Required.'; if (!form.ifsc.trim()) e.ifsc = 'Required.'; if (!form.bankName.trim()) e.bankName = 'Required.';
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setGlobalError(''); if (!validate()) return;
    setLoading(true);
    try {
      const url = referralId ? `/api/auth/register/partner?ref=${referralId}` : '/api/auth/register/partner';
      await api.post(url, {
        partnerType: form.partnerType, email: form.email, mobile: form.mobile, password: form.password,
        fullName: isIndividual ? form.fullName : null, firmName: isIndividual ? null : form.firmName,
        authorizedPerson: isIndividual ? null : form.authorizedPerson, pan: form.pan, arn: form.arn, euin: form.euin,
        euinHolderName: isIndividual ? null : form.euinHolderName, bankAccount: form.bankAccount, ifsc: form.ifsc, bankName: form.bankName,
      });
      setSuccess(true);
    } catch (err: any) { setGlobalError(err.userMessage || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const err = (field: string) => errors[field] ? <p style={s.error}>{errors[field]}</p> : null;

  /* ── Success Screen ── */
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 460, background: '#fff', borderRadius: 16, padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none"><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Registration Successful</h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>Your account is pending activation. You will be notified once activated.</p>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 48, padding: '0 32px', background: '#1e293b', color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Back to Sign In</Link>
        </div>
      </div>
    );
  }

  /* ── Two-Column Layout ── */
  return (
    <>
      <style>{CSS}</style>
      <div className="pr-root" style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

        {/* ═══ LEFT PANEL ═══ */}
        <div className="pr-left-panel" style={{ width: '45%', background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 40px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'rgba(59,130,246,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(59,130,246,0.04)' }} />

          {/* Top — Logo + Tagline */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <img src={logo} alt="OngoleBulls" style={{ height: 44, marginBottom: 20 }} />
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>Partner with OngoleBulls</h1>
            <p style={{ fontSize: 16, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>India's trusted mutual fund distribution platform</p>
          </div>

          {/* Middle — Benefits */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: '0 0 24px' }}>Why join our partner network?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={b.icon} /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{b.title}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — Trust indicators */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16 }}>
              {[{ num: '500+', label: 'Partners' }, { num: '\u20B9200Cr+', label: 'AUM' }, { num: '10,000+', label: 'Investors' }].map((t, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{t.num}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{t.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', margin: 0 }}>Registered with AMFI &middot; SEBI Compliant &middot; ISO Certified</p>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="pr-right-panel" style={{ width: '55%', background: '#f8fafc', overflowY: 'auto', padding: '48px 40px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>

            {/* Header */}
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Create Partner Account</h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link></p>

            {/* Referrer banner */}
            {referrerName && (
              <div style={{ background: '#f0fdf4', borderLeft: '4px solid #16a34a', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="10" fill="#16a34a"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 14, color: '#15803d' }}>You were referred by <strong>{referrerName}</strong></span>
              </div>
            )}

            {globalError && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>{globalError}</div>}

            <form onSubmit={handleSubmit}>

              {/* Section: Account Details */}
              <div style={s.section}>
                <div style={s.sectionTitle}>Account Details</div>

                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Partner Type *</label>
                  <select name="partnerType" value={form.partnerType} onChange={set} className="pr-select pr-input" style={s.select}>
                    <option value="" disabled>Select partner type</option>
                    <option value="INDIVIDUAL_PARTNER">Individual Partner</option>
                    <option value="NON_INDIVIDUAL_PARTNER">Partner Firm</option>
                  </select>
                  {err('partnerType')}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Email Address *</label>
                  <div style={{ display: 'flex', gap: 0 }}>
                    <input type="email" name="email" value={form.email} onChange={set} placeholder="you@example.com" className="pr-input" style={{ ...s.input, flex: 1, borderRadius: otpSent ? 8 : '8px 0 0 8px' }} disabled={otpVerified} />
                    {!otpSent && <button type="button" className="pr-otp-btn" onClick={handleSendOtp} disabled={otpLoading} style={{ height: 48, padding: '0 20px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>{otpLoading ? 'Sending...' : 'Send OTP'}</button>}
                  </div>
                  {err('email')}
                </div>

                {otpSent && !otpVerified && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={s.label}>Enter OTP</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input type="text" name="otp" value={form.otp} onChange={set} placeholder="6-digit OTP" className="pr-input" style={{ ...s.input, flex: 1 }} maxLength={6} />
                      <button type="button" className="pr-otp-btn" onClick={handleVerifyOtp} disabled={otpLoading} style={{ height: 48, padding: '0 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>{otpLoading ? 'Verifying...' : 'Verify'}</button>
                    </div>
                    {otpError && <p style={s.error}>{otpError}</p>}
                  </div>
                )}

                {otpVerified && <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#16a34a"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span style={{ color: '#16a34a', fontWeight: 600, fontSize: 13 }}>Email verified</span></div>}

                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Mobile Number *</label>
                  <input type="text" name="mobile" value={form.mobile} onChange={set} placeholder="10-digit mobile number" className="pr-input" style={s.input} maxLength={10} />
                  {err('mobile')}
                </div>

                <div style={{ ...s.row, marginBottom: 0 }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={s.label}>Password *</label>
                    <div style={s.pwWrap}>
                      <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={set} placeholder="Minimum 8 characters" className="pr-input" style={{ ...s.input, paddingRight: 44 }} />
                      <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(v => !v)} tabIndex={-1}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    {err('password')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={s.label}>Confirm Password *</label>
                    <div style={s.pwWrap}>
                      <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={set} placeholder="Re-enter password" className="pr-input" style={{ ...s.input, paddingRight: 44 }} />
                      <button type="button" style={s.eyeBtn} onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    {err('confirmPassword')}
                  </div>
                </div>
              </div>

              {/* Section: Partner/Firm Details (accordion) */}
              <div style={s.accordion(typeSelected)}>
                <div style={s.section}>
                  <div style={s.sectionTitle}>{isIndividual ? 'Personal Details' : 'Firm Details'}</div>
                  {isIndividual ? (
                    <>
                      <div style={{ ...s.row, marginBottom: 16 }}>
                        <div><label style={s.label}>Full Name *</label><input name="fullName" value={form.fullName} onChange={set} placeholder="Your full name" className="pr-input" style={s.input} />{err('fullName')}</div>
                        <div><label style={s.label}>PAN Number *</label><input name="pan" value={form.pan} onChange={set} placeholder="ABCDE1234F" className="pr-input" style={{ ...s.input, textTransform: 'uppercase' }} />{err('pan')}</div>
                      </div>
                      <div style={s.row}>
                        <div><label style={s.label}>ARN Number *</label><input name="arn" value={form.arn} onChange={set} placeholder="ARN-XXXXXX" className="pr-input" style={s.input} />{err('arn')}</div>
                        <div><label style={s.label}>EUIN *</label><input name="euin" value={form.euin} onChange={set} placeholder="EUIN number" className="pr-input" style={s.input} />{err('euin')}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ marginBottom: 16 }}><label style={s.label}>Firm / Company Name *</label><input name="firmName" value={form.firmName} onChange={set} placeholder="Firm name" className="pr-input" style={s.input} />{err('firmName')}</div>
                      <div style={{ marginBottom: 16 }}><label style={s.label}>Authorized Person Name *</label><input name="authorizedPerson" value={form.authorizedPerson} onChange={set} placeholder="Authorized person" className="pr-input" style={s.input} />{err('authorizedPerson')}</div>
                      <div style={{ ...s.row, marginBottom: 16 }}>
                        <div><label style={s.label}>Firm PAN *</label><input name="pan" value={form.pan} onChange={set} placeholder="ABCDE1234F" className="pr-input" style={{ ...s.input, textTransform: 'uppercase' }} />{err('pan')}</div>
                        <div><label style={s.label}>Firm ARN *</label><input name="arn" value={form.arn} onChange={set} placeholder="ARN-XXXXXX" className="pr-input" style={s.input} />{err('arn')}</div>
                      </div>
                      <div style={s.row}>
                        <div><label style={s.label}>EUIN Holder Name *</label><input name="euinHolderName" value={form.euinHolderName} onChange={set} placeholder="EUIN holder name" className="pr-input" style={s.input} />{err('euinHolderName')}</div>
                        <div><label style={s.label}>EUIN Number *</label><input name="euin" value={form.euin} onChange={set} placeholder="EUIN number" className="pr-input" style={s.input} />{err('euin')}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Section: Bank Details */}
                <div style={s.section}>
                  <div style={s.sectionTitle}>Bank Details</div>
                  <div style={{ marginBottom: 16 }}><label style={s.label}>Bank Account Number *</label><input name="bankAccount" value={form.bankAccount} onChange={set} placeholder="Account number" className="pr-input" style={s.input} />{err('bankAccount')}</div>
                  <div style={s.row}>
                    <div><label style={s.label}>IFSC Code *</label><input name="ifsc" value={form.ifsc} onChange={set} placeholder="SBIN0001234" className="pr-input" style={s.input} />{err('ifsc')}</div>
                    <div><label style={s.label}>Bank Name *</label><input name="bankName" value={form.bankName} onChange={set} placeholder="e.g. State Bank of India" className="pr-input" style={s.input} />{err('bankName')}</div>
                  </div>
                </div>
              </div>

              {/* Section: Agreement */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={set} style={{ width: 16, height: 16, accentColor: '#2563eb', cursor: 'pointer', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: '#374151' }}>I agree to the <Link to="#" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Terms and Conditions</Link></span>
                </label>
                {err('termsAccepted')}
              </div>

              <button type="submit" className="pr-submit" disabled={loading} style={{ width: '100%', height: 52, background: 'linear-gradient(135deg, #1e293b, #1e3a5f)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s ease' }}>
                {loading && <span className="pr-spinner" />}
                {loading ? 'Creating Account...' : 'Create Partner Account \u2192'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b' }}>
              Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
