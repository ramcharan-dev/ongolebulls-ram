import styled from 'styled-components';

const FooterRow = styled.footer`
  margin-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const NavGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  height: 42px;
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  ${({ $variant }) => {
    if ($variant === 'primary') {
      return `
        background: linear-gradient(135deg, #2563eb, #1e3a8a);
        color: #ffffff;
      `;
    }

    return `
      background: #ffffff;
      border-color: #cbd5e1;
      color: #334155;
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Hint = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export default function KycStepNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  nextDisabled,
  nextLabel,
}) {
  return (
    <FooterRow>
      <Hint>Step {currentStep + 1} of {totalSteps}</Hint>

      <NavGroup>
        <Button type="button" onClick={onPrev} disabled={currentStep === 0}>Previous</Button>
        <Button type="button" $variant="primary" onClick={onNext} disabled={nextDisabled}>{nextLabel}</Button>
      </NavGroup>
    </FooterRow>
  );
}
