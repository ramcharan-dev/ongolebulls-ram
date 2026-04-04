import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import {
  LayoutDashboard, Ticket, UserCheck, AlertTriangle, LogOut,
  Search, X, RefreshCw, Inbox, CheckCircle, Clock, Send,
  MessageSquare, ChevronRight, User as UserIcon, Shield,
} from 'lucide-react';
import { lightTheme, darkTheme } from '../../components/user-db/theme';
import { useTheme } from '../../context/ThemeContext';
import { supportApi } from '../../api/support/supportApi';
import type {
  SupportStats, SupportTicket, TicketDetail, TicketReplyEntry, EscalationEntry,
} from '../../types/api';

/* ─── Types ─────────────────────────────────────────────────────────── */

type Section = 'overview' | 'tickets' | 'mine' | 'escalations';
interface Toast { type: 'success' | 'error'; message: string }

const NAV_ITEMS: { key: Section; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { key: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { key: 'tickets', label: 'All Tickets', Icon: Ticket },
  { key: 'mine', label: 'My Tickets', Icon: UserCheck },
  { key: 'escalations', label: 'Escalations', Icon: AlertTriangle },
];

const NAV_LABELS: Record<Section, string> = {
  overview: 'Overview',
  tickets: 'All Tickets',
  mine: 'My Tickets',
  escalations: 'Escalations',
};

/* ─── Helpers ───────────────────────────────────────────────────────── */

const fmt = (d: string | null | undefined) => {
  if (!d) return '\u2014';
  try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return '\u2014'; }
};

