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
  Inbox,
} from 'lucide-react';
import { partnerApi } from '../../api/partnerApi';
import type {
  PartnerProfile, PartnerStats, PartnerClientSummary,
  SipSummary, TrackerSummary, CobOpportunity, ReferralEntry,
} from '../../types/api';

/* ─── Design Tokens ──────────────────────────────────────────────────── */
function getColors(dark: boolean) {
  return {
    navy900: dark ? '#0B1121' : '#0F172A', navy800: dark ? '#12182B' : '#1E293B', navy700: dark ? '#1E293B' : '#334155',
    pri500: '#3B82F6', pri600: dark ? '#3B82F6' : '#2563EB', pri700: '#1D4ED8', pri100: dark ? 'rgba(59,130,246,0.15)' : '#DBEAFE', pri50: dark ? 'rgba(59,130,246,0.08)' : '#EFF6FF',
    white: dark ? '#12182B' : '#FFFFFF', gray50: dark ? '#0B1121' : '#F9FAFB', gray100: dark ? '#1E293B' : '#F3F4F6', gray200: dark ? '#334155' : '#E5E7EB',
    gray300: dark ? '#475569' : '#D1D5DB', gray400: dark ? '#94A3B8' : '#9CA3AF', gray500: dark ? '#94A3B8' : '#6B7280', gray600: dark ? '#CBD5E1' : '#4B5563',
    gray700: dark ? '#E2E8F0' : '#374151', gray900: dark ? '#F8FAFC' : '#111827',
    green500: dark ? '#34D399' : '#10B981', green100: dark ? 'rgba(16,185,129,0.15)' : '#D1FAE5', green400: '#34D399',
    amber500: '#F59E0B', amber100: dark ? 'rgba(245,158,11,0.15)' : '#FEF3C7', amber50: dark ? 'rgba(245,158,11,0.08)' : '#FFFBEB',
    red500: '#EF4444', red100: dark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
    purple100: dark ? 'rgba(139,92,246,0.15)' : '#EDE9FE', purple600: dark ? '#A78BFA' : '#7C3AED',
    orange100: dark ? 'rgba(249,115,22,0.15)' : '#FFEDD5', orange700: dark ? '#FB923C' : '#C2410C',
    indigo100: dark ? 'rgba(99,102,241,0.15)' : '#E0E7FF', indigo700: dark ? '#818CF8' : '#4338CA',
  };
}
function getStyles(C: ReturnType<typeof getColors>) {
  return {
    card: { background: C.white, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', padding: 20 } as React.CSSProperties,
    cardElevated: { background: C.white, borderRadius: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)', padding: 24 } as React.CSSProperties,
    input: { width: '100%', height: 44, border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '0 12px', fontSize: 14, color: C.gray700, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Inter, system-ui, sans-serif', background: C.white } as React.CSSProperties,
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: C.gray500, textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 } as React.CSSProperties,
    btnPrimary: { background: C.pri600, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnOutline: { background: C.white, color: C.gray700, border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '10px 20px', fontWeight: 500, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnGhost: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
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
const ROLE_LABEL: Record<string, string> = { INDIVIDUAL_PARTNER: 'Individual Partner', NON_INDIVIDUAL_PARTNER: 'Partner Firm' };
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

type Section = 'overview' | 'profile' | 'clients' | 'sips' | 'referrals' | 'tracker';
interface Toast { type: 'success' | 'error'; message: string }

const NAV_ITEMS: { key: Section; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: 'overview',  label: 'Overview',              Icon: LayoutDashboard },
  { key: 'profile',   label: 'Profile & Verification', Icon: UserCircle },
  { key: 'clients',   label: 'My Clients',            Icon: Users },
  { key: 'sips',      label: 'SIP Book',              Icon: TrendingUp },
  { key: 'referrals', label: 'My Referrals',           Icon: Users },
  { key: 'tracker',   label: 'Tracker',               Icon: FolderOpen },
];
const NAV_LABELS: Record<Section, string> = { overview: 'Overview', profile: 'Profile & Verification', clients: 'My Clients', sips: 'SIP Book', referrals: 'My Referrals', tracker: 'Tracker' };

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
        .pd-nav-item { display: flex; align-items: center; gap: 10px; width: 100%; height: 44px; padding: 0 12px; border: none; border-radius: 8px; background: transparent; color: ${C.gray400}; font-size: 14px; font-weight: 500; cursor: pointer; font-family: Inter, system-ui, sans-serif; border-left: 3px solid transparent; transition: all 0.15s ease; }
        .pd-nav-item:hover { background: ${C.navy800}; color: ${C.white}; }
        .pd-nav-item.active { background: ${C.navy700}; color: ${C.white}; border-left-color: ${C.pri500}; }
        .pd-pill { padding: 6px 16px; border-radius: 20px; border: none; font-size: 13px; font-weight: 500; cursor: pointer; background: ${C.gray100}; color: ${C.gray600}; font-family: Inter, system-ui, sans-serif; transition: all 0.15s ease; }
        .pd-pill:hover { background: ${C.gray200}; }
        .pd-pill.active { background: ${C.pri600}; color: ${C.white}; }
        .pd-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .pd-table thead th { background: ${C.gray50}; color: ${C.gray500}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; padding: 12px 16px; text-align: left; border-bottom: 1px solid ${C.gray100}; }
        .pd-table thead th:first-child { border-radius: 8px 0 0 0; }
        .pd-table thead th:last-child { border-radius: 0 8px 0 0; }
        .pd-table tbody td { padding: 14px 16px; font-size: 14px; color: ${C.gray700}; border-bottom: 1px solid ${C.gray50}; vertical-align: middle; }
        .pd-table tbody tr { transition: background 0.1s ease; }
        .pd-table tbody tr:hover { background: ${C.gray50}; }
        .pd-input:focus { border-color: ${C.pri500} !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* SIDEBAR */}
        <aside style={{ width: 220, background: C.navy900, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20 }}>
          <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${C.navy700}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: '-.2px' }}>OngoleBulls Invest</div>
            <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>Partner Dashboard</div>
          </div>
          <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${C.navy700}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{initials(profile.fullName || profile.firmName)}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.white, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.fullName || profile.firmName || 'Partner'}</div>
                <span style={{ display: 'inline-block', marginTop: 3, padding: '2px 8px', borderRadius: 10, background: C.pri500, color: C.white, fontSize: 10, fontWeight: 600 }}>{ROLE_LABEL[profile.role] || profile.role}</span>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: profile.isActivated ? C.green400 : C.amber500, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: profile.isActivated ? C.green400 : C.amber500 }}>{profile.isActivated ? 'Active' : 'Pending'}</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <button key={key} type="button" className={`pd-nav-item${section === key ? ' active' : ''}`} onClick={() => setSection(key)}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
          <div style={{ padding: '8px 8px 16px', borderTop: `1px solid ${C.navy700}` }}>
            <button type="button" className="pd-nav-item" onClick={handleLogout} style={{ color: C.gray400 }}><LogOut size={16} /> Logout</button>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{ flex: 1, marginLeft: 220, background: C.gray50, minHeight: '100vh' }}>
          <header style={{ height: 64, background: C.white, borderBottom: `1px solid ${C.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>{NAV_LABELS[section]}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ background: 'none', border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 18, color: C.gray700, display: 'flex', alignItems: 'center', transition: 'all 0.2s ease' }}>{isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}</button>
              <Bell size={18} color={C.gray400} style={{ cursor: 'pointer' }} />
              <div style={{ width: 1, height: 24, background: C.gray200 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.gray700 }}>{profile.fullName || profile.firmName}</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 12 }}>{initials(profile.fullName || profile.firmName)}</div>
            </div>
          </header>
          <div style={{ padding: 24 }}>
            {section === 'overview' && <OverviewSection profile={profile} showToast={showToast} setSection={setSection} />}
            {section === 'profile' && <ProfileSection profile={profile} setProfile={setProfile} showToast={showToast} reload={loadProfile} />}
            {section === 'clients' && <ClientsSection profile={profile} showToast={showToast} setSection={setSection} />}
            {section === 'sips' && <SipBookSection profile={profile} showToast={showToast} />}
            {section === 'referrals' && <ReferralsSection profile={profile} showToast={showToast} />}
            {section === 'tracker' && <TrackerSection profile={profile} showToast={showToast} />}
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
function ActivationBanner({ onGoProfile }: { onGoProfile: () => void }) {
  return (
    <div style={{ background: C.amber50, border: '1px solid #FDE68A', borderLeft: `4px solid ${C.amber500}`, borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Lock size={18} color="#92400E" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#92400E', marginBottom: 4 }}>Account Activation Required</div>
          <div style={{ fontSize: 14, color: '#A16207' }}>Complete your profile verification and wait for admin approval to access this feature.</div>
        </div>
      </div>
      <button type="button" style={S.btnPrimary} onClick={onGoProfile}>Complete Profile <ArrowRight size={14} /></button>
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
  const [loading, setLoading] = useState(false);
  const [showRefer, setShowRefer] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);

  /* ACTIVATION_GUARD_DISABLED_FOR_TESTING — was: if (!profile.isActivated) return; */
  useEffect(() => { setLoading(true); partnerApi.getStats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false)); }, [profile.isActivated]);

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
  const kpis: { label: string; value: number; iconBg: string; Icon: React.FC<{ size?: number; color?: string }> }[] = [
    { label: 'Total Clients', value: stats?.totalClients ?? 0, iconBg: C.pri100, Icon: Users },
    { label: 'Active Investors', value: stats?.activeInvestors ?? 0, iconBg: C.green100, Icon: TrendingUp },
    { label: 'Pending KYC', value: stats?.pendingKyc ?? 0, iconBg: C.amber100, Icon: Clock },
    { label: 'Active SIPs', value: stats?.monthlySips ?? 0, iconBg: C.pri100, Icon: Wallet },
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><k.Icon size={20} color={k.iconBg === C.green100 ? C.green500 : k.iconBg === C.amber100 ? C.amber500 : C.pri600} /></div>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.gray500, textTransform: 'uppercase', letterSpacing: '.5px' }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.gray900 }}>{k.value}</div>
          </div>
        ))}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: C.gray900, margin: '0 0 12px' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ ...S.card, cursor: 'pointer', border: `1px solid ${C.gray100}`, transition: 'all 0.2s ease' }} onClick={() => setShowAddClient(true)}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.pri500; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.gray100; (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = S.card.boxShadow!; }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><UserPlus size={22} color={C.pri600} /></div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>Add Client</div>
          <p style={{ fontSize: 13, color: C.gray500, margin: '4px 0 12px' }}>Onboard a new investor to start their journey</p>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.pri600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Add Client <ArrowRight size={14} /></span>
        </div>
        <div style={{ ...S.card, cursor: 'pointer', border: `1px solid ${C.gray100}`, transition: 'all 0.2s ease' }} onClick={() => setShowRefer(true)}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.pri500; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.gray100; (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = S.card.boxShadow!; }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.green100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><Handshake size={22} color={C.green500} /></div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>Refer a Partner</div>
          <p style={{ fontSize: 13, color: C.gray500, margin: '4px 0 12px' }}>Grow your network, earn referral rewards</p>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.pri600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Refer Now <ArrowRight size={14} /></span>
        </div>
      </div>
      {showAddClient && <AddClientModal onClose={() => setShowAddClient(false)} showToast={showToast} onAdded={() => { setShowAddClient(false); partnerApi.getStats().then(r => setStats(r.data)); }} />}
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
            {selectedType === o.type && <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', background: C.pri500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color={C.white} /></div>}
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
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: C.white, borderRadius: 8, padding: '12px 16px', fontWeight: 600, fontSize: 14, textDecoration: 'none', width: '100%', boxSizing: 'border-box' }}>
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
              <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 6 }}><Wallet size={14} /> Total Value</div><div style={{ fontSize: 28, fontWeight: 700, color: C.white, marginTop: 4 }}>{formatCurrency(tracker!.totalValue)}</div></div>
              <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={14} /> Folios</div><div style={{ fontSize: 28, fontWeight: 700, color: C.white, marginTop: 4 }}>{tracker!.folioCount}</div></div>
              <div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> Fund Houses</div><div style={{ fontSize: 28, fontWeight: 700, color: C.white, marginTop: 4 }}>{tracker!.amcCount}</div></div>
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
