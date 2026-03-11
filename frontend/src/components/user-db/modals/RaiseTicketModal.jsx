import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Send, Paperclip } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
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
    color: ${({ theme }) => theme.colors.primary};
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
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px ${({ theme }) => `rgba(59, 130, 246, 0.2)`};
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px ${({ theme }) => `rgba(59, 130, 246, 0.2)`};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px ${({ theme }) => `rgba(59, 130, 246, 0.2)`};
  }
`;

const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileUploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => `rgba(59, 130, 246, 0.1)`};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => `rgba(59, 130, 246, 0.15)`};
  }

  input {
    display: none;
  }
`;

const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
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

        &:hover {
          background-color: ${theme.colors.muted};
        }
      `;
    }
    return `
      background-color: ${theme.colors.secondary};
      color: #FFF;
      border: none;

      &:hover {
        background-color: #2563EB;
      }
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    `;
  }}
`;

export const RaiseTicketModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call to backend ticket creation
      const token = localStorage.getItem('token');
      // const response = await fetch('/api/tickets', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      //   body: JSON.stringify(formData)
      // });
      // if (!response.ok) throw new Error('Failed to create ticket');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Ticket raised successfully');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to raise ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Raise Support Ticket</h2>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form id="ticket-form" onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="subject">Subject</label>
            <Input 
              id="subject"
              name="subject"
              required
              placeholder="Brief summary of your issue"
              value={formData.subject}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="category">Issue Category</label>
            <Select 
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled>Select a category</option>
              <option value="kyc">KYC/Onboarding Issue</option>
              <option value="payment">Payment/Transaction Failure</option>
              <option value="sip">SIP Setup Problem</option>
              <option value="portfolio">Portfolio Discrepancy</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="description">Description</label>
            <TextArea 
              id="description"
              name="description"
              required
              placeholder="Please provide details about your issue..."
              value={formData.description}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Attachments (Optional)</label>
            <FileUploadContainer>
              <FileUploadLabel>
                <Paperclip size={16} />
                Attach File
                <input type="file" />
              </FileUploadLabel>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Max size: 5MB</span>
            </FileUploadContainer>
          </FormGroup>
        </Form>

        <ModalFooter>
          <Button type="button" $variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="ticket-form" disabled={loading}>
            {loading ? 'Submitting...' : (
              <>
                <Send size={16} />
                Submit Ticket
              </>
            )}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};
