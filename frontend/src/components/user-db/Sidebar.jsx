import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Receipt, FileText, HelpCircle, X, User } from 'lucide-react';
import logo from '../../assets/logo4.png';

const SidebarContainer = styled.aside`
  background-color: ${({ theme }) => theme.colors.sidebar};
  width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  z-index: 50;

  @media (max-width: 1024px) {
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  height: 68px;
  width: auto;
  object-fit: contain;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  display: none;
  padding: 4px;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavList = styled.nav`
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Explore Funds', path: '/dashboard/explore', icon: <Compass size={20} /> },
    { name: 'SIPs', path: '/dashboard/sips', icon: <Receipt size={20} /> },
    { name: 'Statements', path: '/dashboard/statements', icon: <FileText size={20} /> },
    { name: 'My Profile', path: '/dashboard/profile', icon: <User size={20} /> },
    { name: 'Support / Help', path: '/dashboard/support', icon: <HelpCircle size={20} /> },
  ];

  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <LogoContainer>
          <h1>OngoleBulls</h1>
          <LogoImage src={logo} alt="OngoleBulls" />
          
        </LogoContainer>
        <CloseButton onClick={toggleSidebar}>
          <X size={20} />
        </CloseButton>
      </SidebarHeader>
      
      <NavList>
        {navLinks.map((link) => (
          <NavItem 
            key={link.name} 
            to={link.path}
            end={link.path === '/dashboard'}
            onClick={() => {
              if (window.innerWidth <= 1024) toggleSidebar();
            }}
          >
            <IconWrapper>{link.icon}</IconWrapper>
            {link.name}
          </NavItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};
