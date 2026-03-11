import React from 'react';
import styled from 'styled-components';
import SipCalculator from '../../components/calculators/SipCalculator';

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

export default function SipPage() {
  return (
    <PageContainer>
      <PageHeader>
        <Title>SIP Calculator</Title>
        <Subtitle>
          Calculate the future value of your Systematic Investment Plan and discover how small, regular investments can create massive wealth.
        </Subtitle>
      </PageHeader>
      
      <SipCalculator />
    </PageContainer>
  );
}
