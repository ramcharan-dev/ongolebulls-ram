import React from 'react';
import styled from 'styled-components';
import { DynamicGreeting } from '../widgets/DynamicGreeting';
import { StatusCards } from '../widgets/StatusCards';
import { DashboardWidgets } from '../widgets/DashboardWidgets';
import { AssetAllocationChart } from '../widgets/AssetAllocationChart';
import { MarketWatchlist } from '../widgets/MarketWatchlist';

const DashboardHomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const DashboardHome = () => {
  return (
    <DashboardHomeContainer>
      <DynamicGreeting />
      <StatusCards />

      <SectionTitle>Portfolio Overview</SectionTitle>
      <DashboardWidgets />

      <SectionTitle>Insights & Markets</SectionTitle>
      <TwoColumnGrid>
        <AssetAllocationChart />
        <MarketWatchlist />
      </TwoColumnGrid>
    </DashboardHomeContainer>
  );
};
