import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MutualFundPage from '../pages/tools/MutualFundPage';

export default function ToolsRoutes() {
  return (
    <Routes>
      <Route path="mutual-fund-calculator" element={<MutualFundPage />} />
    </Routes>
  );
}
