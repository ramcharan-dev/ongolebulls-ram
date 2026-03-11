import styled from 'styled-components';

const ProgressWrap = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 16px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  p {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ProgressRail = styled.div`
  margin-top: 10px;
  height: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    width: ${({ $progress }) => `${$progress}%`};
    background: linear-gradient(90deg, #2563eb, #06b6d4);
    transition: width 220ms ease;
  }
`;

const StepScroller = styled.div`
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 2px;
`;

const StepList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-start;
  min-width: max-content;
`;

const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
`;

const StepBubble = styled.button`
  width: 92px;
  border: none;
  background: transparent;
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 0;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:disabled {
    pointer-events: none;
  }
`;

const StepNumber = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 2px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;

  ${({ $done, $active }) => {
    if ($done) {
      return `
        border-color: #16a34a;
        background: #16a34a;
        color: #ffffff;
      `;
    }

    if ($active) {
      return `
        border-color: #2563eb;
        background: #eff6ff;
        color: #1d4ed8;
      `;
    }

    return `
      border-color: #cbd5e1;
      background: #f8fafc;
      color: #64748b;
    `;
  }}
`;

const StepLabel = styled.span`
  font-size: 11px;
  text-align: center;
  color: #334155;
  font-weight: 700;
`;

const StepConnector = styled.span`
  width: 26px;
  height: 2px;
  margin-top: 16px;
  background: ${({ $done }) => ($done ? '#22c55e' : '#dbe4ef')};
`;

export default function KycProgress({ steps, currentStep, onStepClick }) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <ProgressWrap>
      <MetaRow>
        <p>KYC onboarding progress</p>
        <p>{progress}% complete</p>
      </MetaRow>

      <ProgressRail $progress={progress} aria-hidden="true">
        <span />
      </ProgressRail>

      <StepScroller>
        <StepList>
          {steps.map((step, index) => {
            const done = index < currentStep;
            const active = index === currentStep;
            const clickable = index <= currentStep;

            return (
              <StepItem key={step}>
                <StepBubble
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick(index)}
                  $clickable={clickable}
                >
                  <StepNumber $done={done} $active={active}>{done ? '✓' : index + 1}</StepNumber>
                  <StepLabel>{step}</StepLabel>
                </StepBubble>
                {index < steps.length - 1 ? <StepConnector $done={done} aria-hidden="true" /> : null}
              </StepItem>
            );
          })}
        </StepList>
      </StepScroller>
    </ProgressWrap>
  );
}
