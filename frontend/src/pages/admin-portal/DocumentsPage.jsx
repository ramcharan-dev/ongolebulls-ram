import { useEffect, useMemo, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import {
  approveDocument,
  getAllDocuments,
  getDocumentStats,
  rejectDocument,
} from '../../api/adminDocumentApi';

export default function DocumentsPage() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, underReview: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        getAllDocuments(statusFilter, search),
        getDocumentStats(),
      ]);
      setRows(Array.isArray(listRes.data) ? listRes.data : []);
      setStats(statsRes.data || { pending: 0, approved: 0, underReview: 0, total: 0 });
    } catch {
      setRows([]);
      setStats({ pending: 0, approved: 0, underReview: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((item) =>
      [item.investorName, item.investorEmail, item.panNumber]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const approve = async (id) => {
    setActionLoadingId(id);
    try {
      await approveDocument(id);
      load();
    } finally {
      setActionLoadingId(null);
    }
  };

  const reject = async (id) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    setActionLoadingId(id);
    try {
      await rejectDocument(id, reason);
      load();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <FolderOpen size={20} />
          <div>
            <h1>KYC Documents</h1>
            <p className="ap-page-subtitle">Review submissions and update status</p>
          </div>
        </div>
        <div className="ap-actions">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={load}>Refresh</button>
        </div>
      </div>

      <div className="ap-grid ap-grid-4" style={{ marginBottom: 12 }}>
        <div className="ap-card"><div className="ap-card-body"><p className="ap-kpi-label">Total</p><p className="ap-kpi-value">{stats.total ?? 0}</p></div></div>
        <div className="ap-card"><div className="ap-card-body"><p className="ap-kpi-label">Pending</p><p className="ap-kpi-value">{stats.pending ?? 0}</p></div></div>
        <div className="ap-card"><div className="ap-card-body"><p className="ap-kpi-label">Approved</p><p className="ap-kpi-value">{stats.approved ?? 0}</p></div></div>
        <div className="ap-card"><div className="ap-card-body"><p className="ap-kpi-label">Under Review</p><p className="ap-kpi-value">{stats.underReview ?? 0}</p></div></div>
      </div>

      <div className="ap-row" style={{ marginBottom: 12 }}>
        <div className="ap-col" style={{ maxWidth: 220 }}>
          <select className="ap-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
        <div className="ap-col" style={{ maxWidth: 260 }}>
          <input className="ap-input" placeholder="Search by name/email/PAN" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <button type="button" className="ap-btn ap-btn-secondary" onClick={load}>Apply</button>
        </div>
      </div>

      <div className="ap-table-wrap">
        <div className="ap-table-scroll">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Investor</th>
                <th>PAN</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div style={{ display: 'grid', placeItems: 'center', padding: 16 }}><div className="ap-spinner" /></div></td></tr>
              ) : filtered.length ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.investorName || '-'}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{item.investorEmail || '-'}</div>
                    </td>
                    <td>{item.panNumber || '-'}</td>
                    <td>{item.riskProfile || '-'}</td>
                    <td>{item.status || '-'}</td>
                    <td>{item.submittedDate ? new Date(item.submittedDate).toLocaleString() : '-'}</td>
                    <td>
                      <div className="ap-actions">
                        <button type="button" className="ap-btn ap-btn-primary" onClick={() => approve(item.id)} disabled={actionLoadingId === item.id || item.status === 'Approved'}>
                          Approve
                        </button>
                        <button type="button" className="ap-btn ap-btn-danger" onClick={() => reject(item.id)} disabled={actionLoadingId === item.id || item.status === 'Rejected'}>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6}><div className="ap-empty">No document submissions found</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
