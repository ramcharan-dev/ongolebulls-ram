import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Shield, Users, FileCheck, LogOut, Search, X, Eye,
  Bell, RefreshCw, Plus, Inbox, CheckCircle, Circle, Clock, AlertTriangle,
  Check, XCircle, ChevronRight, ArrowRight, Settings,
} from 'lucide-react';
import { operationsApi } from '../../api/operations/operationsApi';
import type { OpsStats, OpsPartnerVerification, OpsClientKyc, OpsDocumentReview } from '../../types/api';

/* ─── Design Tokens ──────────────────────────────────────────────────── */
function getColors(dark: boolean) {
  return {
    navy900: dark ? '#0B1121' : '#0F172A', navy800: dark ? '#12182B' : '#1E293B', navy700: dark ? '#1E293B' : '#334155',
    pri500: '#3B82F6', pri600: dark ? '#3B82F6' : '#2563EB', pri700: '#1D4ED8', pri100: dark ? 'rgba(59,130,246,0.15)' : '#DBEAFE', pri50: dark ? 'rgba(59,130,246,0.08)' : '#EFF6FF',
    white: dark ? '#12182B' : '#FFFFFF', gray50: dark ? '#0B1121' : '#F9FAFB', gray100: dark ? '#1E293B' : '#F3F4F6', gray200: dark ? '#334155' : '#E5E7EB',
    gray300: dark ? '#475569' : '#D1D5DB', gray400: dark ? '#94A3B8' : '#9CA3AF', gray500: dark ? '#94A3B8' : '#6B7280', gray600: dark ? '#CBD5E1' : '#4B5563',
    gray700: dark ? '#E2E8F0' : '#374151', gray900: dark ? '#F8FAFC' : '#111827',
    green500: dark ? '#34D399' : '#10B981', green100: dark ? 'rgba(16,185,129,0.15)' : '#D1FAE5',
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
    input: { width: '100%', height: 44, border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '0 12px', fontSize: 14, color: C.gray700, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Inter, system-ui, sans-serif', background: C.white } as React.CSSProperties,
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: C.gray500, textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 } as React.CSSProperties,
    btnPrimary: { background: C.pri600, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnOutline: { background: C.white, color: C.gray700, border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '10px 20px', fontWeight: 500, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnDanger: { background: C.red500, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnGhost: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  };
}
let C = getColors(false);
let S = getStyles(C);
const fmt = (d: string | null | undefined) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '—'; } };
const initials = (name: string | null | undefined) => { if (!name) return '?'; const p = name.trim().split(/\s+/); return p.length > 1 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase(); };

function getStageStyles() {
  return {
    LEAD_CREATED: { label: 'Lead Created', bg: C.gray100, color: C.gray600 },
    LINK_SENT: { label: 'Link Sent', bg: C.pri100, color: C.pri700 },
    LINK_OPENED: { label: 'Link Opened', bg: C.purple100, color: C.purple600 },
    KYC_STARTED: { label: 'KYC Started', bg: C.amber100, color: '#92400E' },
    KYC_COMPLETED: { label: 'KYC Completed', bg: C.orange100, color: C.orange700 },
    INVESTMENT_READY: { label: 'Investment Ready', bg: C.indigo100, color: C.indigo700 },
    ACTIVE_INVESTOR: { label: 'Active Investor', bg: C.green100, color: '#065F46' },
  } as Record<string, { label: string; bg: string; color: string }>;
}
const stageBadge = (stage: string) => { const STAGE_STYLES = getStageStyles(); const s = STAGE_STYLES[stage] || { label: stage, bg: C.gray100, color: C.gray600 }; return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: s.bg, color: s.color }}>{s.label}</span>; };
const StatusBadge = ({ active }: { active: boolean }) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: active ? C.green100 : C.amber100, color: active ? '#065F46' : '#92400E' }}>{active ? <CheckCircle size={12} /> : <Clock size={12} />}{active ? 'Active' : 'Pending'}</span>;
const CheckMark = ({ ok }: { ok: boolean }) => ok ? <CheckCircle size={16} color={C.green500} /> : <XCircle size={16} color={C.gray300} />;
const TypeBadge = ({ type }: { type: string }) => <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: C.pri100, color: C.pri700 }}>{type === 'INDIVIDUAL_PARTNER' ? 'Individual' : 'Firm'}</span>;

