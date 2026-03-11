import React from 'react';
import styled from 'styled-components';
import CagrCalculator from '../../components/calculators/CagrCalculator';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 120px 24px 40px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #64748B;
  max-width: 600px;
  margin: 0 auto;
`;

export default function CagrPage() {
  return (
    <PageContainer>
      <PageHeader>
        <Title>CAGR Calculator</Title>
        <Subtitle>
          Compute the Compound Annual Growth Rate of your investments to measure performance over multi-year periods.
        </Subtitle>
      </PageHeader>
      
      <CagrCalculator />
    </PageContainer>
  );
}
