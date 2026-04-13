import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, ArrowRight, Command } from 'lucide-react';
import { getAllFunds } from '../../../api/fundApi';

/* ─── Animations ─────────────────────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-16px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/* ─── Styled Components ──────────────────────────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding-top: 14vh;
  animation: ${fadeIn} 0.15s ease-out;
`;

const PaletteContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: 480px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideDown} 0.2s ease-out;
  align-self: flex-start;
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchIcon = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }
`;

const CloseBtn = styled.button`
  background: ${({ theme }) => theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.border};
  }
`;

const ResultsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const ResultItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.muted : 'transparent'};
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.12s;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`;

const ResultIcon = styled.div`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
`;

const ResultInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 1px;
`;

const ArrowIcon = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0;
  transition: opacity 0.15s;

  ${ResultItem}:hover & { opacity: 1; }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const Footer = styled.div`
  padding: 10px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FooterKbd = styled.span`
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.muted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 1px 5px;
  margin-right: 4px;
`;

/* ═══════════════════════════════════════════════════════════════════════════ */

export const CommandPalette = ({ onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allFunds, setAllFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch funds once
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAllFunds()
      .then((res) => {
        if (!cancelled) setAllFunds(res.data || []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Filter on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults(allFunds.slice(0, 8));
      setActiveIndex(0);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allFunds.filter((f) =>
      (f.name || '').toLowerCase().includes(q) ||
      (f.type || '').toLowerCase().includes(q) ||
      (f.assetType || '').toLowerCase().includes(q)
    ).slice(0, 10);
    setResults(filtered);
    setActiveIndex(0);
  }, [query, allFunds]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIndex]) {
      onClose();
      navigate('/dashboard/explore');
    }
  }, [results, activeIndex, onClose, navigate]);

  const handleSelect = () => {
    onClose();
    navigate('/dashboard/explore');
  };

  return (
    <Overlay onClick={onClose}>
      <PaletteContainer onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <SearchHeader>
          <SearchIcon><Search size={20} /></SearchIcon>
          <SearchInput
            ref={inputRef}
            placeholder="Search stocks, mutual funds, or symbols..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <CloseBtn onClick={onClose}>ESC</CloseBtn>
        </SearchHeader>

        <ResultsList>
          {loading ? (
            <EmptyState>Loading funds...</EmptyState>
          ) : results.length === 0 ? (
            <EmptyState>
              {query ? `No results for "${query}"` : 'No funds available'}
            </EmptyState>
          ) : (
            results.map((fund, idx) => (
              <ResultItem
                key={fund.id || idx}
                $active={idx === activeIndex}
                onClick={handleSelect}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <ResultIcon>
                  <TrendingUp size={18} />
                </ResultIcon>
                <ResultInfo>
                  <ResultName>{fund.name}</ResultName>
                  <ResultMeta>
                    {fund.type && <span>{fund.type}</span>}
                    {fund.risk && <span>• {fund.risk} Risk</span>}
                    {fund.nav && <span>• NAV ₹{fund.nav}</span>}
                  </ResultMeta>
                </ResultInfo>
                <ArrowIcon><ArrowRight size={16} /></ArrowIcon>
              </ResultItem>
            ))
          )}
        </ResultsList>

        <Footer>
          <span><FooterKbd>↑↓</FooterKbd> Navigate</span>
          <span><FooterKbd>↵</FooterKbd> Select</span>
          <span><FooterKbd>Esc</FooterKbd> Close</span>
        </Footer>
      </PaletteContainer>
    </Overlay>
  );
};
