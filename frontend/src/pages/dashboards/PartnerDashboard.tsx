import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, UserCircle, Users, TrendingUp, FileText,
  LogOut, Plus, RefreshCw, Search, X, Copy, Check, Send,
  ChevronDown, ChevronRight, Upload, Eye, Bell, Lock,
  Target, CheckCircle, Circle, Clock, AlertTriangle, Info,
  UserPlus, Handshake, Wallet, BarChart3, FolderOpen,
  MessageSquare, Link2, ArrowRight, Shield, Building2, User,
  Inbox, Receipt, IndianRupee, Sun, Moon,
} from 'lucide-react';
import { partnerApi } from '../../api/partnerApi';
import type {
  PartnerProfile, PartnerStats, PartnerClientSummary,
  SipSummary, TrackerSummary, CobOpportunity, ReferralEntry,
  PartnerTransaction, PartnerRevenue,
} from '../../types/api';

/* ─── Design Tokens ──────────────────────────────────────────────────── */
function getColors(dark: boolean) {
  if (dark) {
    return {
      navy950: '#080b14', navy900: '#0d111c', navy800: '#131927', navy700: '#181f31',
      pri500: '#f6a91a', pri600: '#ffb020', pri700: '#d88d08', pri100: 'rgba(246,169,26,0.14)', pri50: 'rgba(246,169,26,0.08)',
      white: '#141a27', gray50: '#0f1320', gray100: '#1a2132', gray200: '#263049',
      gray300: '#33415f', gray400: '#7d879d', gray500: '#96a0b5', gray600: '#c5cede',
      gray700: '#e5ebf5', gray900: '#f8fbff',
      green500: '#28d17c', green100: 'rgba(40,209,124,0.14)', green400: '#40e08f',
      amber500: '#ffb020', amber100: 'rgba(255,176,32,0.15)', amber50: 'rgba(255,176,32,0.08)',
      red500: '#ff5a5f', red100: 'rgba(255,90,95,0.14)',
      purple100: 'rgba(168,85,247,0.15)', purple600: '#c084fc',
      orange100: 'rgba(249,115,22,0.15)', orange700: '#fb923c',
      indigo100: 'rgba(59,130,246,0.15)', indigo700: '#60a5fa',
    };
  }
  return {
    navy950: '#f3f6fb', navy900: '#f8fafc', navy800: '#ffffff', navy700: '#eef2f7',
    pri500: '#f59e0b', pri600: '#d97706', pri700: '#b45309', pri100: '#fef3c7', pri50: '#fffbeb',
    white: '#ffffff', gray50: '#f4f7fb', gray100: '#eef2f7', gray200: '#dbe3ef',
    gray300: '#c1cbda', gray400: '#75829a', gray500: '#5a677f', gray600: '#3c4759',
    gray700: '#1f2937', gray900: '#0f172a',
    green500: '#16a34a', green100: '#dcfce7', green400: '#22c55e',
    amber500: '#d97706', amber100: '#fef3c7', amber50: '#fffbeb',
    red500: '#ef4444', red100: '#fee2e2',
    purple100: '#f3e8ff', purple600: '#9333ea',
    orange100: '#ffedd5', orange700: '#c2410c',
    indigo100: '#dbeafe', indigo700: '#2563eb',
  };
}
function getStyles(C: ReturnType<typeof getColors>) {
  return {
    card: { background: `linear-gradient(180deg, ${C.white}, ${C.gray100})`, border: `1px solid ${C.gray200}`, borderRadius: 18, boxShadow: '0 18px 42px rgba(2,6,23,0.18)', padding: 22 } as React.CSSProperties,
    cardElevated: { background: `linear-gradient(180deg, ${C.white}, ${C.gray100})`, border: `1px solid ${C.gray200}`, borderRadius: 22, boxShadow: '0 24px 54px rgba(2,6,23,0.22)', padding: 24 } as React.CSSProperties,
    input: { width: '100%', height: 44, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: '0 14px', fontSize: 14, color: C.gray700, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Inter, system-ui, sans-serif', background: C.white } as React.CSSProperties,
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: C.gray500, textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 } as React.CSSProperties,
    btnPrimary: { background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, color: '#111827', border: 'none', borderRadius: 14, padding: '11px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif', boxShadow: '0 14px 28px rgba(246,169,26,0.22)' } as React.CSSProperties,
    btnOutline: { background: C.white, color: C.gray700, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: '11px 18px', fontWeight: 500, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnGhost: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  };
}
let C = getColors(false);
let S = getStyles(C);

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const fmt = (d: string | null | undefined) => {
  if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '—'; }
};
const formatCurrency = (n: number | null | undefined) => {
  if (n == null) return '₹0'; return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
};
const formatCompactNumber = (n: number | null | undefined) => new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(n ?? 0);
const percentOf = (value: number, total: number) => total > 0 ? Math.round((value / total) * 100) : 0;
const initials = (name: string | null | undefined) => {
  if (!name) return '?'; const p = name.trim().split(/\s+/); return p.length > 1 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};

function getStageStyles() {
  return {
    LEAD_CREATED:     { label: 'Lead Created',    bg: C.gray100,    color: C.gray600 },
    LINK_SENT:        { label: 'Link Sent',       bg: C.pri100,     color: C.pri700 },
    LINK_OPENED:      { label: 'Link Opened',     bg: C.purple100,  color: C.purple600 },
    KYC_STARTED:      { label: 'KYC Started',     bg: C.amber100,   color: '#92400E' },
    KYC_COMPLETED:    { label: 'KYC Completed',   bg: C.orange100,  color: C.orange700 },
    INVESTMENT_READY: { label: 'Investment Ready', bg: C.indigo100,  color: C.indigo700 },
    ACTIVE_INVESTOR:  { label: 'Active Investor',  bg: C.green100,   color: '#065F46' },
  } as Record<string, { label: string; bg: string; color: string }>;
}
const stageBadge = (stage: string) => {
  const STAGE_STYLES = getStageStyles();
  const s = STAGE_STYLES[stage] || { label: stage, bg: C.gray100, color: C.gray600 };
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: s.bg, color: s.color }}>{stage === 'ACTIVE_INVESTOR' && <CheckCircle size={12} />}{s.label}</span>;
};

type Section = 'overview' | 'profile' | 'clients' | 'transactions' | 'revenue' | 'sips' | 'referrals' | 'tracker' | 'arn-onboarding';
interface Toast { type: 'success' | 'error'; message: string }

const NAV_ITEMS: { key: Section; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: 'overview',     label: 'Dashboard',        Icon: LayoutDashboard },
  { key: 'clients',      label: 'Clients',          Icon: Users },
  { key: 'transactions', label: 'Transactions',     Icon: RefreshCw },
  { key: 'sips',         label: 'Systematic Plans', Icon: Receipt },
  { key: 'revenue',      label: 'Revenue',          Icon: Wallet },
  { key: 'tracker',      label: 'Tracker',          Icon: FolderOpen },
  { key: 'profile',      label: 'Profile',          Icon: UserCircle },
  { key: 'referrals',    label: 'Refer & Earn',     Icon: Handshake },
];

