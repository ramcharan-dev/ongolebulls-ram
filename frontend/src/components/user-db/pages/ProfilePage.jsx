import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  User, CreditCard, FileText, ShieldCheck, CheckCircle,
  Clock, XCircle, Mail, Phone, MapPin, Calendar, Briefcase,
  Building2, Hash, Lock, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getUserProfile } from '../../../api/authApi';

/* ─── Animations ─────────────────────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

/* ─── Layout ─────────────────────────────────────────────────────────────── */

const PageContainer = styled.div`
  animation: ${fadeIn} 0.4s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: 28px;
`;

const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

/* ─── Status Badges ──────────────────────────────────────────────────────── */

const BadgeRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $borderColor }) => $borderColor};
`;

/* ─── Tab Bar ────────────────────────────────────────────────────────────── */

const TabBar = styled.div`
  display: flex;
  gap: 4px;
  background-color: ${({ theme }) => theme.colors.muted};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
  overflow-x: auto;

  @media (max-width: 640px) {
    gap: 2px;
    padding: 3px;
  }
`;

const Tab = styled.button`
  flex: 1;
  padding: 11px 18px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;
  color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textMuted};
  background-color: ${({ $active, theme }) => $active ? theme.colors.surface : 'transparent'};
  box-shadow: ${({ $active }) => $active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ $active, theme }) => $active ? theme.colors.surface : 'rgba(0,0,0,0.03)'};
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 12px;
    gap: 5px;
  }
`;

/* ─── Content Cards ──────────────────────────────────────────────────────── */

const TabContent = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const InfoCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.06);
    transform: translateY(-1px);
  }
`;

const InfoIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bg }) => $bg || 'rgba(59,130,246,0.08)'};
  color: ${({ $color }) => $color || '#3B82F6'};
`;

const InfoDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
`;

/* ─── Documents Tab ──────────────────────────────────────────────────────── */

const DocItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 16px 20px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-1px);
  }
`;

const DocLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DocName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const DocStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $verified }) => $verified ? '#059669' : '#F59E0B'};
`;

const DocList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* ─── Risk Profile ───────────────────────────────────────────────────────── */

const RiskCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 20px 24px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  }
`;

const RiskQuestion = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
`;

const RiskAnswer = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  padding-left: 12px;
  border-left: 3px solid ${({ theme }) => theme.colors.secondary};
`;

const RiskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* ─── Loading Skeleton ───────────────────────────────────────────────────── */

const Skeleton = styled.div`
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.muted} 25%, ${({ theme }) => theme.colors.border} 50%, ${({ theme }) => theme.colors.muted} 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s infinite;
  border-radius: 8px;
  height: ${({ $h }) => $h || '20px'};
  width: ${({ $w }) => $w || '100%'};
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function maskPan(pan) {
  if (!pan || pan.length < 4) return pan || '—';
  return pan.substring(0, 2) + '****' + pan.substring(pan.length - 2);
}

function maskAccount(acc) {
  if (!acc || acc.length < 4) return acc || '—';
  return '****' + acc.substring(acc.length - 4);
}

function statusBadgeProps(status) {
  const s = (status || '').toLowerCase();
  if (s === 'verified' || s === 'active' || s === 'completed' || s === 'approved') {
    return {
      icon: <CheckCircle size={16} />,
      bg: 'rgba(5,150,105,0.08)',
      color: '#059669',
      borderColor: 'rgba(5,150,105,0.2)',
      label: 'Verified',
    };
  }
  if (s === 'pending' || s === 'in_progress') {
    return {
      icon: <Clock size={16} />,
      bg: 'rgba(245,158,11,0.08)',
      color: '#D97706',
      borderColor: 'rgba(245,158,11,0.2)',
      label: 'Pending',
    };
  }
  return {
    icon: <XCircle size={16} />,
    bg: 'rgba(220,38,38,0.08)',
    color: '#DC2626',
    borderColor: 'rgba(220,38,38,0.2)',
    label: 'Not Completed',
  };
}

const TABS = [
  { key: 'personal', label: 'Personal Info', icon: <User size={16} /> },
  { key: 'bank', label: 'Bank Details', icon: <CreditCard size={16} /> },
  { key: 'documents', label: 'Documents', icon: <FileText size={16} /> },
  { key: 'risk', label: 'Risk Profile', icon: <ShieldCheck size={16} /> },
];

const RISK_QUESTIONS = [
  'What is your primary financial goal?',
  'What is your investment time horizon?',
  'How would you react to a 20% drop in your portfolio?',
  'What percentage of your income do you invest?',
  'How experienced are you with equity investments?',
];

