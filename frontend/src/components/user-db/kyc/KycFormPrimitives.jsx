import styled from 'styled-components';

export const StepCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 24px;
`;

export const StepTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

export const StepDescription = styled.p`
  margin: 8px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
`;

export const FormGrid = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

export const FullSpan = styled.div`
  grid-column: 1 / -1;
`;

export const Field = styled.label`
  display: block;
`;

export const FieldLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

export const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger};
`;

export const inputBaseCss = `
  margin-top: 8px;
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  padding: 0 12px;
  font-size: 14px;
  transition: border-color 140ms ease, box-shadow 140ms ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  &:disabled {
    background: #f8fafc;
    color: #64748b;
  }
`;

export const Input = styled.input`
  ${inputBaseCss}
`;

export const Select = styled.select`
  ${inputBaseCss}
`;

export const Textarea = styled.textarea`
  margin-top: 8px;
  width: 100%;
  min-height: 98px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  padding: 10px 12px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 140ms ease, box-shadow 140ms ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  }

  &:disabled {
    background: #f8fafc;
    color: #64748b;
  }
`;

export const ErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
`;

export const HelperText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const InlineRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const CheckboxRow = styled.label`
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
  }
`;

export const PillStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid;

  ${({ $state }) => {
    if ($state === 'success') {
      return `
        color: #065f46;
        background: #ecfdf5;
        border-color: #a7f3d0;
      `;
    }

    if ($state === 'error') {
      return `
        color: #991b1b;
        background: #fef2f2;
        border-color: #fecaca;
      `;
    }

    if ($state === 'loading') {
      return `
        color: #1e40af;
        background: #eff6ff;
        border-color: #bfdbfe;
      `;
    }

    return `
      color: #475569;
      background: #f8fafc;
      border-color: #e2e8f0;
    `;
  }}
`;

export const PrimaryAction = styled.button`
  height: 40px;
  border: none;
  border-radius: 10px;
  padding: 0 14px;
  background: linear-gradient(135deg, #2563eb, #1e3a8a);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
