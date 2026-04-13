import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { X, ArrowDownCircle } from 'lucide-react';
import { createRedemptionRequest } from '../../../api/userApi';
import { useAuth } from '../../../hooks/useAuth';

/* ─── Animations ─────────────────────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ──────────────────────────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.15s ease-out;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideUp} 0.25s ease-out;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Form = styled.form`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: 0.2px;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Button = styled.button`
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  ${({ $variant, theme }) => {
    if ($variant === 'secondary') {
      return `
        background-color: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        &:hover { background-color: ${theme.colors.muted}; }
      `;
    }
    return `
      background-color: ${theme.colors.secondary};
      color: #FFF;
      border: none;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
      &:hover { background-color: #1D4ED8; transform: translateY(-1px); }
      &:active { transform: translateY(0); }
      &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    `;
  }}
`;

const SuccessMessage = styled.div`
  padding: 32px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.success};
  font-size: 15px;
  font-weight: 600;
`;

/* ═══════════════════════════════════════════════════════════════════════════ */

export const RedeemModal = ({ onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ fundName: '', amount: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fundName || !formData.amount) return;
    setLoading(true);
    try {
      await createRedemptionRequest({
        userId: user?.id,
        fundName: formData.fundName,
        amount: parseFloat(formData.amount),
      });
      setSuccess(true);
      setTimeout(() => onClose(), 1800);
    } catch {
      alert('Redemption request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            <ArrowDownCircle size={22} color="#3B82F6" />
            Redeem Investment
          </h2>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        {success ? (
          <SuccessMessage>
            Redemption request submitted successfully!
          </SuccessMessage>
        ) : (
          <>
            <Form id="redeem-form" onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="fundName">Fund Name</label>
                <Select
                  id="fundName"
                  name="fundName"
                  required
                  value={formData.fundName}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select a fund to redeem</option>
                  <option value="HDFC Mid-Cap Opportunities">HDFC Mid-Cap Opportunities</option>
                  <option value="SBI Bluechip Fund">SBI Bluechip Fund</option>
                  <option value="ICICI Pru Technology Fund">ICICI Pru Technology Fund</option>
                  <option value="Axis Long Term Equity">Axis Long Term Equity</option>
                  <option value="Mirae Asset Large Cap">Mirae Asset Large Cap</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="amount">Amount (₹)</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="100"
                  step="100"
                  required
                  placeholder="Enter amount to redeem"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>

            <ModalFooter>
              <Button type="button" $variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" form="redeem-form" disabled={loading}>
                {loading ? 'Processing...' : 'Submit Redemption'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContainer>
    </Overlay>
  );
};
