import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 32px;
  border: 1px solid #E2E8F0;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background: #F8FAFC;
  padding: 32px;
  border-radius: 12px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #0F172A;
  font-size: 15px;
`;

const StyledInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #0F172A;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94A3B8;
  }
`;

const ResultCard = styled.div`
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  width: 100%;
`;

const ResultLabel = styled.p`
  color: #64748B;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ResultValue = styled.h2`
  color: #059669;
  font-size: 48px;
  font-weight: 800;
  margin: 0;
`;

const InfoNote = styled.p`
  color: #64748B;
  font-size: 13px;
  margin-top: 12px;
  line-height: 1.5;
`;

export default function CagrCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [finalValue, setFinalValue] = useState(310000);
  const [years, setYears] = useState(10);

  // CAGR = (FV / PV)^(1/n) − 1
  const cagrResult = useMemo(() => {
    const PV = Math.max(0, Number(initialInvestment));
    const FV = Math.max(0, Number(finalValue));
    const n = Math.max(0.1, Number(years)); // Prevent division by 0

    if (PV === 0) return 0;
    
    const ratio = FV / PV;
    if (ratio < 0) return 0; // Prevent imaginary numbers root

    const cagr = (Math.pow(ratio, 1 / n) - 1) * 100;
    
    return cagr.toFixed(2);
  }, [initialInvestment, finalValue, years]);

  return (
    <CalculatorContainer>
      <LeftSection>
        <InputGroup>
          <Label>Initial Investment (PV)</Label>
          <StyledInput 
            type="number" 
            min="0"
            value={initialInvestment} 
            onChange={(e) => setInitialInvestment(e.target.value)} 
          />
        </InputGroup>

        <InputGroup>
          <Label>Final Value (FV)</Label>
          <StyledInput 
            type="number" 
            min="0"
            value={finalValue} 
            onChange={(e) => setFinalValue(e.target.value)} 
          />
        </InputGroup>

        <InputGroup>
          <Label>Duration (Years)</Label>
          <StyledInput 
            type="number" 
            min="1"
            value={years} 
            onChange={(e) => setYears(e.target.value)} 
          />
        </InputGroup>

        <InfoNote>
          The Compound Annual Growth Rate (CAGR) measures the smoothened annualized growth of an investment over a specified time period.
        </InfoNote>
      </LeftSection>

      <RightSection>
        <ResultCard>
          <ResultLabel>Your Compound Annual Growth Rate</ResultLabel>
          <ResultValue>{cagrResult}%</ResultValue>
        </ResultCard>
      </RightSection>
    </CalculatorContainer>
  );
}
