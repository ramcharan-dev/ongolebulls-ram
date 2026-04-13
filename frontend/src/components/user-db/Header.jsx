import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, HelpCircle, Moon, Sun, User, Menu, ChevronUp, ChevronDown,
  MessageSquare, BookOpen, AlertCircle, LogOut, Settings, Command,
  ShieldAlert, UserCheck, Sparkles
} from 'lucide-react';
import { RaiseTicketModal } from './modals/RaiseTicketModal';
import { CommandPalette } from './modals/CommandPalette';
import { RedeemModal } from './modals/RedeemModal';
import { useAuth } from '../../hooks/useAuth';

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  STYLED COMPONENTS                                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

const HeaderContainer = styled.header`
  height: 72px;
  background-color: ${({ theme }) => theme.colors.header};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 40;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: none;
  padding: 8px;
  border-radius: 8px;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 8px 16px;
  width: 300px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchLabel = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  margin-left: 8px;
  user-select: none;
`;

const KbdHint = styled.span`
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 2px 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 2px;
`;

const IndicatorsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Indicator = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;

  span.label {
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    font-weight: 600;
  }

  span.value {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;

    &.up { color: ${({ theme }) => theme.colors.success}; }
    &.down { color: ${({ theme }) => theme.colors.danger}; }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);

  &:hover {
    background-color: #1D4ED8;
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
    border-color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 12px;
  border-right: 1px solid ${({ theme }) => theme.colors.divider};
  padding-right: 20px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #EF4444;
  border: 2px solid ${({ theme }) => theme.colors.header};
`;

/* ─── Dropdown Shared ────────────────────────────────────────────────────── */

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: ${({ $width }) => $width || '240px'};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
`;

const DropdownItem = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ $color, theme }) => $color || theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

/* ─── Notifications Dropdown ─────────────────────────────────────────────── */

const NotifHeader = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MarkReadBtn = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  padding: 0;

  &:hover { text-decoration: underline; }
`;

const NotifItem = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  background-color: ${({ $unread, theme }) => $unread ? `${theme.colors.secondary}08` : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`;

const NotifIconWrap = styled.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bg }) => $bg || 'rgba(59,130,246,0.1)'};
  color: ${({ $color }) => $color || '#3B82F6'};
`;

const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotifTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const NotifTime = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary};
  margin-top: 6px;
`;

/* ─── Profile Dropdown ───────────────────────────────────────────────────── */

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.secondary}30`};
  }
`;

const ProfileHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProfileName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

const ProfileEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  DATA                                                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */

