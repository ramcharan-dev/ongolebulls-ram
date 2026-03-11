import { useEffect, useState } from 'react';
import { getAllFunds, filterFunds } from '../../api/fundApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const RISKS    = ['LOW','MODERATE','HIGH'];
const HORIZONS = ['SHORT','MEDIUM','LONG'];
const GOALS    = ['RETIREMENT','WEALTH','TAX_SAVING','EDUCATION'];
const ASSETS   = ['EQUITY','DEBT','LIQUID','HYBRID'];

const toggle = (arr, val) =>
  arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

export default function Funds() {
  const [funds, setFunds]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filters, setFilters] = useState({ risks:[], horizons:[], goals:[], assets:[] });
  const [filtered, setFiltered] = useState(null); // null = show all

  const loadAll = async () => {
    setLoading(true); setError('');
    try {
      const res = await getAllFunds();
      setFunds(res.data || []);
    } catch (e) { setError(e.userMessage || 'Failed to load funds.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const applyFilters = async () => {
    const { risks, horizons, goals, assets } = filters;
    if (!risks.length && !horizons.length && !goals.length && !assets.length) {
      setFiltered(null); return;
    }
    setLoading(true);
    try {
      const res = await filterFunds(risks, horizons, goals, assets);
      setFiltered(res.data || []);
    } catch (e) { setError(e.userMessage || 'Filter failed.'); }
    finally { setLoading(false); }
  };

  const resetFilters = () => {
    setFilters({ risks:[], horizons:[], goals:[], assets:[] });
    setFiltered(null);
  };

  const list = filtered ?? funds;

  const CheckGroup = ({ label, options, key }) => (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((opt) => (
          <label key={opt} style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, cursor:'pointer' }}>
            <input type="checkbox" checked={filters[key].includes(opt)}
              onChange={() => setFilters(p => ({ ...p, [key]: toggle(p[key], opt) }))} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Mutual Funds</h1>

      <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-start' }}>
        {/* Sidebar filters */}
        <aside style={{ width: 200, flexShrink: 0 }}>
          <div className="card">
            <h4 style={{ marginBottom:'1rem' }}>Filters</h4>
            <CheckGroup label="Risk"    options={RISKS}    key="risks" />
            <CheckGroup label="Horizon" options={HORIZONS} key="horizons" />
            <CheckGroup label="Goal"    options={GOALS}    key="goals" />
            <CheckGroup label="Asset"   options={ASSETS}   key="assets" />
            <button className="btn btn-primary btn-block btn-sm" onClick={applyFilters}>Apply</button>
            <button className="btn btn-outline btn-block btn-sm mt-1" onClick={resetFilters}>Reset</button>
          </div>
        </aside>

        {/* Fund cards */}
        <div style={{ flex: 1 }}>
          {loading && <LoadingSpinner />}
          {error   && <ErrorMessage message={error} onRetry={loadAll} />}
          {!loading && !error && (
            <>
              <p className="text-muted mb-2">{list.length} fund{list.length !== 1 ? 's' : ''} found</p>
              <div className="grid-2">
                {list.map((f) => (
                  <div className="card" key={f.id} style={{ borderTop: '3px solid #16a34a' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                      <h4 style={{ fontSize:15, fontWeight:600 }}>{f.name}</h4>
                      <span className="badge" style={{ background:'#dcfce7', color:'#166534' }}>{f.risk}</span>
                    </div>
                    <p className="text-muted" style={{ fontSize:13, marginBottom:8 }}>{f.type} · {f.assetType} · {f.horizon}</p>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      <div>
                        <p style={{ fontSize:11, color:'#9ca3af' }}>Regular Returns</p>
                        <p style={{ fontWeight:700, color:'#16a34a' }}>{f.returnsRegular}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize:11, color:'#9ca3af' }}>Direct Returns</p>
                        <p style={{ fontWeight:700, color:'#16a34a' }}>{f.returnsDirect}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize:11, color:'#9ca3af' }}>NAV</p>
                        <p style={{ fontWeight:600 }}>₹{f.nav}</p>
                      </div>
                      <div>
                        <p style={{ fontSize:11, color:'#9ca3af' }}>Fund Age</p>
                        <p style={{ fontWeight:600 }}>{f.fundAge} yrs</p>
                      </div>
                    </div>
                    <p style={{ marginTop:8, fontSize:12, color:'#6b7280' }}>Goal: {f.goal}</p>
                  </div>
                ))}
              </div>
              {list.length === 0 && <p className="text-muted text-center">No funds match the selected filters.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
