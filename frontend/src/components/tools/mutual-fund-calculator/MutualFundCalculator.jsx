import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 32px;
  border: 1px solid var(--border);
  max-width: 1000px;
  margin: 0 auto;
  color: var(--text-primary);

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
  background: ${({ $isDark }) => ($isDark ? '#111b2e' : '#F8FAFC')};
  padding: 32px 24px;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const ToggleContainer = styled.div`
  display: flex;
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : '#F1F5F9')};
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 8px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${(props) => {
    if (!props.$active) return 'transparent';
    return props.$isDark ? '#1e293b' : '#FFFFFF';
  }};
  color: ${(props) => {
    if (props.$active) return props.$isDark ? '#93c5fd' : '#2563EB';
    return 'var(--text-muted)';
  }};
  box-shadow: ${(props) => (props.$active ? '0 1px 3px rgba(0,0,0,0.12)' : 'none')};
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.$active ? (props.$isDark ? '#bfdbfe' : '#2563EB') : 'var(--text-primary)')};
  }
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
  color: var(--text-primary);
  font-size: 15px;
`;

const ValueInputWrapper = styled.div`
  background: ${({ $isDark }) => ($isDark ? '#0f172a' : '#EFF6FF')};
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 6px 16px;
  border: 1px solid ${({ $isDark }) => ($isDark ? '#334155' : '#BFDBFE')};
`;

const Prefix = styled.span`
  color: ${({ $isDark }) => ($isDark ? '#93c5fd' : '#2563EB')};
  font-weight: 600;
  margin-right: 4px;
`;

const NumberInput = styled.input`
  background: transparent;
  border: none;
  color: ${({ $isDark }) => ($isDark ? '#93c5fd' : '#2563EB')};
  font-weight: 600;
  font-size: 15px;
  width: 80px;
  text-align: right;
  outline: none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Suffix = styled.span`
  color: ${({ $isDark }) => ($isDark ? '#93c5fd' : '#2563EB')};
  font-weight: 600;
  margin-left: 4px;
`;

const RangeInput = styled.input`
  width: 100%;
  accent-color: ${({ $isDark }) => ($isDark ? '#22d3ee' : '#2DD4BF')};
  height: 6px;
  background: ${({ $isDark }) => ($isDark ? '#334155' : '#E2E8F0')};
  border-radius: 8px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ $isDark }) => ($isDark ? '#06b6d4' : '#059669')};
    cursor: pointer;
    border: 2px solid ${({ $isDark }) => ($isDark ? '#0f172a' : '#FFF')};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
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
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: var(--text-muted);
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
  color: var(--text-primary);
  font-weight: 700;
  font-size: 16px;
`;

const TotalValueRow = styled(StatRow)`
  border-bottom: none;
  border-top: 2px dashed ${({ $isDark }) => ($isDark ? '#334155' : '#CBD5E1')};
  padding-top: 12px;
  margin-top: 4px;
`;

const TotalLabel = styled.span`
  color: var(--text-primary);
  font-weight: 700;
  font-size: 16px;
`;

const TotalValue = styled(StatValue)`
  font-size: 20px;
  color: ${({ $isDark }) => ($isDark ? '#93c5fd' : '#2563EB')};
`;

const ChartCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
`;

const ChartCenterLabel = styled.span`
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
`;

const ChartCenterValue = styled.span`
  font-size: 18px;
  color: var(--text-primary);
  font-weight: 800;
`;

