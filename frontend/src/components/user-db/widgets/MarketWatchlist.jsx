import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

/* ─── Animations ─────────────────────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ──────────────────────────────────────────────────── */

const WatchlistCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease-out;
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
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
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0;
  padding: 0 20px;
  margin-bottom: 4px;
`;

const MiniTab = styled.button`
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.textMuted};
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.secondary : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ItemList = styled.div`
  padding: 4px 0;
  flex: 1;
`;

const WatchlistItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  transition: background-color 0.12s;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`;

const ItemLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.2px;
`;

const ItemSector = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const ItemRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ItemPrice = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ItemChange = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $positive }) => $positive ? '#059669' : '#DC2626'};
  margin-top: 2px;
`;

const ViewAll = styled.button`
  display: block;
  width: 100%;
  padding: 14px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  background: transparent;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`;

/* ─── Data ───────────────────────────────────────────────────────────────── */

const INDICES = [
  { name: 'NIFTY 50', sector: 'Index', price: '24,560.10', change: '+1.20', pct: '+0.52', positive: true },
  { name: 'SENSEX', sector: 'Index', price: '80,123.45', change: '+640.30', pct: '+0.81', positive: true },
  { name: 'NIFTY BANK', sector: 'Index', price: '52,340.80', change: '-120.50', pct: '-0.23', positive: false },
];

const GAINERS = [
  { name: 'RELIANCE', sector: 'Energy', price: '₹2,945.60', change: '+62.40', pct: '+2.16', positive: true },
  { name: 'TCS', sector: 'IT', price: '₹4,120.35', change: '+48.70', pct: '+1.20', positive: true },
  { name: 'HDFCBANK', sector: 'Banking', price: '₹1,740.90', change: '+28.15', pct: '+1.64', positive: true },
  { name: 'INFY', sector: 'IT', price: '₹1,890.25', change: '+22.80', pct: '+1.22', positive: true },
  { name: 'BHARTIARTL', sector: 'Telecom', price: '₹1,650.40', change: '+18.90', pct: '+1.16', positive: true },
];

const LOSERS = [
  { name: 'TATAMOTORS', sector: 'Auto', price: '₹890.60', change: '-24.30', pct: '-2.66', positive: false },
  { name: 'ADANIENT', sector: 'Infra', price: '₹2,340.15', change: '-48.70', pct: '-2.04', positive: false },
  { name: 'SUNPHARMA', sector: 'Pharma', price: '₹1,420.80', change: '-18.40', pct: '-1.28', positive: false },
  { name: 'WIPRO', sector: 'IT', price: '₹510.25', change: '-6.30', pct: '-1.22', positive: false },
  { name: 'COALINDIA', sector: 'Mining', price: '₹380.90', change: '-4.20', pct: '-1.09', positive: false },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export const MarketWatchlist = () => {
  const [activeTab, setActiveTab] = useState('indices');

  const data = activeTab === 'indices' ? INDICES : activeTab === 'gainers' ? GAINERS : LOSERS;

  return (
    <WatchlistCard>
      <CardHeader>
        <CardTitle>Market Watch</CardTitle>
        <IconBadge><BarChart3 size={18} /></IconBadge>
      </CardHeader>

      <TabRow>
        <MiniTab $active={activeTab === 'indices'} onClick={() => setActiveTab('indices')}>
          Indices
        </MiniTab>
        <MiniTab $active={activeTab === 'gainers'} onClick={() => setActiveTab('gainers')}>
          Top Gainers
        </MiniTab>
        <MiniTab $active={activeTab === 'losers'} onClick={() => setActiveTab('losers')}>
          Top Losers
        </MiniTab>
      </TabRow>

      <ItemList>
        {data.map((item) => (
          <WatchlistItem key={item.name}>
            <ItemLeft>
              <ItemName>{item.name}</ItemName>
              <ItemSector>{item.sector}</ItemSector>
            </ItemLeft>
            <ItemRight>
              <ItemPrice>{item.price}</ItemPrice>
              <ItemChange $positive={item.positive}>
                {item.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.change} ({item.pct}%)
              </ItemChange>
            </ItemRight>
          </WatchlistItem>
        ))}
      </ItemList>

      <ViewAll>View All Stocks →</ViewAll>
    </WatchlistCard>
  );
};
