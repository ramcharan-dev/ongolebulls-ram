import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { generateRmReport } from '../../api/adminApi';

export default function InvestmentsPage() {
  const [format, setFormat] = useState('pdf');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const runReport = async () => {
    setLoading(true);
    try {
      const response = await generateRmReport(format);
      setResponseText(response.data || 'Report generated');
    } catch (err) {
      setResponseText(err.userMessage || 'Unable to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <TrendingUp size={20} />
          <div>
            <h1>Investments</h1>
            <p className="ap-page-subtitle">Generate RM investment reports from backend</p>
          </div>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-body">
          <div className="ap-row" style={{ alignItems: 'end' }}>
            <div className="ap-col" style={{ maxWidth: 220 }}>
              <label className="ap-label" htmlFor="rm-format">Output Format</label>
              <select id="rm-format" className="ap-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="xlsx">XLSX</option>
              </select>
            </div>
            <div>
              <button type="button" className="ap-btn ap-btn-primary" onClick={runReport} disabled={loading}>
                {loading ? 'Generating...' : 'Generate RM Report'}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16, border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', padding: 14, minHeight: 80, whiteSpace: 'pre-wrap', fontSize: 13, color: '#334155' }}>
            {responseText || 'Run report to see backend response'}
          </div>
        </div>
      </div>
    </div>
  );
}