type Section = 'overview' | 'verification' | 'kyc' | 'documents';
interface Toast { type: 'success' | 'error'; message: string }

const NAV_ITEMS: { key: Section; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { key: 'verification', label: 'Partner Verification', Icon: Shield },
  { key: 'kyc', label: 'Client KYC Queue', Icon: Users },
  { key: 'documents', label: 'Document & Mandate', Icon: FileCheck },
];
const NAV_LABELS: Record<Section, string> = { overview: 'Overview', verification: 'Partner Verification', kyc: 'Client KYC Queue', documents: 'Document & Mandate Flow' };

/* ═══════════════════════════════════════════════════════════════════════ */
export default function OperationsDashboard() {
  const { isDark } = useTheme();
  C = getColors(isDark);
  S = getStyles(C);

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('ob_user') || '{}');
  if (userData.role !== 'OPERATIONS') { navigate('/login'); return null; }

  const [section, setSection] = useState<Section>('overview');
  const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast]);
  const showToast = (type: Toast['type'], message: string) => setToast({ type, message });
  const handleLogout = () => { localStorage.removeItem('ob_user'); navigate('/login'); };

  return (
    <>
      <style>{`
        @keyframes pd-spin { to { transform: rotate(360deg) } }
        @keyframes pd-toastIn { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes pd-slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .pd-nav-item { display: flex; align-items: center; gap: 10px; width: 100%; height: 44px; padding: 0 12px; border: none; border-radius: 8px; background: transparent; color: ${C.gray400}; font-size: 14px; font-weight: 500; cursor: pointer; font-family: Inter, system-ui, sans-serif; border-left: 3px solid transparent; transition: all 0.15s ease; }
        .pd-nav-item:hover { background: ${C.navy800}; color: ${C.white}; }
        .pd-nav-item.active { background: ${C.navy700}; color: ${C.white}; border-left-color: ${C.pri500}; }
        .pd-pill { padding: 6px 16px; border-radius: 20px; border: none; font-size: 13px; font-weight: 500; cursor: pointer; background: ${C.gray100}; color: ${C.gray600}; font-family: Inter, system-ui, sans-serif; transition: all 0.15s ease; }
        .pd-pill:hover { background: ${C.gray200}; }
        .pd-pill.active { background: ${C.pri600}; color: ${C.white}; }
        .pd-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .pd-table thead th { background: ${C.gray50}; color: ${C.gray500}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; padding: 12px 16px; text-align: left; border-bottom: 1px solid ${C.gray100}; }
        .pd-table thead th:first-child { border-radius: 8px 0 0 0; } .pd-table thead th:last-child { border-radius: 0 8px 0 0; }
        .pd-table tbody td { padding: 14px 16px; font-size: 14px; color: ${C.gray700}; border-bottom: 1px solid ${C.gray50}; vertical-align: middle; }
        .pd-table tbody tr { transition: background 0.1s ease; } .pd-table tbody tr:hover { background: ${C.gray50}; }
        .pd-input:focus { border-color: ${C.pri500} !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <aside style={{ width: 220, background: C.navy900, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20 }}>
          <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${C.navy700}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: '-.2px' }}>OngoleBulls Invest</div>
            <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>Operations Dashboard</div>
          </div>
          <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${C.navy700}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{initials(userData.fullName || userData.name)}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.white, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userData.fullName || userData.name || 'Operations'}</div>
                <span style={{ display: 'inline-block', marginTop: 3, padding: '2px 8px', borderRadius: 10, background: C.pri500, color: C.white, fontSize: 10, fontWeight: 600 }}>Operations</span>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <button key={key} type="button" className={`pd-nav-item${section === key ? ' active' : ''}`} onClick={() => setSection(key)}><Icon size={18} /> {label}</button>
            ))}
          </nav>
          <div style={{ padding: '8px 8px 16px', borderTop: `1px solid ${C.navy700}` }}>
            <button type="button" className="pd-nav-item" onClick={handleLogout} style={{ color: C.gray400 }}><LogOut size={16} /> Logout</button>
          </div>
        </aside>

        <div style={{ flex: 1, marginLeft: 220, background: C.gray50, minHeight: '100vh' }}>
          <header style={{ height: 64, background: C.white, borderBottom: `1px solid ${C.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>{NAV_LABELS[section]}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Bell size={18} color={C.gray400} style={{ cursor: 'pointer' }} />
              <div style={{ width: 1, height: 24, background: C.gray200 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.gray700 }}>{userData.fullName || userData.name}</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 12 }}>{initials(userData.fullName || userData.name)}</div>
            </div>
          </header>
          <div style={{ padding: 24 }}>
            {section === 'overview' && <OverviewSection showToast={showToast} />}
            {section === 'verification' && <VerificationSection showToast={showToast} />}
            {section === 'kyc' && <KycQueueSection showToast={showToast} />}
            {section === 'documents' && <DocumentsSection showToast={showToast} />}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: C.white, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderLeft: `4px solid ${toast.type === 'success' ? C.green500 : C.red500}`, animation: 'pd-toastIn 0.3s ease', maxWidth: 360 }}>
          {toast.type === 'success' ? <CheckCircle size={16} color={C.green500} /> : <AlertTriangle size={16} color={C.red500} />}
          <span style={{ fontSize: 14, color: C.gray700 }}>{toast.message}</span>
        </div>
      )}
    </>
  );
}

