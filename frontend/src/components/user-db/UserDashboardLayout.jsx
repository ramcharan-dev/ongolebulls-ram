import React, { useState } from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Outlet } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useTheme } from '../../context/ThemeContext';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text};
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease-in-out;
  margin-left: 260px; /* Sidebar width */
  width: auto;
  max-width: none;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
  }
`;

const PageContainer = styled.div`
  padding: 28px 24px;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px 10px;
  }
`;

export const UserDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <StyledThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <LayoutWrapper>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <MainContent>
          <Header 
            toggleSidebar={toggleSidebar} 
            toggleTheme={toggleTheme} 
            isDark={isDark} 
          />
          
          <PageContainer>
            {/* The routed content will render here based on active sidebar link */}
            <Outlet />
          </PageContainer>
        </MainContent>
      </LayoutWrapper>
    </StyledThemeProvider>
  );
};
