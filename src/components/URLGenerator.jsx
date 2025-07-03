import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLink, FiCopy, FiCheck, FiShare2, FiEye, FiRefreshCw, FiLock, FiCalendar, FiBarChart3, FiMail, FiQrCode } = FiIcons;

const URLGenerator = ({ bridgePageData, onURLGenerated }) => {
  const [generatedURL, setGeneratedURL] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [urlFormat, setUrlFormat] = useState('word-combo');
  const [customPrefix, setCustomPrefix] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [urlExpiry, setUrlExpiry] = useState('never');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [pagePassword, setPagePassword] = useState('');

  const urlFormats = [
    { id: 'word-combo', name: 'Word Combination', example: 'vsl-blue-mountain-7843', description: 'Memorable and brandable' },
    { id: 'alphanumeric', name: 'Alphanumeric Code', example: 'vsl-a7k9m2x5', description: 'Short and professional' },
    { id: 'descriptive', name: 'Descriptive + Random', example: 'sales-page-creative-boost-4821', description: 'SEO-friendly' },
    { id: 'date-based', name: 'Date-based', example: 'vsl-2025-01-15-x7k9m', description: 'Time-stamped' },
    { id: 'custom', name: 'Custom Prefix', example: 'your-prefix-unique-id', description: 'Personalized branding' }
  ];

  const expiryOptions = [
    { id: 'never', name: 'Never', description: 'Permanent URL' },
    { id: '7days', name: '7 Days', description: 'Short-term campaign' },
    { id: '30days', name: '30 Days', description: 'Monthly promotion' },
    { id: '90days', name: '90 Days', description: 'Quarterly campaign' },
    { id: '1year', name: '1 Year', description: 'Annual campaign' }
  ];

  const wordPairs = [
    ['blue', 'mountain'], ['swift', 'river'], ['golden', 'eagle'], ['bright', 'star'],
    ['crystal', 'peak'], ['silver', 'moon'], ['crimson', 'dawn'], ['emerald', 'forest'],
    ['diamond', 'sky'], ['ruby', 'sunset'], ['sapphire', 'ocean'], ['amber', 'valley'],
    ['violet', 'meadow'], ['coral', 'reef'], ['jade', 'garden'], ['pearl', 'harbor'],
    ['bronze', 'shield'], ['platinum', 'crown'], ['titanium', 'bolt'], ['carbon', 'fiber']
  ];

  const generateRandomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const generateUniqueURL = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 9999);
    
    switch (urlFormat) {
      case 'word-combo':
        const [word1, word2] = wordPairs[Math.floor(Math.random() * wordPairs.length)];
        return `vsl-${word1}-${word2}-${randomNum}`;
      
      case 'alphanumeric':
        return `vsl-${generateRandomString(8)}`;
      
      case 'descriptive':
        const productType = bridgePageData.productType || 'sales-page';
        const descriptor = ['creative', 'boost', 'transform', 'ultimate', 'premium', 'elite'][Math.floor(Math.random() * 6)];
        return `${productType}-${descriptor}-${randomNum}`;
      
      case 'date-based':
        const date = new Date().toISOString().split('T')[0];
        return `vsl-${date}-${generateRandomString(5)}`;
      
      case 'custom':
        const prefix = customPrefix.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'page';
        return `${prefix}-${generateRandomString(6)}`;
      
      default:
        return `vsl-${generateRandomString(8)}`;
    }
  };

  const handleGenerateURL = async () => {
    if (!bridgePageData.headline || !bridgePageData.ctaButtons.some(cta => cta.trim())) {
      alert('Please complete your bridge page content before generating a URL');
      return;
    }

    setIsGenerating(true);
    
    // Simulate URL generation process
    setTimeout(async () => {
      const uniqueId = generateUniqueURL();
      const baseURL = 'https://bridgepages.pro';
      const fullURL = `${baseURL}/${uniqueId}`;
      
      // Check URL uniqueness (simulate API call)
      const isUnique = await checkURLUniqueness(uniqueId);
      
      if (isUnique) {
        const urlData = {
          id: uniqueId,
          fullURL,
          shortURL: `https://bp.pro/${uniqueId.split('-').pop()}`,
          createdAt: new Date().toISOString(),
          expiresAt: urlExpiry === 'never' ? null : calculateExpiryDate(urlExpiry),
          passwordProtected,
          password: passwordProtected ? pagePassword : null,
          pageData: bridgePageData,
          analytics: {
            views: 0,
            clicks: 0,
            conversions: 0
          }
        };

        setGeneratedURL(urlData);
        onURLGenerated(urlData);
        setIsGenerating(false);
        
        // Send confirmation email (simulate)
        sendConfirmationEmail(urlData);
      } else {
        // Retry with new URL
        handleGenerateURL();
      }
    }, 3000);
  };

  const checkURLUniqueness = async (id) => {
    // Simulate API call to check URL uniqueness
    return new Promise(resolve => {
      setTimeout(() => resolve(Math.random() > 0.1), 500);
    });
  };

  const calculateExpiryDate = (expiry) => {
    const now = new Date();
    switch (expiry) {
      case '7days': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case '30days': return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case '90days': return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      case '1year': return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      default: return null;
    }
  };

  const sendConfirmationEmail = (urlData) => {
    // Simulate email sending
    console.log('Confirmation email sent for URL:', urlData.fullURL);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = (url) => {
    // Using a QR code generation service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const regenerateURL = () => {
    setGeneratedURL(null);
    handleGenerateURL();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!generatedURL ? (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiLink} className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Your Unique URL</h2>
              <p className="text-gray-600">Create a professional, shareable link for your bridge page</p>
            </div>

            <div className="space-y-6">
              {/* URL Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  URL Format Style
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {urlFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setUrlFormat(format.id)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        urlFormat === format.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{format.name}</h4>
                        {urlFormat === format.id && (
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{format.description}</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        bridgepages.pro/{format.example}
                      </code>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prefix Input */}
              {urlFormat === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Prefix
                  </label>
                  <input
                    type="text"
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="my-business"
                  />
                  <p className="text-sm text-gray-500">
                    Preview: bridgepages.pro/{customPrefix.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'page'}-xxxxxx
                  </p>
                </motion.div>
              )}

              {/* URL Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Expiration
                  </label>
                  <select
                    value={urlExpiry}
                    onChange={(e) => setUrlExpiry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {expiryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={passwordProtected}
                      onChange={(e) => setPasswordProtected(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Password Protection</span>
                  </label>
                  {passwordProtected && (
                    <input
                      type="password"
                      value={pagePassword}
                      onChange={(e) => setPagePassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter page password"
                    />
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerateURL}
                disabled={isGenerating}
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Your Unique URL...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <SafeIcon icon={FiLink} className="w-5 h-5" />
                    <span>Generate Professional URL</span>
                  </div>
                )}
              </motion.button>

              {/* Generation Progress */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Validating page content...</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Generating unique identifier...</span>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                      <span className="text-sm">Setting up hosting configuration...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">URL Generated Successfully!</h2>
              <p className="text-gray-600">Your bridge page is now live and ready to share</p>
            </div>

            {/* Generated URL Display */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Professional URL
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 font-mono text-lg">
                  {generatedURL.fullURL}
                </div>
                <button
                  onClick={() => copyToClipboard(generatedURL.fullURL)}
                  className="flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Short URL */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL (for social media)
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 font-mono">
                  {generatedURL.shortURL}
                </div>
                <button
                  onClick={() => copyToClipboard(generatedURL.shortURL)}
                  className="flex items-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* URL Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-900">Created</span>
                </div>
                <p className="text-sm text-blue-800">
                  {new Date(generatedURL.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiEye} className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-900">Status</span>
                </div>
                <p className="text-sm text-green-800">Live & Active</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiBarChart3} className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-900">Analytics</span>
                </div>
                <p className="text-sm text-purple-800">Tracking Enabled</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => window.open(generatedURL.fullURL, '_blank')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                <span>View Live Page</span>
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <SafeIcon icon={FiQrCode} className="w-4 h-4" />
                <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
              </button>
            </div>

            {/* QR Code */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-center bg-gray-50 rounded-lg p-6 mb-6"
              >
                <h4 className="font-medium text-gray-900 mb-4">QR Code for Easy Sharing</h4>
                <img
                  src={generateQRCode(generatedURL.fullURL)}
                  alt="QR Code"
                  className="mx-auto rounded-lg shadow-sm"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Scan to visit your bridge page
                </p>
              </motion.div>
            )}

            {/* Sharing Options */}
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Share Your Page</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => copyToClipboard(generatedURL.fullURL)}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4" />
                  <span className="text-sm">Copy Link</span>
                </button>

                <button
                  onClick={() => window.open(`mailto:?subject=Check out my page&body=${generatedURL.fullURL}`, '_blank')}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </button>

                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(generatedURL.fullURL)}`, '_blank')}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiShare2} className="w-4 h-4" />
                  <span className="text-sm">Twitter</span>
                </button>

                <button
                  onClick={regenerateURL}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                  <span className="text-sm">Regenerate</span>
                </button>
              </div>
            </div>

            {/* Security & Expiry Info */}
            {(passwordProtected || urlExpiry !== 'never') && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Security & Access Settings</h4>
                <div className="space-y-1 text-sm text-yellow-800">
                  {passwordProtected && (
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiLock} className="w-4 h-4" />
                      <span>Password protection enabled</span>
                    </div>
                  )}
                  {urlExpiry !== 'never' && (
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>
                        Expires: {generatedURL.expiresAt ? new Date(generatedURL.expiresAt).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default URLGenerator;