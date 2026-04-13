import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  PiggyBank, CalendarClock, IndianRupee, TrendingUp,
  MoreVertical, Pause, Play, SkipForward, XCircle, Pencil,
  Plus, ArrowRight, Search, Filter, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getDashboardRequests } from '../../../api/userApi';

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ANIMATIONS                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const fadeScale = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  LAYOUT                                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

const PageContainer = styled.div`
  animation: ${fadeIn} 0.4s ease-out;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

const PageTitleGroup = styled.div``;

const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const StartSipBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #FFF;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);

  &:hover {
    background-color: #1D4ED8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  &:active { transform: translateY(0); }
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  METRIC CARDS                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 32px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ $accentColor }) => $accentColor ? `${$accentColor}40` : 'inherit'};
  }
`;

const MetricTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MetricLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetricIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const MetricValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
`;

const MetricHint = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  TOOLBAR                                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SipCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  background-color: ${({ theme }) => `${theme.colors.secondary}12`};
  padding: 3px 10px;
  border-radius: 20px;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 8px 14px;
  width: 220px;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.12);
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    font-size: 13px;
    width: 100%;
    &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SIP LIST                                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

const SipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SipCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.3s ease-out;
  animation-delay: ${({ $index }) => $index * 0.05}s;
  animation-fill-mode: backwards;

  &:hover {
    border-color: ${({ theme }) => `${theme.colors.secondary}40`};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const FundIcon = styled.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: #FFF;
  background: ${({ $gradient }) => $gradient};

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 16px;
  }
`;

const FundInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FundName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    white-space: normal;
    font-size: 14px;
  }
`;

const FundMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MetaDot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.textMuted};
`;

const SipDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  min-width: 110px;

  @media (max-width: 768px) {
    align-items: flex-start;
    min-width: auto;
  }
`;

const SipAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SipDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusPill = styled.span`
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.successLight : theme.colors.warningLight};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.success : theme.colors.warning};
`;

/* ─── Kebab Menu ─────────────────────────────────────────────────────────── */

const KebabContainer = styled.div`
  position: relative;
  margin-left: 8px;
`;

const KebabBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const KebabMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 180px;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  overflow: hidden;
  z-index: 60;
  animation: ${fadeScale} 0.12s ease-out;
`;

const KebabItem = styled.button`
  padding: 10px 14px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $color, theme }) => $color || theme.colors.text};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.12s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  EMPTY STATE                                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const EmptyIconWrap = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(139, 92, 246, 0.1));
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 28px 0;
  max-width: 400px;
  line-height: 1.6;
`;

const EmptyCta = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #FFF;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);

  &:hover {
    background-color: #1D4ED8;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  }

  &:active { transform: translateY(0); }
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  LOADING SKELETON                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.muted} 25%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.muted} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
  border-radius: ${({ $radius }) => $radius || '8px'};
  height: ${({ $h }) => $h || '20px'};
  width: ${({ $w }) => $w || '100%'};
