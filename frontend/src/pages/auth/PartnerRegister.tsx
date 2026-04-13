import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { sendEmailOtp, verifyEmailOtp } from '../../api/authApi';
import api from '../../api/axiosConfig';
import { locationApi } from '../../api/locationApi';
import logo from '../../assets/logo4.png';

/* ─── Constants ───────────────────────────────────────────────────────── */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const INITIAL_FORM = {
  partnerType: '', mobile: '', otp: '', email: '', password: '', confirmPassword: '',
  termsAccepted: false, fullName: '', pan: '', arn: '', euin: '',
  bankAccount: '', ifsc: '', bankName: '', firmName: '', authorizedPerson: '', euinHolderName: '',
  state: '', district: '', city: '',
};

const BENEFITS = [
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Earn Trail Commission', desc: 'Earn consistent trail income on every SIP and investment your clients make. Monthly payouts, transparent tracking.' },
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Real-time Portfolio Tracking', desc: 'Monitor all your clients\' portfolios in one place. CAS upload, AMC-wise breakdown, and COB opportunities.' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Dedicated Relationship Manager', desc: 'Every partner gets a dedicated RM for onboarding, query resolution, and business growth guidance.' },
  { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'SEBI Compliant Platform', desc: 'Built for ARN-registered distributors. Full compliance with SEBI and AMFI regulations. Your data is secure.' },
  { icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', title: 'Digital Onboarding for Clients', desc: 'Share smart links. Your clients onboard digitally — no paperwork, no hassle, fully tracked.' },
];
const HEADER_OFFSET = 84;

/* ─── Injected CSS ────────────────────────────────────────────────────── */
const CSS = `
  .pr-input {
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  }
  .pr-input:hover {
    border-color: #cfd8e6 !important;
    background: #ffffff !important;
  }
  .pr-input:focus {
    border-color: #1d4ed8 !important;
    box-shadow: 0 0 0 4px rgba(29,78,216,0.08) !important;
    background: #ffffff !important;
  }
  .pr-select:focus { border-color: #1d4ed8 !important; box-shadow: 0 0 0 4px rgba(29,78,216,0.08); }
  .pr-submit:hover:not(:disabled) { background: linear-gradient(135deg, #172033, #243755) !important; transform: translateY(-1px); box-shadow: 0 18px 34px rgba(15,23,42,0.18); }
  .pr-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .pr-otp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .pr-otp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(15,23,42,0.12); }
  .pr-section-card {
    background: transparent;
    border: none;
    border-top: 1px solid #dde5ef;
    border-radius: 0;
    padding: 18px 0 0;
    box-shadow: none;
  }
  .pr-field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .pr-field-shell {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pr-field-shell--full {
    grid-column: 1 / -1;
  }
  .pr-form-card {
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }
  .pr-inline-note {
    font-size: 12px;
    color: #64748b;
    line-height: 1.55;
  }
  [data-theme="dark"] .pr-input:hover {
    border-color: #41516f !important;
    background: #182233 !important;
  }
  [data-theme="dark"] .pr-input:focus {
    border-color: #5b86ff !important;
    box-shadow: 0 0 0 4px rgba(91,134,255,0.10) !important;
    background: #182233 !important;
  }
  [data-theme="dark"] .pr-select:focus {
    border-color: #5b86ff !important;
    box-shadow: 0 0 0 4px rgba(91,134,255,0.10);
  }
  [data-theme="dark"] .pr-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d2940, #2b3d60) !important;
    box-shadow: 0 18px 34px rgba(0,0,0,0.28);
  }
  [data-theme="dark"] .pr-otp-btn:hover:not(:disabled) {
    box-shadow: 0 14px 28px rgba(0,0,0,0.22);
  }
  @keyframes pr-spin { to { transform: rotate(360deg); } }
  .pr-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: pr-spin 0.6s linear infinite; display: inline-block; }
  @media (max-width: 768px) {
    .pr-left-panel { display: none !important; }
    .pr-right-panel { margin-left: 0 !important; width: 100% !important; padding: 24px 20px !important; }
    .pr-root { flex-direction: column !important; }
    .pr-form-card { padding: 20px !important; border-radius: 22px !important; }
    .pr-form-card { padding: 0 !important; border-radius: 0 !important; }
    .pr-section-card { padding: 18px 0 0 !important; border-radius: 0 !important; }
    .pr-field-grid { grid-template-columns: 1fr !important; }
  }
  @media (min-width: 1200px) {
    .pr-right-panel { padding: 40px 48px !important; }
  }
`;

/* ─── Reusable style objects ──────────────────────────────────────────── */
function getRegisterPalette(isDark: boolean) {
  if (isDark) {
    return {
      pageBg: 'linear-gradient(180deg, #08111f 0%, #0c1628 100%)',
      pageText: '#f4f8ff',
      title: '#f8fbff',
      body: '#9fb0cb',
      label: '#d9e2f0',
      sectionTitle: '#8ea4c6',
      divider: '#233249',
      inputBg: '#141f31',
      inputBorder: '#2a3952',
      inputText: '#f5f8ff',
      helper: '#8ea0bc',
      eyeBg: '#1b273b',
      eyeBorder: '#30425f',
      eyeColor: '#9db0ca',
      checkBg: 'transparent',
      checkBorder: '#2b3950',
      noticeBg: '#111c2c',
      noticeBorder: '#334760',
      noticeText: '#adc0d8',
      successBg: '#0d2518',
      successBorder: '#1f6b45',
      successText: '#8ae0af',
      errorBg: '#2a1416',
      errorBorder: '#6b2a30',
      errorText: '#ffb7ba',
      otpBtn: 'linear-gradient(135deg, #24344f, #31486d)',
      submitBtn: 'linear-gradient(135deg, #d99a1b, #b77705)',
      submitText: '#101827',
      checkboxText: '#d6e0ee',
      link: '#7ea7ff',
    };
  }
  return {
    pageBg: 'linear-gradient(180deg, #f7f9fc 0%, #f3f6fb 100%)',
    pageText: '#0f172a',
    title: '#0f172a',
    body: '#64748b',
    label: '#1e293b',
    sectionTitle: '#50627d',
    divider: '#dde5ef',
    inputBg: '#f8fafc',
    inputBorder: '#d7dfeb',
    inputText: '#0f172a',
    helper: '#607089',
    eyeBg: '#ffffff',
    eyeBorder: '#dce5ef',
    eyeColor: '#64748b',
    checkBg: 'transparent',
    checkBorder: '#e6ecf3',
    noticeBg: '#f8fafc',
    noticeBorder: '#cbd5e1',
    noticeText: '#475569',
    successBg: '#f2fbf6',
    successBorder: '#cdeed9',
    successText: '#15803d',
    errorBg: '#fff5f5',
    errorBorder: '#fecaca',
    errorText: '#b91c1c',
    otpBtn: 'linear-gradient(135deg, #172033, #263754)',
    submitBtn: 'linear-gradient(135deg, #172033, #263754)',
    submitText: '#ffffff',
    checkboxText: '#334155',
    link: '#2563eb',
  };
}

function getRegisterStyles(T: ReturnType<typeof getRegisterPalette>) {
  return {
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: T.label, marginBottom: 2 } as React.CSSProperties,
    helper: { fontSize: 12, color: T.helper, lineHeight: 1.6 } as React.CSSProperties,
    input: { width: '100%', height: 48, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: '0 14px', fontSize: 15, color: T.inputText, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', background: T.inputBg } as React.CSSProperties,
    select: { width: '100%', height: 48, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: '0 14px', fontSize: 15, color: T.inputText, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', background: T.inputBg, cursor: 'pointer', appearance: 'auto' as const } as React.CSSProperties,
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } as React.CSSProperties,
    error: { color: T.errorText, fontSize: 12, marginTop: 2, fontWeight: 600 } as React.CSSProperties,
    sectionTitle: { fontSize: 12, fontWeight: 800, color: T.sectionTitle, textTransform: 'uppercase' as const, letterSpacing: '0.18em', margin: 0 } as React.CSSProperties,
    sectionDesc: { fontSize: 13, color: T.helper, marginTop: 6, lineHeight: 1.65 } as React.CSSProperties,
    section: { marginBottom: 28 } as React.CSSProperties,
    eyeBtn: { position: 'absolute' as const, right: 10, top: '50%', transform: 'translateY(-50%)', background: T.eyeBg, border: `1px solid ${T.eyeBorder}`, cursor: 'pointer', color: T.eyeColor, padding: 5, borderRadius: 999, boxShadow: 'none' } as React.CSSProperties,
    pwWrap: { position: 'relative' as const } as React.CSSProperties,
    accordion: (show: boolean) => ({ maxHeight: show ? 1200 : 0, opacity: show ? 1 : 0, overflow: 'hidden' as const, transition: 'max-height 0.35s ease, opacity 0.3s ease' }) as React.CSSProperties,
    checkboxCard: { background: T.checkBg, border: `1px solid ${T.checkBorder}`, borderRadius: 12, padding: '14px 16px' } as React.CSSProperties,
    inlineNotice: { background: T.noticeBg, border: `1px dashed ${T.noticeBorder}`, borderRadius: 12, padding: '14px 16px', color: T.noticeText, fontSize: 14, lineHeight: 1.6 } as React.CSSProperties,
  };
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function PartnerRegister() {
  const { isDark } = useTheme();
  const T = getRegisterPalette(isDark);
  const s = getRegisterStyles(T);
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

  // Location dropdowns
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  // Load the list of states once on mount.
  useEffect(() => {
    console.log('[PartnerRegister] fetching states from /api/locations/states');
    setStatesLoading(true);
    locationApi.getStates()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        console.log('[PartnerRegister] states response:', data.length, 'items', data.slice(0, 3));
        setStates(data);
      })
      .catch(err => {
        console.error('[PartnerRegister] states fetch failed:', err);
        setStates([]);
      })
      .finally(() => setStatesLoading(false));
  }, []);

  // Reload districts whenever the selected state changes.
  useEffect(() => {
    if (!form.state) {
      setDistricts([]);
      return;
    }
    console.log('[PartnerRegister] fetching districts for state:', form.state);
    setDistrictsLoading(true);
    locationApi.getDistricts(form.state)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        console.log('[PartnerRegister] districts response for', form.state + ':', data.length, 'items');
        setDistricts(data);
      })
      .catch(err => {
        console.error('[PartnerRegister] districts fetch failed:', err);
        setDistricts([]);
      })
      .finally(() => setDistrictsLoading(false));
  }, [form.state]);

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
    let value: string | boolean = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    // Auto-uppercase PAN and IFSC so the stored value matches what the user sees
    // (CSS textTransform only changes display, not the actual form value).
    if (typeof value === 'string' && (target.name === 'pan' || target.name === 'ifsc')) {
      value = value.toUpperCase();
    }
    setForm(p => {
      // Changing the state clears the dependent district selection.
      if (target.name === 'state') {
        return { ...p, state: value as string, district: '' };
      }
      return { ...p, [target.name]: value };
    });
    setErrors(p => ({ ...p, [target.name]: '', ...(target.name === 'state' ? { district: '' } : {}) }));
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

    // ── Account Details ──
    if (!form.partnerType) e.partnerType = 'Select a partner type.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.mobile || !/^[0-9]{10}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number.';
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';

    // ── Personal / Firm Details ──
    if (isIndividual) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required.';
      if (!form.pan.trim()) {
        e.pan = 'PAN is required.';
      } else if (!PAN_REGEX.test(form.pan.toUpperCase())) {
        e.pan = 'Invalid PAN format. Expected: ABCDE1234F (5 letters, 4 digits, 1 letter).';
      }
      if (!form.arn.trim()) e.arn = 'ARN number is required.';
    } else if (form.partnerType === 'NON_INDIVIDUAL_PARTNER') {
      if (!form.firmName.trim()) e.firmName = 'Firm name is required.';
      if (!form.authorizedPerson.trim()) e.authorizedPerson = 'Authorized person name is required.';
      if (!form.pan.trim()) {
        e.pan = 'PAN is required.';
      } else if (!PAN_REGEX.test(form.pan.toUpperCase())) {
        e.pan = 'Invalid PAN format. Expected: ABCDE1234F (5 letters, 4 digits, 1 letter).';
      }
      if (!form.arn.trim()) e.arn = 'ARN number is required.';
    }

    // ── Location ──
    if (!form.state) e.state = 'State is required.';
    if (!form.district) e.district = 'District is required.';
    if (!form.city.trim()) e.city = 'City is required.';

    // ── Bank Details ──
    if (typeSelected) {
      if (!form.bankAccount.trim()) {
        e.bankAccount = 'Bank account number is required.';
      } else if (!/^[0-9]{9,18}$/.test(form.bankAccount.trim())) {
        e.bankAccount = 'Account number must be 9-18 digits.';
      }
      if (!form.ifsc.trim()) {
        e.ifsc = 'IFSC code is required.';
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase())) {
        e.ifsc = 'Invalid IFSC format. Expected: ABCD0123456 (4 letters, 0, 6 alphanumeric).';
      }
      if (!form.bankName.trim()) e.bankName = 'Bank name is required.';
    }

    // ── Agreement ──
    if (!form.termsAccepted) e.termsAccepted = 'You must accept the terms.';

    setErrors(e);
    return Object.keys(e).length === 0;
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
        state: form.state, district: form.district, city: form.city.trim(),
      });
      setSuccess(true);
    } catch (err: any) { setGlobalError(err.userMessage || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const err = (field: string) => errors[field] ? <p style={s.error}>{errors[field]}</p> : null;

  /* ── Success Screen ── */
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: T.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 460, background: T.inputBg, borderRadius: 18, padding: '48px', boxShadow: isDark ? '0 22px 54px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.08)', border: `1px solid ${T.inputBorder}`, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: `1px solid ${T.successBorder}` }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none"><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: T.title, marginBottom: 12 }}>Registration Successful</h2>
          <p style={{ color: T.body, fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>Your account is pending activation. You will be notified once activated.</p>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 48, padding: '0 32px', background: T.submitBtn, color: T.submitText, borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Back to Sign In</Link>
        </div>
      </div>
    );
  }

  /* ── Two-Column Layout ── */
  return (
    <>
      <style>{CSS}</style>
      <div className="pr-root" style={{ display: 'flex', minHeight: `calc(100vh - ${HEADER_OFFSET}px)`, paddingTop: HEADER_OFFSET, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: T.pageBg, color: T.pageText }}>

        {/* ═══ LEFT PANEL ═══ */}
        <div className="pr-left-panel" style={{ width: '45%', background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 36px', flexShrink: 0, position: 'fixed', top: HEADER_OFFSET, left: 0, height: `calc(100vh - ${HEADER_OFFSET}px)`, overflowY: 'auto', zIndex: 1 }}>
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
            <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Why join our partner network?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={b.icon} /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — Trust indicators */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 12 }}>
              {[{ num: '500+', label: 'Partners' }, { num: '\u20B9200Cr+', label: 'AUM' }, { num: '10,000+', label: 'Investors' }].map((t, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>{t.num}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{t.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', margin: 0 }}>Registered with AMFI &middot; SEBI Compliant &middot; ISO Certified</p>
          </div>
        </div>

        {/* ═══ RIGHT PANEL ═══ */}
        <div className="pr-right-panel" style={{ marginLeft: '45%', width: '55%', minHeight: `calc(100vh - ${HEADER_OFFSET}px)`, background: T.pageBg, overflowY: 'auto', padding: '40px 40px 48px' }}>
          <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
            <div className="pr-form-card">

            {/* Header */}
            <h2 style={{ fontSize: 28, fontWeight: 800, color: T.title, margin: '0 0 6px', letterSpacing: '-0.03em' }}>Create Partner Account</h2>
            <p style={{ fontSize: 14, color: T.body, margin: '0 0 28px', lineHeight: 1.6 }}>Set up your distributor profile with cleaner verification, business, and bank details in one place. Already have an account? <Link to="/login" style={{ color: T.link, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link></p>

            {/* Referrer banner */}
            {referrerName && (
              <div style={{ background: T.successBg, border: `1px solid ${T.successBorder}`, borderLeft: '4px solid #16a34a', borderRadius: 12, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="10" fill="#16a34a"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span style={{ fontSize: 14, color: T.successText }}>You were referred by <strong>{referrerName}</strong></span>
              </div>
            )}

            {globalError && <div style={{ background: T.errorBg, color: T.errorText, padding: '11px 14px', borderRadius: 12, marginBottom: 20, fontSize: 14, border: `1px solid ${T.errorBorder}` }}>{globalError}</div>}

            <form onSubmit={handleSubmit}>

              {/* Section: Account Details */}
              <div style={s.section}>
                <div className="pr-section-card">
                <div style={s.sectionTitle}>Account Details</div>
                <p style={{ ...s.sectionDesc, marginBottom: 18 }}>
                  {typeSelected
                    ? 'Start with your login credentials and contact information for verification.'
                    : 'Select the partner type first to load the correct registration form.'}
                </p>

                <div className="pr-field-shell" style={{ marginBottom: 16 }}>
                  <label style={s.label}>Partner Type *</label>
                  <select name="partnerType" value={form.partnerType} onChange={set} className="pr-select pr-input" style={s.select}>
                    <option value="" disabled>Select partner type</option>
                    <option value="INDIVIDUAL_PARTNER">Individual Partner</option>
                    <option value="NON_INDIVIDUAL_PARTNER">Partner Firm</option>
                  </select>
                  {err('partnerType')}
                </div>

                {!typeSelected ? (
                  <div style={s.inlineNotice}>
                    Choose `Individual Partner` or `Partner Firm` to reveal the matching registration fields.
                  </div>
                ) : (
                  <>
                    <div className="pr-field-shell" style={{ marginBottom: 16 }}>
                      <label style={s.label}>Email Address *</label>
                      <div style={s.helper}>We’ll send a one-time password to verify this email before activation.</div>
                      <div style={{ display: 'flex', gap: 0 }}>
                        <input type="email" name="email" value={form.email} onChange={set} placeholder="you@example.com" className="pr-input" style={{ ...s.input, flex: 1, borderRadius: otpSent ? 10 : '10px 0 0 10px' }} disabled={otpVerified} />
                        {!otpSent && <button type="button" className="pr-otp-btn" onClick={handleSendOtp} disabled={otpLoading} style={{ height: 48, padding: '0 18px', background: T.otpBtn, color: '#fff', border: 'none', borderRadius: '0 10px 10px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'transform 0.18s ease, background 0.18s ease' }}>{otpLoading ? 'Sending...' : 'Send OTP'}</button>}
                      </div>
                      {err('email')}
                    </div>

                    {otpSent && !otpVerified && (
                      <div className="pr-field-shell" style={{ marginBottom: 16 }}>
                        <label style={s.label}>Enter OTP</label>
                        <div style={s.helper}>Enter the code sent to your email to continue with registration.</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <input type="text" name="otp" value={form.otp} onChange={set} placeholder="6-digit OTP" className="pr-input" style={{ ...s.input, flex: 1 }} maxLength={6} />
                          <button type="button" className="pr-otp-btn" onClick={handleVerifyOtp} disabled={otpLoading} style={{ height: 48, padding: '0 18px', background: 'linear-gradient(135deg, #0f9f63, #15803d)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'transform 0.18s ease, background 0.18s ease' }}>{otpLoading ? 'Verifying...' : 'Verify'}</button>
                        </div>
                        {otpError && <p style={s.error}>{otpError}</p>}
                      </div>
                    )}

                    {otpVerified && <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, background: T.successBg, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: '10px 12px' }}><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#16a34a"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span style={{ color: T.successText, fontWeight: 700, fontSize: 13 }}>Email verified successfully</span></div>}

                    <div className="pr-field-shell" style={{ marginBottom: 16 }}>
                      <label style={s.label}>Mobile Number *</label>
                      <div style={s.helper}>Use the primary mobile number linked to your distributor profile.</div>
                      <input type="text" name="mobile" value={form.mobile} onChange={set} placeholder="10-digit mobile number" className="pr-input" style={s.input} maxLength={10} />
                      {err('mobile')}
                    </div>

                    <div className="pr-field-grid" style={{ marginBottom: 0 }}>
                      <div className="pr-field-shell" style={{ marginBottom: 16 }}>
                        <label style={s.label}>Password *</label>
                        <div style={s.helper}>Use at least 8 characters for a secure account.</div>
                        <div style={s.pwWrap}>
                          <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={set} placeholder="Minimum 8 characters" className="pr-input" style={{ ...s.input, paddingRight: 44 }} />
                          <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(v => !v)} tabIndex={-1}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        </div>
                        {err('password')}
                      </div>
                      <div className="pr-field-shell" style={{ marginBottom: 16 }}>
                        <label style={s.label}>Confirm Password *</label>
                        <div style={s.helper}>Re-enter the same password to avoid sign-in issues.</div>
                        <div style={s.pwWrap}>
                          <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={set} placeholder="Re-enter password" className="pr-input" style={{ ...s.input, paddingRight: 44 }} />
                          <button type="button" style={s.eyeBtn} onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                        </div>
                        {err('confirmPassword')}
                      </div>
                    </div>
                  </>
                )}
                </div>
              </div>

              {/* Section: Partner/Firm Details (accordion — gated on partner type) */}
              <div style={s.accordion(typeSelected)}>
                <div style={s.section}>
                  <div className="pr-section-card">
                  <div style={s.sectionTitle}>{isIndividual ? 'Personal Details' : 'Firm Details'}</div>
                  <p style={{ ...s.sectionDesc, marginBottom: 18 }}>{isIndividual ? 'Add your ARN-linked identity details exactly as they appear in official records.' : 'Add your firm and authorized representative details for compliance checks and onboarding.'}</p>
                  {isIndividual ? (
                    <>
                      <div className="pr-field-grid" style={{ marginBottom: 16 }}>
                        <div className="pr-field-shell"><label style={s.label}>Full Name *</label><input name="fullName" value={form.fullName} onChange={set} placeholder="Your full name" className="pr-input" style={s.input} />{err('fullName')}</div>
                        <div className="pr-field-shell"><label style={s.label}>PAN Number *</label><input name="pan" value={form.pan} onChange={set} placeholder="ABCDE1234F" className="pr-input" style={{ ...s.input, textTransform: 'uppercase' }} />{err('pan')}</div>
                      </div>
                      <div className="pr-field-grid">
                        <div className="pr-field-shell"><label style={s.label}>ARN Number *</label><input name="arn" value={form.arn} onChange={set} placeholder="ARN-XXXXXX" className="pr-input" style={s.input} />{err('arn')}</div>
                        <div className="pr-field-shell"><label style={s.label}>EUIN (Optional)</label><input name="euin" value={form.euin} onChange={set} placeholder="Enter manually or auto-fetched (optional)" className="pr-input" style={s.input} />{err('euin')}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pr-field-shell" style={{ marginBottom: 16 }}><label style={s.label}>Firm / Company Name *</label><input name="firmName" value={form.firmName} onChange={set} placeholder="Firm name" className="pr-input" style={s.input} />{err('firmName')}</div>
                      <div className="pr-field-shell" style={{ marginBottom: 16 }}><label style={s.label}>Authorized Person Name *</label><input name="authorizedPerson" value={form.authorizedPerson} onChange={set} placeholder="Authorized person" className="pr-input" style={s.input} />{err('authorizedPerson')}</div>
                      <div className="pr-field-grid" style={{ marginBottom: 16 }}>
                        <div className="pr-field-shell"><label style={s.label}>Firm PAN *</label><input name="pan" value={form.pan} onChange={set} placeholder="ABCDE1234F" className="pr-input" style={{ ...s.input, textTransform: 'uppercase' }} />{err('pan')}</div>
                        <div className="pr-field-shell"><label style={s.label}>Firm ARN *</label><input name="arn" value={form.arn} onChange={set} placeholder="ARN-XXXXXX" className="pr-input" style={s.input} />{err('arn')}</div>
                      </div>
                      <div className="pr-field-grid">
                        <div className="pr-field-shell"><label style={s.label}>EUIN Holder Name (Optional)</label><input name="euinHolderName" value={form.euinHolderName} onChange={set} placeholder="Enter manually or auto-fetched (optional)" className="pr-input" style={s.input} />{err('euinHolderName')}</div>
                        <div className="pr-field-shell"><label style={s.label}>EUIN Number (Optional)</label><input name="euin" value={form.euin} onChange={set} placeholder="Enter manually or auto-fetched (optional)" className="pr-input" style={s.input} />{err('euin')}</div>
                      </div>
                    </>
                  )}
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════
                  Section: Location — ALWAYS VISIBLE, not inside any accordion
                  or conditional. Positioned between Personal Details and Bank
                  Details so it is clearly visible in the form flow.
                  ════════════════════════════════════════════════════════════ */}
              {typeSelected && (
                <div style={s.section}>
                  <div className="pr-section-card">
                  <div style={s.sectionTitle}>Location</div>
                  <p style={{ ...s.sectionDesc, marginBottom: 18 }}>Choose your operating location so we can route support and onboarding correctly.</p>
                  <div className="pr-field-grid" style={{ marginBottom: 16 }}>
                    <div className="pr-field-shell">
                      <label style={s.label}>State *</label>
                      <select name="state" value={form.state} onChange={set} className="pr-select pr-input" style={s.select} disabled={statesLoading}>
                        <option value="" disabled>
                          {statesLoading
                            ? 'Loading states...'
                            : states.length === 0
                              ? 'No states available — check /api/locations/states'
                              : 'Select state'}
                        </option>
                        {states.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                      {err('state')}
                    </div>
                    <div className="pr-field-shell">
                      <label style={s.label}>District *</label>
                      <select name="district" value={form.district} onChange={set} className="pr-select pr-input" style={s.select} disabled={!form.state || districtsLoading}>
                        <option value="" disabled>
                          {!form.state ? 'Select state first' : districtsLoading ? 'Loading districts...' : 'Select district'}
                        </option>
                        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {err('district')}
                    </div>
                  </div>
                  <div className="pr-field-shell">
                    <label style={s.label}>City *</label>
                    <input name="city" value={form.city} onChange={set} placeholder="e.g. Ongole" className="pr-input" style={s.input} />
                    {err('city')}
                  </div>
                  </div>
                </div>
              )}

              {/* Section: Bank Details (accordion — gated on partner type) */}
              <div style={s.accordion(typeSelected)}>
                <div style={s.section}>
                  <div className="pr-section-card">
                  <div style={s.sectionTitle}>Bank Details</div>
                  <p style={{ ...s.sectionDesc, marginBottom: 18 }}>Add payout account details used for commissions and partner settlements.</p>
                  <div className="pr-field-shell" style={{ marginBottom: 16 }}><label style={s.label}>Bank Account Number *</label><input name="bankAccount" value={form.bankAccount} onChange={set} placeholder="Account number" className="pr-input" style={s.input} />{err('bankAccount')}</div>
                  <div className="pr-field-grid">
                    <div className="pr-field-shell"><label style={s.label}>IFSC Code *</label><input name="ifsc" value={form.ifsc} onChange={set} placeholder="SBIN0001234" className="pr-input" style={s.input} />{err('ifsc')}</div>
                    <div className="pr-field-shell"><label style={s.label}>Bank Name *</label><input name="bankName" value={form.bankName} onChange={set} placeholder="e.g. State Bank of India" className="pr-input" style={s.input} />{err('bankName')}</div>
                  </div>
                  </div>
                </div>
              </div>

              {/* Section: Agreement */}
              {typeSelected && (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ ...s.checkboxCard, display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                      <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={set} style={{ width: 16, height: 16, accentColor: '#2563eb', cursor: 'pointer', flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: T.checkboxText, lineHeight: 1.7 }}>I agree to the <Link to="#" style={{ color: T.link, fontWeight: 700, textDecoration: 'none' }}>Terms and Conditions</Link> and confirm that the business and compliance details provided above are accurate.</span>
                    </label>
                    {err('termsAccepted')}
                  </div>

                  <button type="submit" className="pr-submit" disabled={loading} style={{ width: '100%', minHeight: 50, background: T.submitBtn, color: T.submitText, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s ease', whiteSpace: 'nowrap', padding: '0 24px', flexShrink: 0 }}>
                    {loading && <span className="pr-spinner" />}
                    {loading ? 'Creating Account...' : 'Create Partner Account \u2192'}
                  </button>
                </>
              )}
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: T.body }}>
              Already have an account? <Link to="/login" style={{ color: T.link, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
