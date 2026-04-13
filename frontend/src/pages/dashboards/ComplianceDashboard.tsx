import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider as SCThemeProvider } from 'styled-components';
import {
  LayoutDashboard,
  ScrollText,
  Flag,
  ShieldAlert,
  FileCheck,
  LogOut,
  Search,
  Inbox,
  RefreshCw,
  Plus,
  X,
  Check,
  Sun,
  Moon,
  AlertCircle,
} from 'lucide-react';
import { lightTheme, darkTheme } from '../../components/user-db/theme';
import { useTheme } from '../../context/ThemeContext';
import { complianceApi } from '../../api/compliance/complianceApi';
import type {
  ComplianceStats,
  AuditLogEntry,
  ComplianceFlag,
  PartnerRisk,
  DisclosureEntry,
} from '../../types/api';

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt = (d: string | null | undefined) => {
  if (!d) return '\u2014';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '\u2014';
  }
};

const fmtTime = (d: string | null | undefined) => {
  if (!d) return '\u2014';
  try {
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '\u2014';
  }
};

type Section = 'overview' | 'audit' | 'flags' | 'risk' | 'disclosures';

// ── Styled Components ──────────────────────────────────────────────────────────

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const SidebarEl = styled.aside`
  width: 240px;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.sidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  z-index: 20;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SidebarBrand = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.3px;
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 16px);
  height: 44px;
  padding: 0 16px;
  margin: 2px 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.secondary : theme.colors.textMuted};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.muted : 'transparent'};
  border-left: ${({ $active, theme }) =>
    $active
      ? `3px solid ${theme.colors.secondary}`
      : '3px solid transparent'};
  transition: all 0.2s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SidebarSpacer = styled.div`
  flex: 1;
`;

const MainEl = styled.main`
  margin-left: 240px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const HeaderEl = styled.header`
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.header};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ThemeToggle = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const PageContent = styled.div`
  padding: 24px;
`;

const Card = styled.div<{ $borderColor?: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $borderColor, theme }) => $borderColor || theme.colors.border};
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 8px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.muted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.muted};
  }
`;

const Badge = styled.span<{ $variant: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $variant, theme }) =>
    $variant === 'success'
      ? theme.colors.successLight
      : $variant === 'danger'
        ? theme.colors.dangerLight
        : $variant === 'warning'
          ? theme.colors.warningLight
          : theme.colors.muted};
  color: ${({ $variant, theme }) =>
    $variant === 'success'
      ? theme.colors.success
      : $variant === 'danger'
        ? theme.colors.danger
        : $variant === 'warning'
          ? theme.colors.warning
          : theme.colors.textMuted};
`;

const Btn = styled.button<{ $variant?: string }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  background: ${({ $variant, theme }) =>
    $variant === 'primary'
      ? theme.colors.secondary
      : $variant === 'danger'
        ? theme.colors.danger
        : 'transparent'};
  color: ${({ $variant, theme }) =>
    $variant === 'primary' || $variant === 'danger'
      ? '#fff'
      : theme.colors.text};
  border: ${({ $variant, theme }) =>
    !$variant ? `1px solid ${theme.colors.border}` : 'none'};
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  box-sizing: border-box;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Skeleton = styled.div`
  height: 48px;
  background: ${({ theme }) => theme.colors.muted};
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`;

const SkeletonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PillGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
`;

const Pill = styled.button<{ $active?: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.secondary : theme.colors.muted};
  color: ${({ $active }) => ($active ? '#fff' : 'inherit')};
  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.secondary : theme.colors.border};
  }
`;

const CheckMark = styled.span<{ $ok: boolean }>`
  color: ${({ $ok, theme }) =>
    $ok ? theme.colors.success : theme.colors.danger};
  display: inline-flex;
  align-items: center;
`;

const Toast = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  background: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success : theme.colors.danger};
  color: #fff;
  animation: slideIn 0.3s ease;
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  align-items: center;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SearchField = styled(Input)`
  padding-left: 38px;
`;

const FilterSelect = styled(Select)`
  width: auto;
  min-width: 160px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px 0;