`;

const SkeletonMetricsGrid = styled(MetricsGrid)``;

const SkeletonCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SkeletonSipCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MOCK DATA                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */

const FUND_GRADIENTS = [
  'linear-gradient(135deg, #3B82F6, #2563EB)',
  'linear-gradient(135deg, #10B981, #059669)',
  'linear-gradient(135deg, #8B5CF6, #7C3AED)',
  'linear-gradient(135deg, #F59E0B, #D97706)',
  'linear-gradient(135deg, #EF4444, #DC2626)',
  'linear-gradient(135deg, #EC4899, #DB2777)',
  'linear-gradient(135deg, #06B6D4, #0891B2)',
];

const MOCK_SIPS = [
  {
    id: 1,
    fundName: 'HDFC Mid-Cap Opportunities Fund - Growth',
    sipAmount: 5000,
    frequency: 'Monthly',
    nextInstallmentDate: '2026-04-05',
    status: 'Active',
    totalInvested: 60000,
    currentValue: 68400,
    category: 'Mid Cap',
    folioNumber: 'FOL-1234567',
  },
  {
    id: 2,
    fundName: 'SBI Bluechip Fund - Direct Growth',
    sipAmount: 10000,
    frequency: 'Monthly',
    nextInstallmentDate: '2026-04-10',
    status: 'Active',
    totalInvested: 120000,
    currentValue: 142800,
    category: 'Large Cap',
    folioNumber: 'FOL-2345678',
  },
  {
    id: 3,
    fundName: 'Axis Long Term Equity Fund - ELSS',
    sipAmount: 2500,
    frequency: 'Monthly',
    nextInstallmentDate: '2026-04-15',
    status: 'Active',
    totalInvested: 30000,
    currentValue: 33750,
    category: 'ELSS',
    folioNumber: 'FOL-3456789',
  },
  {
    id: 4,
    fundName: 'ICICI Prudential Technology Fund - Growth',
    sipAmount: 3000,
    frequency: 'Monthly',
    nextInstallmentDate: '2026-04-07',
    status: 'Paused',
    totalInvested: 36000,
    currentValue: 39600,
    category: 'Sectoral',
    folioNumber: 'FOL-4567890',
  },
  {
    id: 5,
    fundName: 'Mirae Asset Large Cap Fund - Direct Growth',
    sipAmount: 7500,
    frequency: 'Monthly',
    nextInstallmentDate: '2026-04-12',
    status: 'Active',
    totalInvested: 90000,
    currentValue: 104400,
    category: 'Large Cap',
    folioNumber: 'FOL-5678901',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  HELPERS                                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

function formatCurrency(n) {
  if (n == null) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fundInitials(name) {
  if (!name) return '??';
  const words = name.split(/[\s-]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0].substring(0, 2).toUpperCase();
}

function getUpcomingDeductions(sips) {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return sips.filter(
    (s) => s.status === 'Active' && new Date(s.nextInstallmentDate) <= weekFromNow
  ).length;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  COMPONENT                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const SipsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const menuRef = useRef(null);

  // ── Fetch SIPs (try API first, fallback to mock) ───────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchSips = async () => {
      try {
        if (user?.id) {
          const res = await getDashboardRequests(user.id);
          const apiSips = res.data?.sips;
          if (!cancelled && apiSips && apiSips.length > 0) {
            setSips(apiSips);
            setLoading(false);
            return;
          }
        }
      } catch { /* fall through to mock */ }

      // Simulate API delay for mock data
      await new Promise((r) => setTimeout(r, 600));
      if (!cancelled) {
        setSips(MOCK_SIPS);
        setLoading(false);
      }
    };

    fetchSips();
    return () => { cancelled = true; };
  }, [user?.id]);

  // ── Close kebab on outside click ───────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────
  const activeSips = sips.filter((s) => s.status === 'Active');
  const totalMonthlySip = activeSips.reduce((sum, s) => sum + (s.sipAmount || 0), 0);
  const totalInvested = sips.reduce((sum, s) => sum + (s.totalInvested || 0), 0);
  const currentValue = sips.reduce((sum, s) => sum + (s.currentValue || 0), 0);
  const upcomingDeductions = getUpcomingDeductions(sips);

  const filteredSips = sips.filter((s) =>
    !searchQuery || (s.fundName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Action handlers ───────────────────────────────────────────────────
  const handleAction = useCallback((action, sipId) => {
    setOpenMenuId(null);
    setSips((prev) =>
      prev.map((s) => {
        if (s.id !== sipId) return s;
        switch (action) {
          case 'pause':
            return { ...s, status: s.status === 'Paused' ? 'Active' : 'Paused' };
          case 'cancel':
            return null; // remove from list
          default:
            return s;
        }
      }).filter(Boolean)
    );
  }, []);

  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitleGroup>
            <Skeleton $h="28px" $w="160px" />
            <Skeleton $h="14px" $w="300px" style={{ marginTop: 8 }} />
          </PageTitleGroup>
        </PageHeader>
        <SkeletonMetricsGrid>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i}>
              <Skeleton $h="14px" $w="120px" />
              <Skeleton $h="28px" $w="100px" />
              <Skeleton $h="12px" $w="80px" />
            </SkeletonCard>
          ))}
        </SkeletonMetricsGrid>
        <Skeleton $h="18px" $w="140px" style={{ marginBottom: 16 }} />
        {[1, 2, 3].map((i) => (
          <SkeletonSipCard key={i} style={{ marginBottom: 12 }}>
            <Skeleton $h="48px" $w="48px" $radius="12px" />
            <div style={{ flex: 1 }}>
              <Skeleton $h="16px" $w="70%" />
              <Skeleton $h="12px" $w="40%" style={{ marginTop: 6 }} />
            </div>
            <Skeleton $h="20px" $w="80px" />
          </SkeletonSipCard>
        ))}
      </PageContainer>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────
  if (sips.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitleGroup>
            <PageTitle>Your SIPs</PageTitle>
            <PageSubtitle>Manage your systematic investment plans in one place.</PageSubtitle>
          </PageTitleGroup>
        </PageHeader>
        <EmptyState>
          <EmptyIconWrap>
            <PiggyBank size={40} />
          </EmptyIconWrap>
          <EmptyTitle>No Active SIPs</EmptyTitle>
          <EmptyDescription>
            Start a Systematic Investment Plan to invest a fixed amount regularly in mutual funds.
            SIPs help you build long-term wealth with the power of compounding and rupee cost averaging.
          </EmptyDescription>
          <EmptyCta onClick={() => navigate('/dashboard/explore')}>
            <Plus size={18} />
            Start your first SIP
          </EmptyCta>
        </EmptyState>
      </PageContainer>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────
  return (
    <PageContainer>
      {/* ── Header ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>Your SIPs</PageTitle>
          <PageSubtitle>Manage your systematic investment plans in one place.</PageSubtitle>
        </PageTitleGroup>
        <StartSipBtn onClick={() => navigate('/dashboard/explore')}>
          <Plus size={18} />
          New SIP
        </StartSipBtn>
      </PageHeader>

      {/* ── Metric Cards ── */}
      <MetricsGrid>
        <MetricCard $accentColor="#3B82F6">
          <MetricTop>
            <MetricLabel>Total Monthly SIP</MetricLabel>
            <MetricIconWrap $bg="rgba(59,130,246,0.1)" $color="#3B82F6">
              <IndianRupee size={20} />
            </MetricIconWrap>
          </MetricTop>
          <MetricValue>{formatCurrency(totalMonthlySip)}</MetricValue>
          <MetricHint>{activeSips.length} active SIP{activeSips.length !== 1 ? 's' : ''}</MetricHint>
        </MetricCard>

        <MetricCard $accentColor="#F59E0B">
          <MetricTop>
            <MetricLabel>Upcoming Deductions</MetricLabel>
            <MetricIconWrap $bg="rgba(245,158,11,0.1)" $color="#F59E0B">
              <CalendarClock size={20} />
            </MetricIconWrap>
          </MetricTop>
          <MetricValue>{upcomingDeductions}</MetricValue>
          <MetricHint>Due this week</MetricHint>
        </MetricCard>

        <MetricCard $accentColor="#8B5CF6">
          <MetricTop>
            <MetricLabel>Total Invested via SIPs</MetricLabel>
            <MetricIconWrap $bg="rgba(139,92,246,0.1)" $color="#8B5CF6">
              <PiggyBank size={20} />
            </MetricIconWrap>
          </MetricTop>
          <MetricValue>{formatCurrency(totalInvested)}</MetricValue>
          <MetricHint>Across all SIPs</MetricHint>
        </MetricCard>

        <MetricCard $accentColor="#10B981">
          <MetricTop>
            <MetricLabel>Current Value</MetricLabel>
            <MetricIconWrap $bg="rgba(16,185,129,0.1)" $color="#10B981">
              <TrendingUp size={20} />
            </MetricIconWrap>
          </MetricTop>
          <MetricValue>{formatCurrency(currentValue)}</MetricValue>
          <MetricHint>
            {totalInvested > 0
              ? `${((currentValue - totalInvested) / totalInvested * 100).toFixed(1)}% returns`
              : 'No returns yet'}
          </MetricHint>
        </MetricCard>
      </MetricsGrid>

      {/* ── Toolbar ── */}
      <Toolbar>
        <SectionTitle>
          Active Plans
          <SipCount>{filteredSips.length}</SipCount>
        </SectionTitle>
        <ToolbarRight>
          <SearchBox>
            <Search size={16} color="currentColor" />
            <input
              placeholder="Search SIPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <FilterBtn>
            <Filter size={14} />
            Filter
            <ChevronDown size={14} />
          </FilterBtn>
        </ToolbarRight>
      </Toolbar>

      {/* ── SIP List ── */}
      <SipList>
        {filteredSips.map((sip, idx) => (
          <SipCard key={sip.id} $index={idx}>
            <FundIcon $gradient={FUND_GRADIENTS[idx % FUND_GRADIENTS.length]}>
              {fundInitials(sip.fundName)}
            </FundIcon>

            <FundInfo>
              <FundName>{sip.fundName}</FundName>
              <FundMeta>
                <span>{sip.category || sip.frequency}</span>
                <MetaDot />
                <span>Folio: {sip.folioNumber || '—'}</span>
                <MetaDot />
                <span>Invested: {formatCurrency(sip.totalInvested)}</span>
              </FundMeta>
            </FundInfo>

            <StatusPill $active={sip.status === 'Active'}>
              {sip.status}
            </StatusPill>

            <SipDetail>
              <SipAmount>{formatCurrency(sip.sipAmount)}/mo</SipAmount>
              <SipDate>
                <CalendarClock size={12} />
                Next: {formatDate(sip.nextInstallmentDate)}
              </SipDate>
            </SipDetail>

            <KebabContainer ref={openMenuId === sip.id ? menuRef : null}>
              <KebabBtn onClick={() => setOpenMenuId(openMenuId === sip.id ? null : sip.id)}>
                <MoreVertical size={18} />
              </KebabBtn>
              <KebabMenu $isOpen={openMenuId === sip.id}>
                <KebabItem onClick={() => handleAction('edit', sip.id)}>
                  <Pencil size={15} />
                  Edit SIP
                </KebabItem>
                <KebabItem onClick={() => handleAction('pause', sip.id)}>
                  {sip.status === 'Paused' ? <Play size={15} /> : <Pause size={15} />}
                  {sip.status === 'Paused' ? 'Resume SIP' : 'Pause SIP'}
                </KebabItem>
                <KebabItem onClick={() => handleAction('skip', sip.id)}>
                  <SkipForward size={15} />
                  Skip Installment
                </KebabItem>
                <KebabItem $color="#DC2626" onClick={() => handleAction('cancel', sip.id)}>
                  <XCircle size={15} />
                  Cancel SIP
                </KebabItem>
              </KebabMenu>
            </KebabContainer>
          </SipCard>
        ))}
      </SipList>

      {filteredSips.length === 0 && searchQuery && (
        <EmptyState style={{ padding: '40px 24px' }}>
          <EmptyTitle style={{ fontSize: 16 }}>No SIPs match "{searchQuery}"</EmptyTitle>
          <EmptyDescription style={{ marginBottom: 0 }}>
            Try a different search term.
          </EmptyDescription>
        </EmptyState>
      )}
    </PageContainer>
  );
};