const fmtTime = (d: string | null | undefined) => {
  if (!d) return '';
  try { return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
};

const initials = (name: string | null | undefined) => {
  if (!name) return '?';
  const p = name.trim().split(/\s+/);
  return p.length > 1
    ? (p[0][0] + p[p.length - 1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

/* ═══════════════════════════════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  top: 0;
  left: 0;
  bottom: 0;
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
  border-left: 3px solid ${({ $active, theme }) => ($active ? theme.colors.secondary : 'transparent')};
  background: ${({ $active, theme }) => ($active ? `${theme.colors.secondary}15` : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.secondary : theme.colors.textMuted)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  &:hover {
    background: ${({ theme }) => `${theme.colors.secondary}10`};
    color: ${({ theme }) => theme.colors.secondary};
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
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

const Tr = styled.tr`
  transition: background 0.1s ease;
  &:hover { background: ${({ theme }) => `${theme.colors.muted}`}; }
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;
`;

const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const Btn = styled.button<{ $variant?: 'primary' | 'outline' | 'danger' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  padding: ${({ $variant }) => ($variant === 'ghost' ? '6px 8px' : '10px 20px')};
  background: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.secondary :
    $variant === 'danger' ? theme.colors.danger :
    $variant === 'ghost' ? 'transparent' :
    theme.colors.surface};
  color: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.buttonText :
    $variant === 'danger' ? theme.colors.buttonText :
    theme.colors.text};
  border: ${({ $variant, theme }) =>
    $variant === 'outline' ? `1px solid ${theme.colors.border}` : 'none'};
  &:hover {
    opacity: 0.9;
    ${({ $variant, theme }) =>
      $variant === 'outline' ? `background: ${theme.colors.muted};` : ''}
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: slideIn 0.2s ease;
  @keyframes slideIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalCard = styled.div<{ $width?: number }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: ${({ $width }) => ($width || 560)}px;
  max-height: 90vh;
  overflow: auto;
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
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
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
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.secondary}20`};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.secondary}20`};
  }
`;

const Select = styled.select`
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  outline: none;
  font-family: inherit;
  cursor: pointer;
  &:focus {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.secondary}20`};
  }
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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

const Skeleton = styled.div`
  display: flex;
  justify-content: center;
  padding: 48px;
`;

const SkeletonSpinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const PillGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
  background: ${({ $active, theme }) => ($active ? theme.colors.secondary : theme.colors.muted)};
  color: ${({ $active, theme }) => ($active ? theme.colors.buttonText : theme.colors.textMuted)};
  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.colors.secondary : theme.colors.border)};
  }
`;

const ToastEl = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 4px solid ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success : theme.colors.danger};
  max-width: 360px;
  animation: toastIn 0.3s ease;
  @keyframes toastIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

/* ─── Support-specific styled components ────────────────────────────── */

const ThreadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px 0;
`;

const MessageBubble = styled.div<{ $isSupport: boolean }>`
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ $isSupport, theme }) =>
    $isSupport ? theme.colors.muted : `${theme.colors.secondary}15`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 85%;
  align-self: ${({ $isSupport }) => ($isSupport ? 'flex-end' : 'flex-start')};
`;

const EscalationRow = styled(Tr)<{ $severity: string }>`
  background: ${({ $severity, theme }) =>
    $severity === 'critical' ? theme.colors.dangerLight :
    $severity === 'warning' ? theme.colors.warningLight : 'transparent'};
`;

const InternalNoteBubble = styled(MessageBubble)`
  background: ${({ theme }) => theme.colors.warningLight};
  border-color: ${({ theme }) => theme.colors.warning};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div``;

const ReplyToggle = styled.div`
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 12px;
`;

const ToggleBtn = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  background: ${({ $active, theme }) => ($active ? theme.colors.secondary : theme.colors.surface)};
  color: ${({ $active, theme }) => ($active ? theme.colors.buttonText : theme.colors.textMuted)};
  transition: all 0.15s ease;
`;

/* ─── Badge helpers ─────────────────────────────────────────────────── */

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    HIGH: { bg: 'dangerLight', color: 'danger' },
    MEDIUM: { bg: 'warningLight', color: 'warning' },
    LOW: { bg: 'muted', color: 'textMuted' },
  };
  const s = map[priority] || map.LOW;
  return (
    <ThemedBadge $bgKey={s.bg} $colorKey={s.color}>{priority}</ThemedBadge>
  );
}

const ThemedBadge = styled.span<{ $bgKey: string; $colorKey: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $bgKey, theme }) => (theme.colors as Record<string, string>)[$bgKey]};
  color: ${({ $colorKey, theme }) => (theme.colors as Record<string, string>)[$colorKey]};
`;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; icon?: React.ReactNode }> = {
    OPEN: { bg: 'warningLight', color: 'warning', icon: <Clock size={12} /> },
    IN_PROGRESS: { bg: 'muted', color: 'secondary', icon: <RefreshCw size={12} /> },
    RESOLVED: { bg: 'successLight', color: 'success', icon: <CheckCircle size={12} /> },
    CLOSED: { bg: 'muted', color: 'textMuted' },
  };
  const s = map[status] || map.OPEN;
  return (
    <ThemedBadge $bgKey={s.bg} $colorKey={s.color}>{s.icon} {status.replace('_', ' ')}</ThemedBadge>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <ThemedBadge $bgKey="muted" $colorKey="text">
      {category.replace(/_/g, ' ')}
    </ThemedBadge>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function SupportDashboard() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const userData = JSON.parse(localStorage.getItem('ob_user') || '{}');

  useEffect(() => {
    if (userData.role !== 'SUPPORT') {
      navigate('/login');
    }
  }, [userData.role, navigate]);

  const [section, setSection] = useState<Section>('overview');
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type: Toast['type'], message: string) => setToast({ type, message });
  const handleLogout = () => { localStorage.removeItem('ob_user'); navigate('/login'); };

  if (userData.role !== 'SUPPORT') return null;

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <DashboardWrapper>
        {/* ─── Sidebar ─────────────────────────────────────────────── */}
        <SidebarEl>
          <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${isDark ? darkTheme.colors.border : lightTheme.colors.border}` }}>
            <SidebarBrand>OngoleBulls Invest</SidebarBrand>
            <SidebarSub>Support Dashboard</SidebarSub>
          </div>
          <SidebarProfile>
            <Avatar>{initials(userData.fullName || userData.name)}</Avatar>
            <div style={{ minWidth: 0 }}>
              <SidebarName>{userData.fullName || userData.name || 'Support'}</SidebarName>
              <RoleBadge>Support</RoleBadge>
            </div>
          </SidebarProfile>
          <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <NavItem key={key} $active={section === key} onClick={() => setSection(key)}>
                <Icon size={18} /> {label}
              </NavItem>
            ))}
          </nav>
          <SidebarFooter>
            <NavItem onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </NavItem>
          </SidebarFooter>
        </SidebarEl>

        {/* ─── Main ────────────────────────────────────────────────── */}
        <MainEl>
          <HeaderEl>
            <HeaderTitle>{NAV_LABELS[section]}</HeaderTitle>
            <HeaderRight>
              <button onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ background: 'none', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', transition: 'all 0.2s ease', color: 'inherit' }}>{isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}</button>
              <HeaderName>{userData.fullName || userData.name}</HeaderName>
              <SmallAvatar>{initials(userData.fullName || userData.name)}</SmallAvatar>
            </HeaderRight>
          </HeaderEl>
          <PageContent>
            {section === 'overview' && <OverviewSection showToast={showToast} userId={userData.id} />}
            {section === 'tickets' && <AllTicketsSection showToast={showToast} userId={userData.id} />}
            {section === 'mine' && <MyTicketsSection showToast={showToast} userId={userData.id} />}
            {section === 'escalations' && <EscalationsSection showToast={showToast} userId={userData.id} />}
          </PageContent>
        </MainEl>

        {/* ─── Toast ───────────────────────────────────────────────── */}
        {toast && (
          <ToastEl $type={toast.type}>
            {toast.type === 'success'
              ? <CheckCircle size={16} />
              : <AlertTriangle size={16} />}
            <span style={{ fontSize: 14 }}>{toast.message}</span>
          </ToastEl>
        )}
      </DashboardWrapper>
    </ThemeProvider>
  );
}

/* ─── Sidebar sub-components ────────────────────────────────────────── */

const SidebarBrand = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.2px;
`;

const SidebarSub = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const SidebarProfile = styled.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary}, #1D4ED8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
`;

const SmallAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  font-size: 12px;
`;

