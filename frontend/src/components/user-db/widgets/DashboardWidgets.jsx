import React from 'react';
import styled from 'styled-components';
import { IndianRupee, TrendingUp, PiggyBank, ArrowRightLeft } from 'lucide-react';
import { SparkLine } from './SparkLine';

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const WidgetCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.md}, 0 0 0 1px ${({ theme }) => `${theme.colors.secondary}20`};
    border-color: ${({ theme }) => `${theme.colors.secondary}40`};
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const WidgetValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SparkLineWrapper = styled.div`
  margin-bottom: 10px;
`;

const WidgetSubtext = styled.div`
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ $color, theme }) => $color || theme.colors.textMuted};
`;

/* ─── Sparkline mock data ────────────────────────────────────────────────── */

const SPARK_PORTFOLIO = [80, 95, 88, 110, 105, 125, 118, 140, 135, 150];
const SPARK_RETURNS   = [0, 5, 3, 12, 8, 18, 15, 22, 20, 28];
const SPARK_SIPS      = [0, 500, 500, 1000, 1000, 1500, 1500, 2000, 2000, 2500];
const SPARK_TXN       = [2, 1, 3, 0, 4, 2, 1, 5, 3, 2];

export const DashboardWidgets = () => {
  return (
    <WidgetGrid>
      {/* Portfolio Value */}
      <WidgetCard>
        <WidgetHeader>
          <h3>Portfolio Value</h3>
          <IconWrapper $bg="rgba(59, 130, 246, 0.1)" $color="#3B82F6">
            <IndianRupee size={20} />
          </IconWrapper>
        </WidgetHeader>
        <WidgetValue>₹0.00</WidgetValue>
        <SparkLineWrapper>
          <SparkLine data={SPARK_PORTFOLIO} width={220} height={36} color="#3B82F6" />
        </SparkLineWrapper>
        <WidgetSubtext>Across all mutual funds</WidgetSubtext>
      </WidgetCard>

      {/* Today's Gain/Loss */}
      <WidgetCard>
        <WidgetHeader>
          <h3>Today's Return</h3>
          <IconWrapper $bg="rgba(16, 185, 129, 0.1)" $color="#10B981">
            <TrendingUp size={20} />
          </IconWrapper>
        </WidgetHeader>
        <WidgetValue>₹0.00</WidgetValue>
        <SparkLineWrapper>
          <SparkLine data={SPARK_RETURNS} width={220} height={36} color="#10B981" />
        </SparkLineWrapper>
        <WidgetSubtext $color="#10B981">
          <TrendingUp size={14} /> +0.00%
        </WidgetSubtext>
      </WidgetCard>

      {/* Active SIPs */}
      <WidgetCard>
        <WidgetHeader>
          <h3>Active SIPs</h3>
          <IconWrapper $bg="rgba(139, 92, 246, 0.1)" $color="#8B5CF6">
            <PiggyBank size={20} />
          </IconWrapper>
        </WidgetHeader>
        <WidgetValue>₹0 / mo</WidgetValue>
        <SparkLineWrapper>
          <SparkLine data={SPARK_SIPS} width={220} height={36} color="#8B5CF6" />
        </SparkLineWrapper>
        <WidgetSubtext>0 Ongoing SIPs</WidgetSubtext>
      </WidgetCard>

      {/* Recent Transactions */}
      <WidgetCard>
        <WidgetHeader>
          <h3>Recent Transactions</h3>
          <IconWrapper $bg="rgba(245, 158, 11, 0.1)" $color="#F59E0B">
            <ArrowRightLeft size={20} />
          </IconWrapper>
        </WidgetHeader>
        <WidgetValue style={{ fontSize: '20px', marginTop: '4px' }}>
          No recent activity
        </WidgetValue>
        <SparkLineWrapper>
          <SparkLine data={SPARK_TXN} width={220} height={36} color="#F59E0B" />
        </SparkLineWrapper>
        <WidgetSubtext>Your latest transactions will appear here</WidgetSubtext>
      </WidgetCard>
    </WidgetGrid>
  );
};