`;

const TwoPanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ComplianceDashboard() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section>('overview');

  // Toast
  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error';
  } | null>(null);
  const showToast = useCallback(
    (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  // ── Overview state ─────────────────────────────────────────────────────────
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  const [overviewFlags, setOverviewFlags] = useState<ComplianceFlag[]>([]);
  const [overviewFlagsLoading, setOverviewFlagsLoading] = useState(true);
  const [overviewFlagsError, setOverviewFlagsError] = useState('');

  const [overviewLogs, setOverviewLogs] = useState<AuditLogEntry[]>([]);
  const [overviewLogsLoading, setOverviewLogsLoading] = useState(true);
  const [overviewLogsError, setOverviewLogsError] = useState('');

  // ── Audit state ────────────────────────────────────────────────────────────
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [auditEntityType, setAuditEntityType] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFrom, setAuditFrom] = useState('');
  const [auditTo, setAuditTo] = useState('');

  // ── Flags state ────────────────────────────────────────────────────────────
  const [flags, setFlags] = useState<ComplianceFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(false);
  const [flagsError, setFlagsError] = useState('');
  const [flagFilter, setFlagFilter] = useState<'OPEN' | 'RESOLVED' | 'ALL'>(
    'OPEN',
  );

  // Raise flag modal
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [raiseForm, setRaiseForm] = useState({
    entityType: 'PARTNER',
    entityId: '',
    entityName: '',
    flagType: 'MISSING_DOCUMENT',
    reason: '',
  });
  const [raiseSubmitting, setRaiseSubmitting] = useState(false);

  // Resolve flag modal
  const [resolveTarget, setResolveTarget] = useState<ComplianceFlag | null>(
    null,
  );
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolveSubmitting, setResolveSubmitting] = useState(false);

  // ── Risk state ─────────────────────────────────────────────────────────────
  const [risks, setRisks] = useState<PartnerRisk[]>([]);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState('');

  // ── Disclosures state ──────────────────────────────────────────────────────
  const [disclosures, setDisclosures] = useState<DisclosureEntry[]>([]);
  const [disclosuresLoading, setDisclosuresLoading] = useState(false);
  const [disclosuresError, setDisclosuresError] = useState('');
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('ob_user') || '{}');
    if (user.role !== 'COMPLIANCE') navigate('/login');
  }, [navigate]);

  // ── Data fetchers ──────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const res = await complianceApi.getStats();
      setStats(res.data);
    } catch (e: any) {
      setStatsError(e?.response?.data?.message || 'Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchOverviewFlags = useCallback(async () => {
    setOverviewFlagsLoading(true);
    setOverviewFlagsError('');
    try {
      const res = await complianceApi.getFlags({ status: 'OPEN' });
      setOverviewFlags((res.data as ComplianceFlag[]).slice(0, 5));
    } catch (e: any) {
      setOverviewFlagsError(
        e?.response?.data?.message || 'Failed to load flags',
      );
    } finally {
      setOverviewFlagsLoading(false);
    }
  }, []);

  const fetchOverviewLogs = useCallback(async () => {
    setOverviewLogsLoading(true);
    setOverviewLogsError('');
    try {
      const res = await complianceApi.getAuditLogs();
      setOverviewLogs((res.data as AuditLogEntry[]).slice(0, 10));
    } catch (e: any) {
      setOverviewLogsError(
        e?.response?.data?.message || 'Failed to load audit logs',
      );
    } finally {
      setOverviewLogsLoading(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    setAuditError('');
    try {
      const params: Record<string, string> = {};
      if (auditEntityType) params.entityType = auditEntityType;
      if (auditSearch) params.search = auditSearch;
      if (auditFrom) params.from = auditFrom;
      if (auditTo) params.to = auditTo;
      const res = await complianceApi.getAuditLogs(params);
      setAuditLogs(res.data as AuditLogEntry[]);
    } catch (e: any) {
      setAuditError(
        e?.response?.data?.message || 'Failed to load audit logs',
      );
    } finally {
      setAuditLoading(false);
    }
  }, [auditEntityType, auditSearch, auditFrom, auditTo]);

  const fetchFlags = useCallback(async () => {
    setFlagsLoading(true);
    setFlagsError('');
    try {
      const params: Record<string, string> = {};
      if (flagFilter !== 'ALL') params.status = flagFilter;
      const res = await complianceApi.getFlags(params);
      setFlags(res.data as ComplianceFlag[]);
    } catch (e: any) {
      setFlagsError(e?.response?.data?.message || 'Failed to load flags');
    } finally {
      setFlagsLoading(false);
    }
  }, [flagFilter]);

  const fetchRisks = useCallback(async () => {
    setRiskLoading(true);
    setRiskError('');
    try {
      const res = await complianceApi.getRiskSummary();
      setRisks(res.data as PartnerRisk[]);
    } catch (e: any) {
      setRiskError(
        e?.response?.data?.message || 'Failed to load risk summary',
      );
    } finally {
      setRiskLoading(false);
    }
  }, []);

  const fetchDisclosures = useCallback(async () => {
    setDisclosuresLoading(true);
    setDisclosuresError('');
    try {
      const res = await complianceApi.getDisclosures();
      setDisclosures(res.data as DisclosureEntry[]);
    } catch (e: any) {
      setDisclosuresError(
        e?.response?.data?.message || 'Failed to load disclosures',
      );
    } finally {
      setDisclosuresLoading(false);
    }
  }, []);

  // ── Load data on section change ────────────────────────────────────────────

  useEffect(() => {
    if (section === 'overview') {
      fetchStats();
      fetchOverviewFlags();
      fetchOverviewLogs();
    }
  }, [section, fetchStats, fetchOverviewFlags, fetchOverviewLogs]);

  useEffect(() => {
    if (section === 'audit') fetchAuditLogs();
  }, [section, fetchAuditLogs]);

  useEffect(() => {
    if (section === 'flags') fetchFlags();
  }, [section, fetchFlags]);

  useEffect(() => {
    if (section === 'risk') fetchRisks();
  }, [section, fetchRisks]);

  useEffect(() => {
    if (section === 'disclosures') fetchDisclosures();
  }, [section, fetchDisclosures]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleRaiseFlag = async () => {
    if (
      !raiseForm.entityId ||
      !raiseForm.entityName.trim() ||
      !raiseForm.reason.trim()
    )
      return;
    setRaiseSubmitting(true);
    try {
      await complianceApi.raiseFlag({
        entityType: raiseForm.entityType,
        entityId: Number(raiseForm.entityId),
        entityName: raiseForm.entityName,
        flagType: raiseForm.flagType,
        reason: raiseForm.reason,
      });
      showToast('Flag raised successfully');
      setShowRaiseModal(false);
      setRaiseForm({
        entityType: 'PARTNER',
        entityId: '',
        entityName: '',
        flagType: 'MISSING_DOCUMENT',
        reason: '',
      });
      if (section === 'flags') fetchFlags();
      if (section === 'overview') {
        fetchStats();
        fetchOverviewFlags();
      }
    } catch (e: any) {
      showToast(
        e?.response?.data?.message || 'Failed to raise flag',
        'error',
      );
    } finally {
      setRaiseSubmitting(false);
    }
  };

  const handleResolveFlag = async () => {
    if (!resolveTarget || !resolveNotes.trim()) return;
    setResolveSubmitting(true);
    try {
      await complianceApi.resolveFlag(resolveTarget.id, resolveNotes);
      showToast('Flag resolved successfully');
      setResolveTarget(null);
      setResolveNotes('');
      if (section === 'flags') fetchFlags();
      if (section === 'overview') {
        fetchStats();
        fetchOverviewFlags();
      }
    } catch (e: any) {
      showToast(
        e?.response?.data?.message || 'Failed to resolve flag',
        'error',
      );
    } finally {
      setResolveSubmitting(false);
    }
  };

  const openRaiseModalForPartner = (partner: PartnerRisk) => {
    setRaiseForm({
      entityType: 'PARTNER',
      entityId: String(partner.id),
      entityName: partner.fullName || partner.firmName || partner.email,
      flagType: 'MISSING_DOCUMENT',
      reason: '',
    });
    setShowRaiseModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ob_user');
    navigate('/login');
  };

  // ── Nav items ──────────────────────────────────────────────────────────────

  const navItems: { key: Section; icon: React.ReactNode; label: string }[] = [
    {
      key: 'overview',
      icon: <LayoutDashboard size={18} />,
      label: 'Overview',
    },
    { key: 'audit', icon: <ScrollText size={18} />, label: 'Audit Logs' },
    { key: 'flags', icon: <Flag size={18} />, label: 'Compliance Flags' },
    { key: 'risk', icon: <ShieldAlert size={18} />, label: 'Partner Risk' },
    {
      key: 'disclosures',
      icon: <FileCheck size={18} />,
      label: 'Disclosures',
    },
  ];

  const sectionTitles: Record<Section, string> = {
    overview: 'Compliance Overview',
    audit: 'Audit Logs',
    flags: 'Compliance Flags',
    risk: 'Partner Risk Assessment',
    disclosures: 'Disclosures & Consents',
  };

  // ── Helpers for loading / error / empty ────────────────────────────────────

  const LoadingState = () => (
    <SkeletonGroup>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </SkeletonGroup>
  );

  const ErrorState = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <Card $borderColor="#DC2626">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}
      >
        <AlertCircle size={18} color="#DC2626" />
        <span style={{ color: '#DC2626', fontWeight: 600, fontSize: 14 }}>
          {message}
        </span>
      </div>
      <Btn onClick={onRetry}>
        <RefreshCw size={14} /> Retry
      </Btn>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <EmptyBox>
      <Inbox size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
      <div style={{ fontSize: 15, fontWeight: 500 }}>{message}</div>
    </EmptyBox>
  );

  // ── Filtered disclosures ───────────────────────────────────────────────────

  const filteredDisclosures = showOnlyMissing
    ? disclosures.filter(
        (d) =>
          !d.termsAccepted ||
          !d.declarationAccepted ||
          !d.consentComm ||
          !d.consentShareAmc ||
          !d.consentShareDocs,
      )
    : disclosures;

  // ── Render sections ────────────────────────────────────────────────────────

  const renderOverview = () => (
    <>
      {statsLoading ? (
        <StatsGrid>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} style={{ height: 100 }} />
          ))}
        </StatsGrid>
      ) : statsError ? (
        <ErrorState message={statsError} onRetry={fetchStats} />
      ) : stats ? (
        <StatsGrid>
          <Card>
            <StatIcon $color="#DC2626">
              <Flag size={20} />
            </StatIcon>
            <StatValue>{stats.openFlags}</StatValue>
            <StatLabel>Open Flags</StatLabel>
          </Card>
          <Card>
            <StatIcon $color="#059669">
              <Check size={20} />
            </StatIcon>
            <StatValue>{stats.resolvedToday}</StatValue>
            <StatLabel>Resolved Today</StatLabel>
          </Card>
          <Card>
            <StatIcon $color="#D97706">
              <ShieldAlert size={20} />
            </StatIcon>
            <StatValue>{stats.partnersUnderReview}</StatValue>
            <StatLabel>Partners Under Review</StatLabel>
          </Card>
          <Card>
            <StatIcon $color="#2563EB">
              <FileCheck size={20} />
            </StatIcon>
            <StatValue>{stats.pendingApprovals}</StatValue>
            <StatLabel>Pending Approvals</StatLabel>
          </Card>
          <Card>
            <StatIcon $color="#64748B">
              <ScrollText size={20} />
            </StatIcon>
            <StatValue>{stats.totalAuditLogsToday}</StatValue>
            <StatLabel>Audit Logs Today</StatLabel>
          </Card>
        </StatsGrid>
      ) : null}

      <TwoPanelGrid>
        <div>
          <SectionTitle>Open Compliance Flags</SectionTitle>
          {overviewFlagsLoading ? (
            <LoadingState />
          ) : overviewFlagsError ? (
            <ErrorState
              message={overviewFlagsError}
              onRetry={fetchOverviewFlags}
            />
          ) : overviewFlags.length === 0 ? (
            <Card>
              <EmptyState message="No open compliance flags" />
            </Card>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <Th>Entity</Th>
                      <Th>Type</Th>
                      <Th>Flagged</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {overviewFlags.map((f) => (
                      <Tr key={f.id}>
                        <Td>{f.entityName}</Td>
                        <Td>
                          <Badge $variant="warning">{f.flagType}</Badge>
                        </Td>
                        <Td>{fmt(f.flaggedAt)}</Td>
                        <Td>
                          <Btn
                            onClick={() => {
                              setResolveTarget(f);
                              setResolveNotes('');
                            }}
                          >
                            Resolve
                          </Btn>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </Card>
          )}
        </div>

        <div>
          <SectionTitle>Recent Audit Activity</SectionTitle>
          {overviewLogsLoading ? (
            <LoadingState />
          ) : overviewLogsError ? (
            <ErrorState
              message={overviewLogsError}
              onRetry={fetchOverviewLogs}
            />
          ) : overviewLogs.length === 0 ? (
            <Card>
              <EmptyState message="No recent audit activity" />
            </Card>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <Th>Timestamp</Th>
                      <Th>Action</Th>
                      <Th>By</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {overviewLogs.map((l) => (
                      <Tr key={l.id}>
                        <Td>{fmtTime(l.performedAt)}</Td>
                        <Td>{l.action}</Td>
                        <Td>{l.performedByName}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </Card>
          )}
        </div>
      </TwoPanelGrid>
    </>
  );

  const renderAudit = () => (
    <>
      <FilterBar>
        <FilterSelect
          value={auditEntityType}
          onChange={(e) => setAuditEntityType(e.target.value)}
        >
          <option value="">All Entity Types</option>
          <option value="PARTNER">Partner</option>
          <option value="CLIENT">Client</option>
          <option value="USER">User</option>
          <option value="FLAG">Flag</option>
          <option value="PAYOUT">Payout</option>
        </FilterSelect>
        <SearchInput>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchField
            placeholder="Search audit logs..."
            value={auditSearch}
            onChange={(e) => setAuditSearch(e.target.value)}
          />
        </SearchInput>
        <Input
          type="date"
          value={auditFrom}
          onChange={(e) => setAuditFrom(e.target.value)}
          style={{ width: 160 }}
        />
        <Input
          type="date"
          value={auditTo}
          onChange={(e) => setAuditTo(e.target.value)}
          style={{ width: 160 }}
        />
        <Btn onClick={fetchAuditLogs}>
          <RefreshCw size={14} /> Refresh
        </Btn>
      </FilterBar>

      {auditLoading ? (
        <LoadingState />
      ) : auditError ? (
        <ErrorState message={auditError} onRetry={fetchAuditLogs} />
      ) : auditLogs.length === 0 ? (
        <Card>
          <EmptyState message="No audit logs found" />
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Timestamp</Th>
                  <Th>Action</Th>
                  <Th>Entity Type</Th>
                  <Th>Entity Name</Th>
                  <Th>Performed By</Th>
                  <Th>Old Value</Th>
                  <Th>New Value</Th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <Tr key={log.id}>
                    <Td style={{ whiteSpace: 'nowrap' }}>
                      {fmtTime(log.performedAt)}
                    </Td>
                    <Td>{log.action}</Td>
                    <Td>
                      <Badge $variant="default">{log.entityType}</Badge>
                    </Td>
                    <Td>{log.notes || `#${log.entityId}`}</Td>
                    <Td>{log.performedByName}</Td>
                    <Td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.oldValue || '\u2014'}
                    </Td>
                    <Td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.newValue || '\u2014'}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      )}
    </>
  );

  const renderFlags = () => (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <PillGroup>
          {(['OPEN', 'RESOLVED', 'ALL'] as const).map((f) => (
            <Pill
              key={f}
              $active={flagFilter === f}
              onClick={() => setFlagFilter(f)}
            >
              {f === 'OPEN' ? 'Open' : f === 'RESOLVED' ? 'Resolved' : 'All'}
            </Pill>
          ))}
        </PillGroup>
        <Btn
          $variant="primary"
          onClick={() => {
            setRaiseForm({
              entityType: 'PARTNER',
              entityId: '',
              entityName: '',
              flagType: 'MISSING_DOCUMENT',
              reason: '',
            });
            setShowRaiseModal(true);
          }}
        >
          <Plus size={16} /> Raise Flag
        </Btn>
      </div>

      {flagsLoading ? (
        <LoadingState />
      ) : flagsError ? (
        <ErrorState message={flagsError} onRetry={fetchFlags} />
      ) : flags.length === 0 ? (
        <Card>
          <EmptyState message="No compliance flags found" />
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Entity</Th>
                  <Th>Entity Type</Th>
                  <Th>Flag Type</Th>
                  <Th>Reason</Th>
                  <Th>Flagged By</Th>
                  <Th>Flagged At</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {flags.map((f) => (
                  <Tr key={f.id}>
                    <Td>{f.entityName}</Td>
                    <Td>
                      <Badge $variant="default">{f.entityType}</Badge>
                    </Td>
                    <Td>
                      <Badge $variant="warning">{f.flagType}</Badge>
                    </Td>
                    <Td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f.reason}
                    </Td>
                    <Td>{f.flaggedByName}</Td>
                    <Td style={{ whiteSpace: 'nowrap' }}>
                      {fmt(f.flaggedAt)}
                    </Td>
                    <Td>
                      <Badge
                        $variant={
                          f.status === 'OPEN'
                            ? 'danger'
                            : f.status === 'RESOLVED'
                              ? 'success'
                              : 'default'
                        }
                      >
                        {f.status}
                      </Badge>
                    </Td>
                    <Td>
                      {f.status === 'OPEN' ? (
                        <Btn
                          onClick={() => {
                            setResolveTarget(f);
                            setResolveNotes('');
                          }}
                        >
                          Resolve
                        </Btn>
                      ) : (
                        <span style={{ fontSize: 12, opacity: 0.6 }}>
                          {f.resolvedByName
                            ? `by ${f.resolvedByName}`
                            : '\u2014'}
                        </span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      )}
    </>
  );

  const renderRisk = () => (
    <>
      {riskLoading ? (
        <LoadingState />
      ) : riskError ? (
        <ErrorState message={riskError} onRetry={fetchRisks} />
      ) : risks.length === 0 ? (
        <Card>
          <EmptyState message="No partner risk data available" />
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Partner</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Missing ARN</Th>
                  <Th>Missing EUIN</Th>
                  <Th>Missing Bank</Th>
                  <Th>Open Flags</Th>
                  <Th>Registered</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {risks.map((p) => (
                  <Tr key={p.id}>
                    <Td>{p.fullName || p.firmName || p.email}</Td>
                    <Td>
                      <Badge $variant="default">{p.partnerType}</Badge>
                    </Td>
                    <Td>
                      <Badge
                        $variant={p.isActivated ? 'success' : 'warning'}
                      >
                        {p.isActivated ? 'Active' : 'Pending'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge $variant={p.missingArn ? 'danger' : 'success'}>
                        {p.missingArn ? 'Yes' : 'No'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        $variant={p.missingEuin ? 'danger' : 'success'}
                      >
                        {p.missingEuin ? 'Yes' : 'No'}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        $variant={
                          p.missingBankDetails ? 'danger' : 'success'
                        }
                      >
                        {p.missingBankDetails ? 'Yes' : 'No'}
                      </Badge>
                    </Td>
                    <Td>
                      {p.openFlagsCount > 0 ? (
                        <Badge $variant="danger">{p.openFlagsCount}</Badge>
                      ) : (
                        <Badge $variant="success">0</Badge>
                      )}
                    </Td>
                    <Td style={{ whiteSpace: 'nowrap' }}>
                      {fmt(p.createdAt)}
                    </Td>
                    <Td>
                      <Btn onClick={() => openRaiseModalForPartner(p)}>
                        <Flag size={14} /> Flag
                      </Btn>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      )}
    </>
  );

  const renderDisclosures = () => (
    <>
      <FilterBar>
        <Pill
          $active={showOnlyMissing}
          onClick={() => setShowOnlyMissing(!showOnlyMissing)}
        >
          {showOnlyMissing ? 'Showing Missing Only' : 'Show Only Missing Consents'}
        </Pill>
        <Btn onClick={fetchDisclosures}>
          <RefreshCw size={14} /> Refresh
        </Btn>
      </FilterBar>

      {disclosuresLoading ? (
        <LoadingState />
      ) : disclosuresError ? (
        <ErrorState message={disclosuresError} onRetry={fetchDisclosures} />
      ) : filteredDisclosures.length === 0 ? (
        <Card>
          <EmptyState
            message={
              showOnlyMissing
                ? 'All partners have complete consents'
                : 'No disclosure data available'
            }
          />
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Partner</Th>
                  <Th>Type</Th>
                  <Th>Terms</Th>
                  <Th>Declaration</Th>
                  <Th>Comm. Consent</Th>
                  <Th>AMC Sharing</Th>
                  <Th>Doc Sharing</Th>
                  <Th>Registered</Th>
                </tr>
              </thead>
              <tbody>
                {filteredDisclosures.map((d) => (
                  <Tr key={d.id}>
                    <Td>{d.fullName || d.email}</Td>
                    <Td>
                      <Badge $variant="default">{d.partnerType}</Badge>
                    </Td>
                    <Td>
                      <CheckMark $ok={d.termsAccepted}>
                        {d.termsAccepted ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </CheckMark>
                    </Td>
                    <Td>
                      <CheckMark $ok={d.declarationAccepted}>
                        {d.declarationAccepted ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </CheckMark>
                    </Td>
                    <Td>
                      <CheckMark $ok={d.consentComm}>
                        {d.consentComm ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </CheckMark>
                    </Td>
                    <Td>
                      <CheckMark $ok={d.consentShareAmc}>
                        {d.consentShareAmc ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </CheckMark>
                    </Td>
                    <Td>
                      <CheckMark $ok={d.consentShareDocs}>
                        {d.consentShareDocs ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </CheckMark>
                    </Td>
                    <Td style={{ whiteSpace: 'nowrap' }}>
                      {fmt(d.createdAt)}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      )}
    </>
  );

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <SCThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <DashboardWrapper>
        {/* Toast */}
        {toast && (
          <Toast $type={toast.type}>
            {toast.type === 'success' ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.msg}
          </Toast>
        )}

        {/* Sidebar */}
        <SidebarEl>
          <SidebarBrand>OngoleBulls Compliance</SidebarBrand>
          <SidebarNav>
            {navItems.map((item) => (
              <NavItem
                key={item.key}
                $active={section === item.key}
                onClick={() => setSection(item.key)}
              >
                {item.icon}
                {item.label}
              </NavItem>
            ))}
            <SidebarSpacer />
            <NavItem onClick={handleLogout}>
              <LogOut size={18} />
              Log Out
            </NavItem>
          </SidebarNav>
        </SidebarEl>

        {/* Main */}
        <MainEl>
          <HeaderEl>
            <HeaderTitle>{sectionTitles[section]}</HeaderTitle>
            <HeaderRight>
              <ThemeToggle onClick={toggleTheme}>
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </ThemeToggle>
            </HeaderRight>
          </HeaderEl>

          <PageContent>
            {section === 'overview' && renderOverview()}
            {section === 'audit' && renderAudit()}
            {section === 'flags' && renderFlags()}
            {section === 'risk' && renderRisk()}
            {section === 'disclosures' && renderDisclosures()}
          </PageContent>
        </MainEl>

        {/* Raise Flag Modal */}
        {showRaiseModal && (
          <Overlay onClick={() => setShowRaiseModal(false)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'inherit',
                  }}
                >
                  Raise Compliance Flag
                </span>
                <Btn onClick={() => setShowRaiseModal(false)}>
                  <X size={18} />
                </Btn>
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label>Entity Type</Label>
                  <Select
                    value={raiseForm.entityType}
                    onChange={(e) =>
                      setRaiseForm({
                        ...raiseForm,
                        entityType: e.target.value,
                      })
                    }
                  >
                    <option value="PARTNER">Partner</option>
                    <option value="CLIENT">Client</option>
                    <option value="USER">User</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Entity ID</Label>
                  <Input
                    type="number"
                    placeholder="Enter entity ID"
                    value={raiseForm.entityId}
                    onChange={(e) =>
                      setRaiseForm({
                        ...raiseForm,
                        entityId: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Entity Name</Label>
                  <Input
                    placeholder="Enter entity name"
                    value={raiseForm.entityName}
                    onChange={(e) =>
                      setRaiseForm({
                        ...raiseForm,
                        entityName: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Flag Type</Label>
                  <Select
                    value={raiseForm.flagType}
                    onChange={(e) =>
                      setRaiseForm({
                        ...raiseForm,
                        flagType: e.target.value,
                      })
                    }
                  >
                    <option value="MISSING_DOCUMENT">Missing Document</option>
                    <option value="KYC_ISSUE">KYC Issue</option>
                    <option value="REGULATORY_BREACH">
                      Regulatory Breach
                    </option>
                    <option value="DATA_DISCREPANCY">Data Discrepancy</option>
                    <option value="SUSPICIOUS_ACTIVITY">
                      Suspicious Activity
                    </option>
                    <option value="OTHER">Other</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Reason</Label>
                  <TextArea
                    placeholder="Describe the compliance concern..."
                    value={raiseForm.reason}
                    onChange={(e) =>
                      setRaiseForm({ ...raiseForm, reason: e.target.value })
                    }
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Btn onClick={() => setShowRaiseModal(false)}>Cancel</Btn>
                <Btn
                  $variant="primary"
                  onClick={handleRaiseFlag}
                  disabled={
                    raiseSubmitting ||
                    !raiseForm.entityId ||
                    !raiseForm.entityName.trim() ||
                    !raiseForm.reason.trim()
                  }
                >
                  {raiseSubmitting ? 'Submitting...' : 'Raise Flag'}
                </Btn>
              </ModalFooter>
            </ModalCard>
          </Overlay>
        )}

        {/* Resolve Flag Modal */}
        {resolveTarget && (
          <Overlay onClick={() => setResolveTarget(null)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'inherit',
                  }}
                >
                  Resolve Flag
                </span>
                <Btn onClick={() => setResolveTarget(null)}>
                  <X size={18} />
                </Btn>
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label>Entity</Label>
                  <Input value={resolveTarget.entityName} readOnly />
                </FormGroup>
                <FormGroup>
                  <Label>Flag Type</Label>
                  <Input value={resolveTarget.flagType} readOnly />
                </FormGroup>
                <FormGroup>
                  <Label>Reason</Label>
                  <TextArea value={resolveTarget.reason} readOnly />
                </FormGroup>
                <FormGroup>
                  <Label>Flagged By</Label>
                  <Input value={resolveTarget.flaggedByName} readOnly />
                </FormGroup>
                <FormGroup>
                  <Label>Flagged At</Label>
                  <Input value={fmtTime(resolveTarget.flaggedAt)} readOnly />
                </FormGroup>
                <FormGroup>
                  <Label>Resolution Notes *</Label>
                  <TextArea
                    placeholder="Describe how this was resolved..."
                    value={resolveNotes}
                    onChange={(e) => setResolveNotes(e.target.value)}
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Btn onClick={() => setResolveTarget(null)}>Cancel</Btn>
                <Btn
                  $variant="primary"
                  onClick={handleResolveFlag}
                  disabled={resolveSubmitting || !resolveNotes.trim()}
                >
                  {resolveSubmitting ? 'Resolving...' : 'Mark Resolved'}
                </Btn>
              </ModalFooter>
            </ModalCard>
          </Overlay>
        )}
      </DashboardWrapper>
    </SCThemeProvider>
  );
}
