import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ShieldCheck, UserCheck, AlertTriangle, FilePenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getUserProfile } from '../../../api/authApi';

const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatusCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'Completed':
      case 'Active':
      case 'Verified':
        return `
          background-color: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'Pending':
        return `
          background-color: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
      default:
        return `
          background-color: ${theme.colors.dangerLight};
          color: ${theme.colors.danger};
        `;
    }
  }}
`;

const CardContent = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex: 1;
`;

const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563EB;
  }
`;

function normalizeStatus(status, fallback) {
  if (!status) return fallback;
  const s = status.toLowerCase();
  if (s === 'verified' || s === 'completed' || s === 'approved') return 'Verified';
  if (s === 'active') return 'Active';
  if (s === 'pending' || s === 'in_progress') return 'Pending';
  return fallback;
}

export const StatusCards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState('Not Completed');
  const [uccStatus, setUccStatus] = useState('Not Created');

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    getUserProfile(user.id)
      .then((res) => {
        if (cancelled) return;
        const p = res.data;
        setKycStatus(normalizeStatus(p?.kycStatus, 'Not Completed'));
        setUccStatus(normalizeStatus(p?.uccStatus, 'Not Created'));
      })
      .catch(() => { /* keep defaults */ });
    return () => { cancelled = true; };
  }, [user?.id]);

  const kycDone = kycStatus === 'Verified' || kycStatus === 'Active';
  const uccDone = uccStatus === 'Active' || uccStatus === 'Verified';

  return (
    <StatusContainer>
      {/* KYC Card */}
      <StatusCard>
        <CardHeader>
          <h3><ShieldCheck size={20} color="#3B82F6" /> KYC Verification</h3>
          <Badge $status={kycStatus}>{kycStatus}</Badge>
        </CardHeader>
        <CardContent>
          Your Know Your Customer (KYC) verification is mandatory to start investing in mutual funds as per SEBI regulations. Let's get it sorted.
        </CardContent>
        {!kycDone && (
          <ActionButton onClick={() => navigate('/dashboard/kyc')}>
            <FilePenLine size={16} /> Complete KYC
          </ActionButton>
        )}
      </StatusCard>

      {/* UCC Card */}
      <StatusCard>
        <CardHeader>
          <h3><UserCheck size={20} color="#3B82F6" /> UCC Creation</h3>
          <Badge $status={uccStatus}>{uccStatus}</Badge>
        </CardHeader>
        <CardContent>
          A Unique Client Code (UCC) is required to process and track your investments on the exchange.
        </CardContent>
        {!uccDone && (
          <ActionButton onClick={() => navigate('/dashboard/ucc')}>
            <AlertTriangle size={16} /> Generate UCC
          </ActionButton>
        )}
      </StatusCard>
    </StatusContainer>
  );
};
