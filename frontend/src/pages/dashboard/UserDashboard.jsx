import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, getAssetAllocation, createInvestmentRequest, createRedemptionRequest, createSipRequest } from '../../api/userApi';
import { getUser, clearUser } from '../../utils/storage';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function UserDashboard() {
  const navigate  = useNavigate();
  const user      = getUser();
  const userId    = user?.id;

  const [data, setData]       = useState(null);
  const [alloc, setAlloc]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Modal state for actions
  const [modal, setModal]     = useState(null); // 'invest' | 'redeem' | 'sip'
  const [actionForm, setActionForm] = useState({ fundName: '', amount: '', frequency: 'MONTHLY', startDate: '' });
  const [actionMsg, setActionMsg]   = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [dashRes, allocRes] = await Promise.all([
        getDashboard(userId),
        getAssetAllocation(userId),
      ]);
      setData(dashRes.data);
      setAlloc(allocRes.data || []);
    } catch (e) {
      setError(e.userMessage || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleLogout = () => { clearUser(); navigate('/login'); };

  const submitAction = async () => {
    try {
      const base = { userId, fundName: actionForm.fundName, amount: parseFloat(actionForm.amount) };
      if (modal === 'invest') await createInvestmentRequest(base);
      if (modal === 'redeem') await createRedemptionRequest(base);
      if (modal === 'sip')    await createSipRequest({ ...base, frequency: actionForm.frequency, startDate: actionForm.startDate });
      setActionMsg('Request submitted successfully!');
      setTimeout(() => { setModal(null); setActionMsg(''); load(); }, 1500);
    } catch (e) {
      setActionMsg(e.userMessage || 'Request failed.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard…" />;
  if (error)   return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <ErrorMessage message={error} onRetry={load} />
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Welcome, {user?.fullName || 'Investor'} 👋
          </h1>
          <p className="text-muted">{user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/kyc')}>KYC Docs</button>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Portfolio Value',   value: formatCurrency(data?.totalPortfolioValue) },
          { label: 'Invested Amount',   value: formatCurrency(data?.totalInvestedAmount) },
          { label: 'Portfolio Growth',  value: formatPercent(data?.portfolioGrowth) },
          { label: 'Active SIPs',       value: data?.activeSips ?? 0 },
        ].map((kpi) => (
          <div className="card" key={kpi.label} style={{ textAlign: 'center' }}>
            <p className="text-muted" style={{ fontSize: 12 }}>{kpi.label}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#16a34a', marginTop: 4 }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[['invest','Invest More','#16a34a'],['redeem','Redeem','#dc2626'],['sip','Start SIP','#2563eb']].map(([key, label, color]) => (
          <button key={key} className="btn"
            style={{ background: color, color: '#fff' }}
            onClick={() => { setModal(key); setActionForm({ fundName:'', amount:'', frequency:'MONTHLY', startDate:'' }); setActionMsg(''); }}>
            {label}
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 className="section-title">Recent Transactions</h3>
        {data?.recentTransactions?.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                {['Date','Fund','Type','Amount'].map(h => <th key={h} style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px 0' }}>{formatDate(t.txnDate)}</td>
                  <td style={{ padding: '8px 0' }}>{t.fundName}</td>
                  <td style={{ padding: '8px 0' }}><span className="badge badge-approved">{t.type}</span></td>
                  <td style={{ padding: '8px 0' }}>{formatCurrency(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-muted">No transactions yet.</p>}
      </div>

      {/* Fund Suggestions */}
      {data?.fundSuggestions?.length > 0 && (
        <div>
          <h3 className="section-title">Suggested Funds</h3>
          <div className="grid-3">
            {data.fundSuggestions.map((f) => (
              <div className="card" key={f.id}>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>{f.fundName}</p>
                <p style={{ color: '#16a34a', fontWeight: 700 }}>{formatPercent(f.oneYearReturnPercent)} 1Y Return</p>
                <p className="text-muted">{f.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div className="card" style={{ width: 380 }}>
            <h3 style={{ marginBottom:'1rem', textTransform:'capitalize' }}>
              {modal === 'invest' ? 'Invest More' : modal === 'redeem' ? 'Redeem Funds' : 'Start SIP'}
            </h3>
            {actionMsg && <div className={`alert ${actionMsg.includes('success') ? 'alert-success' : 'alert-error'}`}>{actionMsg}</div>}
            <div className="form-group">
              <label>Fund Name</label>
              <input value={actionForm.fundName} onChange={e => setActionForm(p => ({...p, fundName: e.target.value}))} placeholder="e.g. SBI Bluechip Fund" />
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" min="100" value={actionForm.amount} onChange={e => setActionForm(p => ({...p, amount: e.target.value}))} />
            </div>
            {modal === 'sip' && (
              <>
                <div className="form-group">
                  <label>Frequency</label>
                  <select value={actionForm.frequency} onChange={e => setActionForm(p => ({...p, frequency: e.target.value}))}>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={actionForm.startDate} onChange={e => setActionForm(p => ({...p, startDate: e.target.value}))} />
                </div>
              </>
            )}
            <div style={{ display:'flex', gap:8, marginTop:'0.5rem' }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={submitAction}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