const CTAButton = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  background-color: #059669;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);
  transition: background-color 0.2s;

  &:hover {
    background-color: #047857;
  }
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function MutualFundCalculator({
  title = 'Mutual Fund Calculator',
  initialMode = 'SIP',
}) {
  const { isDark } = useTheme();
  const [mode, setMode] = useState(initialMode); // 'SIP' | 'LUMPSUM'
  
  // States
  const [investmentAmount, setInvestmentAmount] = useState(25000);
  const [timePeriod, setTimePeriod] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Core Math
  const results = useMemo(() => {
    const P = Math.max(0, Number(investmentAmount));
    const annualReturn = Math.max(0, Number(expectedReturn));
    const years = Math.max(1, Number(timePeriod));

    let totalInvested = 0;
    let futureValue = 0;

    if (mode === 'SIP') {
      const r = annualReturn / 12 / 100;
      const n = years * 12;
      totalInvested = P * n;
      if (r === 0) {
        futureValue = totalInvested;
      } else {
        futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      }
    } else { // LUMPSUM
      const r = annualReturn / 100;
      totalInvested = P;
      futureValue = P * Math.pow(1 + r, years);
    }

    const estimatedReturns = Math.max(0, futureValue - totalInvested);

    return { totalInvested, estimatedReturns, futureValue };
  }, [investmentAmount, timePeriod, expectedReturn, mode]);

  // Handler functions to seamlessly update form controls
  const handleAmountChange = (val) => setInvestmentAmount(Number(val));
  const handleTimeChange = (val) => setTimePeriod(Number(val));
  const handleReturnChange = (val) => setExpectedReturn(Number(val));

  const chartData = useMemo(() => ({
    labels: ['Invested Amount', 'Est. Returns'],
    datasets: [
      {
        data: [results.totalInvested, results.estimatedReturns],
        backgroundColor: [isDark ? '#334155' : '#E2E8F0', isDark ? '#06b6d4' : '#059669'],
        hoverBackgroundColor: [isDark ? '#475569' : '#CBD5E1', isDark ? '#0891b2' : '#047857'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  }), [isDark, results.totalInvested, results.estimatedReturns]);

  const chartOptions = useMemo(() => ({
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: isDark ? '#334155' : '#1e293b',
        borderWidth: 1,
        callbacks: {
          label: (context) => ` ${context.label}: ${formatCurrency(context.raw)}`
        }
      }
    },
    maintainAspectRatio: false,
  }), [isDark]);

  return (
    <CalculatorContainer>
      <LeftSection>
        {title ? <Title>{title}</Title> : null}
        <ToggleContainer $isDark={isDark}>
          <ToggleButton $isDark={isDark} $active={mode === 'SIP'} onClick={() => { setMode('SIP'); setInvestmentAmount(25000); }}>
            SIP Investment
          </ToggleButton>
          <ToggleButton $isDark={isDark} $active={mode === 'LUMPSUM'} onClick={() => { setMode('LUMPSUM'); setInvestmentAmount(100000); }}>
            One-Time Investment
          </ToggleButton>
        </ToggleContainer>

        {/* Amount Input */}
        <InputGroup>
          <LabelRow>
            <Label>{mode === 'SIP' ? 'Monthly Investment Amount' : 'Total Investment Amount'}</Label>
            <ValueInputWrapper $isDark={isDark}>
              <Prefix $isDark={isDark}>₹</Prefix>
              <NumberInput 
                $isDark={isDark}
                type="number" 
                value={investmentAmount} 
                onChange={(e) => handleAmountChange(e.target.value)} 
              />
            </ValueInputWrapper>
          </LabelRow>
          <RangeInput 
            $isDark={isDark}
            type="range" 
            min={mode === 'SIP' ? 500 : 5000} 
            max={mode === 'SIP' ? 100000 : 10000000} 
            step={mode === 'SIP' ? 500 : 5000} 
            value={investmentAmount} 
            onChange={(e) => handleAmountChange(e.target.value)} 
          />
        </InputGroup>

        {/* Expected Return Input */}
        <InputGroup>
          <LabelRow>
            <Label>Expected Annual Return (%)</Label>
            <ValueInputWrapper $isDark={isDark}>
              <NumberInput 
                $isDark={isDark}
                type="number" 
                value={expectedReturn} 
                onChange={(e) => handleReturnChange(e.target.value)} 
                step="0.5" 
                style={{ width: '40px' }}
              />
              <Suffix $isDark={isDark}>%</Suffix>
            </ValueInputWrapper>
          </LabelRow>
          <RangeInput 
            $isDark={isDark}
            type="range" 
            min="1" 
            max="30" 
            step="0.5" 
            value={expectedReturn} 
            onChange={(e) => handleReturnChange(e.target.value)} 
          />
        </InputGroup>

        {/* Duration Input */}
        <InputGroup>
          <LabelRow>
            <Label>Investment Duration (Years)</Label>
            <ValueInputWrapper $isDark={isDark}>
              <NumberInput 
                $isDark={isDark}
                type="number" 
                value={timePeriod} 
                onChange={(e) => handleTimeChange(e.target.value)} 
                style={{ width: '40px' }}
              />
              <Suffix $isDark={isDark}>Yr</Suffix>
            </ValueInputWrapper>
          </LabelRow>
          <RangeInput 
            $isDark={isDark}
            type="range" 
            min="1" 
            max="40" 
            step="1" 
            value={timePeriod} 
            onChange={(e) => handleTimeChange(e.target.value)} 
          />
        </InputGroup>

      </LeftSection>

      <RightSection $isDark={isDark}>
        <ChartContainer>
          <Doughnut data={chartData} options={chartOptions} />
          <ChartCenter>
            <ChartCenterLabel>Total Value</ChartCenterLabel>
            <br />
            <ChartCenterValue>
              {results.futureValue > 10000000
                ? `₹ ${(results.futureValue / 10000000).toFixed(2)} Cr`
                : results.futureValue > 100000
                ? `₹ ${(results.futureValue / 100000).toFixed(2)} L`
                : formatCurrency(results.futureValue)}
            </ChartCenterValue>
          </ChartCenter>
        </ChartContainer>

        <StatsGrid>
          <StatRow>
            <StatLabel color={isDark ? '#334155' : '#E2E8F0'}>Total Investment</StatLabel>
            <StatValue>{formatCurrency(results.totalInvested)}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel color={isDark ? '#06b6d4' : '#059669'}>Estimated Returns</StatLabel>
            <StatValue>{formatCurrency(results.estimatedReturns)}</StatValue>
          </StatRow>
          <TotalValueRow $isDark={isDark}>
            <TotalLabel>Total Value</TotalLabel>
            <TotalValue $isDark={isDark}>{formatCurrency(results.futureValue)}</TotalValue>
          </TotalValueRow>
        </StatsGrid>

        <CTAButton>
          Start Investing &rarr;
        </CTAButton>
      </RightSection>
    </CalculatorContainer>
  );
}
