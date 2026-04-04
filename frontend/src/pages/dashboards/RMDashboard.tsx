import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Users, BarChart3, ClipboardList,
  LogOut, Search, X, Eye, Bell, RefreshCw, Plus, Inbox,
  CheckCircle, Circle, Clock, AlertTriangle, Mail, Trash2,
  RotateCcw, ChevronRight, ArrowRight, Calendar,
} from 'lucide-react';
import { rmApi } from '../../api/rm/rmApi';
import type { RMStats, RMPartnerSummary, RMPerformance, RMTask } from '../../types/api';

/* ─── Design Tokens ──────────────────────────────────────────────────── */
function getColors(dark: boolean) {
  return {
    navy900: dark ? '#0B1121' : '#0F172A', navy800: dark ? '#12182B' : '#1E293B', navy700: dark ? '#1E293B' : '#334155',
    pri500: '#3B82F6', pri600: dark ? '#3B82F6' : '#2563EB', pri700: '#1D4ED8', pri100: dark ? 'rgba(59,130,246,0.15)' : '#DBEAFE', pri50: dark ? 'rgba(59,130,246,0.08)' : '#EFF6FF',
    white: dark ? '#12182B' : '#FFFFFF', gray50: dark ? '#0B1121' : '#F9FAFB', gray100: dark ? '#1E293B' : '#F3F4F6', gray200: dark ? '#334155' : '#E5E7EB',
    gray300: dark ? '#475569' : '#D1D5DB', gray400: dark ? '#94A3B8' : '#9CA3AF', gray500: dark ? '#94A3B8' : '#6B7280', gray600: dark ? '#CBD5E1' : '#4B5563',
    gray700: dark ? '#E2E8F0' : '#374151', gray900: dark ? '#F8FAFC' : '#111827',
    green500: dark ? '#34D399' : '#10B981', green100: dark ? 'rgba(16,185,129,0.15)' : '#D1FAE5',
    amber500: '#F59E0B', amber100: dark ? 'rgba(245,158,11,0.15)' : '#FEF3C7',
    red500: '#EF4444', red100: dark ? 'rgba(239,68,68,0.15)' : '#FEE2E2',
  };
}
function getStyles(C: ReturnType<typeof getColors>) {
  return {
    card: { background: C.white, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', padding: 20 } as React.CSSProperties,
    input: { width: '100%', height: 44, border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '0 12px', fontSize: 14, color: C.gray700, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Inter, system-ui, sans-serif', background: C.white } as React.CSSProperties,
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: C.gray500, textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 } as React.CSSProperties,
    btnPrimary: { background: C.pri600, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnOutline: { background: C.white, color: C.gray700, border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '10px 20px', fontWeight: 500, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
    btnGhost: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  };
}
let C = getColors(false);
let S = getStyles(C);

const fmt = (d: string | null | undefined) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '—'; } };
const initials = (name: string | null | undefined) => { if (!name) return '?'; const p = name.trim().split(/\s+/); return p.length > 1 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase(); };
const daysAgo = (d: string | null | undefined) => { if (!d) return ''; const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000); return diff === 0 ? 'today' : diff === 1 ? '1 day ago' : `${diff} days ago`; };

type Section = 'overview' | 'partners' | 'performance' | 'tasks';
interface Toast { type: 'success' | 'error'; message: string }

const NAV_ITEMS: { key: Section; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { key: 'partners', label: 'My Partners', Icon: Users },
  { key: 'performance', label: 'Business Performance', Icon: BarChart3 },
  { key: 'tasks', label: 'Follow-ups & Tasks', Icon: ClipboardList },
];
const NAV_LABELS: Record<Section, string> = { overview: 'Overview', partners: 'My Partners', performance: 'Business Performance', tasks: 'Follow-ups & Tasks' };

