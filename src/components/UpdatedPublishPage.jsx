import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBridgePage } from '../context/BridgePageContext';
import FixedEnhancedURLGenerator from './FixedEnhancedURLGenerator';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiAlertCircle, FiEdit3, FiEye, FiZap, FiShare2, FiDownload } = FiIcons;

const UpdatedPublishPage = () => {
  const { bridgePageData } = useBridgePage();
  const [publishStep, setPublishStep] = useState('review');
  const [generatedPageData, setGeneratedPageData] = useState(null);

  const validatePage = () => {
    const issues = [];
    
    if (!bridgePageData.headline?.trim()) {
      issues.push('Headline is required');
    }
    if (!bridgePageData.subheadline?.trim()) {
      issues.push('Subheadline is required');
    }
    if (!bridgePageData.bodyParagraphs.some(p => p.trim())) {
      issues.push('At least one body paragraph is required');
    }
    if (!bridgePageData.ctaButtons.some(cta => cta.trim())) {
      issues.push('At least one CTA button is required');
    }
    if (!bridgePageData.affiliateLink?.trim()) {
      issues.push('Affiliate link is required');
    }
    
    return issues;
  };

  const validationIssues = validatePage();
  const isPageValid = validationIssues.length === 0;

  const handlePublish = () => {
    if (isPageValid) {
      setPublishStep('generate');
    }
  };

  const handlePageGenerated = (pageData) => {
    setGeneratedPageData(pageData);
    setPublishStep('success');
  };

  const pageCompleteness = () => {
    const fields = [
      { name: 'Headline', value: bridgePageData.headline },
      { name: 'Subheadline', value: bridgePageData.subheadline },
      { name: 'Body Content', value: bridgePageData.bodyParagraphs.some(p => p.trim()) },
      { name: 'CTA Buttons', value: bridgePageData.ctaButtons.some(cta => cta.trim()) },
      { name: 'Affiliate Link', value: bridgePageData.affiliateLink },
      { name: 'Design Colors', value: bridgePageData.primaryColor && bridgePageData.secondaryColor },
      { name: 'Typography', value: bridgePageData.headingFont && bridgePageData.bodyFont }
    ];
    
    const completed = fields.filter(field => field.value).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {publishStep === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Page Readiness Check */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheckCircle} className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Generate?</h2>
              <p className="text-gray-600">Review your bridge page before creating the final version</p>
            </div>

            {/* Completeness Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Page Completeness</span>
                <span className="text-sm font-medium text-gray-900">{pageCompleteness()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${pageCompleteness()}%` }}
                />
              </div>
            </div>

            {/* Validation Issues */}
            {validationIssues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500" />
                  <h4 className="font-medium text-red-900">Complete These Items First</h4>
                </div>
                <ul className="space-y-1">
                  {validationIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-800 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Page Summary */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Content Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium">
                      {bridgePageData.bodyParagraphs.join(' ').split(' ').length} words
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonuses:</span>
                    <span className="font-medium">
                      {bridgePageData.bonuses.filter(b => b.enabled).length} active
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CTA Buttons:</span>
                    <span className="font-medium">
                      {bridgePageData.ctaButtons.filter(cta => cta.trim()).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hero Video:</span>
                    <span className="font-medium">
                      {bridgePageData.heroVideo?.enabled ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Design Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Primary Color:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: bridgePageData.primaryColor }}
                      />
                      <span className="font-medium">{bridgePageData.primaryColor}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heading Font:</span>
                    <span className="font-medium">{bridgePageData.headingFont}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Body Font:</span>
                    <span className="font-medium">{bridgePageData.bodyFont}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">Demo Mode</h4>
              <p className="text-sm text-blue-800">
                This demo generates a complete, downloadable HTML page. In production, 
                this would deploy to live hosting with analytics and a real domain.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                <span>Back to Edit</span>
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.open('/preview', '_blank')}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <motion.button
                  onClick={handlePublish}
                  disabled={!isPageValid}
                  whileHover={{ scale: isPageValid ? 1.02 : 1 }}
                  whileTap={{ scale: isPageValid ? 0.98 : 1 }}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                    isPageValid
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <SafeIcon icon={FiZap} className="w-4 h-4" />
                  <span>Generate Page</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {publishStep === 'generate' && (
        <FixedEnhancedURLGenerator onURLGenerated={handlePageGenerated} />
      )}

      {publishStep === 'success' && generatedPageData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheckCircle} className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Your Bridge Page is Ready!
          </h2>
          <p className="text-gray-600 mb-8">
            Your professional bridge page has been generated and is ready to convert visitors into customers.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Page Generated Successfully</h3>
            <p className="text-gray-600 mb-4">
              Download your complete HTML file or copy the code to host anywhere
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  const pageData = JSON.parse(localStorage.getItem(`bridgePage_${generatedPageData.pageId}`));
                  if (pageData?.htmlContent) {
                    const blob = new Blob([pageData.htmlContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `bridge-page-${generatedPageData.pageId}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Download HTML</span>
              </button>
              <button
                onClick={() => {
                  if (generatedPageData.pageUrl) {
                    window.open(generatedPageData.pageUrl, '_blank', 'width=1200,height=800');
                  }
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                <span>Preview Page</span>
              </button>
            </div>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Next Steps:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Upload the HTML file to your web hosting provider</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Set up a custom domain for professional branding</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Test all links and functionality before promoting</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Drive traffic from social media, email, and other channels</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Monitor performance and optimize for better conversions</span>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UpdatedPublishPage;