/* ─── Shared ──────────────────────────────────────────────────────────── */
function Spinner() { return <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div style={{ width: 28, height: 28, border: `3px solid ${C.gray200}`, borderTopColor: C.pri500, borderRadius: '50%', animation: 'pd-spin 0.6s linear infinite' }} /></div>; }
function EmptyState({ text }: { text: string }) { return <div style={{ ...S.card, textAlign: 'center', padding: '48px 24px' }}><Inbox size={40} color={C.gray300} style={{ marginBottom: 12 }} /><p style={{ color: C.gray500, fontSize: 14 }}>{text}</p></div>; }
function ErrorCard({ msg, onRetry }: { msg: string; onRetry: () => void }) { return <div style={{ ...S.card, textAlign: 'center', padding: 32, borderLeft: `4px solid ${C.red500}` }}><p style={{ color: C.red500, marginBottom: 12 }}>{msg}</p><button type="button" style={S.btnOutline} onClick={onRetry}><RefreshCw size={14} /> Retry</button></div>; }
function Detail({ label, value }: { label: string; value: string | null | undefined }) { return <div><span style={S.label}>{label}</span><div style={{ fontWeight: 500, fontSize: 14, color: value ? C.gray900 : C.gray400, marginTop: 2 }}>{value || 'Not provided'}</div></div>; }

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