/* ═══════════════════════════════════════════════════════════════════════ */
export default function RMDashboard() {
  const { isDark, toggleTheme } = useTheme();
  C = getColors(isDark);
  S = getStyles(C);

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('ob_user') || '{}');
  if (userData.role !== 'RELATIONSHIP_MANAGER') { navigate('/login'); return null; }

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
        {/* SIDEBAR */}
        <aside style={{ width: 220, background: C.navy900, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20 }}>
          <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${C.navy700}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: '-.2px' }}>OngoleBulls Invest</div>
            <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>RM Dashboard</div>
          </div>
          <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${C.navy700}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{initials(userData.fullName || userData.name)}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.white, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userData.fullName || userData.name || 'RM'}</div>
                <span style={{ display: 'inline-block', marginTop: 3, padding: '2px 8px', borderRadius: 10, background: C.pri500, color: C.white, fontSize: 10, fontWeight: 600 }}>Relationship Manager</span>
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

        {/* MAIN */}
        <div style={{ flex: 1, marginLeft: 220, background: C.gray50, minHeight: '100vh' }}>
          <header style={{ height: 64, background: C.white, borderBottom: `1px solid ${C.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>{NAV_LABELS[section]}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ background: 'none', border: `1px solid ${C.gray200}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 18, color: C.gray700, display: 'flex', alignItems: 'center', transition: 'all 0.2s ease' }}>{isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}</button>
              <Bell size={18} color={C.gray400} style={{ cursor: 'pointer' }} />
              <div style={{ width: 1, height: 24, background: C.gray200 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.gray700 }}>{userData.fullName || userData.name}</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${C.pri500}, ${C.pri700})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 700, fontSize: 12 }}>{initials(userData.fullName || userData.name)}</div>
            </div>
          </header>
          <div style={{ padding: 24 }}>
            {section === 'overview' && <OverviewSection showToast={showToast} />}
            {section === 'partners' && <PartnersSection showToast={showToast} />}
            {section === 'performance' && <PerformanceSection />}
            {section === 'tasks' && <TasksSection showToast={showToast} />}
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
function StatusBadge({ active }: { active: boolean }) { return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: active ? C.green100 : C.amber100, color: active ? '#065F46' : '#92400E' }}>{active ? <CheckCircle size={12} /> : <Clock size={12} />}{active ? 'Active' : 'Pending'}</span>; }
function TypeBadge({ type }: { type: string }) { return <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: C.pri100, color: C.pri700 }}>{type === 'INDIVIDUAL_PARTNER' ? 'Individual' : 'Firm'}</span>; }

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

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return <div><span style={S.label}>{label}</span><div style={{ fontWeight: 500, fontSize: 14, color: value ? C.gray900 : C.gray400, marginTop: 2 }}>{value || 'Not provided'}</div></div>;
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  OVERVIEW                                                              */
/* ═══════════════════════════════════════════════════════════════════════ */
function OverviewSection({ showToast }: { showToast: (t: 'success' | 'error', m: string) => void }) {
  const [stats, setStats] = useState<RMStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const res = await rmApi.getStats(); setStats(res.data); } catch { setError('Failed to load stats'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;
  if (!stats) return null;

  const kpis = [
    { label: 'Total Partners', value: stats.totalPartners, Icon: Users, bg: C.pri100, color: C.pri600 },
    { label: 'Active Partners', value: stats.activePartners, Icon: CheckCircle, bg: C.green100, color: C.green500 },
    { label: 'Pending Activation', value: stats.pendingActivation, Icon: Clock, bg: C.amber100, color: C.amber500 },
    { label: 'Total Clients', value: stats.totalClients, Icon: Users, bg: C.pri100, color: C.pri600 },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Pending Activation */}
        <div style={S.card}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.gray900, display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={18} color={C.amber500} /> Partners Pending Activation</h3>
          {stats.pendingPartners.length === 0 ? <p style={{ color: C.gray400, fontSize: 14 }}>No pending partners</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.pendingPartners.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.gray100}` }}>
                  <div>
                    <div style={{ fontWeight: 500, color: C.gray900, fontSize: 14 }}>{p.fullName || p.firmName}</div>
                    <div style={{ fontSize: 12, color: C.gray400 }}><TypeBadge type={p.partnerType} /> <span style={{ marginLeft: 6 }}>Registered {daysAgo(p.createdAt)}</span></div>
                  </div>
                  <ChevronRight size={16} color={C.gray400} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div style={S.card}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.gray900, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} color={C.pri600} /> Recent Partner Registrations</h3>
          {stats.recentPartners.length === 0 ? <p style={{ color: C.gray400, fontSize: 14 }}>No partners assigned yet</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.recentPartners.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.gray100}` }}>
                  <div>
                    <div style={{ fontWeight: 500, color: C.gray900, fontSize: 14 }}>{p.fullName || p.firmName}</div>
                    <div style={{ fontSize: 12, color: C.gray400, display: 'flex', alignItems: 'center', gap: 6 }}><TypeBadge type={p.partnerType} />{p.arn && <span>ARN: {p.arn}</span>}<span>{fmt(p.createdAt)}</span></div>
                  </div>
                  <StatusBadge active={p.isActivated} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MY PARTNERS                                                           */