const SidebarName = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RoleBadge = styled.span`
  display: inline-block;
  margin-top: 3px;
  padding: 2px 8px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  font-size: 10px;
  font-weight: 600;
`;

const SidebarFooter = styled.div`
  padding: 8px 8px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

/* ─── Shared sub-components ─────────────────────────────────────────── */

function LoadingSpinner() {
  return <Skeleton><SkeletonSpinner /></Skeleton>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <EmptyBox>
      <Inbox size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
      <p style={{ fontSize: 14, opacity: 0.6 }}>{text}</p>
    </EmptyBox>
  );
}

function ErrorCard({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <Card style={{ textAlign: 'center', padding: 32 }}>
      <p style={{ marginBottom: 12, color: 'inherit' }}>{msg}</p>
      <Btn $variant="outline" onClick={onRetry}><RefreshCw size={14} /> Retry</Btn>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   OVERVIEW SECTION
   ═══════════════════════════════════════════════════════════════════════ */

function OverviewSection({ showToast, userId }: { showToast: (t: 'success' | 'error', m: string) => void; userId: number }) {
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        supportApi.getStats(),
        supportApi.getTickets({}),
      ]);
      setStats(statsRes.data);
      setTickets(ticketsRes.data);
    } catch {
      setError('Failed to load overview data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;
  if (!stats) return null;

  const kpis = [
    { label: 'Open Tickets', value: stats.openTickets, icon: <Ticket size={20} />, bgKey: 'warningLight' as const, colorKey: 'warning' as const },
    { label: 'In Progress', value: stats.inProgressTickets, icon: <RefreshCw size={20} />, bgKey: 'muted' as const, colorKey: 'secondary' as const },
    { label: 'Resolved Today', value: stats.resolvedToday, icon: <CheckCircle size={20} />, bgKey: 'successLight' as const, colorKey: 'success' as const },
    { label: 'My Open Tickets', value: stats.myOpenTickets, icon: <UserCheck size={20} />, bgKey: 'muted' as const, colorKey: 'secondary' as const },
    { label: 'High Priority Open', value: stats.highPriorityOpen, icon: <AlertTriangle size={20} />, bgKey: 'dangerLight' as const, colorKey: 'danger' as const },
    { label: 'Avg Resolution (hrs)', value: stats.avgResolutionHours, icon: <Clock size={20} />, bgKey: 'muted' as const, colorKey: 'textMuted' as const },
  ];

  const highPriority = tickets
    .filter(t => t.priority === 'HIGH' && t.status === 'OPEN')
    .slice(0, 5);

  const recentlyResolved = tickets
    .filter(t => t.status === 'RESOLVED')
    .sort((a, b) => new Date(b.resolvedAt || b.updatedAt).getTime() - new Date(a.resolvedAt || a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <>
      <StatsGrid>
        {kpis.map(k => (
          <Card key={k.label}>
            <StatIconRow>
              <StatIconBox $bgKey={k.bgKey} $colorKey={k.colorKey}>{k.icon}</StatIconBox>
              <StatLabel>{k.label}</StatLabel>
            </StatIconRow>
            <StatValue>{k.value}</StatValue>
          </Card>
        ))}
      </StatsGrid>

      <TwoPanelGrid>
        <Card>
          <CardTitle><AlertTriangle size={18} /> High Priority Tickets</CardTitle>
          {highPriority.length === 0
            ? <p style={{ fontSize: 14, opacity: 0.5 }}>No high priority open tickets.</p>
            : (
              <TableWrap>
                <Table>
                  <thead><tr><Th>Ticket ID</Th><Th>Subject</Th><Th>Raised By</Th><Th>Status</Th></tr></thead>
                  <tbody>
                    {highPriority.map(t => (
                      <Tr key={t.id}>
                        <Td><TicketIdText>{t.ticketId}</TicketIdText></Td>
                        <Td style={{ fontWeight: 500 }}>{t.subject}</Td>
                        <Td>{t.raisedByName}</Td>
                        <Td><StatusBadge status={t.status} /></Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            )}
        </Card>

        <Card>
          <CardTitle><CheckCircle size={18} /> Recently Resolved</CardTitle>
          {recentlyResolved.length === 0
            ? <p style={{ fontSize: 14, opacity: 0.5 }}>No recently resolved tickets.</p>
            : (
              <TableWrap>
                <Table>
                  <thead><tr><Th>Ticket ID</Th><Th>Subject</Th><Th>Resolved</Th></tr></thead>
                  <tbody>
                    {recentlyResolved.map(t => (
                      <Tr key={t.id}>
                        <Td><TicketIdText>{t.ticketId}</TicketIdText></Td>
                        <Td style={{ fontWeight: 500 }}>{t.subject}</Td>
                        <Td>{fmt(t.resolvedAt || t.updatedAt)}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            )}
        </Card>
      </TwoPanelGrid>
    </>
  );
}

const StatIconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const StatIconBox = styled.div<{ $bgKey: string; $colorKey: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bgKey, theme }) => (theme.colors as Record<string, string>)[$bgKey]};
  color: ${({ $colorKey, theme }) => (theme.colors as Record<string, string>)[$colorKey]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TwoPanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const CardTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TableWrap = styled.div`
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TicketIdText = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

