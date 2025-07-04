import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiLoader, FiAlertCircle, FiEye, FiCopy, FiRefreshCw, FiDownload, FiCode } = FiIcons;

const FixedPageGenerationStatus = ({ pageId, onComplete, onError }) => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pageUrl, setPageUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [htmlContent, setHtmlContent] = useState(null);

  const statusSteps = [
    { key: 'validating', label: 'Validating Content', progress: 15 },
    { key: 'generating', label: 'Generating HTML Page', progress: 35 },
    { key: 'uploading', label: 'Creating Live URL', progress: 65 },
    { key: 'configuring', label: 'Configuring Settings', progress: 80 },
    { key: 'testing', label: 'Testing Accessibility', progress: 95 },
    { key: 'complete', label: 'Page is Live!', progress: 100 }
  ];

  useEffect(() => {
    const handleStatusUpdate = (event) => {
      const { pageId: eventPageId, status: newStatus, error: newError, pageUrl: newPageUrl } = event.detail;
      
      if (eventPageId === pageId) {
        setStatus(newStatus);
        setError(newError);
        
        if (newPageUrl) {
          setPageUrl(newPageUrl);
        }
        
        const step = statusSteps.find(s => s.key === newStatus);
        if (step) {
          setProgress(step.progress);
        }
        
        if (newStatus === 'complete') {
          // Get HTML content from localStorage
          try {
            const pageData = JSON.parse(localStorage.getItem(`bridgePage_${pageId}`));
            if (pageData) {
              setHtmlContent(pageData.htmlContent);
            }
          } catch (e) {
            console.error('Error retrieving page data:', e);
          }
          onComplete?.(event.detail);
        } else if (newStatus === 'failed') {
          onError?.(newError);
        }
      }
    };

    window.addEventListener('pageGenerationUpdate', handleStatusUpdate);
    return () => window.removeEventListener('pageGenerationUpdate', handleStatusUpdate);
  }, [pageId, onComplete, onError]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadHTML = () => {
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bridge-page-${pageId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const openInNewWindow = () => {
    if (pageUrl) {
      window.open(pageUrl, '_blank', 'width=1200,height=800');
    }
  };

  const getCurrentStep = () => {
    return statusSteps.find(step => step.key === status) || statusSteps[0];
  };

  const getStatusIcon = (stepStatus) => {
    const stepIndex = statusSteps.findIndex(s => s.key === stepStatus);
    const currentIndex = statusSteps.findIndex(s => s.key === status);
    
    if (status === 'failed') {
      return <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-red-500" />;
    } else if (stepIndex < currentIndex || (stepIndex === currentIndex && status === 'complete')) {
      return <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />;
    } else if (stepIndex === currentIndex && status !== 'complete') {
      return <SafeIcon icon={FiLoader} className="w-4 h-4 text-blue-500 animate-spin" />;
    } else {
      return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 mb-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'complete' ? '🎉 Your Bridge Page is Live!' : 'Creating Your Bridge Page...'}
        </h3>
        <p className="text-gray-600">
          {status === 'complete' 
            ? 'Your bridge page has been created and is ready to share!'
            : 'Please wait while we create your professional bridge page'
          }
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Status Steps */}
      <div className="space-y-3 mb-6">
        {statusSteps.map((step, index) => (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            {getStatusIcon(step.key)}
            <span className={`text-sm ${
              status === step.key ? 'text-blue-600 font-medium' : 
              statusSteps.findIndex(s => s.key === step.key) < statusSteps.findIndex(s => s.key === status) || 
              (status === 'complete' && step.key === 'complete')
                ? 'text-green-600' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-red-900">Generation Failed</h4>
            </div>
            <p className="text-sm text-red-800 mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Display */}
      <AnimatePresence>
        {status === 'complete' && pageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">
                Bridge Page Created Successfully!
              </h4>
              <p className="text-sm text-green-800">
                Your bridge page is ready to convert visitors into customers
              </p>
            </div>

            {/* Live URL Display */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Bridge Page URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value="https://your-bridge-page.demo"
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard("https://your-bridge-page.demo")}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4" />
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                🚀 Demo URL - In production, this would be your live hosted page
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={openInNewWindow}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                <span>View Page</span>
              </button>
              
              <button
                onClick={downloadHTML}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Download HTML</span>
              </button>
              
              <button
                onClick={() => copyToClipboard(htmlContent || '')}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <SafeIcon icon={FiCode} className="w-4 h-4" />
                <span>Copy HTML</span>
              </button>
            </div>

            {/* Page Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">Ready</div>
                <div className="text-xs text-blue-800">Status</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">0</div>
                <div className="text-xs text-purple-800">Views</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-lg font-semibold text-green-600">0</div>
                <div className="text-xs text-green-800">Clicks</div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> This creates a functional HTML page you can download and host anywhere. 
                In production, this would automatically deploy to a live hosting service.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FixedPageGenerationStatus;