import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import URLAnalyzer from './components/URLAnalyzer';
import BridgePageBuilder from './components/BridgePageBuilder';
import PreviewPage from './components/PreviewPage';
import PublishPage from './components/PublishPage';
import { BridgePageProvider } from './context/BridgePageContext';
import './App.css';

function App() {
  return (
    <BridgePageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<URLAnalyzer />} />
              <Route path="/builder" element={<BridgePageBuilder />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/publish" element={<PublishPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BridgePageProvider>
  );
}

export default App;