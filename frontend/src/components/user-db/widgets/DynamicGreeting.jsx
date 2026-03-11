import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GreetingContainer = styled.div`
  margin-bottom: 24px;
`;

const GreetingTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GreetingSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

export const DynamicGreeting = () => {
  const [greeting, setGreeting] = useState('Good Morning');
  const [userName, setUserName] = useState('Investor');

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const storedUser = localStorage.getItem('ob_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.fullName) setUserName(parsed.fullName);
        else if (parsed?.name) setUserName(parsed.name);
        else if (parsed?.username) setUserName(parsed.username);
        else setUserName('Investor');
      } catch (e) {
        setUserName('Investor');
      }
    } else {
      setUserName('Investor');
    }
  }, []);

  return (
    <GreetingContainer>
      <GreetingTitle>
        {greeting}, {userName} <span role="img" aria-label="wave">👋</span>
      </GreetingTitle>
      <GreetingSubtitle>
        Start building your investment future today.
      </GreetingSubtitle>
    </GreetingContainer>
  );
};
