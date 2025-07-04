import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBridgePage } from '../context/BridgePageContext';
import MockPageGenerationService from '../services/MockPageGenerationService';
import FixedPageGenerationStatus from './FixedPageGenerationStatus';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLink, FiCheck, FiAlertCircle, FiPlay, FiSettings, FiZap } = FiIcons;

const FixedEnhancedURLGenerator = ({ onURLGenerated }) => {
  const { bridgePageData } = useBridgePage();
  const [generationState, setGenerationState] = useState('idle');
  const [pageId, setPageId] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [generatedPageData, setGeneratedPageData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Validate page data on component mount and data changes
  useEffect(() => {
    const validation = MockPageGenerationService.validatePageData(bridgePageData);
    setValidationErrors(validation.errors);
  }, [bridgePageData]);

  const handleGeneratePage = async () => {
    try {
      setIsGenerating(true);
      setGenerationState('generating');
      
      // Generate unique page ID
      const newPageId = MockPageGenerationService.generatePageId(bridgePageData);
      setPageId(newPageId);
      
      // Start the page generation process
      const result = await MockPageGenerationService.createAndHostPage(
        bridgePageData,
        newPageId,
        'demo-user' // Demo user ID
      );
      
      setGeneratedPageData(result);
      setGenerationState('complete');
      onURLGenerated?.(result);
      
    } catch (error) {
      console.error('Page generation failed:', error);
      setGenerationState('failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCompletionPercentage = () => {
    const totalFields = 8; // Total required fields
    const completedFields = [
      bridgePageData.headline?.trim(),
      bridgePageData.subheadline?.trim(),
      bridgePageData.bodyParagraphs?.some(p => p.trim()),
      bridgePageData.ctaButtons?.some(cta => cta.trim()),
      bridgePageData.affiliateLink?.trim(),
      bridgePageData.primaryColor,
      bridgePageData.secondaryColor,
      bridgePageData.headingFont && bridgePageData.bodyFont
    ].filter(Boolean).length;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const isReadyToGenerate = validationErrors.length === 0;
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {generationState === 'idle' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiZap} className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Generate Your Bridge Page
              </h2>
              <p className="text-gray-600">
                Create a professional, downloadable bridge page that converts visitors into customers
              </p>
            </div>

            {/* Completion Status */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Page Completion
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    completionPercentage === 100 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Validation Status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Content Checklist
              </h3>
              <div className="space-y-3">
                {[
                  { field: 'headline', label: 'Compelling Headline', value: bridgePageData.headline?.trim() },
                  { field: 'subheadline', label: 'Supporting Subheadline', value: bridgePageData.subheadline?.trim() },
                  { field: 'body', label: 'Body Content', value: bridgePageData.bodyParagraphs?.some(p => p.trim()) },
                  { field: 'cta', label: 'Call-to-Action Buttons', value: bridgePageData.ctaButtons?.some(cta => cta.trim()) },
                  { field: 'affiliate', label: 'Affiliate Link', value: bridgePageData.affiliateLink?.trim() },
                  { field: 'design', label: 'Design & Colors', value: bridgePageData.primaryColor && bridgePageData.secondaryColor },
                  { field: 'fonts', label: 'Typography Settings', value: bridgePageData.headingFont && bridgePageData.bodyFont }
                ].map((item, index) => (
                  <motion.div
                    key={item.field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.value ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {item.value && (
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      item.value ? 'text-green-700 font-medium' : 'text-gray-500'
                    }`}>
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500" />
                  <h4 className="font-medium text-red-900">
                    Complete These Items Before Generating
                  </h4>
                </div>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-800 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Generation Features */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">What You'll Get</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span>Complete HTML page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span>Mobile responsive design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span>Built-in analytics tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span>SEO optimized meta tags</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span>All videos & bonuses included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span>Ready to host anywhere</span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGeneratePage}
              disabled={!isReadyToGenerate || isGenerating}
              whileHover={{ scale: isReadyToGenerate ? 1.02 : 1 }}
              whileTap={{ scale: isReadyToGenerate ? 0.98 : 1 }}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                isReadyToGenerate && !isGenerating
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={isGenerating ? FiSettings : FiPlay} className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating ? 'Generating Your Page...' : 'Generate Bridge Page'}
                </span>
              </div>
            </motion.button>

            {isReadyToGenerate && (
              <p className="text-center text-sm text-gray-600 mt-4">
                Your page will be ready for download and hosting in seconds
              </p>
            )}

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Demo Mode</h4>
              <p className="text-sm text-blue-800">
                This demo creates a downloadable HTML file. In production, this would deploy to live hosting with a real URL.
              </p>
            </div>
          </motion.div>
        )}

        {(generationState === 'generating' || generationState === 'complete' || generationState === 'failed') && (
          <FixedPageGenerationStatus
            pageId={pageId}
            onComplete={(data) => {
              setGeneratedPageData(data);
              setGenerationState('complete');
            }}
            onError={(error) => {
              console.error('Generation error:', error);
              setGenerationState('failed');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FixedEnhancedURLGenerator;