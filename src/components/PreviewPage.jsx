import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBridgePage } from '../context/BridgePageContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEye, FiDownload, FiCode, FiSmartphone, FiMonitor, FiTablet, FiGift, FiArrowRight } = FiIcons;

const PreviewPage = () => {
  const { bridgePageData } = useBridgePage();
  const [viewMode, setViewMode] = useState('desktop');
  const [showCode, setShowCode] = useState(false);

  const generateHTML = () => {
    const enabledBonuses = bridgePageData.bonuses.filter(bonus => bonus.enabled);
    const heroVideoHTML = bridgePageData.heroVideo?.enabled && bridgePageData.heroVideo?.embed
      ? `<div class="hero-video-container">
          <div class="video-wrapper">
            ${bridgePageData.heroVideo.embed}
          </div>
        </div>`
      : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bridge Page</title>
  <link href="https://fonts.googleapis.com/css2?family=${bridgePageData.headingFont.replace(' ', '+')}:wght@400;600;700&family=${bridgePageData.bodyFont.replace(' ', '+')}:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: '${bridgePageData.bodyFont}', sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background: linear-gradient(135deg, ${bridgePageData.primaryColor}15 0%, ${bridgePageData.secondaryColor}15 100%); 
      min-height: 100vh; 
    }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .headline { 
      font-family: '${bridgePageData.headingFont}', sans-serif; 
      font-size: 2.5rem; 
      font-weight: 700; 
      color: ${bridgePageData.primaryColor}; 
      margin-bottom: 20px; 
      line-height: 1.2; 
    }
    .subheadline { 
      font-size: 1.25rem; 
      color: ${bridgePageData.secondaryColor}; 
      margin-bottom: 30px; 
      font-weight: 500; 
    }
    .hero-video-container { 
      margin: 30px 0; 
      background: white; 
      padding: 20px; 
      border-radius: 15px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .video-wrapper {
      width: 100%;
      max-width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .hero-video-container iframe,
    .hero-video-container video { 
      max-width: 100%; 
      height: auto; 
      border-radius: 10px;
      display: block;
      margin: 0 auto;
    }
    .hero-video-container div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .content { 
      background: white; 
      padding: 40px; 
      border-radius: 15px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
      margin-bottom: 40px; 
    }
    .paragraph { 
      font-size: 1.1rem; 
      margin-bottom: 25px; 
      line-height: 1.8; 
    }
    .video-container { 
      margin: 40px 0; 
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .video-container iframe,
    .video-container video {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    .bonuses { 
      background: white; 
      padding: 40px; 
      border-radius: 15px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
      margin-bottom: 40px; 
    }
    .bonuses-title { 
      font-family: '${bridgePageData.headingFont}', sans-serif; 
      font-size: 2rem; 
      color: ${bridgePageData.primaryColor}; 
      text-align: center; 
      margin-bottom: 30px; 
    }
    .bonus-item { 
      display: flex; 
      align-items: flex-start; 
      margin-bottom: 25px; 
      padding: 20px; 
      background: ${bridgePageData.primaryColor}10; 
      border-radius: 10px; 
      border-left: 4px solid ${bridgePageData.primaryColor}; 
    }
    .bonus-icon { 
      width: 40px; 
      height: 40px; 
      background: ${bridgePageData.primaryColor}; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      margin-right: 15px; 
      flex-shrink: 0; 
    }
    .bonus-content h4 { 
      font-family: '${bridgePageData.headingFont}', sans-serif; 
      font-size: 1.2rem; 
      color: ${bridgePageData.primaryColor}; 
      margin-bottom: 5px; 
    }
    .bonus-type { 
      font-size: 0.9rem; 
      color: ${bridgePageData.secondaryColor}; 
      font-weight: 500; 
      margin-bottom: 8px; 
    }
    .cta-section { 
      text-align: center; 
      margin-top: 40px; 
    }
    .cta-button { 
      display: inline-block; 
      background: linear-gradient(135deg, ${bridgePageData.primaryColor} 0%, ${bridgePageData.secondaryColor} 100%); 
      color: white; 
      padding: 18px 40px; 
      font-size: 1.2rem; 
      font-weight: 600; 
      text-decoration: none; 
      border-radius: 50px; 
      margin: 10px; 
      transition: transform 0.3s ease, box-shadow 0.3s ease; 
      box-shadow: 0 5px 15px rgba(0,0,0,0.2); 
    }
    .cta-button:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 8px 25px rgba(0,0,0,0.3); 
    }
    @media (max-width: 768px) { 
      .headline { font-size: 2rem; } 
      .content, .bonuses { padding: 25px; } 
      .container { padding: 20px 15px; } 
      .hero-video-container { padding: 15px; }
      .hero-video-container iframe,
      .video-container iframe {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="headline">${bridgePageData.headline}</h1>
      <p class="subheadline">${bridgePageData.subheadline}</p>
    </div>
    
    ${heroVideoHTML}
    
    <div class="content">
      ${bridgePageData.bodyParagraphs.map(p => `<p class="paragraph">${p}</p>`).join('')}
      
      ${bridgePageData.videoEmbed ? `
        <div class="video-container">
          <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
            ${bridgePageData.videoEmbed}
          </div>
        </div>
      ` : ''}
    </div>
    
    ${enabledBonuses.length > 0 ? `
      <div class="bonuses">
        <h2 class="bonuses-title">🎁 Exclusive Bonuses</h2>
        ${enabledBonuses.map(bonus => `
          <div class="bonus-item">
            <div class="bonus-icon">🎁</div>
            <div class="bonus-content">
              <h4>${bonus.title}</h4>
              <div class="bonus-type">${bonus.type}</div>
              <p>${bonus.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <div class="cta-section">
      ${bridgePageData.ctaButtons.map(cta => cta ? `
        <a href="${bridgePageData.affiliateLink}" class="cta-button">
          ${cta} →
        </a>
      ` : '').join('')}
    </div>
  </div>
</body>
</html>`;
  };

  const downloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bridge-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateHTML());
    alert('HTML code copied to clipboard!');
  };

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': 
      default: return '100%';
    }
  };

  const enabledBonuses = bridgePageData.bonuses.filter(bonus => bonus.enabled);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Preview Controls */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 sticky top-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Controls</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View Mode
                </label>
                <div className="flex space-x-2">
                  {[
                    { id: 'desktop', icon: FiMonitor, label: 'Desktop' },
                    { id: 'tablet', icon: FiTablet, label: 'Tablet' },
                    { id: 'mobile', icon: FiSmartphone, label: 'Mobile' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`flex flex-col items-center space-y-1 p-3 rounded-lg border-2 transition-all ${
                        viewMode === mode.id
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <SafeIcon icon={mode.icon} className="w-5 h-5" />
                      <span className="text-xs font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiCode} className="w-4 h-4" />
                    <span>{showCode ? 'Hide' : 'Show'} HTML Code</span>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiCode} className="w-4 h-4" />
                    <span>Copy HTML</span>
                  </button>
                  <button
                    onClick={downloadHTML}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                    <span>Download HTML</span>
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Page Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium">
                      {bridgePageData.bodyParagraphs.join(' ').split(' ').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hero Video:</span>
                    <span className="font-medium">
                      {bridgePageData.heroVideo?.enabled ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonuses:</span>
                    <span className="font-medium">{enabledBonuses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CTA Buttons:</span>
                    <span className="font-medium">
                      {bridgePageData.ctaButtons.filter(cta => cta.trim()).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiEye} className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mx-auto transition-all duration-300" style={{ width: getPreviewWidth() }}>
                <div
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${bridgePageData.primaryColor}15 0%, ${bridgePageData.secondaryColor}15 100%)`,
                    minHeight: '600px'
                  }}
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h1
                        className="text-4xl font-bold mb-4 leading-tight"
                        style={{
                          fontFamily: bridgePageData.headingFont,
                          color: bridgePageData.primaryColor
                        }}
                      >
                        {bridgePageData.headline || 'Your Compelling Headline Here'}
                      </h1>
                      <p
                        className="text-xl font-medium"
                        style={{
                          fontFamily: bridgePageData.bodyFont,
                          color: bridgePageData.secondaryColor
                        }}
                      >
                        {bridgePageData.subheadline || 'Your supporting subheadline'}
                      </p>
                    </div>

                    {/* Hero Video */}
                    {bridgePageData.heroVideo?.enabled && bridgePageData.heroVideo?.embed && (
                      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
                        <div 
                          className="w-full flex justify-center items-center"
                          style={{ textAlign: 'center' }}
                        >
                          <div 
                            className="max-w-full overflow-hidden rounded-lg"
                            dangerouslySetInnerHTML={{ __html: bridgePageData.heroVideo.embed }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
                      {bridgePageData.bodyParagraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-lg leading-relaxed mb-6 last:mb-0"
                          style={{ fontFamily: bridgePageData.bodyFont }}
                        >
                          {paragraph || `This is paragraph ${index + 1}. Add your compelling content here.`}
                        </p>
                      ))}

                      {bridgePageData.videoEmbed && (
                        <div className="my-8 flex justify-center items-center">
                          <div
                            className="inline-block p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
                            style={{ textAlign: 'center' }}
                            dangerouslySetInnerHTML={{ 
                              __html: `<div style="display: flex; justify-content: center; align-items: center; width: 100%;">${bridgePageData.videoEmbed}</div>` 
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Bonuses */}
                    {enabledBonuses.length > 0 && (
                      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
                        <h2
                          className="text-2xl font-bold text-center mb-6"
                          style={{
                            fontFamily: bridgePageData.headingFont,
                            color: bridgePageData.primaryColor
                          }}
                        >
                          🎁 Exclusive Bonuses
                        </h2>
                        <div className="space-y-4">
                          {enabledBonuses.map((bonus, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-4 p-4 rounded-lg border-l-4"
                              style={{
                                backgroundColor: `${bridgePageData.primaryColor}10`,
                                borderLeftColor: bridgePageData.primaryColor
                              }}
                            >
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                style={{ backgroundColor: bridgePageData.primaryColor }}
                              >
                                <SafeIcon icon={FiGift} className="w-5 h-5" />
                              </div>
                              <div>
                                <h4
                                  className="font-semibold text-lg mb-1"
                                  style={{
                                    fontFamily: bridgePageData.headingFont,
                                    color: bridgePageData.primaryColor
                                  }}
                                >
                                  {bonus.title}
                                </h4>
                                <div
                                  className="text-sm font-medium mb-2"
                                  style={{ color: bridgePageData.secondaryColor }}
                                >
                                  {bonus.type}
                                </div>
                                <p
                                  className="text-gray-700"
                                  style={{ fontFamily: bridgePageData.bodyFont }}
                                >
                                  {bonus.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="text-center space-y-4">
                      {bridgePageData.ctaButtons.map((cta, index) => cta.trim() && (
                        <div key={index}>
                          <button
                            className="inline-flex items-center space-x-2 px-8 py-4 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg"
                            style={{
                              background: `linear-gradient(135deg, ${bridgePageData.primaryColor} 0%, ${bridgePageData.secondaryColor} 100%)`,
                              fontFamily: bridgePageData.bodyFont
                            }}
                          >
                            <span>{cta}</span>
                            <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* HTML Code Display */}
          {showCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gray-900 rounded-2xl overflow-hidden"
            >
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">HTML Code</h3>
                  <button
                    onClick={copyToClipboard}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  <code>{generateHTML()}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;