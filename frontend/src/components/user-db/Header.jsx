import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Bell, HelpCircle, Moon, Sun, User, Menu, ChevronDown, MessageSquare, BookOpen, AlertCircle } from 'lucide-react';
import { RaiseTicketModal } from './modals/RaiseTicketModal';

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
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px ${({ theme }) => `rgba(59, 130, 246, 0.2)`};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  margin-left: 8px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SupportDropdownContainer = styled.div`
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
  width: 240px;
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
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
`;

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
`;

export const Header = ({ toggleSidebar, toggleTheme, isDark }) => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [userInitials, setUserInitials] = useState('OB');
  const supportRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (supportRef.current && !supportRef.current.contains(event.target)) {
        setIsSupportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('ob_user');
    let name = 'Investor';
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.fullName) name = parsed.fullName;
        else if (parsed?.name) name = parsed.name;
        else if (parsed?.username) name = parsed.username;
      } catch (e) {}
    }
    
    // Compute initials (e.g., "John Doe" -> "JD", "Investor" -> "IN")
    const words = name.trim().split(/\s+/);
    if (words.length > 0 && name.trim() !== '') {
      if (words.length >= 2) {
        setUserInitials((words[0][0] + words[1][0]).toUpperCase());
      } else {
        setUserInitials(words[0].substring(0, 2).toUpperCase());
      }
    } else {
      setUserInitials('OB');
    }
  }, []);

  const handleRaiseTicketClick = () => {
    setIsSupportOpen(false);
    setIsTicketModalOpen(true);
  };

  return (
    <>
      <HeaderContainer>
        <LeftSection>
          <MenuButton onClick={toggleSidebar}>
            <Menu size={24} />
          </MenuButton>
          <SearchContainer>
            <Search size={18} color="currentColor" />
            <SearchInput placeholder="Search stocks, funds, or symbols..." />
          </SearchContainer>
        </LeftSection>

        <IndicatorsSection>
          <Indicator>
            <span className="label">NIFTY 50</span>
            <span className="value up">24,560.10 <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }}/> 1.2%</span>
          </Indicator>
          <Indicator>
            <span className="label">SENSEX</span>
            <span className="value up">80,123.45 <ChevronDown size={14} style={{ transform: 'rotate(180deg)' }}/> 0.8%</span>
          </Indicator>
        </IndicatorsSection>

        <RightSection>
          <ActionButtonGroup>
            <PrimaryButton>Invest</PrimaryButton>
            <SecondaryButton>Redeem</SecondaryButton>
          </ActionButtonGroup>

          <ActionButton onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </ActionButton>
          
          <ActionButton title="Notifications">
            <Bell size={20} />
          </ActionButton>

          <SupportDropdownContainer ref={supportRef}>
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
              <DropdownItem>
                <MessageSquare size={18} />
                Contact Support
              </DropdownItem>
              <DropdownItem>
                <BookOpen size={18} />
                FAQ
              </DropdownItem>
            </DropdownMenu>
          </SupportDropdownContainer>

          <UserAvatar>
            {userInitials}
          </UserAvatar>
        </RightSection>
      </HeaderContainer>

      {isTicketModalOpen && (
        <RaiseTicketModal onClose={() => setIsTicketModalOpen(false)} />
      )}
    </>
  );
};
