import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Handshake, UserCheck,
  LogOut, Plus, RefreshCw, Search, Eye, KeyRound, X,
  BarChart3, GitBranch, Shield, ChevronRight, Check,
} from 'lucide-react';
import { adminUserApi } from '../../api/adminUserApi';
import type { UserSummary, AdminStats, PartnerSummary, ClientSummary, PlatformStats, ReferralTreeEntry, PartnerDetail, RoleUsers, UserPermissions, PermissionRow } from '../../types/api';
import { useTheme } from '../../context/ThemeContext';
import '../../pages/admin-portal/admin-portal.css';

/* ─── Role display mapping ───────────────────────────────────────────────── */
const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  RELATIONSHIP_MANAGER: 'Relationship Manager',
  OPERATIONS: 'Operations',
  COMPLIANCE: 'Compliance',
  FINANCE: 'Finance',
  SUPPORT: 'Support',
  INDIVIDUAL_PARTNER: 'Individual Partner',
  NON_INDIVIDUAL_PARTNER: 'Non-Individual Partner',
  USER: 'Client',
};

const ROLE_OPTIONS = [
  { label: 'Relationship Manager', value: 'RELATIONSHIP_MANAGER' },
  { label: 'Operations', value: 'OPERATIONS' },
  { label: 'Compliance', value: 'COMPLIANCE' },
  { label: 'Finance', value: 'FINANCE' },
  { label: 'Support', value: 'SUPPORT' },
  { label: 'Admin', value: 'ADMIN' },
] as const;

const PARTNER_FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Individual', value: 'INDIVIDUAL_PARTNER' },
  { label: 'Non-Individual', value: 'NON_INDIVIDUAL_PARTNER' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
];

type Section = 'overview' | 'users' | 'partners' | 'clients' | 'platformStats' | 'referralTree' | 'permissions';

interface CreateForm { name: string; email: string; role: string; password: string }
interface ResetForm { userId: number; userName: string; newPassword: string }
interface Toast { type: 'success' | 'error'; message: string }

const EMPTY_FORM: CreateForm = { name: '', email: '', role: '', password: '' };

const fmt = (d: string | null | undefined) => {
  if (!d) return '-';
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return '-'; }
};

