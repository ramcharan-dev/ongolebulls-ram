import React from 'react';
import styled from 'styled-components';
import LumpsumCalculator from '../../components/calculators/LumpsumCalculator';

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

export default function LumpsumPage() {
  return (
    <PageContainer>
      <PageHeader>
        <Title>Lumpsum Calculator</Title>
        <Subtitle>
          Estimate the future value of your one-time investments. See how your lumpsum grows over years through compounding.
        </Subtitle>
      </PageHeader>
      
      <LumpsumCalculator />
    </PageContainer>
  );
}