/* ═══════════════════════════════════════════════════════════════════════ */
function PartnersSection({ showToast }: { showToast: (t: 'success' | 'error', m: string) => void }) {
  const [partners, setPartners] = useState<RMPartnerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<RMPartnerSummary | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (s?: string, f?: string) => {
    setLoading(true); setError('');
    try {
      const params: Record<string, string> = {};
      if (s) params.search = s;
      if (f === 'active' || f === 'pending') params.status = f;
      if (f === 'INDIVIDUAL_PARTNER' || f === 'NON_INDIVIDUAL_PARTNER') params.type = f;
      const res = await rmApi.getPartners(params);
      setPartners(res.data);
    } catch { setError('Failed to load partners'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const onSearch = (val: string) => { setSearch(val); if (searchTimer.current) clearTimeout(searchTimer.current); searchTimer.current = setTimeout(() => load(val, filter), 300); };
  const onFilter = (f: string) => { setFilter(f); load(search, f); };

  const filters = [
    { label: 'All', value: '' }, { label: 'Active', value: 'active' }, { label: 'Pending', value: 'pending' },
    { label: 'Individual', value: 'INDIVIDUAL_PARTNER' }, { label: 'Partner Firm', value: 'NON_INDIVIDUAL_PARTNER' },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.gray400 }} /><input className="pd-input" placeholder="Search by name, email, ARN..." value={search} onChange={e => onSearch(e.target.value)} style={{ ...S.input, paddingLeft: 36, width: 300 }} /></div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>{filters.map(f => <button key={f.value} type="button" className={`pd-pill${filter === f.value ? ' active' : ''}`} onClick={() => onFilter(f.value)}>{f.label}</button>)}</div>

      {loading ? <Spinner /> : error ? <ErrorCard msg={error} onRetry={() => load()} /> :
       partners.length === 0 ? <EmptyState text="No partners found." /> : (
        <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
          <table className="pd-table">
            <thead><tr><th>Partner</th><th>Type</th><th>ARN</th><th>Mobile</th><th>Clients</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: '50%', background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri700, fontWeight: 600, fontSize: 12, flexShrink: 0 }}>{initials(p.fullName || p.firmName)}</div><div><div style={{ fontWeight: 500, color: C.gray900 }}>{p.fullName || p.firmName}</div><div style={{ fontSize: 12, color: C.gray400 }}>{p.email}</div></div></div></td>
                  <td><TypeBadge type={p.partnerType} /></td>
                  <td style={{ color: C.gray500 }}>{p.arn || '—'}</td>
                  <td>{p.mobileNumber}</td>
                  <td style={{ fontWeight: 600 }}>{p.clientCount}</td>
                  <td style={{ color: C.gray500 }}>{fmt(p.createdAt)}</td>
                  <td><StatusBadge active={p.isActivated} /></td>
                  <td><button type="button" style={{ ...S.btnGhost, color: C.pri600 }} title="View Details" onClick={() => setSelected(p)}><Eye size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Partner Detail Drawer */}
      {selected && (
        <ModalShell title="Partner Details" onClose={() => setSelected(null)} width={500}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.pri100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.pri700, fontWeight: 700, fontSize: 16 }}>{initials(selected.fullName || selected.firmName)}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.gray900 }}>{selected.fullName || selected.firmName}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}><TypeBadge type={selected.partnerType} /><StatusBadge active={selected.isActivated} /></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <Detail label="Email" value={selected.email} />
            <Detail label="Mobile" value={selected.mobileNumber} />
            <Detail label="PAN" value={selected.pan} />
            <Detail label="ARN" value={selected.arn} />
            <Detail label="EUIN" value={selected.euin} />
            <Detail label="Clients" value={String(selected.clientCount)} />
          </div>
          {(selected.partnerBankAccount || selected.partnerIfsc || selected.partnerBankName) && (
            <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 16, marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: C.gray700 }}>Bank Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Detail label="Account" value={selected.partnerBankAccount ? `****${selected.partnerBankAccount.slice(-4)}` : null} />
                <Detail label="IFSC" value={selected.partnerIfsc} />
                <Detail label="Bank" value={selected.partnerBankName} />
              </div>
            </div>
          )}
          <Detail label="Registered On" value={fmt(selected.createdAt)} />
          <div style={{ marginTop: 16 }}>
            <a href={`mailto:${selected.email}`} style={{ ...S.btnOutline, textDecoration: 'none' }}><Mail size={14} /> Message Partner</a>
          </div>
        </ModalShell>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  BUSINESS PERFORMANCE                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */
