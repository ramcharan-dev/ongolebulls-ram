import { useState } from 'react';
import { calculateSIP, calculateLumpsum } from '../../api/calculatorApi';
import { formatCurrency } from '../../utils/formatters';

export default function Calculator() {
  const [mode, setMode]   = useState('sip'); // 'sip' | 'lumpsum'
  const [form, setForm]   = useState({ monthly: 5000, amount: 100000, rate: 12, years: 10 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: parseFloat(e.target.value) }));

  const calculate = async (e) => {
    e.preventDefault(); setError(''); setResult(null);
    setLoading(true);
    try {
      let res;
      if (mode === 'sip') {
        res = await calculateSIP(form.monthly, form.rate, form.years);
      } else {
        res = await calculateLumpsum(form.amount, form.rate, form.years);
      }
      setResult(res.data);
    } catch (err) {
      setError(err.userMessage || 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 700 }}>
      <h1 className="page-title">Investment Calculator</h1>

      {/* Toggle */}
      <div style={{ display:'flex', gap:8, marginBottom:'1.5rem' }}>
        {['sip','lumpsum'].map((m) => (
          <button key={m} className={`btn ${mode===m ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setMode(m); setResult(null); }}>
            {m === 'sip' ? 'SIP Calculator' : 'Lumpsum Calculator'}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'start' }}>
        {/* Inputs */}
        <div className="card">
          <form onSubmit={calculate}>
            {mode === 'sip' ? (
              <div className="form-group">
                <label>Monthly Investment (₹)</label>
                <input type="number" name="monthly" value={form.monthly} onChange={handle} min={100} />
              </div>
            ) : (
              <div className="form-group">
                <label>One-Time Investment (₹)</label>
                <input type="number" name="amount" value={form.amount} onChange={handle} min={1000} />
              </div>
            )}
            <div className="form-group">
              <label>Expected Annual Return (%)</label>
              <input type="number" name="rate" value={form.rate} onChange={handle} min={1} max={50} step={0.1} />
            </div>
            <div className="form-group">
              <label>Investment Period (years)</label>
              <input type="number" name="years" value={form.years} onChange={handle} min={1} max={40} />
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Calculating…' : 'Calculate'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="card" style={{ background: result ? '#f0fdf4' : '#f9fafb' }}>
          {result ? (
            <div>
              <h3 style={{ marginBottom:'1.25rem', color:'#14532d' }}>Results</h3>
              {[
                ['Invested Amount',   result.investedAmount],
                ['Estimated Returns', result.estimatedReturns],
                ['Maturity Value',    result.maturityValue],
              ].map(([label, val]) => (
                <div key={label} style={{ marginBottom:'1rem' }}>
                  <p style={{ fontSize:13, color:'#6b7280' }}>{label}</p>
                  <p style={{ fontSize:'1.25rem', fontWeight:700, color: label === 'Maturity Value' ? '#16a34a' : '#111827' }}>
                    {formatCurrency(val)}
                  </p>
                </div>
              ))}
              <div style={{ marginTop:'1rem', padding:'1rem', background:'#dcfce7', borderRadius:8 }}>
                <p style={{ fontSize:13, color:'#166534' }}>
                  💡 Your investment grows by{' '}
                  <b>{((result.estimatedReturns / result.investedAmount) * 100).toFixed(1)}%</b>{' '}
                  over {form.years} years.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:'center', color:'#9ca3af', padding:'2rem 0' }}>
              <p style={{ fontSize:40, marginBottom:'.5rem' }}>📊</p>
              <p>Enter values and click Calculate to see your projected returns.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
