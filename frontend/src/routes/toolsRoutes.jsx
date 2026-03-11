import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SipPage from '../pages/tools/SipPage';
import LumpsumPage from '../pages/tools/LumpsumPage';
import CagrPage from '../pages/tools/CagrPage';
import MutualFundPage from '../pages/tools/MutualFundPage';

export default function ToolsRoutes() {
  return (
    <Routes>
      <Route path="sip-calculator" element={<SipPage />} />
      <Route path="lumpsum-calculator" element={<LumpsumPage />} />
      <Route path="cagr-calculator" element={<CagrPage />} />
      <Route path="mutual-fund-calculator" element={<MutualFundPage />} />
    </Routes>
  );
}
