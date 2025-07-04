import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import URLAnalyzer from './components/URLAnalyzer';
import BridgePageBuilder from './components/BridgePageBuilder';
import PreviewPage from './components/PreviewPage';
import UpdatedPublishPage from './components/UpdatedPublishPage';
import EnhancedFeedbackButton from './components/EnhancedFeedbackButton';
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
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/analyzer" element={
                <div className="bg-gray-50">
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <URLAnalyzer />
                  </main>
                </div>
              } />
              <Route path="/builder" element={
                <div className="bg-gray-50">
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <BridgePageBuilder />
                  </main>
                </div>
              } />
              <Route path="/preview" element={
                <div className="bg-gray-50">
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <PreviewPage />
                  </main>
                </div>
              } />
              <Route path="/publish" element={
                <div className="bg-gray-50">
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <UpdatedPublishPage />
                  </main>
                </div>
              } />
            </Routes>

            <EnhancedFeedbackButton />
          </div>
        </Router>
      </BridgePageProvider>
    </QuestProvider>
  );
}

export default App;