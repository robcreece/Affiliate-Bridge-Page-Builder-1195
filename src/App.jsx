import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import Header from './components/Header';
import URLAnalyzer from './components/URLAnalyzer';
import BridgePageBuilder from './components/BridgePageBuilder';
import PreviewPage from './components/PreviewPage';
import UpdatedPublishPage from './components/UpdatedPublishPage';
import FeedbackButton from './components/FeedbackButton';
import { BridgePageProvider } from './context/BridgePageContext';
import questConfig from './config/questConfig';
import './App.css';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <BridgePageProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<URLAnalyzer />} />
                <Route path="/builder" element={<BridgePageBuilder />} />
                <Route path="/preview" element={<PreviewPage />} />
                <Route path="/publish" element={<UpdatedPublishPage />} />
              </Routes>
            </main>
            
            {/* Global Feedback Button - Available on all pages */}
            <FeedbackButton />
          </div>
        </Router>
      </BridgePageProvider>
    </QuestProvider>
  );
}

export default App;