/* ═══════════════════════════════════════════════════════════════════════ */
/*  OVERVIEW                                                              */
/* ═══════════════════════════════════════════════════════════════════════ */
function OverviewSection({ showToast }: { showToast: (t: 'success' | 'error', m: string) => void }) {
  const [stats, setStats] = useState<OpsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setStats((await operationsApi.getStats()).data); } catch { setError('Failed to load stats'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const activate = async (id: number) => {
    try { await operationsApi.activatePartner(id); showToast('success', 'Partner activated'); load(); }
    catch { showToast('error', 'Activation failed'); }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;
  if (!stats) return null;

  const kpis = [
    { label: 'Pending Activation', value: stats.pendingActivation, Icon: Clock, bg: C.amber100, color: C.amber500 },
    { label: 'Activated Today', value: stats.activatedToday, Icon: CheckCircle, bg: C.green100, color: C.green500 },
    { label: 'KYC Queue', value: stats.clientsInKycQueue, Icon: Users, bg: C.pri100, color: C.pri600 },
    { label: 'Activated This Month', value: stats.activatedThisMonth, Icon: Shield, bg: C.green100, color: C.green500 },
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><k.Icon size={20} color={k.color} /></div>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.gray500, textTransform: 'uppercase', letterSpacing: '.5px' }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: C.gray900 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.gray900, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={18} color={C.amber500} /> Partners Awaiting Activation</h3>
        {stats.urgentPartners.length === 0 ? <p style={{ color: C.gray400, fontSize: 14 }}>No partners pending activation.</p> : (
          <div style={{ ...S.card, padding: 0, overflow: 'hidden', boxShadow: 'none' }}>
            <table className="pd-table">
              <thead><tr><th>Partner</th><th>Type</th><th>ARN</th><th>PAN</th><th>Days Waiting</th><th>Action</th></tr></thead>
              <tbody>
                {stats.urgentPartners.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, color: C.gray900 }}>{p.fullName || p.firmName}</td>
                    <td><TypeBadge type={p.partnerType} /></td>
                    <td><CheckMark ok={p.hasArn} /></td>
                    <td><CheckMark ok={p.hasPan} /></td>
                    <td><span style={{ color: p.daysWaiting > 3 ? C.red500 : C.gray500, fontWeight: 600 }}>{p.daysWaiting}d</span></td>
                    <td><button type="button" style={{ ...S.btnPrimary, padding: '6px 14px', fontSize: 12 }} onClick={() => activate(p.id)}><Check size={12} /> Activate</button></td>
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

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PARTNER VERIFICATION                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */
function VerificationSection({ showToast }: { showToast: (t: 'success' | 'error', m: string) => void }) {
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [partners, setPartners] = useState<OpsPartnerVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<OpsPartnerVerification | null>(null);
  const [confirmActivate, setConfirmActivate] = useState<OpsPartnerVerification | null>(null);
  const [showReject, setShowReject] = useState<OpsPartnerVerification | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acting, setActing] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (s?: string, f?: string) => {
    setLoading(true); setError('');
    try {
      if (tab === 'pending') {
        setPartners((await operationsApi.getPendingPartners()).data);
      } else {
        const params: Record<string, string> = {};
        if (s) params.search = s;
        if (f === 'active' || f === 'pending') params.status = f;
        if (f === 'INDIVIDUAL_PARTNER' || f === 'NON_INDIVIDUAL_PARTNER') params.type = f;
        setPartners((await operationsApi.getAllPartners(params)).data);
      }
    } catch { setError('Failed to load partners'); }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { load(); }, [load]);
  const onSearch = (val: string) => { setSearch(val); if (searchTimer.current) clearTimeout(searchTimer.current); searchTimer.current = setTimeout(() => load(val, filter), 300); };
  const onFilter = (f: string) => { setFilter(f); load(search, f); };

  const activate = async (id: number) => {
    setActing(true);
    try { await operationsApi.activatePartner(id); showToast('success', 'Partner activated successfully'); setConfirmActivate(null); load(); }
    catch { showToast('error', 'Activation failed'); }
    finally { setActing(false); }
  };

  const reject = async (id: number) => {
    if (!rejectReason.trim()) { showToast('error', 'Rejection reason is required'); return; }
    setActing(true);
    try { await operationsApi.rejectPartner(id, rejectReason); showToast('success', 'Partner rejected'); setShowReject(null); setRejectReason(''); load(); }
    catch { showToast('error', 'Rejection failed'); }
    finally { setActing(false); }
  };

  const filters = [{ label: 'All', value: '' }, { label: 'Active', value: 'active' }, { label: 'Pending', value: 'pending' }, { label: 'Individual', value: 'INDIVIDUAL_PARTNER' }, { label: 'Partner Firm', value: 'NON_INDIVIDUAL_PARTNER' }];

  return (
    <>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        <button type="button" className={`pd-pill${tab === 'pending' ? ' active' : ''}`} onClick={() => { setTab('pending'); setSearch(''); setFilter(''); }}>Pending Verification</button>
        <button type="button" className={`pd-pill${tab === 'all' ? ' active' : ''}`} onClick={() => { setTab('all'); setSearch(''); setFilter(''); }}>All Partners</button>
      </div>

      {tab === 'all' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.gray400 }} /><input className="pd-input" placeholder="Search by name, email, ARN..." value={search} onChange={e => onSearch(e.target.value)} style={{ ...S.input, paddingLeft: 36, width: 300 }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>{filters.map(f => <button key={f.value} type="button" className={`pd-pill${filter === f.value ? ' active' : ''}`} onClick={() => onFilter(f.value)}>{f.label}</button>)}</div>
        </>
      )}

      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={() => load()} /> :
       partners.length === 0 ? <EmptyState text={tab === 'pending' ? 'No partners pending verification.' : 'No partners found.'} /> : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table className="pd-table">
            <thead><tr><th>Partner</th><th>Type</th><th>ARN</th><th>PAN</th><th>Bank</th><th>Agreement</th><th>Days</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: '50%', background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri700, fontWeight: 600, fontSize: 12, flexShrink: 0 }}>{initials(p.fullName || p.firmName)}</div><div><div style={{ fontWeight: 500, color: C.gray900 }}>{p.fullName || p.firmName}</div><div style={{ fontSize: 12, color: C.gray400 }}>{p.email}</div></div></div></td>
                  <td><TypeBadge type={p.partnerType} /></td>
                  <td><CheckMark ok={p.hasArn} /></td>
                  <td><CheckMark ok={p.hasPan} /></td>
                  <td><CheckMark ok={p.hasBankDetails} /></td>
                  <td><CheckMark ok={p.hasAgreement} /></td>
                  <td><span style={{ color: p.daysWaiting > 3 ? C.red500 : C.gray500, fontWeight: 600 }}>{p.daysWaiting}d</span></td>
                  <td><StatusBadge active={p.isActivated} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button type="button" style={{ ...S.btnGhost, color: C.pri600 }} title="View" onClick={() => setSelected(p)}><Eye size={16} /></button>
                      {!p.isActivated && <button type="button" style={{ ...S.btnGhost, color: C.green500 }} title="Activate" onClick={() => setConfirmActivate(p)}><Check size={16} /></button>}
                      {!p.isActivated && <button type="button" style={{ ...S.btnGhost, color: C.red500 }} title="Reject" onClick={() => { setShowReject(p); setRejectReason(''); }}><XCircle size={16} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <ModalShell title="Partner Details" onClose={() => setSelected(null)} width={520}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri700, fontWeight: 700, fontSize: 16 }}>{initials(selected.fullName || selected.firmName)}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>{selected.fullName || selected.firmName}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}><TypeBadge type={selected.partnerType} /><StatusBadge active={selected.isActivated} /></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <Detail label="Email" value={selected.email} /><Detail label="Mobile" value={selected.mobileNumber} />
            <Detail label="PAN" value={selected.pan} /><Detail label="ARN" value={selected.arn} />
            <Detail label="EUIN" value={selected.euin} /><Detail label="Registered" value={fmt(selected.createdAt)} />
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: C.gray700, margin: '0 0 12px' }}>Verification Checklist</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[{ label: 'ARN Submitted', ok: selected.hasArn }, { label: 'PAN Submitted', ok: selected.hasPan }, { label: 'Bank Details', ok: selected.hasBankDetails }, { label: 'Agreement', ok: selected.hasAgreement }].map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}><CheckMark ok={c.ok} /> <span style={{ color: c.ok ? C.green500 : C.gray500 }}>{c.label}</span></div>
            ))}
          </div>
          {selected.rejectionReason && (
            <div style={{ background: C.red100, borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.red500 }}>REJECTION REASON</span>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: C.red500 }}>{selected.rejectionReason}</p>
            </div>
          )}
          {selected.partnerBankAccount && (
            <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: C.gray700, margin: '0 0 12px' }}>Bank Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Detail label="Account" value={`****${selected.partnerBankAccount.slice(-4)}`} />
                <Detail label="IFSC" value={selected.partnerIfsc} />
                <Detail label="Bank" value={selected.partnerBankName} />
              </div>
            </div>
          )}
        </ModalShell>
      )}

      {/* Confirm Activate */}
      {confirmActivate && (
        <ModalShell title="Confirm Activation" onClose={() => setConfirmActivate(null)} width={440} footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" style={S.btnOutline} onClick={() => setConfirmActivate(null)}>Cancel</button>
            <button type="button" style={{ ...S.btnPrimary, background: C.green500, opacity: acting ? 0.7 : 1 }} onClick={() => activate(confirmActivate.id)} disabled={acting}>{acting ? 'Activating...' : 'Confirm Activation'}</button>
          </div>
        }>
          <p style={{ color: C.gray700, lineHeight: 1.6 }}>Activate <strong>{confirmActivate.fullName || confirmActivate.firmName}</strong> as {confirmActivate.partnerType === 'INDIVIDUAL_PARTNER' ? 'Individual Partner' : 'Partner Firm'}?</p>
          <p style={{ color: C.gray500, fontSize: 13 }}>This will give them full access to the platform.</p>
        </ModalShell>
      )}

      {/* Reject Modal */}
      {showReject && (
        <ModalShell title="Reject Partner" onClose={() => setShowReject(null)} width={440} footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" style={S.btnOutline} onClick={() => setShowReject(null)}>Cancel</button>
            <button type="button" style={{ ...S.btnDanger, opacity: acting ? 0.7 : 1 }} onClick={() => reject(showReject.id)} disabled={acting}>{acting ? 'Rejecting...' : 'Reject Partner'}</button>
          </div>
        }>
          <p style={{ color: C.gray700, marginBottom: 16 }}>Reject <strong>{showReject.fullName || showReject.firmName}</strong>?</p>
          <label style={S.label}>Rejection Reason *</label>
          <textarea className="pd-input" style={{ ...S.input, height: 80, padding: '10px 12px', resize: 'vertical' as const }} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Provide a reason for rejection..." />
        </ModalShell>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  CLIENT KYC QUEUE                                                      */
/* ═══════════════════════════════════════════════════════════════════════ */
function KycQueueSection({ showToast }: { showToast: (t: 'success' | 'error', m: string) => void }) {
  const [clients, setClients] = useState<OpsClientKyc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [selected, setSelected] = useState<OpsClientKyc | null>(null);

  const load = useCallback(async (stage?: string) => {
    setLoading(true); setError('');
    try { const params: Record<string, string> = {}; if (stage) params.stage = stage; setClients((await operationsApi.getKycQueue(params)).data); }
    catch { setError('Failed to load KYC queue'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const onFilter = (stage: string) => { setStageFilter(stage); load(stage); };

  const FORWARD_STAGES: Record<string, string[]> = {
    LEAD_CREATED: ['LINK_SENT'], LINK_SENT: ['LINK_OPENED'], LINK_OPENED: ['KYC_STARTED'],
    KYC_STARTED: ['KYC_COMPLETED'], KYC_COMPLETED: ['INVESTMENT_READY'], INVESTMENT_READY: ['ACTIVE_INVESTOR'], ACTIVE_INVESTOR: [],
  };

  const updateStage = async (clientId: number, stage: string) => {
    try { await operationsApi.updateClientLifecycle(clientId, stage); showToast('success', 'Stage updated'); load(stageFilter); }
    catch { showToast('error', 'Failed to update stage'); }
  };

  const filters = [
    { label: 'All', value: '' }, { label: 'Lead Created', value: 'LEAD_CREATED' },
    { label: 'KYC Started', value: 'KYC_STARTED' }, { label: 'KYC Completed', value: 'KYC_COMPLETED' },
    { label: 'Investment Ready', value: 'INVESTMENT_READY' },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {filters.map(f => <button key={f.value} type="button" className={`pd-pill${stageFilter === f.value ? ' active' : ''}`} onClick={() => onFilter(f.value)}>{f.label}</button>)}
      </div>

      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={() => load()} /> :
       clients.length === 0 ? <EmptyState text="No clients in KYC queue." /> : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table className="pd-table">
            <thead><tr><th>Client</th><th>Mobile</th><th>Partner</th><th>Stage</th><th>KYC Status</th><th>Days</th><th>Actions</th></tr></thead>
            <tbody>
              {clients.map(c => {
                const fwd = FORWARD_STAGES[c.lifecycleStage] || [];
                return (
                  <tr key={c.id}>
                    <td><div><div style={{ fontWeight: 500, color: C.gray900 }}>{c.fullName}</div><div style={{ fontSize: 12, color: C.gray400 }}>{c.email}</div></div></td>
                    <td>{c.mobileNumber}</td>
                    <td style={{ color: C.gray500 }}>{c.assignedPartnerName || '—'}</td>
                    <td>{stageBadge(c.lifecycleStage)}</td>
                    <td><span style={{ fontSize: 13, color: c.kycStatus === 'VERIFIED' ? C.green500 : c.kycStatus === 'SUBMITTED' ? C.amber500 : C.gray400 }}>{c.kycStatus}</span></td>
                    <td><span style={{ color: c.daysSinceRegistration > 7 ? C.red500 : C.gray500, fontWeight: 600 }}>{c.daysSinceRegistration}d</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {fwd.length > 0 && (
                          <select style={{ ...S.input, width: 'auto', height: 32, fontSize: 12, padding: '0 8px' }} defaultValue="" onChange={e => { if (e.target.value) updateStage(c.id, e.target.value); e.target.value = ''; }}>
                            <option value="" disabled>Advance...</option>
                            {fwd.map(s => <option key={s} value={s}>{STAGE_STYLES[s]?.label || s}</option>)}
                          </select>
                        )}
                        <button type="button" style={{ ...S.btnGhost, color: C.pri600 }} title="View" onClick={() => setSelected(c)}><Eye size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <ModalShell title="Client Details" onClose={() => setSelected(null)} width={440}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Detail label="Name" value={selected.fullName} /><Detail label="Email" value={selected.email} />
            <Detail label="Mobile" value={selected.mobileNumber} /><Detail label="KYC Status" value={selected.kycStatus} />
            <Detail label="Assigned Partner" value={selected.assignedPartnerName} /><Detail label="Registered" value={fmt(selected.createdAt)} />
          </div>
          <div style={{ marginTop: 16 }}><span style={S.label}>Lifecycle Stage</span><div style={{ marginTop: 4 }}>{stageBadge(selected.lifecycleStage)}</div></div>
        </ModalShell>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  DOCUMENT & MANDATE FLOW                                               */
/* ═══════════════════════════════════════════════════════════════════════ */
function DocumentsSection({ showToast }: { showToast: (t: 'success' | 'error', m: string) => void }) {
  const [docs, setDocs] = useState<OpsDocumentReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setDocs((await operationsApi.getPendingDocuments()).data); } catch { setError('Failed to load documents'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const markReviewed = async (id: number, status: string) => {
    try { await operationsApi.markDocumentReviewed(id, status); showToast('success', 'Document status updated'); load(); }
    catch { showToast('error', 'Failed to update document'); }
  };

  const DOC_TYPE_LABELS: Record<string, string> = { ARN_VERIFICATION: 'ARN Verification', PAN_VERIFICATION: 'PAN Verification', BANK_VERIFICATION: 'Bank Verification' };
  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    PENDING: { bg: C.amber100, color: '#92400E' }, UNDER_REVIEW: { bg: C.pri100, color: C.pri700 },
    APPROVED: { bg: C.green100, color: '#065F46' }, REJECTED: { bg: C.red100, color: C.red500 },
  };

  return (
    <>
      <div style={S.card}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.gray900, display: 'flex', alignItems: 'center', gap: 8 }}><FileCheck size={18} color={C.pri600} /> Document Review Queue</h3>
        {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={load} /> :
         docs.length === 0 ? <p style={{ color: C.gray400, fontSize: 14 }}>No documents pending review. Queue is clear.</p> : (
          <div style={{ ...S.card, padding: 0, overflow: 'hidden', boxShadow: 'none' }}>
            <table className="pd-table">
              <thead><tr><th>Partner</th><th>Document Type</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {docs.map(d => {
                  const sc = STATUS_COLORS[d.status] || { bg: C.gray100, color: C.gray600 };
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 500, color: C.gray900 }}>{d.partnerName}</td>
                      <td>{DOC_TYPE_LABELS[d.documentType] || d.documentType}</td>
                      <td style={{ color: C.gray500 }}>{fmt(d.submittedAt)}</td>
                      <td><span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: sc.bg, color: sc.color }}>{d.status}</span></td>
                      <td>
                        {d.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button type="button" style={{ ...S.btnPrimary, padding: '6px 12px', fontSize: 12, background: C.green500 }} onClick={() => markReviewed(d.id, 'APPROVED')}><Check size={12} /> Approve</button>
                            <button type="button" style={{ ...S.btnGhost, color: C.red500 }} onClick={() => markReviewed(d.id, 'REJECTED')}><XCircle size={14} /></button>
                          </div>
                        )}
                        {d.status === 'UNDER_REVIEW' && (
                          <button type="button" style={{ ...S.btnOutline, padding: '6px 12px', fontSize: 12 }} onClick={() => markReviewed(d.id, 'APPROVED')}><Check size={12} /> Approve</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mandate Flow placeholder */}
      <div style={{ ...S.card, marginTop: 24 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 600, color: C.gray900, display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={18} color={C.gray400} /> SIP Mandate Flow</h3>
        <div style={{ background: C.gray50, borderRadius: 8, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.amber100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={20} color={C.amber500} /></div>
          <div>
            <div style={{ fontWeight: 600, color: C.gray700 }}>BSE STAR MF Integration</div>
            <div style={{ fontSize: 13, color: C.gray500, marginTop: 2 }}>SIP Mandate processing will be integrated with BSE STAR MF in the next phase.</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.amber500 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: C.amber500 }}>Pending Setup</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