/* ═══════════════════════════════════════════════════════════════════════ */
export default function PartnerDashboard() {
  const { isDark, toggleTheme } = useTheme();
  C = getColors(isDark);
  S = getStyles(C);

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('ob_user') || '{}');
  if (!userData.role || !['INDIVIDUAL_PARTNER', 'NON_INDIVIDUAL_PARTNER'].includes(userData.role)) { navigate('/login'); return null; }

  const [section, setSection] = useState<Section>('overview');
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast]);
  const showToast = (type: Toast['type'], message: string) => setToast({ type, message });
  const loadProfile = useCallback(async () => { setLoading(true); try { const res = await partnerApi.getMe(); setProfile(res.data); } catch { showToast('error', 'Failed to load profile'); } finally { setLoading(false); } }, []);
  useEffect(() => { loadProfile(); }, [loadProfile]);
  const handleLogout = () => { localStorage.removeItem('ob_user'); navigate('/login'); };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.gray50 }}><div style={{ width: 32, height: 32, border: `3px solid ${C.gray200}`, borderTopColor: C.pri500, borderRadius: '50%', animation: 'pd-spin 0.6s linear infinite' }} /></div>;
  if (!profile) return null;

  return (
    <>
      <style>{`
        @keyframes pd-spin { to { transform: rotate(360deg) } }
        @keyframes pd-slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes pd-toastIn { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .pd-nav-item { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 48px; padding: 0 14px; border: 1px solid transparent; border-radius: 14px; background: transparent; color: ${C.gray500}; font-size: 14px; font-weight: 500; cursor: pointer; font-family: Inter, system-ui, sans-serif; transition: all 0.18s ease; }
        .pd-nav-item:hover { background: ${C.gray100}; color: ${C.gray900}; border-color: ${C.gray200}; }
        .pd-nav-item.active { background: rgba(246,169,26,0.08); color: ${C.pri600}; border-color: rgba(246,169,26,0.28); box-shadow: inset 0 0 0 1px rgba(246,169,26,0.08); }
        .pd-pill { padding: 7px 16px; border-radius: 999px; border: 1px solid ${C.gray200}; font-size: 13px; font-weight: 500; cursor: pointer; background: ${C.white}; color: ${C.gray600}; font-family: Inter, system-ui, sans-serif; transition: all 0.15s ease; }
        .pd-pill:hover { border-color: ${C.pri500}; color: ${C.gray900}; }
        .pd-pill.active { background: rgba(246,169,26,0.12); color: ${C.pri600}; border-color: rgba(246,169,26,0.28); }
        .pd-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .pd-table thead th { background: ${C.gray50}; color: ${C.gray500}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; padding: 12px 16px; text-align: left; border-bottom: 1px solid ${C.gray100}; }
        .pd-table thead th:first-child { border-radius: 8px 0 0 0; }
        .pd-table thead th:last-child { border-radius: 0 8px 0 0; }
        .pd-table tbody td { padding: 14px 16px; font-size: 14px; color: ${C.gray700}; border-bottom: 1px solid ${C.gray100}; vertical-align: middle; }
        .pd-table tbody tr { transition: background 0.1s ease; }
        .pd-table tbody tr:hover { background: ${C.gray50}; }
        .pd-input:focus { border-color: ${C.pri500} !important; box-shadow: 0 0 0 4px rgba(246,169,26,0.12); }
        .pd-shell-bg {
          background:
            radial-gradient(circle at top right, rgba(246,169,26,0.08), transparent 24%),
            linear-gradient(180deg, ${C.gray50}, ${C.navy900});
        }
        .pd-glass {
          background: rgba(20,26,39,0.72);
          backdrop-filter: blur(18px);
        }
        .pd-panel {
          background: linear-gradient(180deg, ${C.white}, ${C.gray100});
          border: 1px solid ${C.gray200};
          box-shadow: 0 18px 42px rgba(2,6,23,0.18);
        }
        .pd-stat-card:hover, .pd-action-card:hover { transform: translateY(-2px); border-color: rgba(246,169,26,0.24); }
        @media (max-width: 1220px) {
          .pd-overview-grid { grid-template-columns: 1fr !important; }
          .pd-overview-subgrid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 820px) {
          .pd-header-search { display: none !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* SIDEBAR */}
        <aside style={{ width: 286, background: C.navy900, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20, borderRight: `1px solid ${C.gray200}` }}>
          <div style={{ padding: '24px 24px 18px', borderBottom: `1px solid ${C.gray200}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(246,169,26,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri600, fontSize: 18 }}>↗</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.pri600, letterSpacing: '-.2px' }}>OngoleBulls</div>
                <div style={{ fontSize: 11, color: C.gray400, marginTop: 2, letterSpacing: '.28em', textTransform: 'uppercase' }}>Invest</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '6px 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <button key={key} type="button" className={`pd-nav-item${section === key ? ' active' : ''}`} onClick={() => setSection(key)}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', padding: '18px 16px 24px', borderTop: `1px solid ${C.gray200}` }}>
            <button type="button" className="pd-nav-item" onClick={handleLogout} style={{ color: C.red500 }}><LogOut size={16} /> Sign Out</button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="pd-shell-bg" style={{ flex: 1, marginLeft: 286, minHeight: '100vh' }}>
          <header className="pd-glass" style={{ height: 84, borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
            <div className="pd-header-search" style={{ width: 280, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', top: '50%', left: 14, transform: 'translateY(-50%)', color: C.gray400 }} />
              <input className="pd-input" placeholder="Search..." style={{ ...S.input, paddingLeft: 42, background: C.gray100 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                  width: 36,
                  height: 36,
                  padding: 0,
                  background: C.gray100,
                  border: `1px solid ${C.gray200}`,
                  borderRadius: 14,
                  cursor: 'pointer',
                  color: C.gray600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                }}
              >
                {isDark ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
              </button>
              <div style={{ position: 'relative', width: 38, height: 38, borderRadius: 14, background: C.gray100, border: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={16} color={C.gray500} />
                <span style={{ position: 'absolute', top: -6, right: -4, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: C.red500, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(246,169,26,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri600, fontWeight: 700, fontSize: 12 }}>{initials(profile.fullName || profile.firmName)[0]}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>{profile.fullName || profile.firmName}</div>
                <div style={{ fontSize: 13, color: C.gray400 }}>{profile.email}</div>
              </div>
            </div>
          </header>
          <div style={{ padding: '24px 24px 28px' }}>
            {section === 'overview' && <OverviewSection profile={profile} showToast={showToast} setSection={setSection} />}
            {section === 'profile' && <ProfileSection profile={profile} setProfile={setProfile} showToast={showToast} reload={loadProfile} />}
            {section === 'clients' && <ClientsSection profile={profile} showToast={showToast} setSection={setSection} />}
            {section === 'transactions' && <TransactionsSection profile={profile} showToast={showToast} />}
            {section === 'revenue' && <RevenueSection profile={profile} showToast={showToast} />}
            {section === 'sips' && <SipBookSection profile={profile} showToast={showToast} />}
            {section === 'referrals' && <ReferralsSection profile={profile} showToast={showToast} />}
            {section === 'tracker' && <TrackerSection profile={profile} showToast={showToast} />}
            {section === 'arn-onboarding' && <ArnOnboardingSection profile={profile} showToast={showToast} setSection={setSection} />}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: C.white, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderLeft: `4px solid ${toast.type === 'success' ? C.green500 : C.red500}`, animation: 'pd-toastIn 0.3s ease', maxWidth: 360 }}>
          {toast.type === 'success' ? <CheckCircle size={16} color={C.green500} /> : <AlertTriangle size={16} color={C.red500} />}
          <span style={{ fontSize: 14, color: C.gray700 }}>{toast.message}</span>
        </div>
      )}
    </>
  );
}

/* ─── Shared sub-components ──────────────────────────────────────────── */
function ArnStatusBanner({ profile, onCompleteArn }: { profile: PartnerProfile; onCompleteArn: () => void }) {
  if (profile.arnStatus === 'APPROVED') return null;

  const configs: Record<string, { bg: string; border: string; iconColor: string; title: string; desc: string; btnLabel?: string }> = {
    NOT_SUBMITTED: {
      bg: '#FFFBEB', border: '#F59E0B', iconColor: '#92400E',
      title: 'ARN Verification Required',
      desc: 'Submit your ARN details to get verified and start using the platform.',
      btnLabel: 'Complete ARN',
    },
    PENDING_APPROVAL: {
      bg: '#EFF6FF', border: '#3B82F6', iconColor: '#1E40AF',
      title: 'ARN Verification Pending',
      desc: 'Your ARN submission is under review. We will notify you once verified.',
    },
    REJECTED: {
      bg: '#FEF2F2', border: '#EF4444', iconColor: '#991B1B',
      title: 'ARN Verification Rejected',
      desc: profile.rejectionReason ? `Reason: ${profile.rejectionReason}. Please resubmit with correct details.` : 'Your ARN was rejected. Please resubmit.',
      btnLabel: 'Resubmit ARN',
    },
  };
  const c = configs[profile.arnStatus] || configs.NOT_SUBMITTED;

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}33`, borderLeft: `4px solid ${c.border}`, borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Lock size={18} color={c.iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: c.iconColor, marginBottom: 4 }}>{c.title}</div>
          <div style={{ fontSize: 14, color: c.iconColor + 'CC' }}>{c.desc}</div>
        </div>
      </div>
      {c.btnLabel && <button type="button" style={S.btnPrimary} onClick={onCompleteArn}>{c.btnLabel} <ArrowRight size={14} /></button>}
    </div>
  );
}

function ArnOnboardingSection({ profile, showToast, setSection }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void; setSection: (s: Section) => void }) {
  const [step, setStep] = useState<'ask' | 'form' | 'no-arn'>('ask');
  const [arnNumber, setArnNumber] = useState(profile.arn || '');
  const [pan, setPan] = useState(profile.pan || '');
  const [euin, setEuin] = useState(profile.euin || '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!arnNumber.trim()) e.arnNumber = 'ARN number is required';
    if (!pan.trim()) e.pan = 'PAN is required';
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) e.pan = 'Invalid PAN format (e.g. ABCDE1234F)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await partnerApi.submitArn({ arnNumber: arnNumber.trim(), pan: pan.trim(), euin: euin.trim() || undefined });
      showToast('success', 'ARN submitted for verification');
      setSection('overview');
    } catch (err: any) {
      showToast('error', err?.response?.data?.error || 'Failed to submit ARN');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'no-arn') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button type="button" onClick={() => setStep('ask')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#2563EB', fontWeight: 500, fontSize: 14, marginBottom: 24, padding: 0 }}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
        </button>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>How to Get Your ARN</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
            ARN (AMFI Registration Number) is mandatory for mutual fund distribution in India. Follow these steps to obtain your ARN:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {[
              { num: '1', title: 'Pass NISM Certification', desc: 'Clear the NISM Series V-A: Mutual Fund Distributors Certification Examination.' },
              { num: '2', title: 'Register on AMFI Portal', desc: 'Visit the AMFI website and complete the ARN registration process with required documents.' },
              { num: '3', title: 'Receive Your ARN', desc: 'Once approved, AMFI will issue your unique ARN which you can submit here.' },
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.num}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="https://www.amfiindia.com/distributor-corner" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 16 }}>
            Visit AMFI Portal <ArrowRight size={14} />
          </a>
          <div style={{ marginTop: 16 }}>
            <button type="button" style={{ padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'transparent', color: '#2563EB', border: '1px solid #2563EB', cursor: 'pointer' }} onClick={() => setStep('form')}>
              I Have My ARN Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button type="button" onClick={() => setStep('ask')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#2563EB', fontWeight: 500, fontSize: 14, marginBottom: 24, padding: 0 }}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
        </button>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Submit ARN Details</h2>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>Enter your AMFI registration details for verification.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>ARN Number *</label>
              <input type="text" value={arnNumber} onChange={e => { setArnNumber(e.target.value); setErrors(prev => ({ ...prev, arnNumber: '' })); }}
                placeholder="e.g. ARN-12345" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${errors.arnNumber ? '#EF4444' : '#D1D5DB'}`, fontSize: 14, outline: 'none' }} />
              {errors.arnNumber && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.arnNumber}</div>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>PAN Number *</label>
              <input type="text" value={pan} onChange={e => { setPan(e.target.value.toUpperCase()); setErrors(prev => ({ ...prev, pan: '' })); }}
                placeholder="e.g. ABCDE1234F" maxLength={10} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${errors.pan ? '#EF4444' : '#D1D5DB'}`, fontSize: 14, outline: 'none' }} />
              {errors.pan && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.pan}</div>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>EUIN (Optional)</label>
              <input type="text" value={euin} onChange={e => setEuin(e.target.value)}
                placeholder="e.g. E123456" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, outline: 'none' }} />
            </div>
            <button type="button" style={{ width: '100%', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: '#2563EB', color: '#fff', border: 'none', cursor: 'pointer', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // step === 'ask'
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 32, textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>ARN Verification</h2>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>
          Do you have an AMFI Registration Number (ARN)?
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button type="button" style={{ padding: '14px 40px', fontSize: 15, borderRadius: 10, fontWeight: 600, background: '#2563EB', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => setStep('form')}>
            Yes, I have an ARN
          </button>
          <button type="button" style={{ padding: '14px 40px', fontSize: 15, borderRadius: 10, fontWeight: 600, background: 'transparent', color: '#374151', border: '1px solid #D1D5DB', cursor: 'pointer' }} onClick={() => setStep('no-arn')}>
            No, I don't
          </button>
        </div>
      </div>
    </div>
  );
}

function Spinner() { return <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div style={{ width: 28, height: 28, border: `3px solid ${C.gray200}`, borderTopColor: C.pri500, borderRadius: '50%', animation: 'pd-spin 0.6s linear infinite' }} /></div>; }

function EmptyState({ text, action, onAction }: { text: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ ...S.card, textAlign: 'center', padding: '48px 24px' }}>
      <Inbox size={40} color={C.gray300} style={{ marginBottom: 12 }} />
      <p style={{ color: C.gray500, fontSize: 14, marginBottom: action ? 16 : 0 }}>{text}</p>
      {action && onAction && <button type="button" style={S.btnPrimary} onClick={onAction}><Plus size={14} /> {action}</button>}
    </div>
  );
}

function ErrorCard({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return <div style={{ ...S.card, textAlign: 'center', padding: 32, borderLeft: `4px solid ${C.red500}` }}><p style={{ color: C.red500, marginBottom: 12 }}>{msg}</p><button type="button" style={S.btnOutline} onClick={onRetry}><RefreshCw size={14} /> Retry</button></div>;
}

function ModalShell({ title, onClose, children, footer, width = 480 }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; width?: number }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'pd-slideIn 0.2s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${C.gray100}` }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.gray900 }}>{title}</h3>
          <button type="button" onClick={onClose} style={{ ...S.btnGhost, color: C.gray400 }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
        {footer && <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.gray100}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function Detail({ label, value, locked }: { label: string; value: string | null | undefined; locked?: boolean }) {
  return (
    <div>
      <span style={S.label}>{label}</span>
      <div style={{ fontWeight: 500, fontSize: 14, color: value ? C.gray900 : C.gray400, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
        {value || 'Not provided'}{locked && <Lock size={12} color={C.gray400} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  OVERVIEW                                                              */
/* ═══════════════════════════════════════════════════════════════════════ */
function OverviewSection({ profile, showToast, setSection }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void; setSection: (s: Section) => void }) {
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [revenue, setRevenue] = useState<PartnerRevenue | null>(null);
  const [sips, setSips] = useState<SipSummary[]>([]);
  const [tracker, setTracker] = useState<TrackerSummary | null>(null);
  const [transactions, setTransactions] = useState<PartnerTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRefer, setShowRefer] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const loadOverview = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      partnerApi.getStats(),
      partnerApi.getRevenue(),
      partnerApi.getSips(),
      partnerApi.getHoldings(),
      partnerApi.getTransactions(),
    ]);

    const [statsRes, revenueRes, sipsRes, trackerRes, txRes] = results;
    if (statsRes.status === 'fulfilled') setStats(statsRes.value.data); else setStats(null);
    if (revenueRes.status === 'fulfilled') setRevenue(revenueRes.value.data); else setRevenue(null);
    if (sipsRes.status === 'fulfilled') setSips(sipsRes.value.data); else setSips([]);
    if (trackerRes.status === 'fulfilled') setTracker(trackerRes.value.data); else setTracker(null);
    if (txRes.status === 'fulfilled') setTransactions(txRes.value.data); else setTransactions([]);

    if (results.every(result => result.status === 'rejected')) {
      showToast('error', 'Failed to load dashboard overview');
    }
    setLoading(false);
  }, [showToast]);

  /* ACTIVATION_GUARD_DISABLED_FOR_TESTING — was: if (!profile.isActivated) return; */
  useEffect(() => { loadOverview(); }, [loadOverview, profile.isActivated]);

  /* ACTIVATION_GUARD_DISABLED_FOR_TESTING — checklist block bypassed */
  if (false && !profile.isActivated) {
    const steps = [
      { label: 'Email Verified', done: true },
      { label: 'Mobile Verified', done: true },
      { label: 'ARN & PAN Submitted', done: profile.hasArn },
      { label: 'Bank Details Added', done: profile.hasBankDetails },
      { label: 'Agreement Accepted', done: profile.hasAgreement },
      { label: 'Admin Activation', done: profile.isActivated },
    ];
    const doneCount = steps.filter(s => s.done).length;
    const pct = Math.round((doneCount / steps.length) * 100);
    return (
      <>
        <div style={{ ...S.cardElevated, borderLeft: `4px solid ${C.pri500}`, maxWidth: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Target size={22} color={C.pri600} />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.gray900 }}>Complete Your Profile</h2>
          </div>
          <p style={{ color: C.gray500, fontSize: 14, margin: '4px 0 20px' }}>Welcome, {profile.fullName || profile.firmName}! Complete these steps to start distributing.</p>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: C.gray500 }}>Progress</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.pri600 }}>{doneCount} of {steps.length} steps</span>
            </div>
            <div style={{ height: 8, background: C.gray100, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.pri500}, ${C.pri700})`, borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {s.done ? <CheckCircle size={22} color={C.green500} /> : s.label === 'Admin Activation' ? <Clock size={22} color={C.amber500} /> : <Circle size={22} color={C.gray300} />}
                <span style={{ fontSize: 14, color: s.done ? C.green500 : s.label === 'Admin Activation' ? '#92400E' : C.gray700, fontWeight: s.done ? 500 : 400, fontStyle: s.label === 'Admin Activation' && !s.done ? 'italic' : 'normal' }}>
                  {s.label}{s.label === 'Admin Activation' && !s.done && <span style={{ color: C.gray400, fontWeight: 400 }}> — Pending review</span>}
                </span>
              </div>
            ))}
          </div>
          <button type="button" style={S.btnPrimary} onClick={() => setSection('profile')}>Complete Profile <ArrowRight size={14} /></button>
        </div>
        <div style={{ background: C.pri50, borderLeft: `4px solid ${C.pri500}`, borderRadius: 8, padding: '12px 16px', marginTop: 16, maxWidth: 600, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Info size={16} color={C.pri600} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 13, color: C.pri700, lineHeight: 1.5 }}>Your account is under review. Our team will activate your account within 24-48 hours after profile completion.</p>
        </div>
      </>
    );
  }

  if (loading) return <Spinner />;
  const totalClients = stats?.totalClients ?? 0;
  const activeInvestors = stats?.activeInvestors ?? 0;
  const pendingKyc = stats?.pendingKyc ?? 0;
  const activeSips = sips.filter(s => s.status === 'ACTIVE').length;
  const pausedSips = sips.filter(s => s.status === 'PAUSED').length;
  const cancelledSips = sips.filter(s => s.status === 'CANCELLED').length;
  const failedSips = sips.filter(s => s.status === 'FAILED').length;
  const totalAum = tracker?.totalValue ?? 0;
  const monthlyRevenue = revenue?.monthlyBreakdown?.length ? revenue.monthlyBreakdown[revenue.monthlyBreakdown.length - 1]?.net ?? revenue.totalRevenue : revenue?.totalRevenue ?? 0;
  const totalRevenue = revenue?.totalRevenue ?? 0;
  const latestInflow = stats?.totalTransactionAmount ?? 0;
  const pendingActions = [!profile.hasArn, !profile.hasBankDetails, !profile.hasAgreement, !profile.isActivated, pendingKyc > 0].filter(Boolean).length;
  const pendingOrders = transactions.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
  const confirmedOrders = transactions.filter(t => t.status === 'CONFIRMED' || t.status === 'ALLOCATED').length;
  const failedOrders = transactions.filter(t => ['FAILED', 'REJECTED', 'CANCELLED'].includes(t.status)).length;
  const conversionRate = percentOf(activeInvestors, totalClients);
  const lifecycleDistribution = stats?.lifecycleDistribution ?? {};
  const leadCount = lifecycleDistribution.LEAD_CREATED ?? 0;
  const linkSentCount = lifecycleDistribution.LINK_SENT ?? 0;
  const investorCount = lifecycleDistribution.ACTIVE_INVESTOR ?? activeInvestors;
  const focusTitle = profile.arnStatus === 'NOT_SUBMITTED'
    ? 'Complete ARN verification to unlock client onboarding and start using the full partner workflow.'
    : profile.arnStatus === 'PENDING_APPROVAL'
    ? 'Your ARN is under review. You will be notified once verified.'
    : profile.arnStatus === 'REJECTED'
    ? 'Your ARN was rejected. Please resubmit with correct details.'
    : 'ARN verified. Review your profile and keep partner credentials current.';
  const focusActionLabel = profile.arnStatus === 'NOT_SUBMITTED' ? 'Complete ARN'
    : profile.arnStatus === 'REJECTED' ? 'Resubmit ARN'
    : profile.arnStatus === 'PENDING_APPROVAL' ? 'View Status'
    : 'Open Profile';
  const focusAction = () => {
    if (profile.arnStatus === 'NOT_SUBMITTED' || profile.arnStatus === 'REJECTED') {
      setSection('arn-onboarding');
    } else {
      setSection('profile');
    }
  };
  const quickActions = [
    { label: 'Add Client', icon: UserPlus, onClick: () => setShowAddClient(true) },
    { label: 'SIP Book', icon: Receipt, onClick: () => setSection('sips') },
    { label: 'Tracker', icon: FolderOpen, onClick: () => setSection('tracker') },
    { label: 'Revenue', icon: Wallet, onClick: () => setSection('revenue') },
    { label: 'Profile', icon: UserCircle, onClick: () => setSection('profile') },
  ];
  const funnelStages = [
    { label: 'Lead', count: leadCount, bg: 'rgba(246,169,26,0.10)', bar: 'linear-gradient(135deg, rgba(246,169,26,0.85), rgba(216,141,8,0.95))' },
    { label: 'Link Sent', count: linkSentCount, bg: 'rgba(96,165,250,0.12)', bar: 'linear-gradient(135deg, rgba(96,165,250,0.75), rgba(37,99,235,0.95))' },
    { label: 'Investor', count: investorCount, bg: 'rgba(40,209,124,0.12)', bar: 'linear-gradient(135deg, rgba(40,209,124,0.8), rgba(22,163,74,0.95))' },
  ];

  return (
    <>
      <ArnStatusBanner profile={profile} onCompleteArn={() => setSection('arn-onboarding')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.34em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Portfolio Snapshot</div>
            <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.1, letterSpacing: '-0.03em', color: C.gray900 }}>Partner dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" style={S.btnPrimary} onClick={() => setShowAddClient(true)}><Plus size={16} /> Add Client</button>
            <button type="button" style={S.btnOutline} onClick={() => setShowRefer(true)}><Handshake size={16} /> Refer &amp; Earn</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total AUM', value: formatCurrency(totalAum), icon: TrendingUp, chip: latestInflow > 0 ? `↗ ${formatCurrency(latestInflow)}` : '₹0', chipTone: C.green100, chipColor: C.green500, iconBg: C.green100 },
            { label: 'Active Clients', value: totalClients, icon: Users, chip: `${activeInvestors} investors`, chipTone: C.gray100, chipColor: C.gray500, iconBg: C.indigo100 },
            { label: 'Active SIPs', value: activeSips, icon: RefreshCw, chip: `${pausedSips} paused`, chipTone: C.gray100, chipColor: C.gray500, iconBg: C.pri100 },
            { label: 'Monthly Revenue', value: formatCurrency(monthlyRevenue), icon: Wallet, chip: latestInflow > 0 ? `↗ ${formatCurrency(totalRevenue)} total` : '₹0 total', chipTone: C.green100, chipColor: C.green500, iconBg: C.green100 },
          ].map(card => (
            <div key={card.label} className="pd-panel pd-stat-card" style={{ borderRadius: 18, padding: 24, transition: 'transform 0.18s ease, border-color 0.18s ease' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <card.icon size={20} color={card.iconBg === C.green100 ? C.green500 : card.iconBg === C.indigo100 ? C.indigo700 : C.pri600} />
                </div>
                <span style={{ padding: '6px 12px', borderRadius: 999, background: card.chipTone, color: card.chipColor, fontSize: 12, fontWeight: 600 }}>{card.chip}</span>
              </div>
              <div style={{ fontSize: typeof card.value === 'number' ? 34 : 30, fontWeight: 700, color: C.gray900, letterSpacing: '-0.03em' }}>{card.value}</div>
              <div style={{ fontSize: 14, color: C.gray500, marginTop: 8 }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div className="pd-overview-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, background: `linear-gradient(90deg, rgba(246,169,26,0.10), ${C.white})` }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Today's Focus</div>
              <div style={{ fontSize: 18, lineHeight: 1.55, fontWeight: 600, color: C.gray900, maxWidth: 680 }}>{focusTitle}</div>
            </div>
            <button type="button" style={{ ...S.btnPrimary, whiteSpace: 'nowrap' }} onClick={focusAction}>{focusActionLabel} <ArrowRight size={15} /></button>
          </div>

          <div className="pd-panel" style={{ borderRadius: 18, padding: 26, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color={C.pri600} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>
                  {!profile.hasArn ? 'ARN Pending' : 'ARN Verified'}
                </div>
                <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, marginTop: 8 }}>
                  {!profile.hasArn
                    ? 'Finish your ARN flow to unlock client onboarding, SIP workflows, and advanced partner tools.'
                    : 'Your ARN is on file. Keep the rest of your profile updated so partner operations remain smooth.'}
                </div>
                <button type="button" onClick={() => setSection('profile')} style={{ marginTop: 14, background: 'none', border: 'none', padding: 0, color: C.pri600, fontWeight: 600, cursor: 'pointer' }}>
                  {!profile.hasArn ? 'Complete ARN' : 'Open profile'}
                </button>
              </div>
            </div>
            <span style={{ padding: '6px 12px', borderRadius: 999, background: C.gray100, color: C.gray500, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {!profile.hasArn ? 'Pending' : 'Verified'}
            </span>
          </div>
        </div>

        <div className="pd-overview-subgrid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Action Center</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>You have {pendingActions} pending action{pendingActions !== 1 ? 's' : ''}</div>
                <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, marginTop: 10 }}>
                  Review outstanding KYC, activation, and compliance setup tasks in one place instead of scanning multiple alerts.
                </div>
              </div>
              <button type="button" onClick={() => setSection('profile')} style={{ ...S.btnGhost, color: C.gray400 }}><ArrowRight size={18} /></button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Quick Access</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 14 }}>Quick actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))', gap: 12 }}>
              {quickActions.map(action => (
                <button key={action.label} type="button" className="pd-panel pd-action-card" onClick={action.onClick} style={{ textAlign: 'left', borderRadius: 16, padding: 18, cursor: 'pointer', transition: 'transform 0.18s ease, border-color 0.18s ease' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <action.icon size={20} color={C.pri600} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.gray900 }}>{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pd-overview-subgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Health Overview</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 18 }}>SIP Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Active', value: activeSips, color: C.green500 },
                { label: 'Paused', value: pausedSips, color: C.pri600 },
                { label: 'Cancelled', value: cancelledSips, color: C.gray500 },
                { label: 'Failed', value: failedSips, color: C.red500 },
              ].map(item => (
                <div key={item.label} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 16, padding: '20px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: C.gray400, letterSpacing: '.18em', textTransform: 'uppercase' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Execution Pulse</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 18 }}>Orders Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'In Progress', value: pendingOrders, color: C.pri600 },
                { label: 'Allocated', value: confirmedOrders, color: C.green500 },
                { label: 'Failed', value: failedOrders, color: C.red500 },
              ].map(item => (
                <div key={item.label} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 16, padding: '20px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: item.color }}>{item.value}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: C.gray400, letterSpacing: '.18em', textTransform: 'uppercase' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pd-overview-subgrid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Lifecycle Funnel</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>Lead to investor</div>
              </div>
              <button type="button" style={S.btnOutline} onClick={() => setSection('clients')}>Open Clients</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {funnelStages.map((stage, index) => {
                const percent = percentOf(stage.count, Math.max(totalClients, 1));
                return (
                  <div key={stage.label}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.gray900 }}>{stage.label}</span>
                      <span style={{ fontSize: 13, color: C.gray500 }}>{formatCompactNumber(stage.count)} · {percent}%</span>
                    </div>
                    <div style={{ height: 12, borderRadius: 999, background: stage.bg, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(percent, stage.count > 0 ? 10 : 0)}%`, borderRadius: 999, background: stage.bar }} />
                    </div>
                    {index < funnelStages.length - 1 && <div style={{ marginTop: 10, color: C.gray400 }}><ArrowRight size={16} /></div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>Insight</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 18 }}>Conversion rate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 132, height: 132, borderRadius: '50%', background: `conic-gradient(${C.pri600} 0 ${conversionRate}%, ${C.gray100} ${conversionRate}% 100%)`, padding: 12, flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: C.white, border: `1px solid ${C.gray200}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 34, fontWeight: 700, color: C.gray900 }}>{conversionRate}%</div>
                  <div style={{ fontSize: 12, color: C.gray500 }}>conversion</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>{activeInvestors} of {totalClients} clients are active investors</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: C.gray500, marginTop: 10 }}>
                  Push KYC completion and link follow-ups to move more prospects into funded investor status.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} showToast={showToast} onAdded={() => { setShowAddClient(false); loadOverview(); }} />}
      {showRefer && <ReferPartnerModal profileId={profile.id} onClose={() => setShowRefer(false)} showToast={showToast} />}
    </>
  );
}

/* ─── Refer Partner Modal ────────────────────────────────────────────── */
function ReferPartnerModal({ profileId, onClose, showToast }: { profileId: number; onClose: () => void; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const refLink = selectedType ? `${window.location.origin}/register/partner?type=${selectedType}&ref=${profileId}` : '';
  const copyLink = () => { navigator.clipboard.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const waLink = `https://wa.me/?text=${encodeURIComponent(`Join OngoleBulls Invest as a distribution partner!\nRegister here: ${refLink}`)}`;
  return (
    <ModalShell title="Refer a Partner" onClose={onClose} width={500}>
      <p style={{ color: C.gray500, fontSize: 14, marginBottom: 16 }}>Choose the type of partner to refer:</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[{ type: 'INDIVIDUAL_PARTNER', label: 'Individual Partner', Icon: User, desc: 'An independent ARN holder' },
          { type: 'NON_INDIVIDUAL_PARTNER', label: 'Partner Firm', Icon: Building2, desc: 'A firm or company distributor' },
        ].map(o => (
          <div key={o.type} onClick={() => setSelectedType(o.type)}
            style={{ padding: 20, borderRadius: 12, border: selectedType === o.type ? `2px solid ${C.pri500}` : `2px solid ${C.gray200}`, background: selectedType === o.type ? C.pri50 : C.white, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s ease', position: 'relative' }}>
            {selectedType === o.type && <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: C.pri500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color="#fff" /></div>}
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}><o.Icon size={22} color={C.pri600} /></div>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.gray900 }}>{o.label}</div>
            <p style={{ fontSize: 12, color: C.gray500, margin: '4px 0 0' }}>{o.desc}</p>
          </div>
        ))}
      </div>
      {selectedType && (
        <>
          <label style={S.label}>Your Referral Link</label>
          <div style={{ display: 'flex', marginBottom: 12 }}>
            <input value={refLink} readOnly className="pd-input" style={{ ...S.input, borderRadius: '8px 0 0 8px', background: C.gray50, fontFamily: 'monospace', fontSize: 12, flex: 1 }} />
            <button type="button" onClick={copyLink} style={{ ...S.btnPrimary, borderRadius: '0 8px 8px 0', whiteSpace: 'nowrap' }}>{copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}</button>
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#fff', borderRadius: 8, padding: '12px 16px', fontWeight: 600, fontSize: 14, textDecoration: 'none', width: '100%', boxSizing: 'border-box' }}>
            <Send size={16} /> Share on WhatsApp
          </a>
        </>
      )}
    </ModalShell>
  );
}

