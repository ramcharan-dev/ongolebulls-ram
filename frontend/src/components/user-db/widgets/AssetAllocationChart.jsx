import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getAssetAllocation } from '../../../api/userApi';

ChartJS.register(ArcElement, Tooltip, Legend);

/* ─── Animations ─────────────────────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ──────────────────────────────────────────────────── */

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  animation: ${fadeIn} 0.4s ease-out;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const IconBadge = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
`;

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 220px;
  margin: 0 auto 20px;
`;

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
`;

const LegendLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background-color: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const LegendValue = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const LegendPct = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 6px;
  font-size: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

/* ─── Color Palette ──────────────────────────────────────────────────────── */

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#EC4899'];

/* ─── Fallback data ──────────────────────────────────────────────────────── */

const FALLBACK = [
  { assetClass: 'Equity', totalValue: 45000 },
  { assetClass: 'Debt', totalValue: 25000 },
  { assetClass: 'Gold', totalValue: 15000 },
  { assetClass: 'Hybrid', totalValue: 10000 },
  { assetClass: 'Others', totalValue: 5000 },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export const AssetAllocationChart = () => {
  const { user } = useAuth();
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setAllocation(FALLBACK);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getAssetAllocation(user.id)
      .then((res) => {
        if (!cancelled) {
          const data = res.data;
          setAllocation(data?.length ? data : FALLBACK);
        }
      })
      .catch(() => { setAllocation(FALLBACK); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  const total = allocation.reduce((s, a) => s + (a.totalValue || 0), 0);

  const chartData = {
    labels: allocation.map((a) => a.assetClass),
    datasets: [{
      data: allocation.map((a) => a.totalValue),
      backgroundColor: COLORS.slice(0, allocation.length),
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { size: 13, weight: 600 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ₹${ctx.raw.toLocaleString('en-IN')} (${pct}%)`;
          },
        },
      },
    },
  };

  if (loading) return null;

  return (
    <ChartCard>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <IconBadge><PieChart size={18} /></IconBadge>
      </CardHeader>

      {total === 0 ? (
        <EmptyState>No investments yet</EmptyState>
      ) : (
        <>
          <ChartWrapper>
            <Doughnut data={chartData} options={chartOptions} />
          </ChartWrapper>
          <LegendList>
            {allocation.map((item, idx) => {
              const pct = total ? ((item.totalValue / total) * 100).toFixed(1) : 0;
              return (
                <LegendItem key={item.assetClass}>
                  <LegendLeft>
                    <LegendDot $color={COLORS[idx % COLORS.length]} />
                    <LegendLabel>{item.assetClass}</LegendLabel>
                  </LegendLeft>
                  <div>
                    <LegendValue>₹{item.totalValue.toLocaleString('en-IN')}</LegendValue>
                    <LegendPct>{pct}%</LegendPct>
                  </div>
                </LegendItem>
              );
            })}
          </LegendList>
        </>
      )}
    </ChartCard>
  );
};
