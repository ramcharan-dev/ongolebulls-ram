import React from 'react';
import styled from 'styled-components';
import { DynamicGreeting } from '../widgets/DynamicGreeting';
import { StatusCards } from '../widgets/StatusCards';
import { DashboardWidgets } from '../widgets/DashboardWidgets';

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

export const DashboardHome = () => {
  return (
    <DashboardHomeContainer>
      <DynamicGreeting />
      <StatusCards />
      
      <SectionTitle>Portfolio Overview</SectionTitle>
      <DashboardWidgets />
    </DashboardHomeContainer>
  );
};
