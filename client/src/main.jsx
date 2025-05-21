import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import SpecificAnalysis from './pages/SpecificAnalysis.jsx';
import OverallAnalysis from './pages/OverallAnalysis.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* ✅ Default route when path is exactly '/' */}
        <Route index element={<OverallAnalysis />} />
        
        {/* Other routes */}
        <Route path="specific-analysis" element={<SpecificAnalysis />} />
        <Route path="overall-analysis" element={<OverallAnalysis />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
