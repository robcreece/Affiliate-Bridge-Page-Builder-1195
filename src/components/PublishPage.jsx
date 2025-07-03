import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBridgePage } from '../context/BridgePageContext';
import URLGenerator from './URLGenerator';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiAlertCircle, FiEdit3, FiEye, FiLink, FiSettings } = FiIcons;

const PublishPage = () => {
  const { bridgePageData } = useBridgePage();
  const [publishStep, setPublishStep] = useState('review');
  const [generatedURL, setGeneratedURL] = useState(null);
  const [publishSettings, setPublishSettings] = useState({
    enableAnalytics: true,
    enableLeadCapture: false,
    customDomain: '',
    seoTitle: '',
    seoDescription: '',
    socialImage: ''
  });

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

  const handleURLGenerated = (urlData) => {
    setGeneratedURL(urlData);
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Publish?</h2>
              <p className="text-gray-600">Review your bridge page before going live</p>
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
                  <h4 className="font-medium text-red-900">Issues to Fix Before Publishing</h4>
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

            {/* Publish Settings */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-gray-900 mb-4">Publish Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={publishSettings.enableAnalytics}
                    onChange={(e) => setPublishSettings(prev => ({ ...prev, enableAnalytics: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="analytics" className="text-sm font-medium text-gray-700">
                    Enable Analytics Tracking
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="leadCapture"
                    checked={publishSettings.enableLeadCapture}
                    onChange={(e) => setPublishSettings(prev => ({ ...prev, enableLeadCapture: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="leadCapture" className="text-sm font-medium text-gray-700">
                    Enable Lead Capture (Email Collection)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={publishSettings.seoTitle}
                    onChange={(e) => setPublishSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Custom page title for search engines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Description (Optional)
                  </label>
                  <textarea
                    value={publishSettings.seoDescription}
                    onChange={(e) => setPublishSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description for search engines and social media"
                  />
                </div>
              </div>
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
                  <span>Preview Page</span>
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
                  <SafeIcon icon={FiLink} className="w-4 h-4" />
                  <span>Publish & Generate URL</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {publishStep === 'generate' && (
        <URLGenerator
          bridgePageData={bridgePageData}
          onURLGenerated={handleURLGenerated}
        />
      )}

      {publishStep === 'success' && generatedURL && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheckCircle} className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Your Bridge Page is Live!
          </h2>
          <p className="text-gray-600 mb-8">
            Congratulations! Your professional bridge page has been published and is ready to convert visitors into customers.
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">Your Live URL:</h3>
            <p className="text-lg font-mono text-blue-600 mb-4">{generatedURL.fullURL}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.open(generatedURL.fullURL, '_blank')}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                <span>View Live Page</span>
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(generatedURL.fullURL)}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <SafeIcon icon={FiLink} className="w-4 h-4" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Next Steps:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Share your URL on social media, email, and other marketing channels</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Monitor your page analytics to track performance</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Test different traffic sources to optimize conversions</span>
              </li>
              <li className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-500" />
                <span>Consider A/B testing different versions of your page</span>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PublishPage;