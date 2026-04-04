import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider, keyframes, css } from 'styled-components';
import {
  LayoutDashboard, Wallet, Calculator, FileBarChart, Receipt, LogOut,
  Search, X, Eye, Bell, RefreshCw, Plus, Inbox, CheckCircle, Clock,
  AlertTriangle, ChevronDown, DollarSign, TrendingUp, AlertCircle,
  Info, Edit2,
} from 'lucide-react';
import { lightTheme, darkTheme } from '../../components/user-db/theme';
import { useTheme } from '../../context/ThemeContext';
import { financeApi } from '../../api/finance/financeApi';
import type {
  FinanceStats, PayoutEntry, CommissionRuleEntry, ReconciliationData, GstTdsData,
} from '../../types/api';

/* ─── Types ─────────────────────────────────────────────────────────── */
type Section = 'overview' | 'payouts' | 'commissions' | 'reconciliation' | 'gst';
interface ToastData { type: 'success' | 'error'; message: string }
interface PartnerOption { id: number; fullName: string }

/* ─── Helpers ───────────────────────────────────────────────────────── */
const formatINR = (amount: number | null | undefined) => {
  if (amount == null) return '\u20B90';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};
const fmtDate = (d: string | null | undefined) => {
  if (!d) return '\u2014';
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '\u2014'; }
};
const initials = (name: string | null | undefined) => {
  if (!name) return '?';
  const p = name.trim().split(/\s+/);
  return p.length > 1 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};

const RECENT_PERIODS = (() => {
  const periods: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return periods;
})();

/* ─── Animations ────────────────────────────────────────────────────── */
const spin = keyframes`to { transform: rotate(360deg); }`;
const toastIn = keyframes`from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }`;
const shimmer = keyframes`0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; }`;
const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;

/* ─── Styled Components ─────────────────────────────────────────────── */
const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const SidebarEl = styled.aside`
  width: 240px;
  background: ${({ theme }) => theme.colors.sidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 20;
`;

const NavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: ${({ $active, theme }) => $active ? theme.colors.muted : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.textMuted};
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? 600 : 500};
  cursor: pointer;
  font-family: inherit;
  border-left: 3px solid ${({ $active, theme }) => $active ? theme.colors.secondary : 'transparent'};
  transition: all 0.15s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MainEl = styled.div`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const HeaderEl = styled.header`
  height: 64px;
  background: ${({ theme }) => theme.colors.header};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const PageContent = styled.div`
  padding: 24px;
  animation: ${fadeIn} 0.3s ease;
`;

const Card = styled.div<{ $borderColor?: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ $borderColor, theme }) => $borderColor || theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.muted};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:first-child { border-radius: 8px 0 0 0; }
  &:last-child { border-radius: 0 8px 0 0; }
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background 0.1s ease;
  &:hover { background: ${({ theme }) => theme.colors.muted}; }
`;

const Badge = styled.span<{ $variant: 'success' | 'warning' | 'danger' | 'info' | 'muted' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success': return css`background: ${theme.colors.successLight}; color: ${theme.colors.success};`;
      case 'warning': return css`background: ${theme.colors.warningLight}; color: ${theme.colors.warning};`;
      case 'danger': return css`background: ${theme.colors.dangerLight}; color: ${theme.colors.danger};`;
      case 'info': return css`background: rgba(37,99,235,0.1); color: ${theme.colors.secondary};`;
      case 'muted': return css`background: ${theme.colors.muted}; color: ${theme.colors.textMuted};`;
    }
  }}
`;

