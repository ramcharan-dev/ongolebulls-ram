import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Target, Users } from 'lucide-react';
import {
  getAlerts,
  getGoalChart,
  getKpi,
  getLeaderboard,
  getRiskChart,
  getSipChart,
} from '../../api/adminApi';

const emptyChart = { labels: [], data: [] };

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({});
  const [sipChart, setSipChart] = useState(emptyChart);
  const [riskChart, setRiskChart] = useState(emptyChart);
  const [goalChart, setGoalChart] = useState(emptyChart);
  const [leaderboard, setLeaderboard] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [kpiRes, sipRes, riskRes, goalRes, leaderRes, alertRes] = await Promise.all([
          getKpi(),
          getSipChart(),
          getRiskChart(),
          getGoalChart(),
          getLeaderboard(),
          getAlerts(),
        ]);

        setKpi(kpiRes.data || {});
        setSipChart(sipRes.data || emptyChart);
        setRiskChart(riskRes.data || emptyChart);
        setGoalChart(goalRes.data || emptyChart);
        setLeaderboard(Array.isArray(leaderRes.data) ? leaderRes.data : []);
        setAlerts(Array.isArray(alertRes.data) ? alertRes.data : []);
      } catch {
        setKpi({});
        setSipChart(emptyChart);
        setRiskChart(emptyChart);
        setGoalChart(emptyChart);
        setLeaderboard([]);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = useMemo(() => ([
    { label: 'Total Clients', value: kpi.totalClients ?? 0, icon: Users, iconClass: 'blue' },
    { label: 'Active Investments', value: kpi.activeInvestments ?? 0, icon: Activity, iconClass: 'green' },
    { label: 'Monthly SIPs', value: kpi.monthlySips ?? 0, icon: Target, iconClass: 'amber' },
    { label: 'RM Conversion %', value: kpi.rmConversionRate ?? 0, icon: BarChart3, iconClass: 'purple' },
  ]), [kpi]);

  const normalizeChart = (chart) => {
    const labels = Array.isArray(chart?.labels) ? chart.labels : [];

    let values = [];
    if (Array.isArray(chart?.data)) values = chart.data;
    else if (Array.isArray(chart?.values)) values = chart.values;
    else if (Array.isArray(chart?.executed)) values = chart.executed;
    else if (Array.isArray(chart?.planned)) values = chart.planned;

    const safeValues = values.map((value) => Number(value) || 0);

    if (!labels.length && safeValues.length) {
      return {
        labels: safeValues.map((_, index) => `Item ${index + 1}`),
        values: safeValues,
      };
    }

    return { labels, values: safeValues };
  };

  const renderBars = (chart) => {
    const normalized = normalizeChart(chart);
    const max = Math.max(...(normalized.values.length ? normalized.values : [0]), 1);

    return (
      <div>
        {normalized.labels.map((label, index) => (
          <div key={`${label}-${index}`} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#475569' }}>{label}</span>
              <span style={{ fontWeight: 700 }}>{normalized.values[index] ?? 0}</span>
            </div>
            <div style={{ height: 7, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((normalized.values[index] ?? 0) / max) * 100}%`,
                  background: 'linear-gradient(90deg, #059669, #34d399)',
                }}
              />
            </div>
          </div>
        ))}
        {!normalized.labels.length ? (
          <div className="ap-empty">No chart data</div>
        ) : null}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
        <div className="ap-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="ap-page-header">
        <div className="ap-page-title">
          <Activity size={20} />
          <div>
            <h1>Dashboard</h1>
            <p className="ap-page-subtitle">Live KPI and operational metrics</p>
          </div>
        </div>
      </div>

      <div className="ap-grid ap-grid-4" style={{ marginBottom: 14 }}>
        {cards.map(({ label, value, icon: Icon, iconClass }) => (
          <div key={label} className="ap-card">
            <div className="ap-card-body ap-kpi">
              <div>
                <p className="ap-kpi-label">{label}</p>
                <p className="ap-kpi-value">{value}</p>
              </div>
              <div className={`ap-kpi-icon ${iconClass}`}><Icon size={18} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-grid ap-grid-3" style={{ marginBottom: 14 }}>
        <div className="ap-card"><div className="ap-card-body"><h3 style={{ marginTop: 0 }}>SIP Chart</h3>{renderBars(sipChart)}</div></div>
        <div className="ap-card"><div className="ap-card-body"><h3 style={{ marginTop: 0 }}>Risk Distribution</h3>{renderBars(riskChart)}</div></div>
        <div className="ap-card"><div className="ap-card-body"><h3 style={{ marginTop: 0 }}>Goals Chart</h3>{renderBars(goalChart)}</div></div>
      </div>

      <div className="ap-grid ap-grid-2">
        <div className="ap-card">
          <div className="ap-card-body">
            <h3 style={{ marginTop: 0 }}>RM Leaderboard</h3>
            {leaderboard.length ? (
              leaderboard.map((entry, index) => (
                <div key={`${entry.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', padding: '9px 0' }}>
                  <strong>{entry.name}</strong>
                  <span>{entry.aum}</span>
                </div>
              ))
            ) : <div className="ap-empty">No leaderboard data</div>}
          </div>
        </div>

        <div className="ap-card">
          <div className="ap-card-body">
            <h3 style={{ marginTop: 0 }}>Smart Alerts</h3>
            {alerts.length ? (
              alerts.map((item, index) => (
                <div key={`${item.message}-${index}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, borderBottom: '1px solid #f1f5f9', padding: '9px 0' }}>
                  <AlertTriangle size={15} color="#d97706" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{item.type || item.title || 'Alert'}</div>
                    <div style={{ color: '#475569', fontSize: 13 }}>{item.message || item.detail || '-'}</div>
                  </div>
                </div>
              ))
            ) : <div className="ap-empty">No alerts found</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