const DOCUMENTS = [
  { name: 'PAN Card', key: 'panNumber' },
  { name: 'Aadhaar Card', key: 'aadhaarNumber' },
  { name: 'Address Proof', key: 'addressProof' },
  { name: 'Cancelled Cheque', key: 'chequeFile' },
  { name: 'Signature', key: 'signatureFile' },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PROFILE PAGE COMPONENT                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    let cancelled = false;
    getUserProfile(user.id)
      .then((res) => { if (!cancelled) setProfile(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id]);

  // Merge localStorage user with API profile
  const p = { ...user, ...profile };

  const kycBadge = statusBadgeProps(p.kycStatus);
  const uccBadge = statusBadgeProps(p.uccStatus);

  // Parse risk answers
  let riskAnswers = [];
  try {
    if (p.riskAnswers) {
      riskAnswers = typeof p.riskAnswers === 'string' ? JSON.parse(p.riskAnswers) : p.riskAnswers;
    }
  } catch { /* ignore */ }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <Skeleton $h="28px" $w="200px" />
          <Skeleton $h="16px" $w="300px" style={{ marginTop: 10 }} />
        </PageHeader>
        <InfoGrid>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} $h="90px" />
          ))}
        </InfoGrid>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* ─── Header ─── */}
      <PageHeader>
        <PageTitle>My Profile</PageTitle>
        <PageSubtitle>View and manage your account information</PageSubtitle>
      </PageHeader>

      {/* ─── Status Badges ─── */}
      <BadgeRow>
        <StatusBadge $bg={kycBadge.bg} $color={kycBadge.color} $borderColor={kycBadge.borderColor}>
          {kycBadge.icon}
          KYC: {kycBadge.label}
        </StatusBadge>
        <StatusBadge $bg={uccBadge.bg} $color={uccBadge.color} $borderColor={uccBadge.borderColor}>
          {uccBadge.icon}
          UCC: {uccBadge.label}
        </StatusBadge>
      </BadgeRow>

      {/* ─── Tabs ─── */}
      <TabBar>
        {TABS.map((tab) => (
          <Tab key={tab.key} $active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
            {tab.icon}
            {tab.label}
          </Tab>
        ))}
      </TabBar>

      {/* ─── Tab Content ─── */}
      {activeTab === 'personal' && (
        <TabContent key="personal">
          <InfoGrid>
            <InfoCard>
              <InfoIconWrapper $bg="rgba(59,130,246,0.08)" $color="#3B82F6">
                <User size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Full Name</InfoLabel>
                <InfoValue>{p.fullName || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(16,185,129,0.08)" $color="#10B981">
                <Mail size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Email Address</InfoLabel>
                <InfoValue>{p.email || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(139,92,246,0.08)" $color="#8B5CF6">
                <Phone size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Mobile Number</InfoLabel>
                <InfoValue>{p.mobileNumber || p.mobile || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(245,158,11,0.08)" $color="#F59E0B">
                <Hash size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>PAN Number</InfoLabel>
                <InfoValue>{maskPan(p.panNumber)}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(236,72,153,0.08)" $color="#EC4899">
                <Calendar size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Date of Birth</InfoLabel>
                <InfoValue>{p.dob || p.dateOfBirth || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(99,102,241,0.08)" $color="#6366F1">
                <Briefcase size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Gender</InfoLabel>
                <InfoValue>{p.gender || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(20,184,166,0.08)" $color="#14B8A6">
                <MapPin size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Address</InfoLabel>
                <InfoValue>
                  {[p.address, p.city, p.state, p.pincode].filter(Boolean).join(', ') || '—'}
                </InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(234,88,12,0.08)" $color="#EA580C">
                <User size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Profile Type</InfoLabel>
                <InfoValue>{p.profileType || 'Self'}</InfoValue>
              </InfoDetails>
            </InfoCard>
          </InfoGrid>
        </TabContent>
      )}

      {activeTab === 'bank' && (
        <TabContent key="bank">
          <InfoGrid>
            <InfoCard>
              <InfoIconWrapper $bg="rgba(59,130,246,0.08)" $color="#3B82F6">
                <Building2 size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Bank Name</InfoLabel>
                <InfoValue>{p.bankName || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(16,185,129,0.08)" $color="#10B981">
                <User size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Account Holder</InfoLabel>
                <InfoValue>{p.accountHolderName || p.fullName || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(139,92,246,0.08)" $color="#8B5CF6">
                <Lock size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>Account Number</InfoLabel>
                <InfoValue>{maskAccount(p.accountNumber)}</InfoValue>
              </InfoDetails>
            </InfoCard>

            <InfoCard>
              <InfoIconWrapper $bg="rgba(245,158,11,0.08)" $color="#F59E0B">
                <Hash size={20} />
              </InfoIconWrapper>
              <InfoDetails>
                <InfoLabel>IFSC Code</InfoLabel>
                <InfoValue>{p.ifsc || p.ifscCode || '—'}</InfoValue>
              </InfoDetails>
            </InfoCard>
          </InfoGrid>
        </TabContent>
      )}

      {activeTab === 'documents' && (
        <TabContent key="documents">
          <DocList>
            {DOCUMENTS.map((doc) => {
              const hasDoc = !!p[doc.key];
              return (
                <DocItem key={doc.key}>
                  <DocLeft>
                    <InfoIconWrapper $bg="rgba(59,130,246,0.08)" $color="#3B82F6">
                      <FileText size={18} />
                    </InfoIconWrapper>
                    <DocName>{doc.name}</DocName>
                  </DocLeft>
                  <DocStatus $verified={hasDoc}>
                    {hasDoc ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    {hasDoc ? 'Uploaded' : 'Not Uploaded'}
                  </DocStatus>
                </DocItem>
              );
            })}
          </DocList>
        </TabContent>
      )}

      {activeTab === 'risk' && (
        <TabContent key="risk">
          <RiskList>
            {RISK_QUESTIONS.map((q, idx) => (
              <RiskCard key={idx}>
                <RiskQuestion>Q{idx + 1}. {q}</RiskQuestion>
                <RiskAnswer>
                  {(Array.isArray(riskAnswers) && riskAnswers[idx]) || (riskAnswers && riskAnswers[`q${idx + 1}`]) || '—'}
                </RiskAnswer>
              </RiskCard>
            ))}
          </RiskList>
        </TabContent>
      )}
    </PageContainer>
  );
};
