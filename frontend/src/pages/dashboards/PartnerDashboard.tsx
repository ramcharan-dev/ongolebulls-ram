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
  Inbox, Receipt, IndianRupee, Sun, Moon, Calculator,
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
      isDark: true,
      navy950: '#050812', navy900: '#0b1220', navy800: '#111a2b', navy700: '#172234',
      pri500: '#ffb020', pri600: '#ffc147', pri700: '#d38a00', pri100: 'rgba(255,176,32,0.18)', pri50: 'rgba(255,176,32,0.10)',
      white: '#121b2d', gray50: '#09111e', gray100: '#141f31', gray200: '#21304a',
      gray300: '#314566', gray400: '#8b97ae', gray500: '#a7b2c6', gray600: '#d0d8e6',
      gray700: '#edf3fb', gray900: '#ffffff',
      green500: '#30d486', green100: 'rgba(48,212,134,0.16)', green400: '#55e49f',
      amber500: '#ffb020', amber100: 'rgba(255,176,32,0.18)', amber50: 'rgba(255,176,32,0.10)',
      red500: '#ff6167', red100: 'rgba(255,97,103,0.16)',
      purple100: 'rgba(168,85,247,0.18)', purple600: '#cb96ff',
      orange100: 'rgba(249,115,22,0.18)', orange700: '#ff9d5c',
      indigo100: 'rgba(59,130,246,0.18)', indigo700: '#79b0ff',
    };
  }
  return {
    isDark: false,
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
function getStyles(C: ReturnType<typeof getColors>, dark: boolean) {
  return {
    card: { background: dark ? `linear-gradient(180deg, ${C.white}, ${C.gray100})` : `linear-gradient(180deg, ${C.white}, ${C.gray100})`, border: `1px solid ${C.gray200}`, borderRadius: 18, boxShadow: dark ? '0 22px 50px rgba(0,0,0,0.28)' : '0 18px 44px rgba(107,78,32,0.08)', padding: 22 } as React.CSSProperties,
    cardElevated: { background: dark ? `linear-gradient(180deg, ${C.navy800}, ${C.white})` : `linear-gradient(180deg, ${C.white}, ${C.gray100})`, border: `1px solid ${C.gray200}`, borderRadius: 22, boxShadow: dark ? '0 28px 64px rgba(0,0,0,0.32)' : '0 22px 56px rgba(107,78,32,0.10)', padding: 24 } as React.CSSProperties,
    input: { width: '100%', height: 44, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: '0 14px', fontSize: 14, color: C.gray700, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Inter, system-ui, sans-serif', background: C.white } as React.CSSProperties,
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: C.gray500, textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 } as React.CSSProperties,
    btnPrimary: { background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, color: '#111827', border: 'none', borderRadius: 14, padding: '11px 18px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif', boxShadow: dark ? '0 16px 34px rgba(255,176,32,0.24)' : '0 14px 30px rgba(219,143,0,0.18)' } as React.CSSProperties,
    btnOutline: { background: dark ? 'rgba(18,27,45,0.86)' : C.white, color: C.gray700, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: '11px 18px', fontWeight: 500, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif', boxShadow: dark ? 'inset 0 1px 0 rgba(255,255,255,0.02)' : 'none' } as React.CSSProperties,
    btnGhost: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  };
}
let C = getColors(false);
let S = getStyles(C, false);

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

type Section = 'overview' | 'profile' | 'clients' | 'transactions' | 'revenue' | 'sips' | 'referrals' | 'tracker' | 'planner' | 'arn-onboarding';
interface Toast { type: 'success' | 'error'; message: string }

const NAV_ITEMS: { key: Section; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: 'overview',     label: 'Dashboard',        Icon: LayoutDashboard },
  { key: 'clients',      label: 'Clients',          Icon: Users },
  { key: 'transactions', label: 'Transactions',     Icon: RefreshCw },
  { key: 'sips',         label: 'Systematic Plans', Icon: Receipt },
  { key: 'revenue',      label: 'Revenue',          Icon: Wallet },
  { key: 'tracker',      label: 'Tracker',          Icon: FolderOpen },
  { key: 'planner',      label: 'Planner',          Icon: Calculator },
  { key: 'profile',      label: 'Profile',          Icon: UserCircle },
  { key: 'referrals',    label: 'Refer & Earn',     Icon: Handshake },
];

/* ═══════════════════════════════════════════════════════════════════════ */
export default function PartnerDashboard() {
  const { isDark, toggleTheme } = useTheme();
  C = getColors(isDark);
  S = getStyles(C, isDark);

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
  const sidebarBackground = isDark
    ? `linear-gradient(180deg, ${C.navy900}, ${C.navy950})`
    : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,247,251,0.98))';
  const headerBackground = isDark ? 'rgba(11,18,32,0.84)' : 'rgba(255,255,255,0.78)';
  const panelShadow = isDark ? '0 26px 56px rgba(0,0,0,0.30)' : '0 18px 48px rgba(110,88,46,0.08)';
  const hoverShadow = isDark ? '0 28px 60px rgba(0,0,0,0.36)' : '0 24px 56px rgba(219,143,0,0.12)';

  return (
    <>
      <style>{`
        @keyframes pd-spin { to { transform: rotate(360deg) } }
        @keyframes pd-slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes pd-toastIn { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .pd-nav-item { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 48px; padding: 0 14px; border: 1px solid transparent; border-radius: 14px; background: transparent; color: ${C.gray500}; font-size: 14px; font-weight: 500; cursor: pointer; font-family: Inter, system-ui, sans-serif; transition: all 0.18s ease; }
        .pd-nav-item:hover { background: ${isDark ? 'rgba(20,31,49,0.92)' : C.gray100}; color: ${C.gray900}; border-color: ${isDark ? 'rgba(255,176,32,0.14)' : C.gray200}; }
        .pd-nav-item.active { background: ${isDark ? 'linear-gradient(135deg, rgba(255,176,32,0.16), rgba(255,97,103,0.08))' : 'rgba(246,169,26,0.08)'}; color: ${C.pri600}; border-color: rgba(255,176,32,0.30); box-shadow: ${isDark ? '0 16px 32px rgba(255,176,32,0.08), inset 0 0 0 1px rgba(255,176,32,0.08)' : 'inset 0 0 0 1px rgba(246,169,26,0.08)'}; }
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
            ${isDark
              ? `radial-gradient(circle at top right, rgba(255,176,32,0.16), transparent 24%),
                 radial-gradient(circle at top left, rgba(255,97,103,0.10), transparent 22%),
                 linear-gradient(180deg, ${C.gray50}, ${C.navy900})`
              : `radial-gradient(circle at top left, rgba(245,158,11,0.08), transparent 26%),
                 linear-gradient(180deg, ${C.gray50}, ${C.navy900})`};
        }
        .pd-glass {
          background: ${headerBackground};
          backdrop-filter: blur(18px);
        }
        .pd-panel {
          background: ${isDark ? `linear-gradient(180deg, ${C.navy800}, ${C.white})` : `linear-gradient(180deg, ${C.white}, ${C.gray100})`};
          border: 1px solid ${C.gray200};
          box-shadow: ${panelShadow};
        }
        .pd-stat-card:hover, .pd-action-card:hover { transform: translateY(-2px); border-color: rgba(246,169,26,0.24); box-shadow: ${hoverShadow}; }
        .pd-arn-shell { display: flex; flex-direction: column; gap: 24px; }
        .pd-arn-panel {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid ${isDark ? 'rgba(255,176,32,0.18)' : C.gray200};
          background: ${isDark
            ? `linear-gradient(145deg, rgba(17,26,43,0.98), rgba(10,16,29,0.96))`
            : `linear-gradient(145deg, rgba(255,255,255,0.98), rgba(244,247,251,0.96))`};
          box-shadow: ${isDark ? '0 30px 70px rgba(0,0,0,0.34)' : '0 26px 60px rgba(110,88,46,0.10)'};
        }
        .pd-arn-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${isDark
            ? 'radial-gradient(circle at top right, rgba(255,176,32,0.18), transparent 26%), radial-gradient(circle at bottom left, rgba(255,97,103,0.10), transparent 24%)'
            : 'radial-gradient(circle at top left, rgba(245,158,11,0.10), transparent 28%), radial-gradient(circle at bottom right, rgba(37,99,235,0.06), transparent 26%)'};
          pointer-events: none;
        }
        .pd-arn-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.9fr); gap: 24px; padding: 32px; }
        .pd-arn-choice-row { display: flex; gap: 14px; flex-wrap: wrap; }
        .pd-arn-side-card { border-radius: 22px; border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(110,88,46,0.10)'}; background: ${isDark ? 'rgba(9,17,30,0.72)' : 'rgba(255,255,255,0.72)'}; backdrop-filter: blur(10px); padding: 22px; }
        .pd-arn-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .pd-arn-form-grid .pd-arn-field-full { grid-column: 1 / -1; }
        @media (max-width: 1220px) {
          .pd-overview-grid { grid-template-columns: 1fr !important; }
          .pd-overview-subgrid { grid-template-columns: 1fr !important; }
          .pd-arn-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 820px) {
          .pd-header-search { display: none !important; }
          .pd-planner-inputs { grid-template-columns: 1fr !important; }
          .pd-planner-results { grid-template-columns: 1fr !important; }
          .pd-arn-grid { padding: 22px; }
          .pd-arn-choice-row { flex-direction: column; }
          .pd-arn-choice-row button { width: 100%; justify-content: center; }
          .pd-arn-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {/* SIDEBAR */}
        <aside style={{ width: 286, background: sidebarBackground, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20, borderRight: `1px solid ${C.gray200}` }}>
          <div style={{ padding: '24px 24px 18px', borderBottom: `1px solid ${C.gray200}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: isDark ? 'rgba(246,169,26,0.12)' : 'rgba(245,158,11,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri600, fontSize: 18 }}>↗</div>
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
              <input className="pd-input" placeholder="Search..." style={{ ...S.input, paddingLeft: 42, background: isDark ? C.gray100 : C.white }} />
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
                  background: isDark ? C.gray100 : C.white,
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
              <div style={{ position: 'relative', width: 38, height: 38, borderRadius: 14, background: isDark ? C.gray100 : C.white, border: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={16} color={C.gray500} />
                <span style={{ position: 'absolute', top: -6, right: -4, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: C.red500, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: isDark ? 'rgba(246,169,26,0.18)' : 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri600, fontWeight: 700, fontSize: 12 }}>{initials(profile.fullName || profile.firmName)[0]}</div>
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
            {section === 'planner' && <PlannerSection profile={profile} showToast={showToast} />}
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
      bg: C.isDark ? 'linear-gradient(135deg, rgba(255,176,32,0.12), rgba(18,27,45,0.96))' : '#FFFBEB',
      border: C.isDark ? '#ffb020' : '#F59E0B',
      iconColor: C.isDark ? '#ffd27a' : '#92400E',
      title: 'ARN Verification Required',
      desc: 'Submit your ARN details to get verified and start using the platform.',
      btnLabel: 'Complete ARN',
    },
    PENDING_APPROVAL: {
      bg: C.isDark ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(18,27,45,0.96))' : '#EFF6FF',
      border: C.isDark ? '#60a5fa' : '#3B82F6',
      iconColor: C.isDark ? '#9cc4ff' : '#1E40AF',
      title: 'ARN Verification Pending',
      desc: 'Your ARN submission is under review. We will notify you once verified.',
    },
    REJECTED: {
      bg: C.isDark ? 'linear-gradient(135deg, rgba(255,97,103,0.12), rgba(18,27,45,0.96))' : '#FEF2F2',
      border: C.isDark ? '#ff6167' : '#EF4444',
      iconColor: C.isDark ? '#ff9ba0' : '#991B1B',
      title: 'ARN Verification Rejected',
      desc: profile.rejectionReason ? `Reason: ${profile.rejectionReason}. Please resubmit with correct details.` : 'Your ARN was rejected. Please resubmit.',
      btnLabel: 'Resubmit ARN',
    },
  };
  const c = configs[profile.arnStatus] || configs.NOT_SUBMITTED;

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}33`, borderLeft: `4px solid ${c.border}`, borderRadius: 18, padding: '22px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, boxShadow: C.isDark ? '0 18px 36px rgba(0,0,0,0.18)' : '0 14px 30px rgba(110,88,46,0.06)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Lock size={18} color={c.iconColor} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: c.iconColor, marginBottom: 4 }}>{c.title}</div>
          <div style={{ fontSize: 14, color: C.isDark ? C.gray500 : c.iconColor + 'CC' }}>{c.desc}</div>
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
  const infoCardStyle = {
    borderRadius: 20,
    border: `1px solid ${C.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(110,88,46,0.10)'}`,
    background: C.isDark ? 'rgba(9,17,30,0.72)' : 'rgba(255,255,255,0.76)',
    padding: 20,
  } as React.CSSProperties;
  const inputStyle = (field?: string) => ({
    ...S.input,
    height: 50,
    borderRadius: 14,
    borderColor: field && errors[field] ? C.red500 : C.gray200,
    background: C.isDark ? 'rgba(9,17,30,0.82)' : C.white,
    color: C.gray900,
    boxShadow: C.isDark ? 'inset 0 1px 0 rgba(255,255,255,0.02)' : 'none',
  });
  const subtleButton = {
    ...S.btnOutline,
    justifyContent: 'center',
    minHeight: 52,
    fontWeight: 600,
  } as React.CSSProperties;
  const bulletStyle = {
    width: 36,
    height: 36,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: C.isDark ? 'rgba(255,176,32,0.14)' : C.pri50,
    color: C.pri600,
    flexShrink: 0,
  } as React.CSSProperties;

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
      <div className="pd-arn-shell">
        <button type="button" onClick={() => setStep('ask')} style={{ ...S.btnGhost, width: 'fit-content', color: C.pri600, gap: 8, fontWeight: 600, padding: 0 }}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to ARN verification
        </button>
        <div className="pd-arn-panel">
          <div className="pd-arn-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: C.isDark ? 'rgba(255,176,32,0.12)' : C.pri50, border: `1px solid ${C.isDark ? 'rgba(255,176,32,0.18)' : C.pri100}`, color: C.pri600, fontSize: 12, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>
                Distribution Readiness
              </div>
              <div>
                <h2 style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.04em', color: C.gray900, margin: 0 }}>Get your ARN and unlock partner operations</h2>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: C.gray500, margin: '16px 0 0' }}>
                  ARN verification is required before client onboarding, transaction workflows, and payout-linked partner activity can be fully enabled.
                </p>
              </div>
              <div style={{ ...infoCardStyle, display: 'grid', gap: 16 }}>
                {[
                  { num: '1', title: 'Pass NISM Certification', desc: 'Complete the NISM Series V-A: Mutual Fund Distributors Certification Examination.' },
                  { num: '2', title: 'Register on AMFI', desc: 'Submit your ARN application with the required identity, qualification, and business details.' },
                  { num: '3', title: 'Receive ARN & EUIN', desc: 'Once approved, come back here and submit your ARN for platform verification.' },
                ].map(s => (
                  <div key={s.num} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ ...bulletStyle, borderRadius: '50%', fontWeight: 700, fontSize: 14 }}>{s.num}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.gray900, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 13, lineHeight: 1.7, color: C.gray500 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="pd-arn-side-card">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: C.red100, color: C.red500, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>Action needed</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.gray900, marginBottom: 10 }}>No ARN on file yet</div>
                <p style={{ margin: 0, color: C.gray500, fontSize: 14, lineHeight: 1.75 }}>
                  Until you complete this step, core partner actions stay limited. Once AMFI approves your ARN, you can submit it here in a minute.
                </p>
              </div>
              <div className="pd-arn-side-card" style={{ display: 'grid', gap: 14 }}>
                <a
                  href="https://www.amfiindia.com/distributor-corner"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...S.btnPrimary, width: '100%', justifyContent: 'center', textDecoration: 'none', minHeight: 52 }}
                >
                  Visit AMFI Portal <ArrowRight size={14} />
                </a>
                <button type="button" style={{ ...subtleButton, width: '100%' }} onClick={() => setStep('form')}>
                  I already have my ARN
                </button>
                <div style={{ fontSize: 12, lineHeight: 1.7, color: C.gray400 }}>
                  Tip: keep your ARN, PAN, and EUIN ready before submitting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="pd-arn-shell">
        <button type="button" onClick={() => setStep('ask')} style={{ ...S.btnGhost, width: 'fit-content', color: C.pri600, gap: 8, fontWeight: 600, padding: 0 }}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to ARN verification
        </button>
        <div className="pd-arn-panel">
          <div className="pd-arn-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: C.isDark ? 'rgba(48,212,134,0.12)' : C.green100, border: `1px solid ${C.isDark ? 'rgba(48,212,134,0.18)' : C.green100}`, color: C.green500, fontSize: 12, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>
                Verification Submission
              </div>
              <div>
                <h2 style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.04em', color: C.gray900, margin: 0 }}>Submit your ARN details</h2>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: C.gray500, margin: '16px 0 0' }}>
                  We’ll use these details for review and activation. Make sure the ARN and PAN match your AMFI registration exactly.
                </p>
              </div>
              <div style={{ ...infoCardStyle, display: 'grid', gap: 16 }}>
                {[
                  { icon: Shield, title: 'Secure review flow', desc: 'Submitted details are checked before partner activation and trading-related actions are unlocked.' },
                  { icon: CheckCircle, title: 'Faster approvals', desc: 'Accurate ARN, PAN, and EUIN details reduce back-and-forth and speed up verification.' },
                  { icon: Info, title: 'What happens next', desc: 'After submission, your ARN status will move to pending review and you’ll see updates on the dashboard.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={bulletStyle}><Icon size={18} /></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.gray900, marginBottom: 4 }}>{title}</div>
                      <div style={{ fontSize: 13, lineHeight: 1.7, color: C.gray500 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pd-arn-side-card">
              <div style={{ fontSize: 20, fontWeight: 700, color: C.gray900, marginBottom: 6 }}>Verification details</div>
              <p style={{ margin: '0 0 22px', color: C.gray500, fontSize: 14, lineHeight: 1.7 }}>
                Complete the form below to send your ARN for verification.
              </p>
              <div className="pd-arn-form-grid">
                <div className="pd-arn-field-full">
                  <label style={S.label}>ARN Number *</label>
                  <input className="pd-input" type="text" value={arnNumber} onChange={e => { setArnNumber(e.target.value); setErrors(prev => ({ ...prev, arnNumber: '' })); }} placeholder="e.g. ARN-12345" style={inputStyle('arnNumber')} />
                  {errors.arnNumber && <div style={{ color: C.red500, fontSize: 12, marginTop: 6 }}>{errors.arnNumber}</div>}
                </div>
                <div>
                  <label style={S.label}>PAN Number *</label>
                  <input className="pd-input" type="text" value={pan} onChange={e => { setPan(e.target.value.toUpperCase()); setErrors(prev => ({ ...prev, pan: '' })); }} placeholder="e.g. ABCDE1234F" maxLength={10} style={inputStyle('pan')} />
                  {errors.pan && <div style={{ color: C.red500, fontSize: 12, marginTop: 6 }}>{errors.pan}</div>}
                </div>
                <div>
                  <label style={S.label}>EUIN</label>
                  <input className="pd-input" type="text" value={euin} onChange={e => setEuin(e.target.value)} placeholder="e.g. E123456" style={inputStyle()} />
                </div>
                <div className="pd-arn-field-full" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                  <button type="button" style={{ ...S.btnPrimary, flex: '1 1 220px', justifyContent: 'center', minHeight: 52, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit for verification'}
                  </button>
                  <button type="button" style={{ ...subtleButton, flex: '1 1 180px' }} onClick={() => setStep('no-arn')}>
                    Need ARN guidance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-arn-shell">
      <div className="pd-arn-panel">
        <div className="pd-arn-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: C.isDark ? 'rgba(255,176,32,0.12)' : C.pri50, border: `1px solid ${C.isDark ? 'rgba(255,176,32,0.18)' : C.pri100}`, color: C.pri600, fontSize: 12, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>
              ARN Verification
            </div>
            <div>
              <h1 style={{ fontSize: 38, lineHeight: 1.04, fontWeight: 800, letterSpacing: '-0.05em', color: C.gray900, margin: 0 }}>Complete your ARN verification</h1>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.gray500, margin: '18px 0 0', maxWidth: 620 }}>
                This step unlocks full partner functionality across client onboarding, transactions, revenue operations, and workflow approvals.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { label: 'Client onboarding', value: 'Enabled after ARN approval', tone: C.green500 },
                { label: 'Transaction workflows', value: 'Linked to verified partner status', tone: C.pri600 },
                { label: 'Review status', value: profile.arnStatus?.replaceAll('_', ' ') || 'Not submitted', tone: C.red500 },
              ].map(item => (
                <div key={item.label} style={{ ...infoCardStyle, padding: 18 }}>
                  <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: C.gray400, marginBottom: 10 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: item.tone }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="pd-arn-side-card">
              <div style={{ fontSize: 24, fontWeight: 700, color: C.gray900, marginBottom: 8 }}>Do you already have an ARN?</div>
              <p style={{ margin: 0, color: C.gray500, fontSize: 14, lineHeight: 1.75 }}>
                Choose the path that matches your current registration status. You can submit immediately if your ARN is already issued.
              </p>
            </div>
            <div className="pd-arn-side-card" style={{ display: 'grid', gap: 16 }}>
              <div className="pd-arn-choice-row">
                <button type="button" style={{ ...S.btnPrimary, flex: '1 1 240px', justifyContent: 'center', minHeight: 54 }} onClick={() => setStep('form')}>
                  Yes, I have an ARN
                </button>
                <button type="button" style={{ ...subtleButton, flex: '1 1 220px' }} onClick={() => setStep('no-arn')}>
                  No, I need guidance
                </button>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: C.gray400 }}>
                A verified ARN helps us activate your distribution profile faster and keeps compliance checks aligned with AMFI records.
              </div>
            </div>
          </div>
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
    { label: 'Lead', count: leadCount, stage: 'LEAD_CREATED', bg: 'rgba(246,169,26,0.10)', bar: 'linear-gradient(135deg, rgba(246,169,26,0.85), rgba(216,141,8,0.95))' },
    { label: 'Link Sent', count: linkSentCount, stage: 'LINK_SENT', bg: 'rgba(96,165,250,0.12)', bar: 'linear-gradient(135deg, rgba(96,165,250,0.75), rgba(37,99,235,0.95))' },
    { label: 'KYC Started', count: lifecycleDistribution.KYC_STARTED ?? 0, stage: 'KYC_STARTED', bg: 'rgba(168,85,247,0.10)', bar: 'linear-gradient(135deg, rgba(168,85,247,0.75), rgba(126,34,206,0.95))' },
    { label: 'Investor', count: investorCount, stage: 'ACTIVE_INVESTOR', bg: 'rgba(40,209,124,0.12)', bar: 'linear-gradient(135deg, rgba(40,209,124,0.8), rgba(22,163,74,0.95))' },
  ];

  // --- Improvement 6: Client Alerts (derived from existing data) ---
  const alerts: { icon: React.ReactNode; text: string; tone: string; color: string }[] = [];
  if (pausedSips > 0) alerts.push({ icon: <AlertTriangle size={14} />, text: `${pausedSips} SIP${pausedSips > 1 ? 's' : ''} paused — follow up to resume`, tone: 'rgba(245,158,11,0.10)', color: C.amber500 });
  if (failedSips > 0) alerts.push({ icon: <AlertTriangle size={14} />, text: `${failedSips} SIP${failedSips > 1 ? 's' : ''} failed — requires attention`, tone: C.red100, color: C.red500 });
  if (pendingKyc > 0) alerts.push({ icon: <Clock size={14} />, text: `${pendingKyc} client${pendingKyc > 1 ? 's' : ''} pending KYC completion`, tone: 'rgba(96,165,250,0.10)', color: '#3B82F6' });
  if (totalAum === 0 && totalClients > 0) alerts.push({ icon: <FolderOpen size={14} />, text: 'No portfolio data — upload CAS to track AUM', tone: C.gray100, color: C.gray500 });
  if (failedOrders > 0) alerts.push({ icon: <AlertTriangle size={14} />, text: `${failedOrders} order${failedOrders > 1 ? 's' : ''} failed or rejected`, tone: C.red100, color: C.red500 });

  // --- Improvement 4: SIP donut data ---
  const totalSips = activeSips + pausedSips + cancelledSips + failedSips;
  const sipTotal = Math.max(totalSips, 1);
  const sipSlices = [
    { pct: (activeSips / sipTotal) * 100, color: C.green500 },
    { pct: (pausedSips / sipTotal) * 100, color: C.pri600 },
    { pct: (cancelledSips / sipTotal) * 100, color: C.gray400 },
    { pct: (failedSips / sipTotal) * 100, color: C.red500 },
  ];
  let sipConicGrad = C.gray100;
  if (totalSips > 0) {
    let acc = 0;
    const stops = sipSlices.map(s => { const start = acc; acc += s.pct; return `${s.color} ${start}% ${acc}%`; });
    sipConicGrad = `conic-gradient(${stops.join(', ')})`;
  }
  const totalSipMonthlyValue = sips.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const avgSipAmt = activeSips > 0 ? Math.round(totalSipMonthlyValue / activeSips) : 0;

  // --- Improvement 2: Quick Access with micro-stats ---
  const profileCompletion = [profile.hasArn, profile.hasBankDetails, profile.hasAgreement, profile.isActivated].filter(Boolean).length;
  const quickActionsEnhanced = [
    { label: 'Add Client', sub: `${totalClients} total`, icon: UserPlus, onClick: () => setShowAddClient(true) },
    { label: 'SIP Book', sub: `${activeSips} active`, icon: Receipt, onClick: () => setSection('sips') },
    { label: 'Tracker', sub: totalAum > 0 ? formatCompactNumber(totalAum) : '—', icon: FolderOpen, onClick: () => setSection('tracker') },
    { label: 'Revenue', sub: monthlyRevenue > 0 ? `${formatCompactNumber(monthlyRevenue)}/mo` : '—', icon: Wallet, onClick: () => setSection('revenue') },
    { label: 'Planner', sub: 'Plan income', icon: Calculator, onClick: () => setSection('planner') },
    { label: 'Profile', sub: `${profileCompletion * 25}%`, icon: UserCircle, onClick: () => setSection('profile') },
  ];

  // --- Improvement 8: Portfolio Insights ---
  const holdings = tracker?.holdings ?? [];
  const amcMap: Record<string, number> = {};
  holdings.forEach(h => { amcMap[h.amcName] = (amcMap[h.amcName] ?? 0) + (h.currentValue ?? 0); });
  const topAmcs = Object.entries(amcMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // --- Improvement 5: Orders pipeline total ---
  const totalOrderValue = transactions.reduce((s, t) => s + (t.amount ?? 0), 0);
  const totalOrders = transactions.length;

  // Section label helper
  const secLabel = (text: string) => <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase' as const, color: C.gray400, marginBottom: 8 }}>{text}</div>;

  return (
    <>
      <ArnStatusBanner profile={profile} onCompleteArn={() => setSection('arn-onboarding')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* ── Header ── */}
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

        {/* ── 1. Enhanced Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total AUM', value: formatCurrency(totalAum), icon: TrendingUp, chip: latestInflow > 0 ? `↗ ${formatCompactNumber(latestInflow)}` : '₹0', chipTone: C.green100, chipColor: C.green500, iconBg: C.green100, detail: `${tracker?.folioCount ?? 0} folios · ${tracker?.amcCount ?? 0} AMCs` },
            { label: 'Active Clients', value: totalClients, icon: Users, chip: `${activeInvestors} investors`, chipTone: C.gray100, chipColor: C.gray500, iconBg: C.indigo100, detail: pendingKyc > 0 ? `${pendingKyc} pending KYC` : 'All KYC complete' },
            { label: 'Active SIPs', value: activeSips, icon: RefreshCw, chip: `${pausedSips} paused`, chipTone: C.gray100, chipColor: C.gray500, iconBg: C.pri100, detail: totalSipMonthlyValue > 0 ? `${formatCurrency(totalSipMonthlyValue)}/mo value` : `Avg ${formatCurrency(avgSipAmt)}/SIP` },
            { label: 'Monthly Revenue', value: formatCurrency(monthlyRevenue), icon: Wallet, chip: totalRevenue > 0 ? `↗ ${formatCompactNumber(totalRevenue)} total` : '₹0 total', chipTone: C.green100, chipColor: C.green500, iconBg: C.green100, detail: revenue?.releasedRevenue ? `${formatCurrency(revenue.releasedRevenue)} released` : 'Trail + upfront' },
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
              <div style={{ fontSize: 12, color: C.gray400, marginTop: 6, borderTop: `1px solid ${C.gray100}`, paddingTop: 8 }}>{card.detail}</div>
            </div>
          ))}
        </div>

        {/* ── Today's Focus + ARN ── */}
        <div className="pd-overview-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, background: `linear-gradient(90deg, rgba(246,169,26,0.10), ${C.white})` }}>
            <div>
              {secLabel("Today's Focus")}
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
                <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>{!profile.hasArn ? 'ARN Pending' : 'ARN Verified'}</div>
                <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, marginTop: 8 }}>
                  {!profile.hasArn ? 'Finish your ARN flow to unlock client onboarding.' : 'Your ARN is on file. Keep your profile updated.'}
                </div>
                <button type="button" onClick={() => setSection('profile')} style={{ marginTop: 10, background: 'none', border: 'none', padding: 0, color: C.pri600, fontWeight: 600, cursor: 'pointer' }}>
                  {!profile.hasArn ? 'Complete ARN' : 'Open profile'}
                </button>
              </div>
            </div>
            <span style={{ padding: '6px 12px', borderRadius: 999, background: profile.hasArn ? C.green100 : C.gray100, color: profile.hasArn ? C.green500 : C.gray500, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {!profile.hasArn ? 'Pending' : 'Verified'}
            </span>
          </div>
        </div>

        {/* ── 6. Client Alerts (conditional — only shows if alerts exist) ── */}
        {alerts.length > 0 && (
          <div className="pd-panel" style={{ borderRadius: 18, padding: 22, borderLeft: `4px solid ${C.amber500}` }}>
            {secLabel('Alerts')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: a.tone }}>
                  <span style={{ color: a.color, flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: a.color }}>{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Action Center + 2. Quick Access with micro-stats ── */}
        <div className="pd-overview-subgrid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.15fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div>
                {secLabel('Action Center')}
                <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900 }}>You have {pendingActions} pending action{pendingActions !== 1 ? 's' : ''}</div>
                <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, marginTop: 10 }}>
                  Review outstanding KYC, activation, and compliance setup tasks in one place.
                </div>
                {pendingActions > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
                    {!profile.hasArn && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.amber500 }}><Circle size={8} /> Submit ARN details</div>}
                    {!profile.hasBankDetails && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.amber500 }}><Circle size={8} /> Add bank details</div>}
                    {!profile.hasAgreement && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.amber500 }}><Circle size={8} /> Accept platform agreement</div>}
                    {!profile.isActivated && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.gray400 }}><Clock size={8} /> Awaiting admin activation</div>}
                    {pendingKyc > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#3B82F6' }}><Circle size={8} /> {pendingKyc} client KYC pending</div>}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => setSection('profile')} style={{ ...S.btnGhost, color: C.gray400 }}><ArrowRight size={18} /></button>
            </div>
          </div>

          <div>
            {secLabel('Quick Access')}
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 14 }}>Quick actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
              {quickActionsEnhanced.map(action => (
                <button key={action.label} type="button" className="pd-panel pd-action-card" onClick={action.onClick} style={{ textAlign: 'left', borderRadius: 16, padding: 16, cursor: 'pointer', transition: 'transform 0.18s ease, border-color 0.18s ease' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <action.icon size={18} color={C.pri600} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.gray900 }}>{action.label}</div>
                  <div style={{ fontSize: 11, color: C.gray400, marginTop: 3 }}>{action.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. SIP Donut + 5. Orders Pipeline ── */}
        <div className="pd-overview-subgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            {secLabel('Health Overview')}
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 18 }}>SIP Overview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* Donut */}
              <div style={{ width: 110, height: 110, borderRadius: '50%', background: sipConicGrad, padding: 10, flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: C.white, border: `1px solid ${C.gray200}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.gray900 }}>{totalSips}</div>
                  <div style={{ fontSize: 10, color: C.gray400 }}>TOTAL</div>
                </div>
              </div>
              {/* Detail */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Active', value: activeSips, color: C.green500 },
                  { label: 'Paused', value: pausedSips, color: C.pri600 },
                  { label: 'Cancelled', value: cancelledSips, color: C.gray400 },
                  { label: 'Failed', value: failedSips, color: C.red500 },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.gray700, flex: 1 }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.gray900 }}>{s.value}</span>
                  </div>
                ))}
                {totalSipMonthlyValue > 0 && (
                  <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 8, marginTop: 4, fontSize: 12, color: C.gray500 }}>
                    Monthly SIP value: <strong style={{ color: C.gray700 }}>{formatCurrency(totalSipMonthlyValue)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            {secLabel('Execution Pulse')}
            <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 18 }}>Orders Overview</div>
            {/* Pipeline */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 18 }}>
              {[
                { label: 'In Progress', value: pendingOrders, color: C.pri600, bg: C.pri100 },
                { label: 'Allocated', value: confirmedOrders, color: C.green500, bg: C.green100 },
                { label: 'Failed', value: failedOrders, color: C.red500, bg: C.red100 },
              ].map((item, idx) => (
                <div key={item.label} style={{ display: 'contents' }}>
                  <div style={{ flex: 1, background: item.bg, borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 10, color: C.gray500, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 4 }}>{item.label}</div>
                  </div>
                  {idx < 2 && <ArrowRight size={14} color={C.gray300} style={{ flexShrink: 0 }} />}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.gray400, borderTop: `1px solid ${C.gray100}`, paddingTop: 10 }}>
              <span>Total orders: <strong style={{ color: C.gray700 }}>{totalOrders}</strong></span>
              <span>Value: <strong style={{ color: C.gray700 }}>{formatCurrency(totalOrderValue)}</strong></span>
            </div>
          </div>
        </div>

        {/* ── 3. Lifecycle Funnel with conversion rates + clickable ── */}
        <div className="pd-overview-subgrid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
          <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
              <div>
                {secLabel('Lifecycle Funnel')}
                <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>Lead to investor</div>
              </div>
              <button type="button" style={S.btnOutline} onClick={() => setSection('clients')}>Open Clients</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {funnelStages.map((stage, index) => {
                const percent = percentOf(stage.count, Math.max(totalClients, 1));
                const prevCount = index > 0 ? funnelStages[index - 1].count : 0;
                const convPct = index > 0 && prevCount > 0 ? Math.round((stage.count / prevCount) * 100) : null;
                return (
                  <div key={stage.label}>
                    {index > 0 && convPct !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 4px 8px', color: convPct > 50 ? C.green500 : convPct > 20 ? C.amber500 : C.red500 }}>
                        <ChevronDown size={12} />
                        <span style={{ fontSize: 11, fontWeight: 700 }}>{convPct}% conversion</span>
                      </div>
                    )}
                    <button type="button" onClick={() => setSection('clients')} style={{ display: 'block', width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.gray900 }}>{stage.label}</span>
                        <span style={{ fontSize: 13, color: C.gray500 }}>{stage.count} · {percent}%</span>
                      </div>
                      <div style={{ height: 10, borderRadius: 999, background: stage.bg, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(percent, stage.count > 0 ? 10 : 0)}%`, borderRadius: 999, background: stage.bar }} />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Conversion Rate + 8. Portfolio Insights ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
              {secLabel('Insight')}
              <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 18 }}>Conversion rate</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 110, height: 110, borderRadius: '50%', background: `conic-gradient(${C.pri600} 0 ${conversionRate}%, ${C.gray100} ${conversionRate}% 100%)`, padding: 10, flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: C.white, border: `1px solid ${C.gray200}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{conversionRate}%</div>
                    <div style={{ fontSize: 10, color: C.gray500 }}>conversion</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.gray900 }}>{activeInvestors} of {totalClients} clients</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: C.gray500, marginTop: 6 }}>
                    Push KYC completion and follow-ups to move prospects into funded investors.
                  </div>
                </div>
              </div>
            </div>

            <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
              {secLabel('Portfolio Insights')}
              {topAmcs.length > 0 ? (
                <>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900, marginBottom: 14 }}>Top AMCs by value</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {topAmcs.map(([amc, val], i) => (
                      <div key={amc} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                        <span style={{ width: 20, height: 20, borderRadius: 6, background: [C.pri100, C.green100, C.indigo100][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: [C.pri700, C.green500, C.indigo700][i], flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ flex: 1, color: C.gray700, fontWeight: 500 }}>{amc}</span>
                        <span style={{ fontWeight: 700, color: C.gray900 }}>{formatCurrency(val)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.gray900, marginBottom: 8 }}>Portfolio composition</div>
                  <p style={{ fontSize: 13, color: C.gray500, margin: '0 0 12px', lineHeight: 1.6 }}>Upload a CAS statement or add holdings manually to see your portfolio breakdown by AMC.</p>
                  <button type="button" style={S.btnOutline} onClick={() => setSection('tracker')}><FolderOpen size={14} /> Open Tracker</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── 7. Client Engagement Calendar ── */}
        <div className="pd-panel" style={{ borderRadius: 18, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              {secLabel('Client Engagement')}
              <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900, marginBottom: 8 }}>Upcoming events</div>
              <p style={{ margin: 0, fontSize: 13, color: C.gray500, lineHeight: 1.6 }}>
                Birthday and anniversary reminders help retain clients 3x longer.
                Add client date-of-birth in the Clients section to enable automated engagement reminders.
              </p>
            </div>
            <button type="button" style={S.btnOutline} onClick={() => setSection('clients')}>
              <Users size={14} /> Go to Clients
            </button>
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

/* ─── Planner Section ────────────────────────────────────────────────── */
function PlannerSection({ profile, showToast }: { profile: PartnerProfile; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [targetMonthly, setTargetMonthly] = useState<number>(100000);
  const [trailPercent, setTrailPercent] = useState<number>(1);
  const [avgSipAmount, setAvgSipAmount] = useState<number>(5000);
  const [currentAum, setCurrentAum] = useState<number>(0);
  const [newSipsPerMonth, setNewSipsPerMonth] = useState<number>(10);

  // Attempt to auto-fetch current AUM from partner holdings
  useEffect(() => {
    (async () => {
      try {
        const res = await partnerApi.getHoldings();
        const fetched = res.data?.totalValue ?? 0;
        if (fetched > 0) setCurrentAum(fetched);
      } catch { /* user can input manually */ }
    })();
  }, []);

  // ── Derived calculations (no state, pure math) ──
  const hasValidInputs = targetMonthly > 0 && trailPercent > 0 && avgSipAmount > 0;
  const targetAum = hasValidInputs ? (targetMonthly * 12) / (trailPercent / 100) : 0;
  const additionalAum = Math.max(0, targetAum - currentAum);
  const progressPct = targetAum > 0 ? Math.min(100, Math.round((currentAum / targetAum) * 100)) : 0;
  const annualPerSip = avgSipAmount * 12;
  const sipsNeeded = annualPerSip > 0 ? Math.ceil(additionalAum / annualPerSip) : 0;
  const estimatedMonths = newSipsPerMonth > 0 ? Math.ceil(sipsNeeded / newSipsPerMonth) : 0;
  const goalReached = currentAum >= targetAum && targetAum > 0;
  const estimatedCurrentIncome = trailPercent > 0 ? Math.round((currentAum * (trailPercent / 100)) / 12) : 0;

  const formatInr = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const formatCompact = (n: number) => {
    if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(1)} L`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  };
  const timeLabel = (m: number) => {
    if (m <= 0) return '0 months';
    const y = Math.floor(m / 12);
    const mo = m % 12;
    if (y === 0) return `${mo} month${mo === 1 ? '' : 's'}`;
    if (mo === 0) return `${y} year${y === 1 ? '' : 's'}`;
    return `${y}y ${mo}m`;
  };

  const inputLabel = { ...S.label, fontSize: 11, fontWeight: 600, color: C.gray500 } as React.CSSProperties;
  const inputStyle = { ...S.input, fontSize: 15, fontWeight: 600, height: 46, background: C.white, borderColor: C.gray200 } as React.CSSProperties;

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 42, height: 42, borderRadius: 14, background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 24px rgba(219,143,0,0.22)` }}>
          <Calculator size={20} color="#111827" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.gray900 }}>Income Planner</h2>
          <p style={{ margin: 0, fontSize: 13, color: C.gray400 }}>Plan your trail commission income growth</p>
        </div>
      </div>

      {/* Input Card */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: C.gray700 }}>Your Assumptions</h3>
        <div className="pd-planner-inputs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={inputLabel}>Target Monthly Income</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: C.gray400, fontWeight: 600 }}>₹</span>
              <input type="number" value={targetMonthly || ''} onChange={e => setTargetMonthly(Math.max(0, Number(e.target.value)))} style={{ ...inputStyle, paddingLeft: 30 }} placeholder="100000" />
            </div>
          </div>
          <div>
            <label style={inputLabel}>Avg SIP Amount (monthly)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: C.gray400, fontWeight: 600 }}>₹</span>
              <input type="number" value={avgSipAmount || ''} onChange={e => setAvgSipAmount(Math.max(0, Number(e.target.value)))} style={{ ...inputStyle, paddingLeft: 30 }} placeholder="5000" />
            </div>
          </div>
          <div>
            <label style={inputLabel}>Trail Commission % (p.a.)</label>
            <div style={{ position: 'relative' }}>
              <input type="number" step="0.1" min="0.01" max="10" value={trailPercent || ''} onChange={e => setTrailPercent(Math.max(0, Number(e.target.value)))} style={{ ...inputStyle, paddingRight: 30 }} placeholder="1" />
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: C.gray400, fontWeight: 600 }}>%</span>
            </div>
          </div>
        </div>
        <div className="pd-planner-inputs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <label style={inputLabel}>Your Current AUM</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: C.gray400, fontWeight: 600 }}>₹</span>
              <input type="number" value={currentAum || ''} onChange={e => setCurrentAum(Math.max(0, Number(e.target.value)))} style={{ ...inputStyle, paddingLeft: 30 }} placeholder="0" />
            </div>
          </div>
          <div>
            <label style={inputLabel}>New SIPs you can add per month</label>
            <input type="number" min="1" max="1000" value={newSipsPerMonth || ''} onChange={e => setNewSipsPerMonth(Math.max(1, Number(e.target.value)))} style={inputStyle} placeholder="10" />
          </div>
        </div>
      </div>

      {!hasValidInputs ? (
        <div style={{ ...S.card, textAlign: 'center', padding: 40, color: C.gray400 }}>
          <Target size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: 15 }}>Enter a valid target income, SIP amount, and trail % to see your plan.</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div style={{ ...S.cardElevated, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.gray500 }}>
                {goalReached ? 'GOAL REACHED' : 'PROGRESS TO GOAL'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: goalReached ? C.green500 : C.pri600 }}>{progressPct}%</span>
            </div>
            <div style={{ width: '100%', height: 12, borderRadius: 10, background: C.gray100, overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', borderRadius: 10, background: goalReached ? `linear-gradient(90deg, ${C.green500}, ${C.green500})` : `linear-gradient(90deg, ${C.pri500}, ${C.pri700})`, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: C.gray400 }}>Current: <strong style={{ color: C.gray700 }}>{formatInr(currentAum)}</strong></span>
              <span style={{ fontSize: 12, color: C.gray400 }}>Target: <strong style={{ color: C.gray700 }}>{formatInr(targetAum)}</strong></span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="pd-planner-results" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            {/* AUM Needed */}
            <div className="pd-stat-card" style={{ ...S.card, textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.green500}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <TrendingUp size={18} color={C.green500} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.gray400, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>AUM Needed</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.gray900, lineHeight: 1.2 }}>₹{formatCompact(targetAum)}</div>
              {!goalReached && additionalAum > 0 && (
                <div style={{ marginTop: 6, fontSize: 11, padding: '3px 8px', borderRadius: 8, background: `${C.pri500}14`, color: C.pri700, fontWeight: 600, display: 'inline-block' }}>
                  +₹{formatCompact(additionalAum)} more
                </div>
              )}
            </div>
            {/* SIPs Needed */}
            <div className="pd-stat-card" style={{ ...S.card, textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.pri500}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Receipt size={18} color={C.pri600} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.gray400, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>New SIPs Needed</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.gray900, lineHeight: 1.2 }}>{goalReached ? 0 : sipsNeeded.toLocaleString('en-IN')}</div>
              <div style={{ marginTop: 6, fontSize: 11, color: C.gray400 }}>at {formatInr(avgSipAmount)}/month each</div>
            </div>
            {/* Timeline */}
            <div className="pd-stat-card" style={{ ...S.card, textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `rgba(99,102,241,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Clock size={18} color="#6366F1" />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.gray400, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Estimated Timeline</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.gray900, lineHeight: 1.2 }}>{goalReached ? '0' : timeLabel(estimatedMonths)}</div>
              <div style={{ marginTop: 6, fontSize: 11, color: C.gray400 }}>at {newSipsPerMonth} new SIPs/month</div>
            </div>
          </div>

          {/* Motivational Summary */}
          <div style={{ ...S.card, borderLeft: `4px solid ${goalReached ? C.green500 : C.pri500}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: goalReached ? `${C.green500}18` : `${C.pri500}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              {goalReached ? <CheckCircle size={18} color={C.green500} /> : <Target size={18} color={C.pri600} />}
            </div>
            <div>
              {goalReached ? (
                <p style={{ margin: 0, fontSize: 14, color: C.gray700, lineHeight: 1.7 }}>
                  <strong style={{ color: C.green500 }}>Congratulations!</strong> Your current AUM of <strong>{formatInr(currentAum)}</strong> already
                  exceeds your target of <strong>{formatInr(targetAum)}</strong>. You are earning an estimated <strong>{formatInr(estimatedCurrentIncome)}/month</strong> in trail commission.
                </p>
              ) : (
                <p style={{ margin: 0, fontSize: 14, color: C.gray700, lineHeight: 1.7 }}>
                  You need <strong style={{ color: C.pri700 }}>{sipsNeeded.toLocaleString('en-IN')} more SIPs</strong> of <strong>{formatInr(avgSipAmount)}</strong> to
                  build an AUM of <strong>{formatInr(targetAum)}</strong> and earn <strong style={{ color: C.pri700 }}>{formatInr(targetMonthly)}/month</strong> in
                  trail commission. At <strong>{newSipsPerMonth} new SIPs per month</strong>, you can reach this goal in
                  approximately <strong style={{ color: '#6366F1' }}>{timeLabel(estimatedMonths)}</strong>.
                  {estimatedCurrentIncome > 0 && (
                    <span> Your current AUM already earns ~<strong>{formatInr(estimatedCurrentIncome)}/month</strong>.</span>
                  )}
                </p>
              )}
            </div>
          </div>
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
