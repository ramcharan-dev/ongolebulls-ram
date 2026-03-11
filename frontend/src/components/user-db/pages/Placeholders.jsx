import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const BlankStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyStateContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: 48px;
  margin-top: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 8px 0 0 0;
`;

export const ExploreFunds = () => (
  <PageContainer>
    <PageTitle>Explore Funds</PageTitle>
    <PageSubtitle>Discover top performing mutual funds handpicked for you.</PageSubtitle>
    <EmptyStateContainer>
      <BlankStateIcon>🔍</BlankStateIcon>
      <h3>Funds Loading...</h3>
      <p style={{ color: '#64748B' }}>We are fetching the latest mutual fund data.</p>
    </EmptyStateContainer>
  </PageContainer>
);

export const SIPs = () => (
  <PageContainer>
    <PageTitle>Your SIPs</PageTitle>
    <PageSubtitle>Manage your systematic investment plans in one place.</PageSubtitle>
    <EmptyStateContainer>
      <BlankStateIcon>📈</BlankStateIcon>
      <h3>No Active SIPs</h3>
      <p style={{ color: '#64748B' }}>Start your first SIP today and build long term wealth.</p>
    </EmptyStateContainer>
  </PageContainer>
);

export const Statements = () => (
  <PageContainer>
    <PageTitle>Statements & Reports</PageTitle>
    <PageSubtitle>Download your capital gains and transaction statements.</PageSubtitle>
    <EmptyStateContainer>
      <BlankStateIcon>📄</BlankStateIcon>
      <h3>No Statements Generated</h3>
      <p style={{ color: '#64748B' }}>Your transaction history will appear here once you invest.</p>
    </EmptyStateContainer>
  </PageContainer>
);

export const Support = () => (
  <PageContainer>
    <PageTitle>Support Center</PageTitle>
    <PageSubtitle>Get help with your investments or raise a ticket.</PageSubtitle>
    <EmptyStateContainer>
      <BlankStateIcon>💬</BlankStateIcon>
      <h3>Need Help?</h3>
      <p style={{ color: '#64748B' }}>Use the Help icon in the top header to raise a ticket or view FAQs.</p>
    </EmptyStateContainer>
  </PageContainer>
);
