import { useState } from 'react';
import { FileText } from 'lucide-react';
import { getComplianceSummary } from '../../api/adminApi';

export default function PlansPage() {
  const [period, setPeriod] = useState('month');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const runCompliance = async () => {
    setLoading(true);
    try {
      const response = await getComplianceSummary(period);
      setResponseText(response.data || 'Completed');
    } catch (err) {
      setResponseText(err.userMessage || 'Failed to generate compliance summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <FileText size={20} />
          <div>
            <h1>Plans & Compliance</h1>
            <p className="ap-page-subtitle">Operational reporting controls wired to backend</p>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-body">
          <div className="ap-row" style={{ alignItems: 'end' }}>
            <div className="ap-col" style={{ maxWidth: 240 }}>
              <label className="ap-label" htmlFor="period">Period</label>
              <select id="period" className="ap-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div>
              <button type="button" className="ap-btn ap-btn-primary" onClick={runCompliance} disabled={loading}>
                {loading ? 'Running...' : 'Generate Compliance Summary'}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16, border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', padding: 14, minHeight: 80, whiteSpace: 'pre-wrap', fontSize: 13, color: '#334155' }}>
            {responseText || 'Run report to see server response'}
          </div>
        </div>
      </div>
    </div>
  );
}
