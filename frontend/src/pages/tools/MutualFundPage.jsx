import React from 'react';
import styled from 'styled-components';
import MutualFundCalculator from '../../components/tools/mutual-fund-calculator/MutualFundCalculator';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 120px 24px 40px;
  color: var(--text-primary);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
`;

export default function MutualFundPage() {
  return (
    <PageContainer>
      <PageHeader>
        <Title>Mutual Fund Calculator</Title>
        <Subtitle>
          Estimate your mutual fund returns using SIP or Lumpsum investments. Instantly visualize your wealth growth.
        </Subtitle>
      </PageHeader>
      
      <MutualFundCalculator />
    </PageContainer>
  );
}