const Btn = styled.button<{ $variant?: 'primary' | 'danger' | 'outline' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'danger': return css`background: ${theme.colors.danger}; color: ${theme.colors.buttonText}; border: none;`;
      case 'outline': return css`background: transparent; color: ${theme.colors.text}; border: 1px solid ${theme.colors.border};`;
      case 'ghost': return css`background: transparent; color: ${theme.colors.textMuted}; border: none; padding: 6px 8px;`;
      default: return css`background: ${theme.colors.secondary}; color: ${theme.colors.buttonText}; border: none;`;
    }
  }}
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 90%;
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
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.secondary}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  resize: vertical;
  &:focus { border-color: ${({ theme }) => theme.colors.secondary}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
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
  outline: none;
  cursor: pointer;
  &:focus { border-color: ${({ theme }) => theme.colors.secondary}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
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
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Skeleton = styled.div`
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.muted} 25%, ${({ theme }) => theme.colors.border} 50%, ${({ theme }) => theme.colors.muted} 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  margin-bottom: 12px;
  &:nth-child(2) { width: 80%; }
  &:nth-child(3) { width: 60%; }
`;

const PillGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
  background: ${({ $active, theme }) => $active ? theme.colors.secondary : theme.colors.muted};
  color: ${({ $active, theme }) => $active ? theme.colors.buttonText : theme.colors.textMuted};
  &:hover { opacity: 0.85; }
`;

const Toast = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 20px; right: 20px;
  z-index: 9999;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid ${({ $type, theme }) => $type === 'success' ? theme.colors.success : theme.colors.danger};
  animation: ${toastIn} 0.3s ease;
  max-width: 360px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

/* Extra layout helpers */
const SidebarBrand = styled.div`
  padding: 20px 16px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const SidebarUser = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const SidebarNav = styled.nav`
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const SidebarFooter = styled.div`
  padding: 8px 8px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
const Avatar = styled.div`
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary}, #1d4ed8);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 14px; flex-shrink: 0;
`;
const AvatarSm = styled(Avatar)`width: 32px; height: 32px; font-size: 12px;`;
const TwoCol = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px;`;
const FormRow = styled.div`margin-bottom: 16px;`;
const SearchWrap = styled.div`position: relative; max-width: 300px;`;
const SearchIcon = styled.div`position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: ${({ theme }) => theme.colors.textMuted};`;
const SearchInput = styled(Input)`padding-left: 36px;`;
const SectionTitle = styled.h3`font-size: 16px; font-weight: 600; margin-bottom: 16px; color: ${({ theme }) => theme.colors.text};`;
const NoteCard = styled.div`
  background: ${({ theme }) => theme.colors.warningLight};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 20px;
`;
const NetHighlight = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

/* ─── Nav Config ────────────────────────────────────────────────────── */
const NAV_ITEMS: { key: Section; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { key: 'payouts', label: 'Payouts', Icon: Wallet },
  { key: 'commissions', label: 'Commission Rules', Icon: Calculator },
  { key: 'reconciliation', label: 'Reconciliation', Icon: FileBarChart },
  { key: 'gst', label: 'GST / TDS', Icon: Receipt },
];
const NAV_LABELS: Record<Section, string> = {
  overview: 'Overview',
  payouts: 'Payouts Management',
  commissions: 'Commission Rules',
  reconciliation: 'Reconciliation',
  gst: 'GST / TDS Summary',
};

/* ─── Status helpers ────────────────────────────────────────────────── */
const statusVariant = (s: string): 'success' | 'warning' | 'danger' | 'info' | 'muted' => {
  const lower = s.toUpperCase();
  if (lower === 'RELEASED') return 'success';
  if (lower === 'APPROVED') return 'info';
  if (lower === 'PENDING') return 'warning';
  if (lower === 'DISPUTED') return 'danger';
  return 'muted';
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function FinanceDashboard() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const userData = JSON.parse(localStorage.getItem('ob_user') || '{}');

  useEffect(() => {
    if (userData.role !== 'FINANCE') navigate('/login');
  }, [userData.role, navigate]);

  const [section, setSection] = useState<Section>('overview');
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((type: ToastData['type'], message: string) => setToast({ type, message }), []);
  const handleLogout = () => { localStorage.removeItem('ob_user'); navigate('/login'); };

  if (userData.role !== 'FINANCE') return null;

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <DashboardWrapper>
        {/* ── Sidebar ─────────────────────────── */}
        <SidebarEl>
          <SidebarBrand>
            <div style={{ fontSize: 15, fontWeight: 700 }}>OngoleBulls Invest</div>
            <div style={{ fontSize: 11, color: 'inherit', opacity: 0.5, marginTop: 2 }}>Finance Dashboard</div>
          </SidebarBrand>
          <SidebarUser>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar>{initials(userData.fullName || userData.name)}</Avatar>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userData.fullName || userData.name || 'Finance'}
                </div>
                <Badge $variant="info" style={{ marginTop: 3, fontSize: 10 }}>Finance</Badge>
              </div>
            </div>
          </SidebarUser>
          <SidebarNav>
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <NavItem key={key} $active={section === key} onClick={() => setSection(key)}>
                <Icon size={18} /> {label}
              </NavItem>
            ))}
          </SidebarNav>
          <SidebarFooter>
            <NavItem onClick={handleLogout}><LogOut size={16} /> Logout</NavItem>
          </SidebarFooter>
        </SidebarEl>

        {/* ── Main ────────────────────────────── */}
        <MainEl>
          <HeaderEl>
            <span style={{ fontSize: 18, fontWeight: 600 }}>{NAV_LABELS[section]}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ background: 'none', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', transition: 'all 0.2s ease', color: 'inherit' }}>{isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}</button>
              <Bell size={18} style={{ cursor: 'pointer', opacity: 0.5 }} />
              <div style={{ width: 1, height: 24, background: 'currentColor', opacity: 0.15 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{userData.fullName || userData.name}</span>
              <AvatarSm>{initials(userData.fullName || userData.name)}</AvatarSm>
            </div>
          </HeaderEl>
          <PageContent>
            {section === 'overview' && <OverviewSection showToast={showToast} />}
            {section === 'payouts' && <PayoutsSection showToast={showToast} />}
            {section === 'commissions' && <CommissionsSection showToast={showToast} />}
            {section === 'reconciliation' && <ReconciliationSection showToast={showToast} />}
            {section === 'gst' && <GstTdsSection showToast={showToast} />}
          </PageContent>
        </MainEl>
      </DashboardWrapper>

      {toast && (
        <Toast $type={toast.type}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.message}
        </Toast>
      )}
    </ThemeProvider>
  );
}

/* ─── Shared Utility Components ─────────────────────────────────────── */
function Spinner() {
  const SpinWrap = styled.div`display: flex; justify-content: center; padding: 48px;`;
  const SpinCircle = styled.div`
    width: 28px; height: 28px;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  `;
  return <SpinWrap><SpinCircle /></SpinWrap>;
}

function LoadingSkeleton() {
  return <Card><Skeleton /><Skeleton /><Skeleton /></Card>;
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card $borderColor="currentColor" style={{ borderColor: 'var(--danger, #DC2626)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <AlertCircle size={20} />
        <span style={{ fontWeight: 600 }}>Error</span>
      </div>
      <p style={{ marginBottom: 16, fontSize: 14, opacity: 0.7 }}>{message}</p>
      <Btn $variant="outline" onClick={onRetry}><RefreshCw size={14} /> Retry</Btn>
    </Card>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.FC<{ size?: number }>; text: string }) {
  return (
    <Card>
      <EmptyBox>
        <Icon size={40} />
        <p>{text}</p>
      </EmptyBox>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   OVERVIEW SECTION
   ═══════════════════════════════════════════════════════════════════════ */
interface SectionProps { showToast: (t: ToastData['type'], m: string) => void }

function OverviewSection({ showToast }: SectionProps) {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [payouts, setPayouts] = useState<PayoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sRes, pRes] = await Promise.all([
        financeApi.getStats(),
        financeApi.getPayouts(),
      ]);
      setStats(sRes.data);
      setPayouts(Array.isArray(pRes.data) ? pRes.data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorCard message={error} onRetry={load} />;
  if (!stats) return <EmptyState icon={Inbox} text="No data available" />;

  const pendingPayouts = payouts.filter(p => p.status === 'PENDING').slice(0, 5);
  const releasedPayouts = payouts.filter(p => p.status === 'RELEASED').slice(0, 5);

  return (
    <>
      <StatsGrid>
        <Card>
          <StatLabel>Pending Payouts</StatLabel>
          <StatValue>{stats.totalPayoutsPending}</StatValue>
        </Card>
        <Card>
          <StatLabel>Released Payouts</StatLabel>
          <StatValue>{stats.totalPayoutsReleased}</StatValue>
        </Card>
        <Card>
          <StatLabel>Pending Amount</StatLabel>
          <StatValue>{formatINR(stats.pendingAmount)}</StatValue>
        </Card>
        <Card>
          <StatLabel>Released This Month</StatLabel>
          <StatValue>{formatINR(stats.releasedThisMonth)}</StatValue>
        </Card>
        <Card>
          <StatLabel>Active Commission Rules</StatLabel>
          <StatValue>{stats.activeCommissionRules}</StatValue>
        </Card>
        <Card>
          <StatLabel>Disputed Payouts</StatLabel>
          <StatValue>{stats.disputedPayouts}</StatValue>
        </Card>
      </StatsGrid>

      <TwoCol>
        {/* Payouts Awaiting Release */}
        <Card>
          <SectionTitle>Payouts Awaiting Release</SectionTitle>
          {pendingPayouts.length === 0 ? (
            <EmptyBox><Inbox size={32} /><p>No pending payouts</p></EmptyBox>
          ) : (
            <Table>
              <thead>
                <tr><Th>Partner</Th><Th>Period</Th><Th>Net</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {pendingPayouts.map(p => (
                  <Tr key={p.id}>
                    <Td>{p.partnerName}</Td>
                    <Td>{p.period}</Td>
                    <Td><NetHighlight>{formatINR(p.netAmount)}</NetHighlight></Td>
                    <Td><Badge $variant="warning">Pending</Badge></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {/* Recently Released */}
        <Card>
          <SectionTitle>Recently Released</SectionTitle>
          {releasedPayouts.length === 0 ? (
            <EmptyBox><Inbox size={32} /><p>No released payouts yet</p></EmptyBox>
          ) : (
            <Table>
              <thead>
                <tr><Th>Partner</Th><Th>Net</Th><Th>Date</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {releasedPayouts.map(p => (
                  <Tr key={p.id}>
                    <Td>{p.partnerName}</Td>
                    <Td><NetHighlight>{formatINR(p.netAmount)}</NetHighlight></Td>
                    <Td>{fmtDate(p.payoutDate)}</Td>
                    <Td><Badge $variant="success">Released</Badge></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </TwoCol>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAYOUTS SECTION
   ═══════════════════════════════════════════════════════════════════════ */
function PayoutsSection({ showToast }: SectionProps) {
  const [payouts, setPayouts] = useState<PayoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewPayout, setViewPayout] = useState<PayoutEntry | null>(null);
  const [releaseId, setReleaseId] = useState<number | null>(null);
  const [disputeId, setDisputeId] = useState<number | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [creating, setCreating] = useState(false);
  const [partners, setPartners] = useState<PartnerOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Create form
  const [cPartnerId, setCPartnerId] = useState(0);
  const [cPeriod, setCPeriod] = useState('');
  const [cGross, setCGross] = useState('');
  const [cGstPct, setCGstPct] = useState('18');
  const [cTdsPct, setCTdsPct] = useState('10');

  const calcNet = () => {
    const g = parseFloat(cGross) || 0;
    const gst = g * (parseFloat(cGstPct) || 0) / 100;
    const tds = g * (parseFloat(cTdsPct) || 0) / 100;
    return g - gst - tds;
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (filter) params.status = filter;
      if (search) params.search = search;
      const res = await financeApi.getPayouts(params);
      setPayouts(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = async () => {
    setCreating(true);
    try {
      const res = await financeApi.getPartners();
      setPartners(Array.isArray(res.data) ? res.data : []);
    } catch { /* fallback empty */ }
    setCPartnerId(0); setCPeriod(''); setCGross(''); setCGstPct('18'); setCTdsPct('10');
  };

  const handleCreate = async () => {
    if (!cPartnerId || !cPeriod || !cGross) { showToast('error', 'Fill all required fields'); return; }
    const partner = partners.find(p => p.id === cPartnerId);
    setSubmitting(true);
    try {
      await financeApi.createPayout({
        partnerId: cPartnerId,
        partnerName: partner?.fullName || '',
        period: cPeriod,
        grossAmount: parseFloat(cGross),
        gstPercent: parseFloat(cGstPct) || 0,
        tdsPercent: parseFloat(cTdsPct) || 0,
      });
      showToast('success', 'Payout created successfully');
      setCreating(false);
      load();
    } catch (e: any) {
      showToast('error', e?.response?.data?.message || 'Failed to create payout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRelease = async () => {
    if (!releaseId) return;
    setSubmitting(true);
    try {
      await financeApi.releasePayout(releaseId);
      showToast('success', 'Payout released');
      setReleaseId(null);
      load();
    } catch (e: any) {
      showToast('error', e?.response?.data?.message || 'Failed to release payout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeId || !disputeReason.trim()) { showToast('error', 'Please provide a dispute reason'); return; }
    setSubmitting(true);
    try {
      await financeApi.disputePayout(disputeId, disputeReason.trim());
      showToast('success', 'Payout disputed');
      setDisputeId(null);
      setDisputeReason('');
      load();
    } catch (e: any) {
      showToast('error', e?.response?.data?.message || 'Failed to dispute payout');
    } finally {
      setSubmitting(false);
    }
  };

  const filters = ['', 'PENDING', 'APPROVED', 'RELEASED', 'DISPUTED'];
  const filterLabels: Record<string, string> = { '': 'All', PENDING: 'Pending', APPROVED: 'Approved', RELEASED: 'Released', DISPUTED: 'Disputed' };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <PillGroup>
          {filters.map(f => (
            <Pill key={f} $active={filter === f} onClick={() => setFilter(f)}>{filterLabels[f]}</Pill>
          ))}
        </PillGroup>
        <Btn onClick={openCreate}><Plus size={14} /> Create Payout</Btn>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SearchWrap>
          <SearchIcon><Search size={16} /></SearchIcon>
          <SearchInput placeholder="Search by partner name..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchWrap>
      </div>

      {loading ? <LoadingSkeleton /> : error ? <ErrorCard message={error} onRetry={load} /> : payouts.length === 0 ? (
        <EmptyState icon={Wallet} text="No payouts found" />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Partner</Th><Th>Period</Th><Th>Gross</Th><Th>GST</Th><Th>TDS</Th>
                  <Th>Net</Th><Th>Date</Th><Th>Status</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {payouts.map(p => (
                  <Tr key={p.id}>
                    <Td>{p.partnerName}</Td>
                    <Td>{p.period}</Td>
                    <Td>{formatINR(p.grossAmount)}</Td>
                    <Td>{formatINR(p.gst)}</Td>
                    <Td>{formatINR(p.tds)}</Td>
                    <Td><NetHighlight>{formatINR(p.netAmount)}</NetHighlight></Td>
                    <Td>{fmtDate(p.payoutDate || p.createdAt)}</Td>
                    <Td><Badge $variant={statusVariant(p.status)}>{p.status}</Badge></Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn $variant="ghost" onClick={() => setViewPayout(p)} title="View"><Eye size={16} /></Btn>
                        {(p.status === 'PENDING' || p.status === 'APPROVED') && (
                          <Btn $variant="ghost" onClick={() => setReleaseId(p.id)} title="Release" style={{ color: '#059669' }}>
                            <CheckCircle size={16} />
                          </Btn>
                        )}
                        {p.status === 'PENDING' && (
                          <Btn $variant="ghost" onClick={() => { setDisputeId(p.id); setDisputeReason(''); }} title="Dispute" style={{ color: '#DC2626' }}>
                            <AlertTriangle size={16} />
                          </Btn>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* ── View Modal ── */}
      {viewPayout && (
        <Overlay onClick={() => setViewPayout(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Payout Details</span>
              <Btn $variant="ghost" onClick={() => setViewPayout(null)}><X size={18} /></Btn>
            </ModalHeader>
            <ModalBody>
              <FormRow><Label>Partner</Label><div>{viewPayout.partnerName}</div></FormRow>
              <TwoCol>
                <FormRow><Label>Period</Label><div>{viewPayout.period}</div></FormRow>
                <FormRow><Label>Status</Label><Badge $variant={statusVariant(viewPayout.status)}>{viewPayout.status}</Badge></FormRow>
              </TwoCol>
              <TwoCol>
                <FormRow><Label>Gross Amount</Label><div>{formatINR(viewPayout.grossAmount)}</div></FormRow>
                <FormRow><Label>Net Amount</Label><NetHighlight>{formatINR(viewPayout.netAmount)}</NetHighlight></FormRow>
              </TwoCol>
              <TwoCol>
                <FormRow><Label>GST</Label><div>{formatINR(viewPayout.gst)}</div></FormRow>
                <FormRow><Label>TDS</Label><div>{formatINR(viewPayout.tds)}</div></FormRow>
              </TwoCol>
              {viewPayout.payoutDate && <FormRow><Label>Payout Date</Label><div>{fmtDate(viewPayout.payoutDate)}</div></FormRow>}
              {viewPayout.releasedByName && <FormRow><Label>Released By</Label><div>{viewPayout.releasedByName}</div></FormRow>}
              {viewPayout.disputeReason && <FormRow><Label>Dispute Reason</Label><div style={{ padding: 12, borderRadius: 8 }}>{viewPayout.disputeReason}</div></FormRow>}
            </ModalBody>
            <ModalFooter><Btn $variant="outline" onClick={() => setViewPayout(null)}>Close</Btn></ModalFooter>
          </ModalCard>
        </Overlay>
      )}

      {/* ── Release Confirmation Modal ── */}
      {releaseId !== null && (
        <Overlay onClick={() => setReleaseId(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Confirm Release</span>
              <Btn $variant="ghost" onClick={() => setReleaseId(null)}><X size={18} /></Btn>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to release this payout? This action cannot be undone.</p>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="outline" onClick={() => setReleaseId(null)}>Cancel</Btn>
              <Btn onClick={handleRelease} disabled={submitting}>{submitting ? 'Releasing...' : 'Release Payout'}</Btn>
            </ModalFooter>
          </ModalCard>
        </Overlay>
      )}

      {/* ── Dispute Modal ── */}
      {disputeId !== null && (
        <Overlay onClick={() => setDisputeId(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Dispute Payout</span>
              <Btn $variant="ghost" onClick={() => setDisputeId(null)}><X size={18} /></Btn>
            </ModalHeader>
            <ModalBody>
              <FormRow>
                <Label>Reason for Dispute *</Label>
                <TextArea placeholder="Explain the reason for disputing this payout..." value={disputeReason} onChange={e => setDisputeReason(e.target.value)} />
              </FormRow>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="outline" onClick={() => setDisputeId(null)}>Cancel</Btn>
              <Btn $variant="danger" onClick={handleDispute} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Dispute'}</Btn>
            </ModalFooter>
          </ModalCard>
        </Overlay>
      )}

      {/* ── Create Payout Modal ── */}
      {creating && (
        <Overlay onClick={() => setCreating(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Create Payout</span>
              <Btn $variant="ghost" onClick={() => setCreating(false)}><X size={18} /></Btn>
            </ModalHeader>
            <ModalBody>
              <FormRow>
                <Label>Partner *</Label>
                <Select value={cPartnerId} onChange={e => setCPartnerId(Number(e.target.value))}>
                  <option value={0}>Select a partner</option>
                  {partners.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                </Select>
              </FormRow>
              <FormRow>
                <Label>Period *</Label>
                <Select value={cPeriod} onChange={e => setCPeriod(e.target.value)}>
                  <option value="">Select period</option>
                  {RECENT_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
              </FormRow>
              <FormRow>
                <Label>Gross Amount *</Label>
                <Input type="number" placeholder="Enter gross amount" value={cGross} onChange={e => setCGross(e.target.value)} />
              </FormRow>
              <TwoCol>
                <FormRow>
                  <Label>GST %</Label>
                  <Input type="number" value={cGstPct} onChange={e => setCGstPct(e.target.value)} />
                </FormRow>
                <FormRow>
                  <Label>TDS %</Label>
                  <Input type="number" value={cTdsPct} onChange={e => setCTdsPct(e.target.value)} />
                </FormRow>
              </TwoCol>
              <Card style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StatLabel>Net Payout (auto-calculated)</StatLabel>
                  <NetHighlight style={{ fontSize: 20 }}>{formatINR(calcNet())}</NetHighlight>
                </div>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="outline" onClick={() => setCreating(false)}>Cancel</Btn>
              <Btn onClick={handleCreate} disabled={submitting}>{submitting ? 'Creating...' : 'Create Payout'}</Btn>
            </ModalFooter>
          </ModalCard>
        </Overlay>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMMISSIONS SECTION
   ═══════════════════════════════════════════════════════════════════════ */
function CommissionsSection({ showToast }: SectionProps) {
  const [rules, setRules] = useState<CommissionRuleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRuleEntry | null>(null);
  const [deactivateId, setDeactivateId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [fAmc, setFAmc] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fTrail, setFTrail] = useState('');
  const [fUpfront, setFUpfront] = useState('');
  const [fFrom, setFFrom] = useState('');
  const [fTo, setFTo] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await financeApi.getCommissionRules();
      setRules(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load commission rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!fAmc || !fCategory || !fTrail || !fUpfront || !fFrom) {
      showToast('error', 'Fill all required fields');
      return;
    }
    setSubmitting(true);
    const payload = {
      amcName: fAmc,
      fundCategory: fCategory,
      trailPercent: parseFloat(fTrail),
      upfrontPercent: parseFloat(fUpfront),
      effectiveFrom: fFrom,
      effectiveTo: fTo || undefined,
    };
    try {
      if (editingRule) {
        await financeApi.updateCommissionRule(editingRule.id, payload);
        showToast('success', 'Commission rule updated');
      } else {
        await financeApi.createCommissionRule(payload);
        showToast('success', 'Commission rule created');
      }
      setAdding(false);
      setEditingRule(null);
      load();
    } catch (e: any) {
      showToast('error', e?.response?.data?.message || (editingRule ? 'Failed to update rule' : 'Failed to create rule'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    setSubmitting(true);
    try {
      await financeApi.deactivateCommissionRule(deactivateId);
      showToast('success', 'Rule deactivated');
      setDeactivateId(null);
      load();
    } catch (e: any) {
      showToast('error', e?.response?.data?.message || 'Failed to deactivate rule');
    } finally {
      setSubmitting(false);
    }
  };

  const CATEGORIES = ['Equity', 'Debt', 'Hybrid', 'ELSS', 'Liquid', 'Index', 'Sectoral', 'International'];
  const categoryVariant = (c: string): 'info' | 'success' | 'warning' | 'muted' => {
    if (['Equity', 'ELSS', 'Sectoral'].includes(c)) return 'info';
    if (['Debt', 'Liquid'].includes(c)) return 'success';
    if (['Hybrid', 'Index'].includes(c)) return 'warning';
    return 'muted';
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn onClick={() => { setEditingRule(null); setAdding(true); setFAmc(''); setFCategory(''); setFTrail(''); setFUpfront(''); setFFrom(''); setFTo(''); }}>
          <Plus size={14} /> Add Rule
        </Btn>
      </div>

      {loading ? <LoadingSkeleton /> : error ? <ErrorCard message={error} onRetry={load} /> : rules.length === 0 ? (
        <EmptyState icon={Calculator} text="No commission rules configured" />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>AMC</Th><Th>Category</Th><Th>Trail %</Th><Th>Upfront %</Th>
                  <Th>Effective From</Th><Th>Effective To</Th><Th>Status</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rules.map(r => (
                  <Tr key={r.id}>
                    <Td style={{ fontWeight: 500 }}>{r.amcName}</Td>
                    <Td><Badge $variant={categoryVariant(r.fundCategory)}>{r.fundCategory}</Badge></Td>
                    <Td>{r.trailPercent}%</Td>
                    <Td>{r.upfrontPercent}%</Td>
                    <Td>{fmtDate(r.effectiveFrom)}</Td>
                    <Td>{r.effectiveTo ? fmtDate(r.effectiveTo) : '\u2014'}</Td>
                    <Td>
                      <Badge $variant={r.isActive ? 'success' : 'danger'}>
                        {r.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {r.isActive && (
                          <Btn $variant="ghost" onClick={() => {
                            setEditingRule(r);
                            setFAmc(r.amcName);
                            setFCategory(r.fundCategory);
                            setFTrail(String(r.trailPercent));
                            setFUpfront(String(r.upfrontPercent));
                            setFFrom(r.effectiveFrom);
                            setFTo(r.effectiveTo || '');
                            setAdding(true);
                          }} title="Edit">
                            <Edit2 size={16} />
                          </Btn>
                        )}
                        {r.isActive && (
                          <Btn $variant="ghost" onClick={() => setDeactivateId(r.id)} title="Deactivate" style={{ color: '#DC2626' }}>
                            <X size={16} />
                          </Btn>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* ── Add / Edit Rule Modal ── */}
      {adding && (
        <Overlay onClick={() => { setAdding(false); setEditingRule(null); }}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span style={{ fontWeight: 600, fontSize: 16 }}>{editingRule ? 'Edit Commission Rule' : 'Add Commission Rule'}</span>
              <Btn $variant="ghost" onClick={() => { setAdding(false); setEditingRule(null); }}><X size={18} /></Btn>
            </ModalHeader>
            <ModalBody>
              <FormRow>
                <Label>AMC Name *</Label>
                <Input placeholder="e.g., HDFC Mutual Fund" value={fAmc} onChange={e => setFAmc(e.target.value)} />
              </FormRow>
              <FormRow>
                <Label>Fund Category *</Label>
                <Select value={fCategory} onChange={e => setFCategory(e.target.value)}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </FormRow>
              <TwoCol>
                <FormRow>
                  <Label>Trail % *</Label>
                  <Input type="number" step="0.01" placeholder="e.g., 0.50" value={fTrail} onChange={e => setFTrail(e.target.value)} />
                </FormRow>
                <FormRow>
                  <Label>Upfront % *</Label>
                  <Input type="number" step="0.01" placeholder="e.g., 1.00" value={fUpfront} onChange={e => setFUpfront(e.target.value)} />
                </FormRow>
              </TwoCol>
              <TwoCol>
                <FormRow>
                  <Label>Effective From *</Label>
                  <Input type="date" value={fFrom} onChange={e => setFFrom(e.target.value)} />
                </FormRow>
                <FormRow>
                  <Label>Effective To</Label>
                  <Input type="date" value={fTo} onChange={e => setFTo(e.target.value)} />
                </FormRow>
              </TwoCol>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="outline" onClick={() => { setAdding(false); setEditingRule(null); }}>Cancel</Btn>
              <Btn onClick={handleAdd} disabled={submitting}>
                {submitting ? (editingRule ? 'Updating...' : 'Creating...') : (editingRule ? 'Update Rule' : 'Create Rule')}
              </Btn>
            </ModalFooter>
          </ModalCard>
        </Overlay>
      )}

      {/* ── Deactivate Confirmation ── */}
      {deactivateId !== null && (
        <Overlay onClick={() => setDeactivateId(null)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span style={{ fontWeight: 600, fontSize: 16 }}>Confirm Deactivation</span>
              <Btn $variant="ghost" onClick={() => setDeactivateId(null)}><X size={18} /></Btn>
            </ModalHeader>
            <ModalBody>
              <p>Are you sure you want to deactivate this commission rule? It will no longer apply to new payouts.</p>
            </ModalBody>
            <ModalFooter>
              <Btn $variant="outline" onClick={() => setDeactivateId(null)}>Cancel</Btn>
              <Btn $variant="danger" onClick={handleDeactivate} disabled={submitting}>{submitting ? 'Deactivating...' : 'Deactivate'}</Btn>
            </ModalFooter>
          </ModalCard>
        </Overlay>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RECONCILIATION SECTION
   ═══════════════════════════════════════════════════════════════════════ */
function ReconciliationSection({ showToast }: SectionProps) {
  const [period, setPeriod] = useState(RECENT_PERIODS[0]);
  const [data, setData] = useState<ReconciliationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await financeApi.getReconciliation({ period });
      setData(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load reconciliation data');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Label>Period</Label>
        <Select style={{ maxWidth: 220 }} value={period} onChange={e => setPeriod(e.target.value)}>
          {RECENT_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
      </div>

      {loading ? <LoadingSkeleton /> : error ? <ErrorCard message={error} onRetry={load} /> : !data ? (
        <EmptyState icon={FileBarChart} text="No reconciliation data for this period" />
      ) : (
        <>
          <StatsGrid>
            <Card>
              <StatLabel>Total Gross</StatLabel>
              <StatValue>{formatINR(data.totalGross)}</StatValue>
            </Card>
            <Card>
              <StatLabel>Total GST</StatLabel>
              <StatValue>{formatINR(data.totalGst)}</StatValue>
            </Card>
            <Card>
              <StatLabel>Total TDS</StatLabel>
              <StatValue>{formatINR(data.totalTds)}</StatValue>
            </Card>
            <Card>
              <StatLabel>Net Released</StatLabel>
              <StatValue>{formatINR(data.totalNetReleased)}</StatValue>
            </Card>
            <Card>
              <StatLabel>Pending Release</StatLabel>
              <StatValue>{formatINR(data.pendingRelease)}</StatValue>
            </Card>
          </StatsGrid>

          <SectionTitle>Partner Breakdown</SectionTitle>
          {(!data.partnerBreakdown || data.partnerBreakdown.length === 0) ? (
            <EmptyState icon={Inbox} text="No partner breakdown data" />
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <thead>
                    <tr>
                      <Th>Partner</Th><Th>Gross</Th><Th>GST</Th><Th>TDS</Th><Th>Net</Th><Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.partnerBreakdown.map(p => (
                      <Tr key={p.id}>
                        <Td style={{ fontWeight: 500 }}>{p.partnerName}</Td>
                        <Td>{formatINR(p.grossAmount)}</Td>
                        <Td>{formatINR(p.gst)}</Td>
                        <Td>{formatINR(p.tds)}</Td>
                        <Td><NetHighlight>{formatINR(p.netAmount)}</NetHighlight></Td>
                        <Td><Badge $variant={statusVariant(p.status)}>{p.status}</Badge></Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   GST / TDS SECTION
   ═══════════════════════════════════════════════════════════════════════ */
function GstTdsSection({ showToast }: SectionProps) {
  const [period, setPeriod] = useState(RECENT_PERIODS[0]);
  const [data, setData] = useState<GstTdsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await financeApi.getGstTdsSummary({ period });
      setData(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load GST/TDS data');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Label>Period</Label>
        <Select style={{ maxWidth: 220 }} value={period} onChange={e => setPeriod(e.target.value)}>
          {RECENT_PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
      </div>

      {loading ? <LoadingSkeleton /> : error ? <ErrorCard message={error} onRetry={load} /> : !data ? (
        <EmptyState icon={Receipt} text="No GST/TDS data for this period" />
      ) : (
        <>
          <TwoCol>
            {/* GST Summary */}
            <div>
              <SectionTitle>GST Summary</SectionTitle>
              {(!data.gstEntries || data.gstEntries.length === 0) ? (
                <Card><EmptyBox><Inbox size={32} /><p>No GST entries</p></EmptyBox></Card>
              ) : (
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <Table>
                      <thead>
                        <tr><Th>Partner</Th><Th>PAN</Th><Th>Gross</Th><Th>Rate</Th><Th>Amount</Th><Th>Status</Th></tr>
                      </thead>
                      <tbody>
                        {data.gstEntries.map((e, i) => (
                          <Tr key={i}>
                            <Td style={{ fontWeight: 500 }}>{e.partnerName}</Td>
                            <Td>{e.pan || '\u2014'}</Td>
                            <Td>{formatINR(e.grossAmount)}</Td>
                            <Td>{e.rate}%</Td>
                            <Td>{formatINR(e.amount)}</Td>
                            <Td><Badge $variant={e.status === 'FILED' ? 'success' : 'warning'}>{e.status}</Badge></Td>
                          </Tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              )}
            </div>

            {/* TDS Summary */}
            <div>
              <SectionTitle>TDS Summary</SectionTitle>
              {(!data.tdsEntries || data.tdsEntries.length === 0) ? (
                <Card><EmptyBox><Inbox size={32} /><p>No TDS entries</p></EmptyBox></Card>
              ) : (
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <Table>
                      <thead>
                        <tr><Th>Partner</Th><Th>PAN</Th><Th>Gross</Th><Th>Rate</Th><Th>Amount</Th><Th>Status</Th></tr>
                      </thead>
                      <tbody>
                        {data.tdsEntries.map((e, i) => (
                          <Tr key={i}>
                            <Td style={{ fontWeight: 500 }}>{e.partnerName}</Td>
                            <Td>{e.pan || '\u2014'}</Td>
                            <Td>{formatINR(e.grossAmount)}</Td>
                            <Td>{e.rate}%</Td>
                            <Td>{formatINR(e.amount)}</Td>
                            <Td><Badge $variant={e.status === 'DEDUCTED' ? 'success' : 'warning'}>{e.status}</Badge></Td>
                          </Tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              )}
            </div>
          </TwoCol>

          <NoteCard>
            <Info size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>These figures are for reference. File GST returns through your CA or GST portal.</span>
          </NoteCard>
        </>
      )}
    </>
  );
}
