import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Handshake, UserCheck,
  LogOut, Plus, RefreshCw, Search, Eye, KeyRound, X,
  BarChart3, GitBranch, Shield, ChevronRight, Check,
  Radio, Zap, Clock, AlertTriangle, CheckCircle2, Loader2, FileCheck,
} from 'lucide-react';
import { adminUserApi } from '../../api/adminUserApi';
import { locationApi } from '../../api/locationApi';
import type { UserSummary, AdminStats, PartnerSummary, ClientSummary, PlatformStats, ReferralTreeEntry, PartnerDetail, RoleUsers, UserPermissions, PermissionRow, ArnRequestResponse } from '../../types/api';
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

type Section = 'overview' | 'users' | 'partners' | 'arnRequests' | 'clients' | 'platformStats' | 'referralTree' | 'permissions' | 'bseMonitor';

interface CreateForm { name: string; email: string; role: string; password: string; assignedState: string; assignedDistrict: string }
interface ResetForm { userId: number; userName: string; newPassword: string }
interface Toast { type: 'success' | 'error'; message: string }

const EMPTY_FORM: CreateForm = { name: '', email: '', role: '', password: '', assignedState: '', assignedDistrict: '' };

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
    { key: 'arnRequests', label: 'ARN Requests', icon: <FileCheck size={16} /> },
    { key: 'clients', label: 'Clients', icon: <UserCheck size={16} /> },
    { key: 'platformStats', label: 'Platform Stats', icon: <BarChart3 size={16} /> },
    { key: 'referralTree', label: 'Referral Tree', icon: <GitBranch size={16} /> },
    { key: 'permissions', label: 'Roles & Permissions', icon: <Shield size={16} /> },
    { key: 'bseMonitor', label: 'BSE Monitor', icon: <Radio size={16} /> },
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
          {section === 'arnRequests' && <ArnRequestsSection showToast={showToast} />}
          {section === 'clients' && <ClientsSection showToast={showToast} />}
          {section === 'platformStats' && <PlatformStatsSection showToast={showToast} />}
          {section === 'referralTree' && <ReferralTreeSection showToast={showToast} />}
          {section === 'permissions' && <PermissionsSection showToast={showToast} />}
          {section === 'bseMonitor' && <BseMonitorSection showToast={showToast} />}
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

  // Location dropdowns (RM creation only)
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [statesLoaded, setStatesLoaded] = useState(false);

  // Fetch states eagerly on section mount so dropdowns are ready the first
  // time the Create User modal opens. Previously this was gated on modalOpen,
  // which caused a visible 'Loading states...' flash on the first open.
  useEffect(() => {
    console.log('[AdminDashboard.InternalUsers] fetching states');
    locationApi.getStates()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        console.log('[AdminDashboard.InternalUsers] states response:', data.length, 'items', data.slice(0, 3));
        setStates(data);
      })
      .catch((err) => {
        console.error('[AdminDashboard.InternalUsers] states fetch failed:', err);
        setStates([]);
      })
      .finally(() => setStatesLoaded(true));
  }, []);

  // Reload districts whenever the assigned state changes.
  useEffect(() => {
    if (!form.assignedState) {
      setDistricts([]);
      return;
    }
    console.log('[AdminDashboard.InternalUsers] fetching districts for', form.assignedState);
    locationApi.getDistricts(form.assignedState)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        console.log('[AdminDashboard.InternalUsers] districts response:', data.length, 'items');
        setDistricts(data);
      })
      .catch((err) => {
        console.error('[AdminDashboard.InternalUsers] districts fetch failed:', err);
        setDistricts([]);
      });
  }, [form.assignedState]);

  // Log role value on every change so the user can verify the condition
  // in the modal matches. Drop this once the issue is confirmed fixed.
  useEffect(() => {
    if (modalOpen) {
      console.log('[AdminDashboard.InternalUsers] form.role =', JSON.stringify(form.role),
        '| isRm =', form.role === 'RELATIONSHIP_MANAGER',
        '| states loaded =', states.length);
    }
  }, [form.role, modalOpen, states.length]);

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
    // RM-specific: assignedState is mandatory (district optional = state-level fallback)
    if (form.role === 'RELATIONSHIP_MANAGER' && !form.assignedState) {
      setFormError('Assigned state is required for Relationship Manager');
      return;
    }
    setFormLoading(true);
    try {
      const payload: Record<string, string> = {
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password,
      };
      if (form.role === 'RELATIONSHIP_MANAGER') {
        payload.assignedState = form.assignedState;
        if (form.assignedDistrict) payload.assignedDistrict = form.assignedDistrict;
      }
      await adminUserApi.createUser(payload);
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
                      <td>
                        {ROLE_LABELS[u.role] || u.role}
                        {u.role === 'RELATIONSHIP_MANAGER' && u.assignedState && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {u.assignedDistrict ? `${u.assignedDistrict}, ${u.assignedState}` : `${u.assignedState} (state-level)`}
                          </div>
                        )}
                      </td>
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
                <select className="ap-select" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value, assignedState: '', assignedDistrict: '' }))}>
                  <option value="">Select a role</option>
                  {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              {/* RM location fields — shown whenever the selected role is Relationship Manager.
                  The comparison is case/whitespace-tolerant to survive any future value drift
                  in ROLE_OPTIONS without hiding the fields. */}
              {(form.role || '').trim().toUpperCase() === 'RELATIONSHIP_MANAGER' && (
                <>
                  <div className="ap-field">
                    <label className="ap-label">Assigned State *</label>
                    <select className="ap-select" value={form.assignedState}
                      onChange={(e) => setForm((p) => ({ ...p, assignedState: e.target.value, assignedDistrict: '' }))}>
                      <option value="">{statesLoaded ? (states.length ? 'Select state' : 'No states available — check /api/locations/states') : 'Loading states...'}</option>
                      {states.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div className="ap-field">
                    <label className="ap-label">Assigned District (optional — leave blank for state-level RM)</label>
                    <select className="ap-select" value={form.assignedDistrict}
                      disabled={!form.assignedState}
                      onChange={(e) => setForm((p) => ({ ...p, assignedDistrict: e.target.value }))}>
                      <option value="">{!form.assignedState ? 'Select state first' : 'Any district in state'}</option>
                      {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </>
              )}
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

  // Location + RM filters
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [rmFilter, setRmFilter] = useState<string>(''); // RM user id as string, or ''
  const [allStates, setAllStates] = useState<string[]>([]);
  const [filterDistricts, setFilterDistricts] = useState<string[]>([]);
  const [rmOptions, setRmOptions] = useState<UserSummary[]>([]);

  // Manual RM override modal
  const [reassign, setReassign] = useState<PartnerSummary | null>(null);
  const [reassignRmId, setReassignRmId] = useState<string>('');
  const [reassignSaving, setReassignSaving] = useState(false);

  // Load states + RM list once for filters & reassignment dropdown.
  useEffect(() => {
    locationApi.getStates().then((r) => setAllStates(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    adminUserApi.getUsers().then((r) => {
      const users: UserSummary[] = Array.isArray(r.data) ? r.data : [];
      setRmOptions(users.filter((u) => u.role === 'RELATIONSHIP_MANAGER'));
    }).catch(() => {});
  }, []);

  // Refresh district filter options when state filter changes.
  useEffect(() => {
    if (!stateFilter) { setFilterDistricts([]); setDistrictFilter(''); return; }
    locationApi.getDistricts(stateFilter)
      .then((r) => setFilterDistricts(Array.isArray(r.data) ? r.data : []))
      .catch(() => setFilterDistricts([]));
  }, [stateFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const isStatusFilter = filter === 'active' || filter === 'pending';
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filter && !isStatusFilter) params.type = filter;
      if (isStatusFilter) params.status = filter;
      if (stateFilter) params.state = stateFilter;
      if (districtFilter) params.district = districtFilter;
      if (rmFilter) params.rmId = rmFilter;
      const res = await adminUserApi.getPartners(params);
      setPartners(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load partners');
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }, [search, filter, stateFilter, districtFilter, rmFilter]);

  useEffect(() => { load(); }, [load]);

  const openReassign = (p: PartnerSummary) => {
    setReassign(p);
    setReassignRmId(p.assignedRmId ? String(p.assignedRmId) : '');
  };

  const submitReassign = async () => {
    if (!reassign) return;
    setReassignSaving(true);
    try {
      const newId = reassignRmId ? Number(reassignRmId) : null;
      await adminUserApi.assignPartnerRm(reassign.id, newId);
      showToast('success', newId ? 'RM reassigned' : 'RM cleared');
      setReassign(null);
      load();
    } catch (err: any) {
      showToast('error', err?.userMessage || 'Failed to reassign RM');
    } finally {
      setReassignSaving(false);
    }
  };

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

      <div className="ap-row" style={{ marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
        <select className="ap-select" style={{ maxWidth: 200 }}
          value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
          <option value="">All states</option>
          {allStates.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="ap-select" style={{ maxWidth: 200 }}
          value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}
          disabled={!stateFilter}>
          <option value="">{stateFilter ? 'All districts' : 'All districts (pick state)'}</option>
          {filterDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="ap-select" style={{ maxWidth: 220 }}
          value={rmFilter} onChange={(e) => setRmFilter(e.target.value)}>
          <option value="">All RMs</option>
          {rmOptions.map((rm) => (
            <option key={rm.id} value={rm.id}>
              {rm.name}{rm.assignedState ? ` — ${rm.assignedDistrict || rm.assignedState}` : ''}
            </option>
          ))}
        </select>
        {(stateFilter || districtFilter || rmFilter) && (
          <button type="button" className="ap-btn ap-btn-ghost"
            onClick={() => { setStateFilter(''); setDistrictFilter(''); setRmFilter(''); }}
            style={{ fontSize: 12 }}>
            Clear location filters
          </button>
        )}
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
              <thead><tr><th>Name</th><th>Type</th><th>Email</th><th>Location</th><th>ARN</th><th>Assigned RM</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
                ) : partners.length ? (
                  partners.map((p) => (
                    <tr key={p.id}>
                      <td>{p.partnerType === 'NON_INDIVIDUAL_PARTNER' ? (p.firmName || p.fullName || '-') : (p.fullName || '-')}</td>
                      <td>{ROLE_LABELS[p.partnerType] || p.partnerType}</td>
                      <td>{p.email || '-'}</td>
                      <td>
                        {p.state || p.district || p.city ? (
                          <div style={{ fontSize: 12 }}>
                            <div>{[p.city, p.district].filter(Boolean).join(', ') || '-'}</div>
                            {p.state && <div style={{ color: '#64748b' }}>{p.state}</div>}
                          </div>
                        ) : '-'}
                      </td>
                      <td>{p.arn || '-'}</td>
                      <td>
                        {p.assignedRmName ? (
                          <span style={{ fontSize: 12 }}>{p.assignedRmName}</span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#b45309' }}>Unassigned</span>
                        )}
                      </td>
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
                          <button type="button" className="ap-btn ap-btn-secondary" onClick={() => openReassign(p)}
                            style={{ fontSize: 12, padding: '5px 10px' }}>Reassign RM</button>
                          <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setDetail(p)}
                            style={{ fontSize: 12, padding: '5px 10px' }}><Eye size={12} /> View</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={9}><div className="ap-empty">No partners registered yet</div></td></tr>
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
                <DetailRow label="State" value={detail.state} />
                <DetailRow label="District" value={detail.district} />
                <DetailRow label="City" value={detail.city} />
                <DetailRow label="Assigned RM" value={detail.assignedRmName || 'Unassigned'} />
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

      {/* Manual RM Reassignment Modal */}
      {reassign && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal ap-modal-sm" role="dialog" aria-modal="true">
            <div className="ap-modal-header">
              <h2>Reassign Relationship Manager</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setReassign(null)}><X size={16} /></button>
            </div>
            <div className="ap-modal-body">
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                Partner: <strong>{reassign.fullName || reassign.firmName}</strong>
                <br />
                Location: {[reassign.city, reassign.district, reassign.state].filter(Boolean).join(', ') || '—'}
                <br />
                Current RM: {reassign.assignedRmName || 'Unassigned'}
              </p>
              <div className="ap-field">
                <label className="ap-label">Select RM</label>
                <select className="ap-select" value={reassignRmId} onChange={(e) => setReassignRmId(e.target.value)}>
                  <option value="">— Unassign (clear RM) —</option>
                  {rmOptions.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name}
                      {rm.assignedState
                        ? ` (${rm.assignedDistrict ? rm.assignedDistrict + ', ' : ''}${rm.assignedState})`
                        : ''}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                  Manually overrides the auto-assigned RM. Use this when the partner's location doesn't match any RM service area.
                </p>
              </div>
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setReassign(null)}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-primary" onClick={submitReassign} disabled={reassignSaving}>
                {reassignSaving ? 'Saving...' : 'Save'}
              </button>
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
/*  ARN REQUESTS                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ArnRequestsSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [requests, setRequests] = useState<ArnRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<{ userId: number; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminUserApi.getArnRequests(params);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load ARN requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (userId: number) => {
    setActionLoading(userId);
    try {
      await adminUserApi.approveArn(userId);
      showToast('success', 'ARN approved successfully');
      load();
    } catch {
      showToast('error', 'Failed to approve ARN');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setActionLoading(rejectModal.userId);
    try {
      await adminUserApi.rejectArn(rejectModal.userId, rejectReason.trim());
      showToast('success', 'ARN rejected');
      setRejectModal(null);
      setRejectReason('');
      load();
    } catch {
      showToast('error', 'Failed to reject ARN');
    } finally {
      setActionLoading(null);
    }
  };

  const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'PENDING_APPROVAL' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PENDING_APPROVAL: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
      APPROVED: { bg: '#D1FAE5', color: '#065F46', label: 'Approved' },
      REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
    };
    const s = map[status] || { bg: '#F3F4F6', color: '#6B7280', label: status };
    return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
  };

  return (
    <>
      <div className="ap-section-header">
        <h2>ARN Requests</h2>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="ap-filter-group">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} type="button"
              className={`ap-filter-btn ${statusFilter === f.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.value)}>{f.label}</button>
          ))}
        </div>
        <input type="text" className="ap-search" placeholder="Search by name or ARN..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: 'auto', maxWidth: 260 }} />
      </div>

      {error && <div className="ap-error">{error}</div>}

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Type</th>
              <th>ARN Number</th>
              <th>PAN</th>
              <th>EUIN</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
            ) : requests.length ? (
              requests.map(r => (
                <tr key={r.userId}>
                  <td>{r.partnerType === 'NON_INDIVIDUAL_PARTNER' ? (r.firmName || r.fullName || '-') : (r.fullName || '-')}</td>
                  <td>{ROLE_LABELS[r.partnerType] || r.partnerType}</td>
                  <td>{r.arn || '-'}</td>
                  <td>{r.pan || '-'}</td>
                  <td>{r.euin || '-'}</td>
                  <td>
                    {statusBadge(r.arnStatus)}
                    {r.arnStatus === 'REJECTED' && r.rejectionReason && (
                      <div style={{ fontSize: 11, color: '#991B1B', marginTop: 4 }} title={r.rejectionReason}>
                        Reason: {r.rejectionReason.length > 30 ? r.rejectionReason.slice(0, 30) + '...' : r.rejectionReason}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="ap-actions">
                      {r.arnStatus === 'PENDING_APPROVAL' && (
                        <>
                          <button type="button" className="ap-btn ap-btn-primary" onClick={() => handleApprove(r.userId)}
                            disabled={actionLoading === r.userId} style={{ fontSize: 12, padding: '5px 10px' }}>Approve</button>
                          <button type="button" className="ap-btn ap-btn-danger" onClick={() => setRejectModal({ userId: r.userId, name: r.fullName || r.firmName || 'Partner' })}
                            disabled={actionLoading === r.userId} style={{ fontSize: 12, padding: '5px 10px' }}>Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7}><div className="ap-empty">No ARN requests found</div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="ap-modal-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true" style={{ maxWidth: 480 }}>
            <div className="ap-modal-header">
              <h2>Reject ARN</h2>
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => { setRejectModal(null); setRejectReason(''); }}><X size={16} /></button>
            </div>
            <div className="ap-modal-body">
              <p style={{ marginBottom: 16, fontSize: 14 }}>Reject ARN for <strong>{rejectModal.name}</strong>?</p>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Rejection Reason *</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..." rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 14, resize: 'vertical' }} />
            </div>
            <div className="ap-modal-footer">
              <button type="button" className="ap-btn ap-btn-secondary" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</button>
              <button type="button" className="ap-btn ap-btn-danger" onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === rejectModal.userId}>
                {actionLoading === rejectModal.userId ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  BSE MONITOR                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */
interface BseTx {
  transactionId: string; apiName: string; status: string; endpoint: string;
  createdAt: string; completedAt: string | null; errorMessage: string | null;
  bseStatus?: string; httpStatus?: number;
}

function BseMonitorSection({ showToast }: { showToast: (t: Toast['type'], m: string) => void }) {
  const [transactions, setTransactions] = useState<BseTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUserApi.bseTransactions(50);
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast('error', 'Failed to load BSE transactions');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleLogin = async () => {
    setActionLoading('login');
    try {
      const res = await adminUserApi.bseLogin();
      if (res.data?.success) {
        showToast('success', 'BSE login successful');
      } else {
        showToast('error', res.data?.message || 'BSE login failed');
      }
      load();
    } catch (err: any) {
      showToast('error', err.userMessage || 'BSE login failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSchemes = async () => {
    setActionLoading('schemes');
    try {
      const res = await adminUserApi.bseSchemes({ start: 0, length: 10 });
      showToast('success', `Scheme fetch initiated: ${res.data?.transactionId}`);
      setTimeout(load, 2000);
    } catch (err: any) {
      showToast('error', err.userMessage || 'Scheme fetch failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleNav = async () => {
    setActionLoading('nav');
    try {
      const res = await adminUserApi.bseNav({ start: 0, length: 10 });
      showToast('success', `NAV fetch initiated: ${res.data?.transactionId}`);
      setTimeout(load, 2000);
    } catch (err: any) {
      showToast('error', err.userMessage || 'NAV fetch failed');
    } finally {
      setActionLoading(null);
    }
  };

  const viewDetail = async (txId: string) => {
    setDetailLoading(true);
    setDetailModal(null);
    try {
      const res = await adminUserApi.bseStatus(txId);
      setDetailModal(res.data);
    } catch {
      showToast('error', 'Failed to load transaction detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; fg: string }> = {
      PENDING: { bg: '#fef3c7', fg: '#92400e' },
      IN_PROGRESS: { bg: '#dbeafe', fg: '#1e40af' },
      SUCCESS: { bg: '#dcfce7', fg: '#166534' },
      FAILED: { bg: '#fee2e2', fg: '#991b1b' },
    };
    const c = colors[status] || { bg: '#f3f4f6', fg: '#374151' };
    return (
      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: c.bg, color: c.fg }}>
        {status}
      </span>
    );
  };

  const apiNameBadge = (name: string) => {
    const colors: Record<string, { bg: string; fg: string }> = {
      LOGIN: { bg: '#f3e8ff', fg: '#6b21a8' },
      SCHEME_LIST: { bg: '#dbeafe', fg: '#1e40af' },
      NAV_LIST: { bg: '#ccfbf1', fg: '#115e59' },
    };
    const c = colors[name] || { bg: '#f3f4f6', fg: '#374151' };
    return (
      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: c.bg, color: c.fg }}>
        {name}
      </span>
    );
  };

  const duration = (created: string, completed: string | null) => {
    if (!completed) return '\u2014';
    const ms = new Date(completed).getTime() - new Date(created).getTime();
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Radio size={20} />
          <div>
            <h1>BSE Monitor</h1>
            <p className="ap-page-subtitle">BSE StAR MF v2 connection status and transactions</p>
          </div>
        </div>
        <button type="button" className="ap-btn ap-btn-secondary" onClick={load}><RefreshCw size={14} /> Refresh</button>
      </div>

      {/* ── Connection Status ──────────────────────────────────── */}
      <div className="ap-card" style={{ marginBottom: 20 }}>
        <div className="ap-card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>BSE StAR MF v2 Connection</h3>
              <p style={{ fontSize: 13, opacity: 0.7 }}>Mock mode enabled by default. Set BSE_V2_MOCK_MODE=false for live.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="ap-btn ap-btn-primary"
                onClick={handleLogin}
                disabled={actionLoading === 'login'}
                style={{ fontSize: 12 }}
              >
                {actionLoading === 'login' ? <><Loader2 size={12} className="spin" /> Testing...</> : <><Zap size={12} /> Test BSE Login</>}
              </button>
              <button
                type="button"
                className="ap-btn ap-btn-secondary"
                onClick={handleSchemes}
                disabled={actionLoading === 'schemes'}
                style={{ fontSize: 12 }}
              >
                {actionLoading === 'schemes' ? <><Loader2 size={12} className="spin" /> Fetching...</> : 'Fetch Schemes'}
              </button>
              <button
                type="button"
                className="ap-btn ap-btn-secondary"
                onClick={handleNav}
                disabled={actionLoading === 'nav'}
                style={{ fontSize: 12 }}
              >
                {actionLoading === 'nav' ? <><Loader2 size={12} className="spin" /> Fetching...</> : 'Fetch NAV'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ──────────────────────────────────── */}
      <div className="ap-card">
        <div className="ap-card-body">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Recent Transactions</h3>
          <div className="ap-table-wrap">
            <div className="ap-table-scroll">
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>API</th>
                    <th>Status</th>
                    <th>Endpoint</th>
                    <th>Created</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7}><div className="ap-loading"><div className="ap-spinner" /></div></td></tr>
                  ) : transactions.length ? (
                    transactions.map((tx) => (
                      <tr key={tx.transactionId}>
                        <td><code style={{ fontSize: 11 }}>{tx.transactionId.length > 28 ? tx.transactionId.substring(0, 28) + '...' : tx.transactionId}</code></td>
                        <td>{apiNameBadge(tx.apiName)}</td>
                        <td>{statusBadge(tx.status)}</td>
                        <td style={{ fontSize: 12, opacity: 0.8 }}>{tx.endpoint}</td>
                        <td style={{ fontSize: 12 }}>{fmt(tx.createdAt)}</td>
                        <td style={{ fontSize: 12, fontFamily: 'monospace' }}>{duration(tx.createdAt, tx.completedAt)}</td>
                        <td>
                          <button
                            type="button"
                            className="ap-btn ap-btn-secondary"
                            onClick={() => viewDetail(tx.transactionId)}
                            style={{ fontSize: 11, padding: '3px 8px' }}
                          >
                            <Eye size={11} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={7}><div className="ap-empty">No BSE transactions yet. Use the buttons above to test.</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ──────────────────────────────────── */}
      {(detailModal || detailLoading) && (
        <div className="ap-modal-overlay" onClick={() => { setDetailModal(null); setDetailLoading(false); }}>
          <div className="ap-modal" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <h2>Transaction Detail</h2>
              <button type="button" className="ap-modal-close" onClick={() => { setDetailModal(null); setDetailLoading(false); }}>
                <X size={16} />
              </button>
            </div>
            <div className="ap-modal-body">
              {detailLoading ? (
                <div className="ap-loading"><div className="ap-spinner" /></div>
              ) : detailModal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div><strong style={{ fontSize: 12 }}>Transaction ID</strong><br /><code style={{ fontSize: 11 }}>{detailModal.transactionId}</code></div>
                    <div><strong style={{ fontSize: 12 }}>API</strong><br />{apiNameBadge(detailModal.apiName)}</div>
                    <div><strong style={{ fontSize: 12 }}>Status</strong><br />{statusBadge(detailModal.status)}</div>
                    <div><strong style={{ fontSize: 12 }}>Endpoint</strong><br /><span style={{ fontSize: 12 }}>{detailModal.endpoint}</span></div>
                    <div><strong style={{ fontSize: 12 }}>Created</strong><br /><span style={{ fontSize: 12 }}>{fmt(detailModal.createdAt)}</span></div>
                    <div><strong style={{ fontSize: 12 }}>Completed</strong><br /><span style={{ fontSize: 12 }}>{detailModal.completedAt ? fmt(detailModal.completedAt) : '\u2014'}</span></div>
                    {detailModal.bseStatus && <div><strong style={{ fontSize: 12 }}>BSE Status</strong><br /><span style={{ fontSize: 12 }}>{detailModal.bseStatus}</span></div>}
                    {detailModal.httpStatus && <div><strong style={{ fontSize: 12 }}>HTTP Status</strong><br /><span style={{ fontSize: 12 }}>{detailModal.httpStatus}</span></div>}
                  </div>
                  {detailModal.errorMessage && (
                    <div style={{ background: '#fee2e2', padding: 10, borderRadius: 6, fontSize: 12, color: '#991b1b' }}>
                      <strong>Error:</strong> {detailModal.errorMessage}
                    </div>
                  )}
                  {detailModal.data && (
                    <div>
                      <strong style={{ fontSize: 12 }}>Response Data</strong>
                      <pre style={{ background: 'var(--bg, #f9fafb)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 6, padding: 10, fontSize: 11, maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginTop: 4 }}>
                        {typeof detailModal.data === 'string' ? detailModal.data : JSON.stringify(detailModal.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
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