/* ═══════════════════════════════════════════════════════════════════════
   TICKET DETAIL MODAL
   ═══════════════════════════════════════════════════════════════════════ */

function TicketDetailModal({
  ticketId,
  onClose,
  showToast,
  onRefresh,
}: {
  ticketId: number;
  onClose: () => void;
  showToast: (t: 'success' | 'error', m: string) => void;
  onRefresh: () => void;
}) {
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await supportApi.getTicketDetail(ticketId);
      setDetail(res.data);
      setNewStatus(res.data.status);
    } catch {
      setError('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { load(); }, [load]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await supportApi.addReply(ticketId, { message: replyText.trim(), isInternal });
      setReplyText('');
      showToast('success', isInternal ? 'Internal note added' : 'Reply sent');
      load();
      onRefresh();
    } catch {
      showToast('error', 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async () => {
    if (!detail || newStatus === detail.status) return;
    try {
      await supportApi.updateStatus(ticketId, newStatus);
      showToast('success', `Status updated to ${newStatus.replace('_', ' ')}`);
      load();
      onRefresh();
    } catch {
      showToast('error', 'Failed to update status');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard $width={640} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {loading ? 'Loading...' : detail ? detail.ticketId : 'Ticket'}
            </span>
            {detail && (
              <>
                <StatusBadge status={detail.status} />
                <PriorityBadge priority={detail.priority} />
              </>
            )}
          </div>
          <Btn $variant="ghost" onClick={onClose}><X size={20} /></Btn>
        </ModalHeader>

        <ModalBody>
          {loading && <LoadingSpinner />}
          {error && <ErrorCard msg={error} onRetry={load} />}
          {detail && !loading && (
            <>
              {/* Subject */}
              <ModalSubject>{detail.subject}</ModalSubject>

              {/* Info */}
              <InfoGrid>
                <InfoItem>
                  <Label>Raised By</Label>
                  <InfoValue>{detail.raisedByName} ({detail.raisedByEmail})</InfoValue>
                </InfoItem>
                <InfoItem>
                  <Label>Category</Label>
                  <div><CategoryBadge category={detail.category} /></div>
                </InfoItem>
                <InfoItem>
                  <Label>Created</Label>
                  <InfoValue>{fmt(detail.createdAt)} {fmtTime(detail.createdAt)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <Label>Assigned To</Label>
                  <InfoValue>{detail.assignedToName || 'Unassigned'}</InfoValue>
                </InfoItem>
              </InfoGrid>

              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                <Label>Description</Label>
                <DescriptionBox>{detail.description}</DescriptionBox>
              </div>

              {/* Conversation */}
              <Label>Conversation ({detail.replies.length})</Label>
              <ThreadContainer>
                {detail.replies.length === 0 && (
                  <p style={{ textAlign: 'center', fontSize: 14, opacity: 0.5, padding: 16 }}>
                    No replies yet.
                  </p>
                )}
                {detail.replies.map((r: TicketReplyEntry) => {
                  // Check if it looks like an internal note based on the data we have
                  const isNoteStyle = !r.isFromSupport ? false : r.message.startsWith('[Internal]');
                  const BubbleComponent = isNoteStyle ? InternalNoteBubble : MessageBubble;
                  return (
                    <BubbleComponent key={r.id} $isSupport={r.isFromSupport}>
                      <BubbleHeader>
                        <BubbleAvatar $isSupport={r.isFromSupport}>
                          {r.isFromSupport ? <Shield size={12} /> : <UserIcon size={12} />}
                        </BubbleAvatar>
                        <BubbleName>{r.repliedBy}</BubbleName>
                        <BubbleTime>{fmt(r.createdAt)} {fmtTime(r.createdAt)}</BubbleTime>
                        {r.isFromSupport && isNoteStyle && (
                          <ThemedBadge $bgKey="warningLight" $colorKey="warning" style={{ fontSize: 10, padding: '2px 6px' }}>
                            Internal
                          </ThemedBadge>
                        )}
                      </BubbleHeader>
                      <BubbleText>{r.message}</BubbleText>
                    </BubbleComponent>
                  );
                })}
              </ThreadContainer>

              {/* Reply form */}
              <ReplySection>
                <Label>Reply</Label>
                <ReplyToggle>
                  <ToggleBtn $active={!isInternal} onClick={() => setIsInternal(false)}>
                    <MessageSquare size={14} /> Public Reply
                  </ToggleBtn>
                  <ToggleBtn $active={isInternal} onClick={() => setIsInternal(true)}>
                    <Shield size={14} /> Internal Note
                  </ToggleBtn>
                </ReplyToggle>
                <TextArea
                  placeholder={isInternal ? 'Write an internal note...' : 'Type your reply...'}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <Btn $variant="primary" onClick={handleReply} disabled={sending || !replyText.trim()}>
                    <Send size={14} /> {sending ? 'Sending...' : 'Send'}
                  </Btn>
                </div>
              </ReplySection>

              {/* Status change */}
              <StatusChangeRow>
                <Label style={{ marginBottom: 0, alignSelf: 'center' }}>Change Status</Label>
                <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </Select>
                <Btn $variant="outline" onClick={handleStatusChange} disabled={newStatus === detail.status}>
                  Update
                </Btn>
              </StatusChangeRow>
            </>
          )}
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
}

const ModalSubject = styled.h2`
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoValue = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2px;
`;

const DescriptionBox = styled.div`
  background: ${({ theme }) => theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;

const BubbleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const BubbleAvatar = styled.div<{ $isSupport: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $isSupport, theme }) =>
    $isSupport ? theme.colors.secondary : theme.colors.muted};
  color: ${({ $isSupport, theme }) =>
    $isSupport ? '#fff' : theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BubbleName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const BubbleTime = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BubbleText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;

const ReplySection = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatusChangeRow = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 12px;
`;

/* ═══════════════════════════════════════════════════════════════════════
   TICKET TABLE (reusable)
   ═══════════════════════════════════════════════════════════════════════ */

function TicketTable({
  tickets,
  showToast,
  onRefresh,
  userId,
  showAssign = false,
  showUnassign = false,
}: {
  tickets: SupportTicket[];
  showToast: (t: 'success' | 'error', m: string) => void;
  onRefresh: () => void;
  userId: number;
  showAssign?: boolean;
  showUnassign?: boolean;
}) {
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [acting, setActing] = useState<number | null>(null);

  const assignToMe = async (id: number) => {
    setActing(id);
    try {
      await supportApi.assignTicket(id, userId);
      showToast('success', 'Ticket assigned to you');
      onRefresh();
    } catch {
      showToast('error', 'Failed to assign ticket');
    } finally {
      setActing(null);
    }
  };

  const unassign = async (id: number) => {
    setActing(id);
    try {
      await supportApi.assignTicket(id, 0);
      showToast('success', 'Ticket unassigned');
      onRefresh();
    } catch {
      showToast('error', 'Failed to unassign ticket');
    } finally {
      setActing(null);
    }
  };

  return (
    <>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Ticket ID</Th>
              <Th>Subject</Th>
              <Th>Raised By</Th>
              <Th>Category</Th>
              <Th>Priority</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Assigned To</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <Tr key={t.id}>
                <Td><TicketIdText>{t.ticketId}</TicketIdText></Td>
                <Td style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</Td>
                <Td>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.raisedByName}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{t.raisedByEmail}</div>
                </Td>
                <Td><CategoryBadge category={t.category} /></Td>
                <Td><PriorityBadge priority={t.priority} /></Td>
                <Td><StatusBadge status={t.status} /></Td>
                <Td>{fmt(t.createdAt)}</Td>
                <Td>{t.assignedToName || <span style={{ opacity: 0.4 }}>Unassigned</span>}</Td>
                <Td>
                  <ActionGroup>
                    <Btn $variant="outline" onClick={() => setViewingId(t.id)} style={{ padding: '6px 12px', fontSize: 12 }}>
                      <ChevronRight size={12} /> View & Reply
                    </Btn>
                    {showAssign && !t.assignedTo && (
                      <Btn $variant="primary" onClick={() => assignToMe(t.id)} disabled={acting === t.id} style={{ padding: '6px 12px', fontSize: 12 }}>
                        <UserCheck size={12} /> Assign to Me
                      </Btn>
                    )}
                    {showUnassign && t.assignedTo === userId && (
                      <Btn $variant="outline" onClick={() => unassign(t.id)} disabled={acting === t.id} style={{ padding: '6px 12px', fontSize: 12 }}>
                        <X size={12} /> Unassign
                      </Btn>
                    )}
                  </ActionGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>

      {viewingId !== null && (
        <TicketDetailModal
          ticketId={viewingId}
          onClose={() => setViewingId(null)}
          showToast={showToast}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

/* ═══════════════════════════════════════════════════════════════════════
   ALL TICKETS SECTION
   ═══════════════════════════════════════════════════════════════════════ */

function AllTicketsSection({ showToast, userId }: { showToast: (t: 'success' | 'error', m: string) => void; userId: number }) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search) params.search = search;
      const res = await supportApi.getTickets(params);
      setTickets(res.data);
    } catch {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, search]);

  useEffect(() => { load(); }, [load]);

  const statuses = ['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const statusLabels: Record<string, string> = { '': 'All', OPEN: 'Open', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved', CLOSED: 'Closed' };
  const priorities = ['', 'HIGH', 'MEDIUM', 'LOW'];
  const priorityLabels: Record<string, string> = { '': 'All', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

  return (
    <>
      <FilterBar>
        <FilterSection>
          <Label>Status</Label>
          <PillGroup>
            {statuses.map(s => (
              <Pill key={s} $active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {statusLabels[s]}
              </Pill>
            ))}
          </PillGroup>
        </FilterSection>
        <FilterSection>
          <Label>Priority</Label>
          <PillGroup>
            {priorities.map(p => (
              <Pill key={p} $active={priorityFilter === p} onClick={() => setPriorityFilter(p)}>
                {priorityLabels[p]}
              </Pill>
            ))}
          </PillGroup>
        </FilterSection>
        <SearchWrap>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 14, opacity: 0.4 }} />
          <Input
            placeholder="Search by subject or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </SearchWrap>
      </FilterBar>

      {loading && <LoadingSpinner />}
      {error && <ErrorCard msg={error} onRetry={load} />}
      {!loading && !error && tickets.length === 0 && <EmptyState text="No tickets found matching your filters." />}
      {!loading && !error && tickets.length > 0 && (
        <TicketTable
          tickets={tickets}
          showToast={showToast}
          onRefresh={load}
          userId={userId}
          showAssign
        />
      )}
    </>
  );
}

const FilterBar = styled(Card)`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterSection = styled.div``;

const SearchWrap = styled.div`
  position: relative;
  max-width: 360px;
`;

/* ═══════════════════════════════════════════════════════════════════════
   MY TICKETS SECTION
   ═══════════════════════════════════════════════════════════════════════ */

function MyTicketsSection({ showToast, userId }: { showToast: (t: 'success' | 'error', m: string) => void; userId: number }) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await supportApi.getMyTickets();
      setTickets(res.data);
    } catch {
      setError('Failed to load your tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;
  if (tickets.length === 0) return <EmptyState text="You have no tickets assigned to you." />;

  return (
    <TicketTable
      tickets={tickets}
      showToast={showToast}
      onRefresh={load}
      userId={userId}
      showUnassign
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ESCALATIONS SECTION
   ═══════════════════════════════════════════════════════════════════════ */

function EscalationsSection({ showToast, userId }: { showToast: (t: 'success' | 'error', m: string) => void; userId: number }) {
  const [escalations, setEscalations] = useState<EscalationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await supportApi.getEscalations();
      setEscalations(res.data);
    } catch {
      setError('Failed to load escalations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const escalate = async (id: number) => {
    setActing(id);
    try {
      await supportApi.escalateTicket(id);
      showToast('success', 'Ticket escalated');
      load();
    } catch {
      showToast('error', 'Failed to escalate ticket');
    } finally {
      setActing(null);
    }
  };

  const getSeverity = (hours: number): string => {
    if (hours > 48) return 'critical';
    if (hours > 24) return 'warning';
    return 'normal';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorCard msg={error} onRetry={load} />;
  if (escalations.length === 0) return <EmptyState text="No escalated or overdue tickets." />;

  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <Th>Ticket ID</Th>
            <Th>Subject</Th>
            <Th>Raised By</Th>
            <Th>Priority</Th>
            <Th>Hours Open</Th>
            <Th>Replies</Th>
            <Th>Assigned To</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {escalations.map(e => (
            <EscalationRow key={e.id} $severity={getSeverity(e.hoursOpen)}>
              <Td><TicketIdText>{e.ticketId}</TicketIdText></Td>
              <Td style={{ fontWeight: 500 }}>{e.subject}</Td>
              <Td>{e.raisedByName}</Td>
              <Td><PriorityBadge priority={e.priority} /></Td>
              <Td>
                <HoursText $severity={getSeverity(e.hoursOpen)}>
                  {e.hoursOpen}h
                </HoursText>
              </Td>
              <Td>{e.replyCount}</Td>
              <Td>{e.assignedToName || <span style={{ opacity: 0.4 }}>Unassigned</span>}</Td>
              <Td>
                {!e.isEscalated ? (
                  <Btn
                    $variant="danger"
                    onClick={() => escalate(e.id)}
                    disabled={acting === e.id}
                    style={{ padding: '6px 12px', fontSize: 12 }}
                  >
                    <AlertTriangle size={12} /> Escalate
                  </Btn>
                ) : (
                  <ThemedBadge $bgKey="dangerLight" $colorKey="danger">
                    <AlertTriangle size={12} /> Escalated
                  </ThemedBadge>
                )}
              </Td>
            </EscalationRow>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}

const HoursText = styled.span<{ $severity: string }>`
  font-weight: 700;
  font-size: 14px;
  color: ${({ $severity, theme }) =>
    $severity === 'critical' ? theme.colors.danger :
    $severity === 'warning' ? theme.colors.warning :
    theme.colors.text};
`;