const MARKET_DATA = [
  { label: 'NIFTY 50', value: '24,560.10', change: '+294.70', pct: '+1.2%', positive: true },
  { label: 'SENSEX', value: '80,123.45', change: '+640.30', pct: '+0.8%', positive: true },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'KYC Verification Pending',
    time: '2 hours ago',
    unread: true,
    icon: <ShieldAlert size={18} />,
    bg: 'rgba(245,158,11,0.1)',
    color: '#D97706',
  },
  {
    id: 2,
    title: 'Complete your UCC Registration',
    time: '1 day ago',
    unread: true,
    icon: <UserCheck size={18} />,
    bg: 'rgba(59,130,246,0.1)',
    color: '#3B82F6',
  },
  {
    id: 3,
    title: 'Welcome to OngoleBulls!',
    time: '3 days ago',
    unread: false,
    icon: <Sparkles size={18} />,
    bg: 'rgba(16,185,129,0.1)',
    color: '#10B981',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  HEADER COMPONENT                                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const Header = ({ toggleSidebar, toggleTheme, isDark }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ── Dropdown state ──────────────────────────────────────────────────────
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // ── User info ───────────────────────────────────────────────────────────
  const [userName, setUserName] = useState('Investor');
  const [userEmail, setUserEmail] = useState('');
  const [userInitials, setUserInitials] = useState('OB');

  // ── Refs for click-outside ──────────────────────────────────────────────
  const supportRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // ── Load user info from localStorage ────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('ob_user');
    let name = 'Investor';
    let email = '';
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.fullName) name = parsed.fullName;
        else if (parsed?.name) name = parsed.name;
        else if (parsed?.username) name = parsed.username;
        if (parsed?.email) email = parsed.email;
      } catch (e) { /* ignore */ }
    }
    setUserName(name);
    setUserEmail(email);

    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      setUserInitials((words[0][0] + words[1][0]).toUpperCase());
    } else if (words.length === 1 && words[0].length > 0) {
      setUserInitials(words[0].substring(0, 2).toUpperCase());
    } else {
      setUserInitials('OB');
    }
  }, []);

  // ── Click-outside handler ───────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (supportRef.current && !supportRef.current.contains(event.target)) {
        setIsSupportOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Cmd+K / Ctrl+K shortcut ────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleRaiseTicketClick = () => {
    setIsSupportOpen(false);
    setIsTicketModalOpen(true);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <HeaderContainer>
        <LeftSection>
          <MenuButton onClick={toggleSidebar}>
            <Menu size={24} />
          </MenuButton>

          {/* ── Search → opens CommandPalette ── */}
          <SearchContainer onClick={() => setIsCommandPaletteOpen(true)}>
            <Search size={18} color="currentColor" />
            <SearchLabel>Search stocks, funds, or symbols...</SearchLabel>
            <KbdHint>
              <Command size={11} />K
            </KbdHint>
          </SearchContainer>
        </LeftSection>

        {/* ── Market Tickers (dynamic green/red) ── */}
        <IndicatorsSection>
          {MARKET_DATA.map((item) => (
            <Indicator key={item.label}>
              <span className="label">{item.label}</span>
              <span className={`value ${item.positive ? 'up' : 'down'}`}>
                {item.value}{' '}
                {item.positive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}{' '}
                {item.pct}
              </span>
            </Indicator>
          ))}
        </IndicatorsSection>

        <RightSection>
          {/* ── Invest & Redeem ── */}
          <ActionButtonGroup>
            <PrimaryButton onClick={() => navigate('/dashboard/explore')}>
              Invest
            </PrimaryButton>
            <SecondaryButton onClick={() => setIsRedeemOpen(true)}>
              Redeem
            </SecondaryButton>
          </ActionButtonGroup>

          {/* ── Theme Toggle ── */}
          <ActionButton onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </ActionButton>

          {/* ── Notifications ── */}
          <DropdownContainer ref={notifRef}>
            <ActionButton
              title="Notifications"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <NotificationBadge />}
            </ActionButton>

            <DropdownMenu $isOpen={isNotificationsOpen} $width="320px">
              <NotifHeader>
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <MarkReadBtn onClick={handleMarkAllRead}>Mark all read</MarkReadBtn>
                )}
              </NotifHeader>
              {notifications.map((notif) => (
                <NotifItem key={notif.id} $unread={notif.unread}>
                  <NotifIconWrap $bg={notif.bg} $color={notif.color}>
                    {notif.icon}
                  </NotifIconWrap>
                  <NotifContent>
                    <NotifTitle>{notif.title}</NotifTitle>
                    <NotifTime>{notif.time}</NotifTime>
                  </NotifContent>
                  {notif.unread && <UnreadDot />}
                </NotifItem>
              ))}
            </DropdownMenu>
          </DropdownContainer>

          {/* ── Help & Support ── */}
          <DropdownContainer ref={supportRef}>
            <ActionButton
              title="Help & Support"
              onClick={() => setIsSupportOpen(!isSupportOpen)}
            >
              <HelpCircle size={20} />
            </ActionButton>

            <DropdownMenu $isOpen={isSupportOpen}>
              <DropdownItem onClick={handleRaiseTicketClick}>
                <AlertCircle size={18} />
                Raise Support Ticket
              </DropdownItem>
              <Divider />
              <DropdownItem onClick={() => { setIsSupportOpen(false); navigate('/dashboard/support'); }}>
                <MessageSquare size={18} />
                Contact Support
              </DropdownItem>
              <DropdownItem onClick={() => { setIsSupportOpen(false); navigate('/dashboard/support'); }}>
                <BookOpen size={18} />
                FAQ
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>

          {/* ── Profile Dropdown ── */}
          <DropdownContainer ref={profileRef}>
            <UserAvatar onClick={() => setIsProfileOpen(!isProfileOpen)}>
              {userInitials}
            </UserAvatar>

            <DropdownMenu $isOpen={isProfileOpen} $width="260px">
              <ProfileHeader>
                <ProfileName>{userName}</ProfileName>
                {userEmail && <ProfileEmail>{userEmail}</ProfileEmail>}
              </ProfileHeader>
              <DropdownItem onClick={() => { setIsProfileOpen(false); navigate('/dashboard/profile'); }}>
                <User size={18} />
                My Profile
              </DropdownItem>
              <DropdownItem onClick={() => { setIsProfileOpen(false); navigate('/dashboard/support'); }}>
                <Settings size={18} />
                Settings
              </DropdownItem>
              <Divider />
              <DropdownItem $color="#DC2626" onClick={handleSignOut}>
                <LogOut size={18} />
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
        </RightSection>
      </HeaderContainer>

      {/* ── Modals ── */}
      {isTicketModalOpen && (
        <RaiseTicketModal onClose={() => setIsTicketModalOpen(false)} />
      )}
      {isCommandPaletteOpen && (
        <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} />
      )}
      {isRedeemOpen && (
        <RedeemModal onClose={() => setIsRedeemOpen(false)} />
      )}
    </>
  );
};