function PerformanceSection() {
  const [data, setData] = useState<RMPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const res = await rmApi.getPerformance(); setData(res.data); } catch { setError('Failed to load performance data'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;
  if (!data) return null;

  const STAGE_LABELS: Record<string, string> = { LEAD_CREATED: 'Lead Created', LINK_SENT: 'Link Sent', LINK_OPENED: 'Link Opened', KYC_STARTED: 'KYC Started', KYC_COMPLETED: 'KYC Completed', INVESTMENT_READY: 'Investment Ready', ACTIVE_INVESTOR: 'Active Investor' };
  const maxStageCount = Math.max(...Object.values(data.clientsByStage), 1);

  return (
    <>
      {/* Partners summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Users size={16} color={C.pri600} /><span style={S.label}>Total Clients</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{data.totalClients}</div></div>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><CheckCircle size={16} color={C.green500} /><span style={S.label}>Active Partners</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{data.activePartners}</div></div>
        <div style={S.card}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Clock size={16} color={C.amber500} /><span style={S.label}>Pending Partners</span></div><div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{data.pendingPartners}</div></div>
      </div>

      {/* Clients by lifecycle stage */}
      <div style={{ ...S.card, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: C.gray900 }}>Clients by Lifecycle Stage</h3>
        {data.totalClients === 0 ? <p style={{ color: C.gray400, fontSize: 14 }}>No client data yet. Partners need to onboard clients first.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(data.clientsByStage).map(([stage, count]) => (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 130, fontSize: 13, color: C.gray600, flexShrink: 0 }}>{STAGE_LABELS[stage] || stage}</div>
                <div style={{ flex: 1, height: 24, background: C.gray100, borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / maxStageCount) * 100}%`, background: stage === 'ACTIVE_INVESTOR' ? C.green500 : C.pri500, borderRadius: 6, minWidth: count > 0 ? 24 : 0, transition: 'width 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                    {count > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: C.white }}>{count}</span>}
                  </div>
                </div>
                <div style={{ width: 32, textAlign: 'right', fontSize: 13, fontWeight: 600, color: C.gray700 }}>{count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top partners */}
      <div style={S.card}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: C.gray900 }}>Top Partners by Client Count</h3>
        {data.topPartners.length === 0 ? <p style={{ color: C.gray400, fontSize: 14 }}>No partner data to rank yet.</p> : (
          <div style={{ ...S.card, padding: 0, overflow: 'hidden', boxShadow: 'none' }}>
            <table className="pd-table">
              <thead><tr><th>Rank</th><th>Partner</th><th>Clients</th><th>Active Investors</th><th>Status</th></tr></thead>
              <tbody>
                {data.topPartners.map(p => (
                  <tr key={p.rank}>
                    <td><span style={{ width: 28, height: 28, borderRadius: '50%', background: p.rank <= 3 ? C.pri100 : C.gray100, color: p.rank <= 3 ? C.pri700 : C.gray500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{p.rank}</span></td>
                    <td style={{ fontWeight: 500, color: C.gray900 }}>{p.partnerName}</td>
                    <td style={{ fontWeight: 600 }}>{p.clients}</td>
                    <td>{p.activeInvestors}</td>
                    <td><StatusBadge active={p.isActivated} /></td>
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
/*  FOLLOW-UPS & TASKS                                                    */
/* ═══════════════════════════════════════════════════════════════════════ */
function TasksSection({ showToast }: { showToast: (t: 'success' | 'error', m: string) => void }) {
  const [pending, setPending] = useState<RMTask[]>([]);
  const [completed, setCompleted] = useState<RMTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [partners, setPartners] = useState<RMPartnerSummary[]>([]);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [tasksRes, partnersRes] = await Promise.all([rmApi.getTasks(), rmApi.getPartners()]);
      setPending(tasksRes.data.pending || []);
      setCompleted(tasksRes.data.completed || []);
      setPartners(partnersRes.data || []);
    } catch { setError('Failed to load tasks'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const markComplete = async (id: number) => { try { await rmApi.completeTask(id); showToast('success', 'Task completed'); load(); } catch { showToast('error', 'Failed to complete task'); } };
  const reopen = async (id: number) => { try { await rmApi.reopenTask(id); showToast('success', 'Task reopened'); load(); } catch { showToast('error', 'Failed to reopen task'); } };
  const remove = async (id: number) => { try { await rmApi.deleteTask(id); showToast('success', 'Task deleted'); load(); } catch { showToast('error', 'Failed to delete task'); } };

  const priorityStyle = (p: string) => {
    if (p === 'HIGH') return { background: C.red100, color: C.red500 };
    if (p === 'MEDIUM') return { background: C.amber100, color: '#92400E' };
    return { background: C.pri100, color: C.pri700 };
  };

  const isOverdue = (d: string | null) => { if (!d) return false; return new Date(d) < new Date(new Date().toDateString()); };

  if (loading) return <Spinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button type="button" style={S.btnPrimary} onClick={() => setShowCreate(true)}><Plus size={14} /> Add Task</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* To Do */}
        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: C.gray900, display: 'flex', alignItems: 'center', gap: 8 }}><Circle size={16} color={C.amber500} /> To Do <span style={{ fontSize: 12, fontWeight: 500, color: C.gray400 }}>({pending.length})</span></h3>
          {pending.length === 0 ? <div style={{ ...S.card, textAlign: 'center', padding: 32 }}><p style={{ color: C.gray400, fontSize: 14 }}>No pending tasks. You're all caught up!</p></div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.map(t => (
                <div key={t.id} style={{ ...S.card, borderLeft: `4px solid ${t.priority === 'HIGH' ? C.red500 : t.priority === 'MEDIUM' ? C.amber500 : C.pri500}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.gray900 }}>{t.title}</div>
                    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, ...priorityStyle(t.priority) }}>{t.priority}</span>
                  </div>
                  {t.description && <p style={{ fontSize: 13, color: C.gray500, margin: '0 0 8px' }}>{t.description}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: C.gray400, marginBottom: 10 }}>
                    {t.dueDate && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: isOverdue(t.dueDate) ? C.red500 : C.gray400 }}><Calendar size={12} /> {fmt(t.dueDate)}{isOverdue(t.dueDate) && ' (overdue)'}</span>}
                    {t.relatedPartnerName && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {t.relatedPartnerName}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" style={{ ...S.btnPrimary, padding: '6px 12px', fontSize: 12 }} onClick={() => markComplete(t.id)}><CheckCircle size={12} /> Complete</button>
                    <button type="button" style={{ ...S.btnGhost, color: C.red500 }} onClick={() => remove(t.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: C.gray900, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={16} color={C.green500} /> Completed <span style={{ fontSize: 12, fontWeight: 500, color: C.gray400 }}>({completed.length})</span></h3>
          {completed.length === 0 ? <div style={{ ...S.card, textAlign: 'center', padding: 32 }}><p style={{ color: C.gray400, fontSize: 14 }}>No completed tasks yet.</p></div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {completed.map(t => (
                <div key={t.id} style={{ ...S.card, opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: C.gray500, textDecoration: 'line-through' }}>{t.title}</div>
                    <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, ...priorityStyle(t.priority) }}>{t.priority}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.gray400, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    {t.completedAt && <span>Completed {fmt(t.completedAt)}</span>}
                    {t.relatedPartnerName && <span>{t.relatedPartnerName}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" style={{ ...S.btnOutline, padding: '6px 12px', fontSize: 12 }} onClick={() => reopen(t.id)}><RotateCcw size={12} /> Reopen</button>
                    <button type="button" style={{ ...S.btnGhost, color: C.red500 }} onClick={() => remove(t.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreate && <CreateTaskModal partners={partners} onClose={() => setShowCreate(false)} showToast={showToast} onCreated={() => { setShowCreate(false); load(); }} />}
    </>
  );
}

function CreateTaskModal({ partners, onClose, showToast, onCreated }: { partners: RMPartnerSummary[]; onClose: () => void; showToast: (t: 'success' | 'error', m: string) => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', relatedPartnerId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    try {
      await rmApi.createTask({
        title: form.title, description: form.description || undefined,
        priority: form.priority, dueDate: form.dueDate || undefined,
        relatedPartnerId: form.relatedPartnerId ? Number(form.relatedPartnerId) : undefined,
      });
      showToast('success', 'Task created');
      onCreated();
    } catch (err: any) { setError(err?.response?.data?.error || 'Failed to create task'); }
    finally { setSaving(false); }
  };

  return (
    <ModalShell title="Create Task" onClose={onClose} width={500} footer={
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button type="button" style={S.btnOutline} onClick={onClose}>Cancel</button>
        <button type="button" style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={submit} disabled={saving}>{saving ? 'Creating...' : 'Create Task'}</button>
      </div>
    }>
      {error && <div style={{ background: C.red100, color: C.red500, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={14} /> {error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={S.label}>Title *</label><input className="pd-input" style={S.input} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" /></div>
        <div><label style={S.label}>Description</label><textarea className="pd-input" style={{ ...S.input, height: 80, padding: '10px 12px', resize: 'vertical' as const }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Additional details..." /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={S.label}>Priority</label>
            <select style={S.input} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div><label style={S.label}>Due Date</label><input className="pd-input" type="date" style={S.input} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} /></div>
        </div>
        <div>
          <label style={S.label}>Related Partner (optional)</label>
          <select style={S.input} value={form.relatedPartnerId} onChange={e => setForm(p => ({ ...p, relatedPartnerId: e.target.value }))}>
            <option value="">None</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.fullName || p.firmName} ({p.email})</option>)}
          </select>
        </div>
      </div>
    </ModalShell>
  );
}