const isActive = (u: { isActivated?: boolean; activated?: boolean }) =>
  u.isActivated === true || u.activated === true;

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  /* Auth guard */
  const userData = JSON.parse(localStorage.getItem('ob_user') || '{}');
  if (userData.role !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  const { isDark, toggleTheme } = useTheme();

  const [section, setSection] = useState<Section>('overview');
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type: Toast['type'], message: string) => setToast({ type, message });

  const handleLogout = () => {
    localStorage.removeItem('ob_user');
    navigate('/login');
  };

  const NAV: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { key: 'users', label: 'Internal Users', icon: <Users size={16} /> },
    { key: 'partners', label: 'Partners', icon: <Handshake size={16} /> },
    { key: 'clients', label: 'Clients', icon: <UserCheck size={16} /> },
    { key: 'platformStats', label: 'Platform Stats', icon: <BarChart3 size={16} /> },
    { key: 'referralTree', label: 'Referral Tree', icon: <GitBranch size={16} /> },
    { key: 'permissions', label: 'Roles & Permissions', icon: <Shield size={16} /> },
  ];

  return (
    <div className="ap-root" data-theme={isDark ? 'dark' : 'light'}>
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="ap-sidebar">
        <div className="ap-brand">
          <h1>OngoleBulls Invest</h1>
          <p>Admin Dashboard</p>
        </div>
        <nav className="ap-nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              className={`ap-nav-link${section === n.key ? ' active' : ''}`}
              onClick={() => setSection(n.key)}
            >
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <div className="ap-sidebar-footer">
          <button type="button" className="ap-nav-link" onClick={handleLogout} style={{ width: '100%' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────── */}
      <div className="ap-main">
        <header className="ap-topbar">
          <span className="ap-topbar-title">Admin Dashboard</span>
          <div className="ap-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ background: 'none', border: '1px solid', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 18, color: isDark ? '#f1f5f9' : '#374151', display: 'flex', alignItems: 'center', transition: 'all 0.2s ease' }}>{isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}</button>
            <span className="ap-admin-chip">{userData.fullName || userData.name || 'Admin'}</span>
          </div>
        </header>
        <div className="ap-content">
          {section === 'overview' && <OverviewSection showToast={showToast} />}
          {section === 'users' && <InternalUsersSection showToast={showToast} />}
          {section === 'partners' && <PartnersSection showToast={showToast} />}
          {section === 'clients' && <ClientsSection showToast={showToast} />}
          {section === 'platformStats' && <PlatformStatsSection showToast={showToast} />}
          {section === 'referralTree' && <ReferralTreeSection showToast={showToast} />}
          {section === 'permissions' && <PermissionsSection showToast={showToast} />}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`ap-toast ${toast.type === 'success' ? 'ap-toast-success' : 'ap-toast-error'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  OVERVIEW                                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function OverviewSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminUserApi.getStats();
      setStats(res.data);
    } catch {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;
  if (error) return (
    <div className="ap-empty">
      <p>{error}</p>
      <button type="button" className="ap-btn ap-btn-primary" onClick={load} style={{ marginTop: 10 }}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
  if (!stats) return null;

  const kpis = [
    { label: 'Total Partners', value: stats.totalPartners, color: 'blue', icon: <Handshake size={18} /> },
    { label: 'Active Partners', value: stats.activePartners, color: 'green', icon: <UserCheck size={18} /> },
    { label: 'Pending Activation', value: stats.pendingActivation, color: 'amber', icon: <RefreshCw size={18} /> },
    { label: 'Total Clients', value: stats.totalClients, color: 'purple', icon: <Users size={18} /> },
  ];

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <LayoutDashboard size={20} />
          <div>
            <h1>Overview</h1>
            <p className="ap-page-subtitle">Platform summary at a glance</p>
          </div>
        </div>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="ap-grid ap-grid-4" style={{ marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} className="ap-card">
            <div className="ap-card-body">
              <div className="ap-kpi">
                <div>
                  <p className="ap-kpi-label">{k.label}</p>
                  <p className="ap-kpi-value">{k.value}</p>
                </div>
                <div className={`ap-kpi-icon ${k.color}`}>{k.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-grid ap-grid-2">
        <div>
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>Recently Registered Partners</h3>
          <MiniTable
            columns={['Name', 'Type', 'ARN', 'Registered', 'Status']}
            rows={stats.recentPartners}
            renderRow={(u) => (
              <tr key={u.id}>
                <td>{u.name || '-'}</td>
                <td>{ROLE_LABELS[u.role] || u.role}</td>
                <td>{(u as any).arn || '-'}</td>
                <td>{fmt(u.createdAt)}</td>
                <td><StatusBadge active={isActive(u)} /></td>
              </tr>
            )}
            emptyMsg="No partners registered yet"
          />
        </div>
        <div>
          <h3 style={{ fontSize: 15, marginBottom: 10 }}>Recently Created Internal Users</h3>
          <MiniTable
            columns={['Name', 'Role', 'Created', 'Status']}
            rows={stats.recentInternalUsers}
            renderRow={(u) => (
              <tr key={u.id}>
                <td>{u.name || '-'}</td>
                <td>{ROLE_LABELS[u.role] || u.role}</td>
                <td>{fmt(u.createdAt)}</td>
                <td><StatusBadge active={isActive(u)} /></td>
              </tr>
            )}
            emptyMsg="No internal users created yet"
          />
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  INTERNAL USERS                                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */
function InternalUsersSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [resetModal, setResetModal] = useState<ResetForm | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminUserApi.getUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load internal users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openModal = () => { setForm(EMPTY_FORM); setFormError(''); setModalOpen(true); };

  const handleCreate = async () => {
    setFormError('');
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    if (!form.email.trim()) { setFormError('Email is required'); return; }
    if (!form.role) { setFormError('Role is required'); return; }
    if (!form.password || form.password.length < 8) { setFormError('Password must be at least 8 characters'); return; }
    setFormLoading(true);
    try {
      await adminUserApi.createUser(form);
      setModalOpen(false);
      showToast('success', 'User created successfully');
      load();
    } catch (err: any) {
      setFormError(err.userMessage || 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    setActionLoading(id);
    try {
      await adminUserApi.toggleStatus(id);
      load();
    } catch {
      showToast('error', 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async () => {
    if (!resetModal || !resetModal.newPassword || resetModal.newPassword.length < 8) return;
    setResetLoading(true);
    try {
      await adminUserApi.resetPassword(resetModal.userId, resetModal.newPassword);
      showToast('success', 'Password reset successfully');
      setResetModal(null);
    } catch {
      showToast('error', 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Users size={20} />
          <div>
            <h1>Internal Users</h1>
            <p className="ap-page-subtitle">Create and manage internal platform users</p>
          </div>
        </div>
        <div className="ap-actions">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
          <button type="button" className="ap-btn ap-btn-primary" onClick={openModal}><Plus size={14} /> Create User</button>
        </div>
      </div>

      {error ? (
        <div className="ap-empty">
          <p>{error}</p>
          <button type="button" className="ap-btn ap-btn-primary" onClick={load} style={{ marginTop: 10 }}><RefreshCw size={14} /> Retry</button>
        </div>
      ) : (
        <div className="ap-table-wrap">
          <div className="ap-table-scroll">
            <table className="ap-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created On</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
                ) : users.length ? (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name || '-'}</td>
                      <td>{u.email || '-'}</td>
                      <td>{ROLE_LABELS[u.role] || u.role}</td>
                      <td><StatusBadge active={isActive(u)} /></td>
                      <td>{fmt(u.createdAt)}</td>
                      <td>
                        <div className="ap-actions">
                          <button
                            type="button"
                            className={`ap-btn ${isActive(u) ? 'ap-btn-danger' : 'ap-btn-primary'}`}
                            onClick={() => handleToggle(u.id)}
                            disabled={actionLoading === u.id}
                            style={{ fontSize: 12, padding: '5px 10px' }}
                          >
                            {isActive(u) ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className="ap-btn ap-btn-secondary"
                            onClick={() => setResetModal({ userId: u.id, userName: u.name, newPassword: '' })}
                            style={{ fontSize: 12, padding: '5px 10px' }}
                          >
                            <KeyRound size={12} /> Reset Pwd
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6}><div className="ap-empty">No internal users found. Click "Create User" to add one.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {modalOpen && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal ap-modal-sm" role="dialog" aria-modal="true">
            <div className="ap-modal-header">
              <h2>Create User</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setModalOpen(false)}><X size={16} /></button>
            </div>
            <div className="ap-modal-body">
              {formError && <div style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', padding: '10px 12px', borderRadius: 10, fontSize: 13, marginBottom: 12 }}>{formError}</div>}
              <div className="ap-field"><label className="ap-label">Name</label><input className="ap-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" /></div>
              <div className="ap-field"><label className="ap-label">Email</label><input className="ap-input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="user@company.com" /></div>
              <div className="ap-field"><label className="ap-label">Role</label>
                <select className="ap-select" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                  <option value="">Select a role</option>
                  {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="ap-field"><label className="ap-label">Temporary Password</label><input className="ap-input" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Minimum 8 characters" /></div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={handleCreate} disabled={formLoading || !form.name || !form.email || !form.role || !form.password}>
                {formLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal ap-modal-sm" role="dialog" aria-modal="true">
            <div className="ap-modal-header">
              <h2>Reset Password</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setResetModal(null)}><X size={16} /></button>
            </div>
            <div className="ap-modal-body">
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Set a new password for <strong>{resetModal.userName}</strong></p>
              <div className="ap-field">
                <label className="ap-label">New Password</label>
                <input className="ap-input" type="password" value={resetModal.newPassword}
                  onChange={(e) => setResetModal((p) => p ? { ...p, newPassword: e.target.value } : p)}
                  placeholder="Minimum 8 characters" />
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setResetModal(null)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={handleResetPassword}
                disabled={resetLoading || !resetModal.newPassword || resetModal.newPassword.length < 8}>
                {resetLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PARTNERS                                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function PartnersSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [partners, setPartners] = useState<PartnerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState<PartnerSummary | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const isStatusFilter = filter === 'active' || filter === 'pending';
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filter && !isStatusFilter) params.type = filter;
      if (isStatusFilter) params.status = filter;
      const res = await adminUserApi.getPartners(params);
      setPartners(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load partners');
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => { load(); }, [load]);

  const handleActivate = async (id: number) => {
    setActionLoading(id);
    try { await adminUserApi.activatePartner(id); load(); showToast('success', 'Partner activated'); }
    catch { showToast('error', 'Failed to activate partner'); }
    finally { setActionLoading(null); }
  };

  const handleDeactivate = async (id: number) => {
    setActionLoading(id);
    try { await adminUserApi.deactivatePartner(id); load(); showToast('success', 'Partner deactivated'); }
    catch { showToast('error', 'Failed to deactivate partner'); }
    finally { setActionLoading(null); }
  };

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Handshake size={20} />
          <div>
            <h1>Partners</h1>
            <p className="ap-page-subtitle">Manage individual and non-individual partners</p>
          </div>
        </div>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="ap-row" style={{ marginBottom: 14 }}>
        <div className="ap-input-with-icon" style={{ flex: 1, maxWidth: 340 }}>
          <Search size={14} className="ap-input-icon" />
          <input className="ap-input ap-input-icon-pad" placeholder="Search by name, email or ARN…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="ap-pill-tabs">
          {PARTNER_FILTER_OPTIONS.map((f) => (
            <button key={f.value} type="button"
              className={`ap-pill${filter === f.value ? ' active' : ''}`}
              onClick={() => setFilter(f.value)}>{f.label}</button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="ap-empty">
          <p>{error}</p>
          <button type="button" className="ap-btn ap-btn-primary" onClick={load} style={{ marginTop: 10 }}><RefreshCw size={14} /> Retry</button>
        </div>
      ) : (
        <div className="ap-table-wrap">
          <div className="ap-table-scroll">
            <table className="ap-table">
              <thead><tr><th>Name</th><th>Type</th><th>Email</th><th>Mobile</th><th>ARN</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
                ) : partners.length ? (
                  partners.map((p) => (
                    <tr key={p.id}>
                      <td>{p.partnerType === 'NON_INDIVIDUAL_PARTNER' ? (p.firmName || p.fullName || '-') : (p.fullName || '-')}</td>
                      <td>{ROLE_LABELS[p.partnerType] || p.partnerType}</td>
                      <td>{p.email || '-'}</td>
                      <td>{p.mobileNumber || '-'}</td>
                      <td>{p.arn || '-'}</td>
                      <td>{fmt(p.createdAt)}</td>
                      <td><StatusBadge active={isActive(p)} pending={!isActive(p)} /></td>
                      <td>
                        <div className="ap-actions">
                          {isActive(p) ? (
                            <button type="button" className="ap-btn ap-btn-danger" onClick={() => handleDeactivate(p.id)}
                              disabled={actionLoading === p.id} style={{ fontSize: 12, padding: '5px 10px' }}>Deactivate</button>
                          ) : (
                            <button type="button" className="ap-btn ap-btn-primary" onClick={() => handleActivate(p.id)}
                              disabled={actionLoading === p.id} style={{ fontSize: 12, padding: '5px 10px' }}>Activate</button>
                          )}
                          <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setDetail(p)}
                            style={{ fontSize: 12, padding: '5px 10px' }}><Eye size={12} /> View</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={8}><div className="ap-empty">No partners registered yet</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Partner Detail Modal */}
      {detail && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true">
            <div className="ap-modal-header">
              <h2>Partner Details</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setDetail(null)}><X size={16} /></button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-form-grid">
                <DetailRow label="Full Name" value={detail.fullName} />
                <DetailRow label="Firm Name" value={detail.firmName} />
                <DetailRow label="Type" value={ROLE_LABELS[detail.partnerType] || detail.partnerType} />
                <DetailRow label="Email" value={detail.email} />
                <DetailRow label="Mobile" value={detail.mobileNumber} />
                <DetailRow label="ARN" value={detail.arn} />
                <DetailRow label="EUIN" value={detail.euin} />
                <DetailRow label="PAN" value={detail.pan} />
                <DetailRow label="Bank Name" value={detail.partnerBankName} />
                <DetailRow label="Account" value={detail.partnerBankAccount} />
                <DetailRow label="IFSC" value={detail.partnerIfsc} />
                <DetailRow label="Status" value={isActive(detail) ? 'Active' : 'Pending Activation'} />
                <DetailRow label="Registered On" value={fmt(detail.createdAt)} />
              </div>
            </div>
            <PartnerFullDetail partnerId={detail.id} />
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Partner Full Detail (embedded in partner modal) ────────────────────── */
function PartnerFullDetail({ partnerId }: { partnerId: number }) {
  const [detail, setDetail] = useState<PartnerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminUserApi.getPartnerDetail(partnerId);
      setDetail(res.data);
      setShow(true);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return (
      <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb' }}>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load} disabled={loading}
          style={{ fontSize: 12, padding: '5px 12px' }}>
          {loading ? 'Loading...' : 'View Full Detail'}
        </button>
      </div>
    );
  }

  if (!detail) return null;

  const lifecycleEntries = Object.entries(detail.clientsByLifecycle || {});

  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb' }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Extended Detail</h4>
      <div className="ap-grid ap-grid-3" style={{ marginBottom: 12 }}>
        <div className="ap-card"><div className="ap-card-body"><div className="ap-kpi"><div><p className="ap-kpi-label">Total Clients</p><p className="ap-kpi-value">{detail.totalClients}</p></div></div></div></div>
        <div className="ap-card"><div className="ap-card-body"><div className="ap-kpi"><div><p className="ap-kpi-label">Referrals</p><p className="ap-kpi-value">{detail.referralCount}</p></div></div></div></div>
      </div>
      {lifecycleEntries.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p className="ap-kpi-label" style={{ marginBottom: 6 }}>Client Lifecycle Breakdown</p>
          {lifecycleEntries.map(([stage, count]) => (
            <div key={stage} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0' }}>
              <span>{stage.replace(/_/g, ' ')}</span>
              <span style={{ fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
        View Only — Partners cannot have permissions edited
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  CLIENTS                                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ClientsSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const res = await adminUserApi.getClients(params);
      setClients(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load clients');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <UserCheck size={20} />
          <div>
            <h1>Clients</h1>
            <p className="ap-page-subtitle">Showing {clients.length} client{clients.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div style={{ marginBottom: 14, maxWidth: 340 }}>
        <div className="ap-input-with-icon">
          <Search size={14} className="ap-input-icon" />
          <input className="ap-input ap-input-icon-pad" placeholder="Search by name or email…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error ? (
        <div className="ap-empty">
          <p>{error}</p>
          <button type="button" className="ap-btn ap-btn-primary" onClick={load} style={{ marginTop: 10 }}><RefreshCw size={14} /> Retry</button>
        </div>
      ) : (
        <div className="ap-table-wrap">
          <div className="ap-table-scroll">
            <table className="ap-table">
              <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>KYC Status</th><th>Registered</th><th>Status</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
                ) : clients.length ? (
                  clients.map((c) => (
                    <tr key={c.id}>
                      <td>{c.fullName || '-'}</td>
                      <td>{c.email || '-'}</td>
                      <td>{c.mobileNumber || '-'}</td>
                      <td>
                        <span className={`ap-badge ${c.kycStatus === 'Submitted' ? 'ap-badge-green' : 'ap-badge-gray'}`}>
                          {c.kycStatus}
                        </span>
                      </td>
                      <td>{fmt(c.createdAt)}</td>
                      <td><StatusBadge active={isActive(c)} /></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6}><div className="ap-empty">No clients registered yet</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PLATFORM STATS                                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */
function PlatformStatsSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminUserApi.getPlatformStats();
      setStats(res.data);
    } catch {
      setError('Failed to load platform stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;
  if (error) return (
    <div className="ap-empty">
      <p>{error}</p>
      <button type="button" className="ap-btn ap-btn-primary" onClick={load} style={{ marginTop: 10 }}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
  if (!stats) return null;

  const row1 = [
    { label: 'Total Partners', value: stats.totalPartners, color: 'blue', icon: <Handshake size={18} /> },
    { label: 'Total Clients', value: stats.totalClients, color: 'purple', icon: <Users size={18} /> },
    { label: 'Total Internal Users', value: stats.totalInternalUsers, color: 'green', icon: <UserCheck size={18} /> },
    { label: 'Total Referrals', value: stats.totalReferrals, color: 'amber', icon: <GitBranch size={18} /> },
  ];

  const row2 = [
    { label: 'Active Partners', value: stats.activePartners, color: 'green', icon: <Check size={18} /> },
    { label: 'Pending Partners', value: stats.pendingPartners, color: 'amber', icon: <RefreshCw size={18} /> },
    { label: 'Converted Referrals', value: stats.convertedReferrals, color: 'blue', icon: <ChevronRight size={18} /> },
  ];

  const maxPartnerType = Math.max(stats.partnersByType?.individual || 0, stats.partnersByType?.firm || 0, 1);
  const lifecycleEntries = Object.entries(stats.clientsByLifecycle || {});
  const maxLifecycle = Math.max(...lifecycleEntries.map(([, v]) => v), 1);

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <BarChart3 size={20} />
          <div>
            <h1>Platform Stats</h1>
            <p className="ap-page-subtitle">Comprehensive platform metrics and activity</p>
          </div>
        </div>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div className="ap-grid ap-grid-4" style={{ marginBottom: 16 }}>
        {row1.map((k) => (
          <div key={k.label} className="ap-card">
            <div className="ap-card-body">
              <div className="ap-kpi">
                <div>
                  <p className="ap-kpi-label">{k.label}</p>
                  <p className="ap-kpi-value">{k.value}</p>
                </div>
                <div className={`ap-kpi-icon ${k.color}`}>{k.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-grid ap-grid-3" style={{ marginBottom: 20 }}>
        {row2.map((k) => (
          <div key={k.label} className="ap-card">
            <div className="ap-card-body">
              <div className="ap-kpi">
                <div>
                  <p className="ap-kpi-label">{k.label}</p>
                  <p className="ap-kpi-value">{k.value}</p>
                </div>
                <div className={`ap-kpi-icon ${k.color}`}>{k.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-grid ap-grid-2" style={{ marginBottom: 20 }}>
        {/* Partners by type */}
        <div className="ap-card">
          <div className="ap-card-body">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Partners by Type</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>Individual</span><span style={{ fontWeight: 600 }}>{stats.partnersByType?.individual || 0}</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 4, height: 10 }}>
                  <div style={{ background: '#2563EB', borderRadius: 4, height: 10, width: `${((stats.partnersByType?.individual || 0) / maxPartnerType) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>Firm</span><span style={{ fontWeight: 600 }}>{stats.partnersByType?.firm || 0}</span>
                </div>
                <div style={{ background: '#e5e7eb', borderRadius: 4, height: 10 }}>
                  <div style={{ background: '#7c3aed', borderRadius: 4, height: 10, width: `${((stats.partnersByType?.firm || 0) / maxPartnerType) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clients by lifecycle */}
        <div className="ap-card">
          <div className="ap-card-body">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Clients by Lifecycle</h3>
            {lifecycleEntries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lifecycleEntries.map(([stage, count]) => (
                  <div key={stage}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span>{stage.replace(/_/g, ' ')}</span><span style={{ fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8 }}>
                      <div style={{ background: '#059669', borderRadius: 4, height: 8, width: `${(count / maxLifecycle) * 100}%`, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ap-empty">No lifecycle data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <h3 style={{ fontSize: 15, marginBottom: 10 }}>Recent Activity</h3>
      <div className="ap-table-wrap">
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead><tr><th>Action</th><th>Entity</th><th>Name</th><th>Performed By</th><th>Time</th></tr></thead>
            <tbody>
              {(stats.recentActivity || []).length > 0 ? (
                stats.recentActivity.slice(0, 10).map((a, i) => (
                  <tr key={i}>
                    <td>{a.action}</td>
                    <td>{a.entityType}</td>
                    <td>{a.entityName || '-'}</td>
                    <td>{a.performedByName || '-'}</td>
                    <td>{fmt(a.performedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}><div className="ap-empty">No recent activity</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  REFERRAL TREE                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ReferralTreeSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [referrals, setReferrals] = useState<ReferralTreeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminUserApi.getAllReferrals();
      setReferrals(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load referrals');
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter
    ? referrals.filter((r) => r.referrerType === filter)
    : referrals;

  const total = referrals.length;
  const converted = referrals.filter((r) => r.referredUserActivated).length;
  const pending = total - converted;
  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0';

  const FILTER_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Individual Partner', value: 'INDIVIDUAL_PARTNER' },
    { label: 'Partner Firm', value: 'NON_INDIVIDUAL_PARTNER' },
  ];

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <GitBranch size={20} />
          <div>
            <h1>Referral Tree</h1>
            <p className="ap-page-subtitle">All referrals across the platform</p>
          </div>
        </div>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      {/* Summary row */}
      <div className="ap-grid ap-grid-4" style={{ marginBottom: 16 }}>
        <div className="ap-card"><div className="ap-card-body"><div className="ap-kpi"><div><p className="ap-kpi-label">Total</p><p className="ap-kpi-value">{total}</p></div></div></div></div>
        <div className="ap-card"><div className="ap-card-body"><div className="ap-kpi"><div><p className="ap-kpi-label">Converted</p><p className="ap-kpi-value">{converted}</p></div></div></div></div>
        <div className="ap-card"><div className="ap-card-body"><div className="ap-kpi"><div><p className="ap-kpi-label">Pending</p><p className="ap-kpi-value">{pending}</p></div></div></div></div>
        <div className="ap-card"><div className="ap-card-body"><div className="ap-kpi"><div><p className="ap-kpi-label">Conversion Rate</p><p className="ap-kpi-value">{conversionRate}%</p></div></div></div></div>
      </div>

      {/* Filter pills */}
      <div className="ap-pill-tabs" style={{ marginBottom: 14 }}>
        {FILTER_OPTIONS.map((f) => (
          <button key={f.value} type="button"
            className={`ap-pill${filter === f.value ? ' active' : ''}`}
            onClick={() => setFilter(f.value)}>{f.label}</button>
        ))}
      </div>

      {error ? (
        <div className="ap-empty">
          <p>{error}</p>
          <button type="button" className="ap-btn ap-btn-primary" onClick={load} style={{ marginTop: 10 }}><RefreshCw size={14} /> Retry</button>
        </div>
      ) : (
        <div className="ap-table-wrap">
          <div className="ap-table-scroll">
            <table className="ap-table">
              <thead><tr><th>Referrer</th><th>Type</th><th>Referred Person</th><th>Referred As</th><th>Referred On</th><th>Status</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
                ) : filtered.length ? (
                  filtered.map((r, i) => (
                    <tr key={i}>
                      <td>{r.referrerName || '-'}</td>
                      <td><span className={`ap-badge ${r.referrerType === 'INDIVIDUAL_PARTNER' ? 'ap-badge-blue' : 'ap-badge-purple'}`}>
                        {ROLE_LABELS[r.referrerType] || r.referrerType}
                      </span></td>
                      <td>{r.referredUserName || '-'}</td>
                      <td>{ROLE_LABELS[r.referredUserRole] || r.referredUserRole}</td>
                      <td>{fmt(r.referredAt)}</td>
                      <td>{r.referredUserActivated
                        ? <span className="ap-badge ap-badge-green">Activated</span>
                        : <span className="ap-badge ap-badge-amber">Pending</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6}><div className="ap-empty">No referrals found</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PERMISSIONS                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */
function PermissionsSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [roleUsers, setRoleUsers] = useState<RoleUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [permUserName, setPermUserName] = useState('');
  const [permUserRole, setPermUserRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [permLoading, setPermLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminUserApi.getRoleUsers();
      setRoleUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load roles');
      setRoleUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setSelectedUserId(null);
    setPermissions([]);
  };

  const handleEditPermissions = async (userId: number) => {
    setPermLoading(true);
    try {
      const res = await adminUserApi.getUserPermissions(userId);
      const data: UserPermissions = res.data;
      setSelectedUserId(userId);
      setPermissions(data.permissions || []);
      setPermUserName(data.userName);
      setPermUserRole(data.role);
    } catch {
      showToast('error', 'Failed to load permissions');
    } finally {
      setPermLoading(false);
    }
  };

  const handleTogglePerm = (idx: number, field: keyof PermissionRow) => {
    setPermissions((prev) =>
      prev.map((p, i) => i === idx ? { ...p, [field]: !p[field] } : p)
    );
  };

  const handleResetDefaults = async () => {
    if (!selectedRole) return;
    setPermLoading(true);
    try {
      const res = await adminUserApi.getRoleDefaults(selectedRole);
      setPermissions(res.data?.permissions || []);
      showToast('success', 'Permissions reset to defaults');
    } catch {
      showToast('error', 'Failed to load defaults');
    } finally {
      setPermLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedUserId) return;
    setSaving(true);
    try {
      await adminUserApi.updateUserPermissions(selectedUserId, { permissions });
      showToast('success', 'Permissions saved successfully');
    } catch {
      showToast('error', 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /></div>;
  if (error) return (
    <div className="ap-empty">
      <p>{error}</p>
      <button type="button" className="ap-btn ap-btn-primary" onClick={load} style={{ marginTop: 10 }}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  const INTERNAL_ROLES = ['RELATIONSHIP_MANAGER', 'OPERATIONS', 'COMPLIANCE', 'FINANCE', 'SUPPORT'];
  const selectedRoleData = roleUsers.find((r) => r.role === selectedRole);

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Shield size={20} />
          <div>
            <h1>Roles &amp; Permissions</h1>
            <p className="ap-page-subtitle">Manage user permissions by role</p>
          </div>
        </div>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left column — role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {INTERNAL_ROLES.map((role) => {
            const rd = roleUsers.find((r) => r.role === role);
            const count = rd?.userCount || 0;
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                className="ap-card"
                onClick={() => handleSelectRole(role)}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #2563EB' : '1px solid #e5e7eb',
                  textAlign: 'left',
                  padding: '12px 14px',
                  background: isSelected ? '#eff6ff' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{ROLE_LABELS[role] || role}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{count} user{count !== 1 ? 's' : ''}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div>
          {!selectedRole ? (
            <div className="ap-empty" style={{ padding: 40 }}>
              <Shield size={32} style={{ color: '#94a3b8', marginBottom: 10 }} />
              <p>Select a role to manage permissions</p>
            </div>
          ) : selectedUserId ? (
            /* Permission matrix editor */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{permUserName} — {ROLE_LABELS[permUserRole] || permUserRole}</h3>
                </div>
                <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setSelectedUserId(null)}
                  style={{ fontSize: 12, padding: '5px 10px' }}>
                  Back to Users
                </button>
              </div>

              {permLoading ? (
                <div className="ap-loading"><div className="ap-spinner" /></div>
              ) : (
                <>
                  <div className="ap-table-wrap">
                    <div className="ap-table-scroll">
                      <table className="ap-table">
                        <thead>
                          <tr>
                            <th>Section</th>
                            <th style={{ textAlign: 'center' }}>View</th>
                            <th style={{ textAlign: 'center' }}>Create</th>
                            <th style={{ textAlign: 'center' }}>Edit</th>
                            <th style={{ textAlign: 'center' }}>Delete</th>
                            <th style={{ textAlign: 'center' }}>Approve</th>
                          </tr>
                        </thead>
                        <tbody>
                          {permissions.length > 0 ? permissions.map((p, idx) => (
                            <tr key={p.section}>
                              <td style={{ fontWeight: 500 }}>{p.section}</td>
                              {(['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove'] as const).map((field) => (
                                <td key={field} style={{ textAlign: 'center' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <input
                                      type="checkbox"
                                      checked={p[field]}
                                      onChange={() => handleTogglePerm(idx, field)}
                                      style={{ width: 18, height: 18, accentColor: '#2563EB', cursor: 'pointer' }}
                                    />
                                  </label>
                                </td>
                              ))}
                            </tr>
                          )) : (
                            <tr><td colSpan={6}><div className="ap-empty">No permission sections defined</div></td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button type="button" className="ap-btn ap-btn-secondary" onClick={handleResetDefaults} disabled={permLoading}>
                      Reset to Defaults
                    </button>
                    <button type="button" className="ap-btn ap-btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Permissions'}
                    </button>
                  </div>

                  <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: 8, fontSize: 12, color: '#64748b', marginTop: 14 }}>
                    Note: Permission changes take effect on the user's next login session.
                  </div>
                </>
              )}
            </div>
          ) : (
            /* User list for selected role */
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                {ROLE_LABELS[selectedRole] || selectedRole} Users
              </h3>
              {selectedRoleData && selectedRoleData.users.length > 0 ? (
                <div className="ap-table-wrap">
                  <div className="ap-table-scroll">
                    <table className="ap-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {selectedRoleData.users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.name || '-'}</td>
                            <td>{u.email || '-'}</td>
                            <td><StatusBadge active={u.isActivated} /></td>
                            <td>
                              <button type="button" className="ap-btn ap-btn-primary" onClick={() => handleEditPermissions(u.id)}
                                disabled={permLoading} style={{ fontSize: 12, padding: '5px 10px' }}>
                                Edit Permissions
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="ap-empty">No users found with this role</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SHARED MINI COMPONENTS                                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */
function StatusBadge({ active, pending }: { active: boolean; pending?: boolean }) {
  if (active) return <span className="ap-badge ap-badge-green">Active</span>;
  if (pending) return <span className="ap-badge ap-badge-amber">Pending</span>;
  return <span className="ap-badge ap-badge-red">Inactive</span>;
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="ap-field" style={{ marginBottom: 8 }}>
      <span className="ap-label">{label}</span>
      <span style={{ fontSize: 13 }}>{value || '-'}</span>
    </div>
  );
}

function MiniTable<T>({ columns, rows, renderRow, emptyMsg }: {
  columns: string[];
  rows: T[];
  renderRow: (item: T) => React.ReactNode;
  emptyMsg: string;
}) {
  return (
    <div className="ap-table-wrap">
      <div className="ap-table-scroll">
        <table className="ap-table">
          <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.length ? rows.map(renderRow) : (
              <tr><td colSpan={columns.length}><div className="ap-empty">{emptyMsg}</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