/* ─── Add Client Modal ───────────────────────────────────────────────── */
function AddClientModal({ onClose, showToast, onAdded }: { onClose: () => void; showToast: (t: 'success' | 'error', m: string) => void; onAdded: () => void }) {
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async () => {
    setError('');
    if (!form.fullName.trim() || !form.email.trim() || !form.mobile.trim()) { setError('All fields are required'); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError('Invalid email'); return; }
    if (!/^[0-9]{10}$/.test(form.mobile)) { setError('Mobile must be 10 digits'); return; }
    setSaving(true);
    try { await partnerApi.addClient(form); showToast('success', 'Client added successfully!'); onAdded(); }
    catch (err: any) { setError(err?.response?.data?.error || err?.userMessage || 'Failed to add client'); } finally { setSaving(false); }
  };
  return (
    <ModalShell title="Add New Client" onClose={onClose} width={480} footer={
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button type="button" style={S.btnOutline} onClick={onClose}>Cancel</button>
        <button type="button" style={{ ...S.btnPrimary, minWidth: 140, opacity: saving ? 0.7 : 1 }} onClick={submit} disabled={saving}>{saving ? 'Adding...' : 'Add Client'}</button>
      </div>
    }>
      {error && <div style={{ background: C.red100, color: C.red500, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={14} /> {error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={S.label}>Full Name *</label><input className="pd-input" style={S.input} value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Enter client's full name" /></div>
        <div><label style={S.label}>Email Address *</label><input className="pd-input" style={S.input} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="client@example.com" /></div>
        <div><label style={S.label}>Mobile Number *</label><input className="pd-input" style={S.input} value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} placeholder="10-digit mobile number" maxLength={10} /></div>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PROFILE & VERIFICATION                                               */
/* ═══════════════════════════════════════════════════════════════════════ */
function ProfileSection({ profile, setProfile, showToast, reload }: { profile: PartnerProfile; setProfile: (p: PartnerProfile) => void; showToast: (t: 'success' | 'error', m: string) => void; reload: () => void }) {
  const [tab, setTab] = useState<'info' | 'verify'>('info');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: profile.fullName || '', mobileNumber: profile.mobileNumber || '', pan: profile.pan || '', arn: profile.arn || '', euin: profile.euin || '' });
  const [saving, setSaving] = useState(false);
  const [editBank, setEditBank] = useState(false);
  const [bankForm, setBankForm] = useState({ partnerBankAccount: profile.partnerBankAccount || '', partnerIfsc: profile.partnerIfsc || '', partnerBankName: profile.partnerBankName || '' });
  const [showAgreement, setShowAgreement] = useState(false);

  const saveProfile = async () => {
    if (editForm.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(editForm.pan)) { showToast('error', 'Invalid PAN format (e.g. ABCDE1234F)'); return; }
    setSaving(true); try { const res = await partnerApi.updateProfile(editForm); setProfile(res.data); setEditing(false); showToast('success', 'Profile updated'); } catch (err: any) { showToast('error', err?.response?.data?.error || 'Update failed'); } finally { setSaving(false); }
  };
  const saveBankDetails = async () => { setSaving(true); try { const res = await partnerApi.updateBankDetails(bankForm); setProfile(res.data); setEditBank(false); showToast('success', 'Bank details updated'); } catch (err: any) { showToast('error', err?.response?.data?.error || 'Update failed'); } finally { setSaving(false); } };
  const acceptAgreement = async () => { setSaving(true); try { const res = await partnerApi.acceptAgreement(); setProfile(res.data); setShowAgreement(false); showToast('success', 'Agreement accepted'); } catch { showToast('error', 'Failed to accept agreement'); } finally { setSaving(false); } };
  const isFirm = profile.role === 'NON_INDIVIDUAL_PARTNER';

  return (
    <>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        <button type="button" className={`pd-pill${tab === 'info' ? ' active' : ''}`} onClick={() => setTab('info')}>Personal Information</button>
        <button type="button" className={`pd-pill${tab === 'verify' ? ' active' : ''}`} onClick={() => setTab('verify')}>Verification Status</button>
      </div>
      {tab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.gray900 }}>{isFirm ? 'Firm Details' : 'Personal Details'}</h3>
              {!editing && <button type="button" style={S.btnOutline} onClick={() => setEditing(true)}>Edit Profile</button>}
            </div>
            {editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={S.label}>Full Name</label><input className="pd-input" style={S.input} value={editForm.fullName} onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))} /></div>
                <div><label style={S.label}>Email</label><input style={{ ...S.input, opacity: 0.6, cursor: 'not-allowed' }} value={profile.email} disabled /><span style={{ fontSize: 11, color: C.gray400, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}><Lock size={10} /> Cannot be changed</span></div>
                <div><label style={S.label}>Mobile</label><input className="pd-input" style={S.input} value={editForm.mobileNumber} onChange={e => setEditForm(p => ({ ...p, mobileNumber: e.target.value }))} /></div>
                <div><label style={S.label}>PAN Number</label><input className="pd-input" style={S.input} value={editForm.pan} onChange={e => setEditForm(p => ({ ...p, pan: e.target.value.toUpperCase() }))} placeholder="ABCDE1234F" /></div>
                <div><label style={S.label}>ARN Number</label><input className="pd-input" style={S.input} value={editForm.arn} onChange={e => setEditForm(p => ({ ...p, arn: e.target.value }))} /></div>
                <div><label style={S.label}>EUIN</label><input className="pd-input" style={S.input} value={editForm.euin} onChange={e => setEditForm(p => ({ ...p, euin: e.target.value }))} /></div>
                <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" style={S.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
                  <button type="button" style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Detail label="Full Name" value={profile.fullName} />
                <Detail label="Email" value={profile.email} locked />
                <Detail label="Mobile" value={profile.mobileNumber} />
                <Detail label="PAN" value={profile.pan ? `${profile.pan.substring(0, 2)}XXXXX${profile.pan.substring(7)}` : null} />
                <Detail label="ARN" value={profile.arn} />
                <Detail label="EUIN" value={profile.euin} />
                {isFirm && <Detail label="Firm Name" value={profile.firmName} />}
                {isFirm && <Detail label="Authorized Person" value={profile.authorizedPerson} />}
              </div>
            )}
          </div>
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.gray900 }}>Bank Details</h3>
              {!editBank && <button type="button" style={S.btnOutline} onClick={() => setEditBank(true)}>Update</button>}
            </div>
            {editBank ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={S.label}>Account Number</label><input className="pd-input" style={S.input} value={bankForm.partnerBankAccount} onChange={e => setBankForm(p => ({ ...p, partnerBankAccount: e.target.value }))} /></div>
                <div><label style={S.label}>IFSC Code</label><input className="pd-input" style={S.input} value={bankForm.partnerIfsc} onChange={e => setBankForm(p => ({ ...p, partnerIfsc: e.target.value.toUpperCase() }))} placeholder="ABCD0123456" /></div>
                <div><label style={S.label}>Bank Name</label><input className="pd-input" style={S.input} value={bankForm.partnerBankName} onChange={e => setBankForm(p => ({ ...p, partnerBankName: e.target.value }))} /></div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}><button type="button" style={S.btnOutline} onClick={() => setEditBank(false)}>Cancel</button><button type="button" style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={saveBankDetails} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Detail label="Account Number" value={profile.partnerBankAccount ? `****${profile.partnerBankAccount.slice(-4)}` : null} />
                <Detail label="IFSC Code" value={profile.partnerIfsc} />
                <Detail label="Bank Name" value={profile.partnerBankName} />
              </div>
            )}
          </div>
          <div style={S.card}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: C.gray900 }}>Location & Relationship Manager</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Detail label="State" value={profile.state} />
              <Detail label="District" value={profile.district} />
              <Detail label="City" value={profile.city} />
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Detail label="Assigned Relationship Manager" value={profile.assignedRmName || 'Not yet assigned'} />
              <Detail label="RM Email" value={profile.assignedRmEmail || '-'} />
            </div>
            <p style={{ fontSize: 12, color: C.gray400, marginTop: 12, marginBottom: 0 }}>
              Your RM is auto-assigned based on your location. Contact support to change your RM.
            </p>
          </div>
          <div style={S.card}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: C.gray900 }}>Platform Agreement</h3>
            {profile.hasAgreement
              ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: C.green100, color: '#065F46', fontSize: 14, fontWeight: 500 }}><CheckCircle size={16} /> Agreement Accepted</span>
              : <button type="button" style={S.btnPrimary} onClick={() => setShowAgreement(true)}><Shield size={14} /> Accept Platform Agreement</button>}
          </div>
          {showAgreement && (
            <ModalShell title="Platform Agreement" onClose={() => setShowAgreement(false)} width={520} footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}><button type="button" style={S.btnOutline} onClick={() => setShowAgreement(false)}>Cancel</button><button type="button" style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={acceptAgreement} disabled={saving}>{saving ? 'Accepting...' : 'I Accept'}</button></div>
            }><p style={{ color: C.gray700, lineHeight: 1.6 }}>I agree to the OngoleBulls Invest platform terms.</p><p style={{ color: C.gray700, lineHeight: 1.6 }}>I confirm I am a registered AMFI distributor with a valid ARN.</p><p style={{ color: C.gray700, lineHeight: 1.6 }}>I will comply with SEBI and AMFI regulations.</p></ModalShell>
          )}
        </div>
      )}
      {tab === 'verify' && (
        <div style={S.card}>
          <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: C.gray900 }}>Verification Steps</h3>
          {[
            { label: 'Email Verified', done: true, note: 'Verified during registration' },
            { label: 'Mobile Verified', done: true, note: 'Validated during registration' },
            { label: 'ARN & PAN Submitted', done: profile.hasArn, note: profile.hasArn ? 'Submitted' : 'Go to Personal Information tab to add' },
            { label: 'Bank Details Added', done: profile.hasBankDetails, note: profile.hasBankDetails ? 'Added' : 'Go to Personal Information tab to add' },
            { label: 'Agreement Accepted', done: profile.hasAgreement, note: profile.hasAgreement ? 'Accepted' : 'Go to Personal Information tab to accept' },
            { label: 'Admin Activation', done: profile.isActivated, note: profile.isActivated ? 'Activated by admin' : 'Pending admin review' },
          ].map((step, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
              {i < arr.length - 1 && <div style={{ position: 'absolute', left: 15, top: 32, width: 2, height: 'calc(100% - 8px)', background: step.done ? C.green500 : C.gray200 }} />}
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: step.done ? C.green100 : C.gray100, zIndex: 1 }}>
                {step.done ? <CheckCircle size={18} color={C.green500} /> : <Circle size={18} color={C.gray400} />}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? 24 : 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: step.done ? C.green500 : C.gray700 }}>{step.label}</div>
                <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>{step.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MY CLIENTS                                                            */
/* ═══════════════════════════════════════════════════════════════════════ */
function ClientsSection({ profile, showToast, setSection }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void; setSection: (s: Section) => void }) {
  const [clients, setClients] = useState<PartnerClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedClient, setSelectedClient] = useState<PartnerClientSummary | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const load = useCallback(async (s?: string, stage?: string) => { setLoading(true); setError(''); try { const params: Record<string, string> = {}; if (s) params.search = s; if (stage) params.stage = stage; const res = await partnerApi.getClients(params); setClients(res.data); } catch { setError('Failed to load clients'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const onSearch = (val: string) => { setSearch(val); if (searchTimer.current) clearTimeout(searchTimer.current); searchTimer.current = setTimeout(() => load(val, stageFilter), 300); };
  const onFilter = (stage: string) => { setStageFilter(stage); load(search, stage); };
  const resendLink = async (clientId: number) => { try { await partnerApi.updateClientLifecycle(clientId, 'LINK_SENT'); showToast('success', 'Link sent!'); load(search, stageFilter); } catch { showToast('error', 'Failed to update'); } };
  const filters = [{ label: 'All', value: '' }, { label: 'Lead Created', value: 'LEAD_CREATED' }, { label: 'KYC Started', value: 'KYC_STARTED' }, { label: 'Active Investor', value: 'ACTIVE_INVESTOR' }];

  return (
    <>
      {/* ACTIVATION_GUARD_DISABLED_FOR_TESTING */}
      {/* {!profile.isActivated && <ActivationBanner onGoProfile={() => setSection('profile')} />} */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.gray400 }} /><input className="pd-input" placeholder="Search clients..." value={search} onChange={e => onSearch(e.target.value)} style={{ ...S.input, paddingLeft: 36, width: 260 }} /></div>
        <button type="button" style={S.btnPrimary} onClick={() => setShowAdd(true)}><Plus size={14} /> Add Client</button>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>{filters.map(f => <button key={f.value} type="button" className={`pd-pill${stageFilter === f.value ? ' active' : ''}`} onClick={() => onFilter(f.value)}>{f.label}</button>)}</div>
      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={() => load()} /> :
       clients.length === 0 ? <EmptyState text="No clients yet. Click 'Add Client' to onboard your first investor." action="Add Your First Client" onAction={() => setShowAdd(true)} /> : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table className="pd-table">
            <thead><tr><th>Client</th><th>Email</th><th>Mobile</th><th>Stage</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>{clients.map(c => (
              <tr key={c.id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: '50%', background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri700, fontWeight: 600, fontSize: 12, flexShrink: 0 }}>{initials(c.fullName)}</div><span style={{ fontWeight: 500, color: C.gray900 }}>{c.fullName}</span></div></td>
                <td style={{ color: C.gray500 }}>{c.email}</td>
                <td>{c.mobileNumber}</td>
                <td>{stageBadge(c.lifecycleStage)}</td>
                <td style={{ color: C.gray500 }}>{fmt(c.createdAt)}</td>
                <td><div style={{ display: 'flex', gap: 4 }}>
                  <a href={`https://wa.me/91${c.mobileNumber}?text=${encodeURIComponent(`Hi ${c.fullName}, please complete your KYC to start investing with OngoleBulls.`)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ ...S.btnGhost, color: '#25D366' }}><MessageSquare size={15} /></a>
                  <button type="button" title="Resend Link" style={{ ...S.btnGhost, color: C.pri500 }} onClick={() => resendLink(c.id)}><Link2 size={15} /></button>
                  <button type="button" title="View" style={{ ...S.btnGhost, color: C.gray400 }} onClick={() => setSelectedClient(c)}><Eye size={15} /></button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} showToast={showToast} onAdded={() => { setShowAdd(false); load(search, stageFilter); }} />}
      {selectedClient && (
        <ModalShell title="Client Details" onClose={() => setSelectedClient(null)} width={440}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Detail label="Name" value={selectedClient.fullName} /><Detail label="Email" value={selectedClient.email} />
            <Detail label="Mobile" value={selectedClient.mobileNumber} /><Detail label="KYC Status" value={selectedClient.kycStatus} />
          </div>
          <div style={{ margin: '16px 0', padding: '12px 0', borderTop: `1px solid ${C.gray100}` }}>
            <Detail label="Lifecycle Stage" value={STAGE_STYLES[selectedClient.lifecycleStage]?.label || selectedClient.lifecycleStage} />
            <div style={{ marginTop: 4 }}>{stageBadge(selectedClient.lifecycleStage)}</div>
          </div>
          <Detail label="Registered On" value={fmt(selectedClient.createdAt)} />
          <div style={{ marginTop: 16 }}><a href={`https://wa.me/91${selectedClient.mobileNumber}`} target="_blank" rel="noopener noreferrer" style={{ ...S.btnOutline, textDecoration: 'none' }}><MessageSquare size={14} /> WhatsApp</a></div>
        </ModalShell>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SIP BOOK                                                              */
/* ═══════════════════════════════════════════════════════════════════════ */
function SipBookSection({ profile, showToast }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [sips, setSips] = useState<SipSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const res = await partnerApi.getSips(); setSips(res.data); } catch { setError('Failed to load SIPs'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const filtered = filter ? sips.filter(s => s.status === filter) : sips;
  const activeSips = sips.filter(s => s.status === 'ACTIVE');
  const totalMonthly = activeSips.reduce((sum, s) => sum + (s.amount || 0), 0);
  const pausedCount = sips.filter(s => s.status === 'PAUSED').length;

  return (
    <>
      {/* ACTIVATION_GUARD_DISABLED_FOR_TESTING */}
      {/* {!profile.isActivated && <ActivationBanner onGoProfile={() => {}} />} */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><BarChart3 size={16} color={C.green500} /><span style={S.label}>Active SIPs</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{activeSips.length}</div></div>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Wallet size={16} color={C.pri600} /><span style={S.label}>Monthly Amount</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{formatCurrency(totalMonthly)}</div></div>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Clock size={16} color={C.amber500} /><span style={S.label}>Paused SIPs</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{pausedCount}</div></div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>{[{ l: 'All', v: '' }, { l: 'Active', v: 'ACTIVE' }, { l: 'Paused', v: 'PAUSED' }].map(f => <button key={f.v} type="button" className={`pd-pill${filter === f.v ? ' active' : ''}`} onClick={() => setFilter(f.v)}>{f.l}</button>)}</div>
      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={load} /> :
       filtered.length === 0 ? <EmptyState text="No SIPs found. Help your clients start their SIP journey." /> : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}><table className="pd-table">
          <thead><tr><th>Client</th><th>Fund</th><th>Amount</th><th>Frequency</th><th>Next Due</th><th>Status</th></tr></thead>
          <tbody>{filtered.map(s => (
            <tr key={s.id}><td style={{ fontWeight: 500, color: C.gray900 }}>{s.clientName}</td><td>{s.fundName}</td><td style={{ fontWeight: 600 }}>{formatCurrency(s.amount)}</td><td>{s.frequency}</td><td style={{ color: C.gray500 }}>{fmt(s.nextDueDate)}</td>
            <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: s.status === 'ACTIVE' ? C.green100 : s.status === 'PAUSED' ? C.amber100 : C.gray100, color: s.status === 'ACTIVE' ? '#065F46' : s.status === 'PAUSED' ? '#92400E' : C.gray600 }}>{s.status === 'ACTIVE' ? <CheckCircle size={12} /> : s.status === 'PAUSED' ? <Clock size={12} /> : null}{s.status}</span></td></tr>
          ))}</tbody>
        </table></div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  TRACKER                                                               */
/* ═══════════════════════════════════════════════════════════════════════ */
function TrackerSection({ profile, showToast }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [tracker, setTracker] = useState<TrackerSummary | null>(null);
  const [cob, setCob] = useState<CobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'client' | 'amc' | 'cob'>('client');
  const [showUpload, setShowUpload] = useState(false);
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [holdingForm, setHoldingForm] = useState({ clientName: '', amcName: '', fundName: '', folioNumber: '', units: '', nav: '', currentValue: '' });
  const [savingHolding, setSavingHolding] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const load = useCallback(async () => { setLoading(true); setError(''); try { const [hRes, cRes] = await Promise.all([partnerApi.getHoldings(), partnerApi.getCobOpportunities()]); setTracker(hRes.data); setCob(cRes.data); } catch { setError('Failed to load tracker data'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const handleFileUpload = async (file: File) => { setUploading(true); try { await partnerApi.uploadCas(file); showToast('success', 'File uploaded! Add holdings manually below.'); setShowUpload(false); } catch { showToast('error', 'Upload failed'); } finally { setUploading(false); } };
  const addHolding = async () => {
    const units = parseFloat(holdingForm.units); const nav = parseFloat(holdingForm.nav); const cv = holdingForm.currentValue ? parseFloat(holdingForm.currentValue) : units * nav;
    if (!holdingForm.clientName || !holdingForm.fundName || isNaN(units) || isNaN(nav)) { showToast('error', 'Fill required fields (Client, Fund, Units, NAV)'); return; }
    setSavingHolding(true);
    try { const res = await partnerApi.addHoldings([{ clientName: holdingForm.clientName, amcName: holdingForm.amcName, fundName: holdingForm.fundName, folioNumber: holdingForm.folioNumber, units, nav, currentValue: cv }]); setTracker(res.data); setHoldingForm({ clientName: '', amcName: '', fundName: '', folioNumber: '', units: '', nav: '', currentValue: '' }); showToast('success', 'Holding added'); partnerApi.getCobOpportunities().then(r => setCob(r.data)); } catch { showToast('error', 'Failed to add holding'); } finally { setSavingHolding(false); }
  };
  const hasHoldings = tracker && tracker.holdings && tracker.holdings.length > 0;
  const byClient: Record<string, TrackerSummary['holdings']> = {};
  const byAmc: Record<string, TrackerSummary['holdings']> = {};
  if (hasHoldings) { for (const h of tracker!.holdings) { (byClient[h.clientName] ||= []).push(h); (byAmc[h.amcName] ||= []).push(h); } }

  return (
    <>
      {/* ACTIVATION_GUARD_DISABLED_FOR_TESTING */}
      {/* {!profile.isActivated && <ActivationBanner onGoProfile={() => {}} />} */}
      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={load} /> : (
        <>
          {hasHoldings && (
            <div style={{ background: `linear-gradient(135deg, ${C.pri600}, ${C.pri700})`, borderRadius: 12, padding: '24px 28px', marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 6 }}><Wallet size={14} /> Total Value</div><div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 4 }}>{formatCurrency(tracker!.totalValue)}</div></div>
              <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={14} /> Folios</div><div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 4 }}>{tracker!.folioCount}</div></div>
              <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> Fund Houses</div><div style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginTop: 4 }}>{tracker!.amcCount}</div></div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button type="button" style={S.btnOutline} onClick={() => setShowUpload(!showUpload)}><Upload size={14} /> Upload CAS File</button>
            <button type="button" style={S.btnPrimary} onClick={() => setShowAddHolding(!showAddHolding)}><Plus size={14} /> Add Holding</button>
          </div>
          {showUpload && (
            <div style={{ border: `2px dashed ${C.pri500}`, borderRadius: 12, background: C.pri50, textAlign: 'center', padding: '40px 24px', marginBottom: 20 }}>
              <Upload size={36} color={C.pri500} style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 600, fontSize: 16, color: C.gray900, marginBottom: 4 }}>Upload CAS File</div>
              <p style={{ color: C.gray500, fontSize: 13, marginBottom: 16 }}>Drag and drop or click to browse. Supports: PDF, XML from CAMS/KFintech</p>
              <input ref={fileRef} type="file" accept=".pdf,.xml" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }} />
              <button type="button" style={S.btnPrimary} onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? 'Uploading...' : 'Browse File'}</button>
            </div>
          )}
          {showAddHolding && (
            <div style={{ ...S.card, marginBottom: 20 }}>
              <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: C.gray900 }}>Add Holding Manually</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div><label style={S.label}>Client Name *</label><input className="pd-input" style={S.input} value={holdingForm.clientName} onChange={e => setHoldingForm(p => ({ ...p, clientName: e.target.value }))} /></div>
                <div><label style={S.label}>AMC Name</label><input className="pd-input" style={S.input} value={holdingForm.amcName} onChange={e => setHoldingForm(p => ({ ...p, amcName: e.target.value }))} /></div>
                <div><label style={S.label}>Fund Name *</label><input className="pd-input" style={S.input} value={holdingForm.fundName} onChange={e => setHoldingForm(p => ({ ...p, fundName: e.target.value }))} /></div>
                <div><label style={S.label}>Folio Number</label><input className="pd-input" style={S.input} value={holdingForm.folioNumber} onChange={e => setHoldingForm(p => ({ ...p, folioNumber: e.target.value }))} /></div>
                <div><label style={S.label}>Units *</label><input className="pd-input" style={S.input} type="number" step="0.0001" value={holdingForm.units} onChange={e => setHoldingForm(p => ({ ...p, units: e.target.value }))} /></div>
                <div><label style={S.label}>NAV *</label><input className="pd-input" style={S.input} type="number" step="0.0001" value={holdingForm.nav} onChange={e => setHoldingForm(p => ({ ...p, nav: e.target.value }))} /></div>
                <div><label style={S.label}>Current Value (auto)</label><input className="pd-input" style={S.input} type="number" value={holdingForm.currentValue || (holdingForm.units && holdingForm.nav ? (parseFloat(holdingForm.units) * parseFloat(holdingForm.nav)).toFixed(2) : '')} onChange={e => setHoldingForm(p => ({ ...p, currentValue: e.target.value }))} /></div>
              </div>
              <button type="button" style={{ ...S.btnPrimary, marginTop: 16, opacity: savingHolding ? 0.7 : 1 }} onClick={addHolding} disabled={savingHolding}>{savingHolding ? 'Adding...' : 'Add Holding'}</button>
            </div>
          )}
          {!hasHoldings && !showUpload && !showAddHolding ? <EmptyState text="No portfolio data yet. Upload a CAS file or add holdings manually to track your clients' portfolios." /> : hasHoldings && (
            <>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                <button type="button" className={`pd-pill${tab === 'client' ? ' active' : ''}`} onClick={() => setTab('client')}>By Client</button>
                <button type="button" className={`pd-pill${tab === 'amc' ? ' active' : ''}`} onClick={() => setTab('amc')}>By AMC</button>
                <button type="button" className={`pd-pill${tab === 'cob' ? ' active' : ''}`} onClick={() => setTab('cob')}>COB Opportunities</button>
              </div>
              {tab === 'client' && <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}><table className="pd-table"><thead><tr><th>Client Name</th><th>Total Value</th><th>Funds</th></tr></thead><tbody>
                {Object.entries(byClient).map(([name, holdings]) => <ExpandableRow key={name} cells={[name, formatCurrency(holdings.reduce((s, h) => s + (h.currentValue || 0), 0)), String(holdings.length)]}><table className="pd-table"><thead><tr><th>Fund</th><th>AMC</th><th>Folio</th><th>Units</th><th>NAV</th><th>Value</th></tr></thead><tbody>{holdings.map(h => <tr key={h.id}><td>{h.fundName}</td><td>{h.amcName}</td><td>{h.folioNumber}</td><td>{h.units}</td><td>{h.nav}</td><td style={{ fontWeight: 600 }}>{formatCurrency(h.currentValue)}</td></tr>)}</tbody></table></ExpandableRow>)}
              </tbody></table></div>}
              {tab === 'amc' && <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}><table className="pd-table"><thead><tr><th>AMC Name</th><th>Total Value</th><th>Folios</th></tr></thead><tbody>
                {Object.entries(byAmc).map(([name, holdings]) => <ExpandableRow key={name} cells={[name, formatCurrency(holdings.reduce((s, h) => s + (h.currentValue || 0), 0)), String(new Set(holdings.map(h => h.folioNumber)).size)]}><table className="pd-table"><thead><tr><th>Fund</th><th>Client</th><th>Folio</th><th>Units</th><th>Value</th></tr></thead><tbody>{holdings.map(h => <tr key={h.id}><td>{h.fundName}</td><td>{h.clientName}</td><td>{h.folioNumber}</td><td>{h.units}</td><td style={{ fontWeight: 600 }}>{formatCurrency(h.currentValue)}</td></tr>)}</tbody></table></ExpandableRow>)}
              </tbody></table></div>}
              {tab === 'cob' && (cob.length === 0 ? <EmptyState text="No COB opportunities found yet." /> : <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}><table className="pd-table"><thead><tr><th>Client Name</th><th>AMCs</th><th>Total Value</th><th>Action</th></tr></thead><tbody>
                {cob.map((c, i) => <tr key={i}><td style={{ fontWeight: 500, color: C.gray900 }}>{c.clientName}</td><td>{c.amcCount}</td><td style={{ fontWeight: 600 }}>{formatCurrency(c.totalValue)}</td><td><button type="button" style={{ ...S.btnOutline, padding: '6px 14px', fontSize: 12 }} onClick={() => showToast('success', 'COB initiation will be available in the next update.')}>Initiate COB</button></td></tr>)}
              </tbody></table></div>)}
            </>
          )}
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  TRANSACTIONS                                                          */
/* ═══════════════════════════════════════════════════════════════════════ */
function TransactionsSection({ profile, showToast }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [txns, setTxns] = useState<PartnerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [clients, setClients] = useState<PartnerClientSummary[]>([]);
  const [createForm, setCreateForm] = useState({ clientId: '', type: 'SIP', schemeName: '', amount: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params: Record<string, string> = {};
      if (filter) params.type = filter;
      setTxns((await partnerApi.getTransactions(params)).data);
    } catch { setError('Failed to load transactions'); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  const openCreate = async () => {
    try { setClients((await partnerApi.getClients()).data); } catch {}
    setShowCreate(true);
  };

  const submitCreate = async () => {
    setCreateError('');
    if (!createForm.amount || parseFloat(createForm.amount) <= 0) { setCreateError('Amount is required'); return; }
    setSaving(true);
    try {
      await partnerApi.createTransaction({
        clientId: createForm.clientId ? Number(createForm.clientId) : undefined,
        type: createForm.type,
        schemeName: createForm.schemeName || undefined,
        amount: parseFloat(createForm.amount),
        notes: createForm.notes || undefined,
      });
      showToast('success', 'Transaction created');
      setShowCreate(false);
      setCreateForm({ clientId: '', type: 'SIP', schemeName: '', amount: '', notes: '' });
      load();
    } catch (err: any) { setCreateError(err?.response?.data?.error || 'Failed to create transaction'); }
    finally { setSaving(false); }
  };

  const totalAmount = txns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const sipCount = txns.filter(t => t.type === 'SIP').length;
  const lumpsumCount = txns.filter(t => t.type === 'LUMPSUM').length;

  const statusColor = (s: string) => s === 'CONFIRMED' ? C.green100 : s === 'PENDING' ? C.amber100 : s === 'REJECTED' || s === 'CANCELLED' ? C.red100 : C.gray100;
  const statusText = (s: string) => s === 'CONFIRMED' ? C.green500 : s === 'PENDING' ? C.amber500 : s === 'REJECTED' || s === 'CANCELLED' ? C.red500 : C.gray500;

  return (
    <>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Receipt size={16} color={C.pri600} /><span style={S.label}>Total Transactions</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{txns.length}</div></div>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><TrendingUp size={16} color={C.green500} /><span style={S.label}>SIP</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{sipCount}</div></div>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Wallet size={16} color={C.pri600} /><span style={S.label}>Lumpsum</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{lumpsumCount}</div></div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ l: 'All', v: '' }, { l: 'SIP', v: 'SIP' }, { l: 'Lumpsum', v: 'LUMPSUM' }].map(f => (
            <button key={f.v} type="button" className={`pd-pill${filter === f.v ? ' active' : ''}`} onClick={() => setFilter(f.v)}>{f.l}</button>
          ))}
        </div>
        <button type="button" style={S.btnPrimary} onClick={openCreate}><Plus size={14} /> New Transaction</button>
      </div>

      {/* Table */}
      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={load} /> :
       txns.length === 0 ? <EmptyState text="No transactions yet. Create your first transaction." /> : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table className="pd-table">
            <thead><tr><th>Client</th><th>Type</th><th>Scheme</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500, color: C.gray900 }}>{t.clientName || '—'}</td>
                  <td><span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: t.type === 'SIP' ? C.pri100 : C.green100, color: t.type === 'SIP' ? C.pri600 : C.green500 }}>{t.type}</span></td>
                  <td style={{ color: C.gray500 }}>{t.schemeName || '—'}</td>
                  <td style={{ fontWeight: 600, color: C.gray900 }}>{formatCurrency(t.amount)}</td>
                  <td><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: statusColor(t.status), color: statusText(t.status) }}>{t.status}</span></td>
                  <td style={{ color: C.gray500 }}>{fmt(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <ModalShell title="New Transaction" onClose={() => setShowCreate(false)} width={480} footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" style={S.btnOutline} onClick={() => setShowCreate(false)}>Cancel</button>
            <button type="button" style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={submitCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Transaction'}</button>
          </div>
        }>
          {createError && <div style={{ background: C.red100, color: C.red500, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{createError}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={S.label}>Client (Optional)</label>
              <select className="pd-input" style={{ ...S.input, cursor: 'pointer' }} value={createForm.clientId} onChange={e => setCreateForm(p => ({ ...p, clientId: e.target.value }))}>
                <option value="">Select client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={S.label}>Type *</label>
                <select className="pd-input" style={{ ...S.input, cursor: 'pointer' }} value={createForm.type} onChange={e => setCreateForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="SIP">SIP</option>
                  <option value="LUMPSUM">Lumpsum</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Amount *</label>
                <input className="pd-input" style={S.input} type="number" placeholder="0.00" value={createForm.amount} onChange={e => setCreateForm(p => ({ ...p, amount: e.target.value }))} />
              </div>
            </div>
            <div><label style={S.label}>Scheme Name</label><input className="pd-input" style={S.input} placeholder="e.g. HDFC Top 100 Growth" value={createForm.schemeName} onChange={e => setCreateForm(p => ({ ...p, schemeName: e.target.value }))} /></div>
            <div><label style={S.label}>Notes</label><input className="pd-input" style={S.input} placeholder="Optional notes" value={createForm.notes} onChange={e => setCreateForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
        </ModalShell>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  REVENUE                                                               */
/* ═══════════════════════════════════════════════════════════════════════ */
function RevenueSection({ profile, showToast }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [revenue, setRevenue] = useState<PartnerRevenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setRevenue((await partnerApi.getRevenue()).data); }
    catch { setError('Failed to load revenue data'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;
  if (!revenue) return null;

  return (
    <>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ ...S.card, borderLeft: `4px solid ${C.pri500}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><IndianRupee size={16} color={C.pri600} /><span style={S.label}>Total Revenue</span></div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{formatCurrency(revenue.totalRevenue)}</div>
        </div>
        <div style={{ ...S.card, borderLeft: `4px solid ${C.green500}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><CheckCircle size={16} color={C.green500} /><span style={S.label}>Released</span></div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.green500 }}>{formatCurrency(revenue.releasedRevenue)}</div>
        </div>
        <div style={{ ...S.card, borderLeft: `4px solid ${C.amber500}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Clock size={16} color={C.amber500} /><span style={S.label}>Pending</span></div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.amber500 }}>{formatCurrency(revenue.pendingRevenue)}</div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div style={S.card}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.gray900, margin: '0 0 16px' }}>Monthly Breakdown</h3>
        {revenue.monthlyBreakdown.length === 0 ? (
          <EmptyState text="No payout records yet. Revenue will appear here once payouts are processed." />
        ) : (
          <div style={{ ...S.card, padding: 0, overflow: 'hidden', boxShadow: 'none' }}>
            <table className="pd-table">
              <thead><tr><th>Period</th><th>Gross</th><th>Net</th><th>Status</th></tr></thead>
              <tbody>
                {revenue.monthlyBreakdown.map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: C.gray900 }}>{m.period}</td>
                    <td style={{ color: C.gray500 }}>{formatCurrency(m.gross)}</td>
                    <td style={{ fontWeight: 600, color: C.gray900 }}>{formatCurrency(m.net)}</td>
                    <td><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: m.status === 'RELEASED' ? C.green100 : C.amber100, color: m.status === 'RELEASED' ? C.green500 : C.amber500 }}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Referrals Section ──────────────────────────────────────────────── */
function ReferralsSection({ profile, showToast }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const res = await partnerApi.getReferrals(); setReferrals(res.data); }
    catch { setError('Failed to load referrals'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const total = referrals.length;
  const converted = referrals.filter(r => r.converted).length;
  const pending = total - converted;

  return (
    <>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={S.card}>
          <div style={S.label}>Total Referred</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{total}</div>
        </div>
        <div style={S.card}>
          <div style={S.label}>Converted</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.green500 }}>{converted}</div>
        </div>
        <div style={S.card}>
          <div style={S.label}>Pending</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.amber500 }}>{pending}</div>
        </div>
      </div>

      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={load} /> :
       referrals.length === 0 ? <EmptyState text="No referrals yet. Share your referral link to grow your network." /> : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table className="pd-table">
            <thead><tr><th>Partner Name</th><th>Type</th><th>Referred On</th><th>Status</th><th>Activation</th></tr></thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500, color: C.gray900 }}>{r.registeredUserName || 'Not yet registered'}</td>
                  <td><span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: C.pri100, color: C.pri700 }}>{r.referralType === 'INDIVIDUAL_PARTNER' ? 'Individual' : 'Firm'}</span></td>
                  <td style={{ color: C.gray500 }}>{fmt(r.clickedAt)}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: r.converted ? C.green100 : C.amber100, color: r.converted ? C.green500 : C.amber500 }}>
                      {r.converted ? 'Converted' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {r.converted && r.partnerStatus && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: r.partnerStatus === 'Active' ? C.green100 : C.amber100, color: r.partnerStatus === 'Active' ? C.green500 : C.amber500 }}>
                        {r.partnerStatus}
                      </span>
                    )}
                    {!r.converted && <span style={{ color: C.gray400 }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ExpandableRow({ cells, children }: { cells: string[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <><tr style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>{cells.map((c, i) => <td key={i} style={{ fontWeight: i === 0 ? 500 : 400, color: i === 0 ? C.gray900 : C.gray700 }}>{i === 0 && <span style={{ marginRight: 8, color: C.gray400 }}>{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}{c}</td>)}</tr>
    {open && <tr><td colSpan={cells.length} style={{ padding: 0, background: C.gray50 }}>{children}</td></tr>}</>
  );
}
