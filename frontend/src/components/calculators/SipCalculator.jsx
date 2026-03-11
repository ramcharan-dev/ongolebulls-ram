import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

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
  align-items: center;
  gap: 24px;
  background: #F8FAFC;
  padding: 24px;
  border-radius: 12px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 500;
  color: #0F172A;
  font-size: 15px;
`;

const ValueBadge = styled.div`
  background: #EFF6FF;
  color: #2563EB;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RangeInput = styled.input`
  width: 100%;
  accent-color: #2DD4BF;
  height: 6px;
  background: #E2E8F0;
  border-radius: 8px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #059669;
    cursor: pointer;
    border: 2px solid #FFF;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const RangeLimits = styled.div`
  display: flex;
  justify-content: space-between;
  color: #64748B;
  font-size: 12px;
`;

const ChartContainer = styled.div`
  width: 250px;
  height: 250px;
  position: relative;
`;

const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  margin-top: 16px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #E2E8F0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: #64748B;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.color || 'transparent'};
  }
`;

const StatValue = styled.span`
  color: #0F172A;
  font-weight: 700;
  font-size: 16px;
`;

const InfoNote = styled.p`
  color: #64748B;
  font-size: 13px;
  margin-top: 12px;
  line-height: 1.5;
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  // Future Value of SIP: FV = P × [((1+r)^n − 1) / r] × (1+r)
  const results = useMemo(() => {
    const P = Math.max(0, Number(monthlyInvestment));
    const annualReturn = Math.max(0, Number(expectedReturn));
    const years = Math.max(1, Number(timePeriod));

    const r = annualReturn / 12 / 100;
    const n = years * 12;
    
    const totalInvested = P * n;
    
    let futureValue = 0;
    if (r === 0) {
      futureValue = totalInvested;
    } else {
      futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }
    
    const estimatedReturns = Math.max(0, futureValue - totalInvested);

    return {
      totalInvested,
      estimatedReturns,
      futureValue
    };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const chartData = {
    labels: ['Invested Amount', 'Est. Returns'],
    datasets: [
      {
        data: [results.totalInvested, results.estimatedReturns],
        backgroundColor: ['#E2E8F0', '#059669'],
        hoverBackgroundColor: ['#CBD5E1', '#047857'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${formatCurrency(context.raw)}`
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <CalculatorContainer>
      <LeftSection>
        <InputGroup>
          <LabelRow>
            <Label>Monthly investment</Label>
            <ValueBadge>₹ {Intl.NumberFormat('en-IN').format(monthlyInvestment)}</ValueBadge>
          </LabelRow>
          <RangeInput 
            type="range" 
            min="500" 
            max="100000" 
            step="500" 
            value={monthlyInvestment} 
            onChange={(e) => setMonthlyInvestment(e.target.value)} 
          />
          <RangeLimits>
            <span>₹500</span>
            <span>₹1L</span>
          </RangeLimits>
        </InputGroup>

        <InputGroup>
          <LabelRow>
            <Label>Expected return rate (p.a)</Label>
            <ValueBadge>{expectedReturn}%</ValueBadge>
          </LabelRow>
          <RangeInput 
            type="range" 
            min="1" 
            max="30" 
            step="0.5" 
            value={expectedReturn} 
            onChange={(e) => setExpectedReturn(e.target.value)} 
          />
          <RangeLimits>
            <span>1%</span>
            <span>30%</span>
          </RangeLimits>
        </InputGroup>

        <InputGroup>
          <LabelRow>
            <Label>Time period</Label>
            <ValueBadge>{timePeriod} Yr</ValueBadge>
          </LabelRow>
          <RangeInput 
            type="range" 
            min="1" 
            max="40" 
            step="1" 
            value={timePeriod} 
            onChange={(e) => setTimePeriod(e.target.value)} 
          />
          <RangeLimits>
            <span>1 Yr</span>
            <span>40 Yr</span>
          </RangeLimits>
        </InputGroup>

        <InfoNote>
          A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds, helping you build wealth passively through the power of compounding.
        </InfoNote>
      </LeftSection>

      <RightSection>
        <ChartContainer>
          <Doughnut data={chartData} options={chartOptions} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Total Value</span>
            <br />
            <span style={{ fontSize: '18px', color: '#0F172A', fontWeight: 800 }}>
              {results.futureValue > 10000000
                ? `₹ ${(results.futureValue / 10000000).toFixed(2)} Cr`
                : results.futureValue > 100000
                ? `₹ ${(results.futureValue / 100000).toFixed(2)} L`
                : formatCurrency(results.futureValue)}
            </span>
          </div>
        </ChartContainer>

        <StatsGrid>
          <StatRow>
            <StatLabel color="#E2E8F0">Invested Amount</StatLabel>
            <StatValue>{formatCurrency(results.totalInvested)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel color="#059669">Est. Returns</StatLabel>
            <StatValue>{formatCurrency(results.estimatedReturns)}</StatValue>
          </StatRow>
          <StatRow style={{ borderTop: '2px dashed #CBD5E1', paddingTop: '12px', marginTop: '4px' }}>
            <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '16px' }}>Total Value</span>
            <StatValue style={{ fontSize: '20px', color: '#2563EB' }}>{formatCurrency(results.futureValue)}</StatValue>
          </StatRow>
        </StatsGrid>
      </RightSection>
    </CalculatorContainer>
  );
}
