import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBridgePage } from '../context/BridgePageContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLink, FiSearch, FiArrowRight, FiAlertCircle, FiCheckCircle, FiLoader, FiTarget, FiZap, FiCpu } = FiIcons;

const URLAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const { setAnalysisData, updateBridgePageData, generateBonuses } = useBridgePage();
  const navigate = useNavigate();

  const analyzeURL = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL format');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    // Simulate analysis with enhanced visual feedback
    setTimeout(() => {
      const mockAnalysis = {
        url,
        bigIdea: 'Transform Your Life with This Revolutionary System',
        painPoints: [
          'Struggling with current methods that don\'t work',
          'Wasting time on ineffective strategies',
          'Frustrated with lack of results',
          'Overwhelmed by complex processes'
        ],
        benefits: [
          'Achieve results 10x faster',
          'Simple step-by-step system',
          'Proven by thousands of users',
          'Risk-free guarantee'
        ],
        emotionalDrivers: [
          'Fear of missing out on transformation',
          'Desire for quick results',
          'Need for proven system',
          'Want for simplicity'
        ],
        productType: 'business',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        tone: 'urgent-confident'
      };

      setAnalysisData(mockAnalysis);

      // Generate bridge page content based on analysis
      const bridgeContent = generateBridgeContent(mockAnalysis);
      updateBridgePageData(bridgeContent);

      setIsAnalyzing(false);
      navigate('/builder');
    }, 4000);
  };

  const generateBridgeContent = (analysis) => {
    const headlines = {
      'urgent-confident': `⚡ WARNING: This ${analysis.bigIdea.split(' ')[0]} Method Is About To Change Everything...`,
      'friendly-expert': `The Smart Way to ${analysis.bigIdea}`,
      'authority-direct': `How I Discovered ${analysis.bigIdea}`
    };

    const subheadlines = {
      'urgent-confident': 'But only if you act fast - this exclusive opportunity won\'t last long',
      'friendly-expert': 'Simple, proven strategies that actually work',
      'authority-direct': 'The insider secrets they don\'t want you to know'
    };

    const ctaOptions = {
      'urgent-confident': ['Get Instant Access Now', 'Yes, I Want This!'],
      'friendly-expert': ['Start My Journey Today', 'Show Me How'],
      'authority-direct': ['Claim Your Copy', 'Get Started Now']
    };

    return {
      headline: headlines[analysis.tone] || headlines['urgent-confident'],
      subheadline: subheadlines[analysis.tone] || subheadlines['urgent-confident'],
      bodyParagraphs: [
        `If you're tired of ${analysis.painPoints[0]?.toLowerCase()}, you're not alone. Thousands of people just like you have been searching for a solution that actually works.`,
        `What if I told you there's a proven system that ${analysis.benefits[0]?.toLowerCase()} and ${analysis.benefits[1]?.toLowerCase()}? This isn't just another promise - it's a complete transformation waiting to happen.`,
        `The window of opportunity is closing fast. Don't let another day pass wondering "what if" - take action now and discover why this system is changing lives worldwide.`
      ],
      primaryColor: analysis.primaryColor,
      secondaryColor: analysis.secondaryColor,
      ctaButtons: ctaOptions[analysis.tone] || ctaOptions['urgent-confident'],
      bonuses: generateBonuses(analysis.productType)
    };
  };

  const analysisSteps = [
    { label: 'Connecting to URL...', icon: FiLink, delay: 0 },
    { label: 'Extracting content...', icon: FiSearch, delay: 800 },
    { label: 'Analyzing psychology...', icon: FiCpu, delay: 1600 },
    { label: 'Generating bridge content...', icon: FiZap, delay: 2400 },
    { label: 'Optimizing conversion elements...', icon: FiTarget, delay: 3200 }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={FiTarget} className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Analyze Any Sales Page
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Enter the URL of the product you want to promote and our AI will analyze it to create your perfect bridge page with optimized copy and conversion elements.
        </p>
      </motion.div>

      {/* Main Analysis Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8"
      >
        <div className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sales Page URL
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiLink} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/sales-page"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAnalyzing}
              />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center space-x-2 text-red-600"
              >
                <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </div>

          {/* Analyze Button */}
          <motion.button
            onClick={analyzeURL}
            disabled={isAnalyzing}
            whileHover={{ scale: isAnalyzing ? 1 : 1.02 }}
            whileTap={{ scale: isAnalyzing ? 1 : 0.98 }}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
              isAnalyzing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <SafeIcon icon={FiLoader} className="w-5 h-5" />
                  </motion.div>
                  <span className="loading-dots">Analyzing Sales Page</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSearch} className="w-5 h-5" />
                  <span>Analyze & Create Bridge Page</span>
                  <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                </>
              )}
            </div>
          </motion.button>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="space-y-3">
              {analysisSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.delay / 1000, duration: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <SafeIcon icon={step.icon} className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Smart Analysis',
            description: 'AI-powered analysis of sales pages to extract key conversion elements and psychological triggers',
            icon: FiSearch,
            color: 'blue'
          },
          {
            title: 'Proven Templates',
            description: 'High-converting bridge page templates based on successful campaigns and industry best practices',
            icon: FiTarget,
            color: 'purple'
          },
          {
            title: 'Instant Generation',
            description: 'Automatically generate compelling copy, bonuses, and conversion elements in seconds',
            icon: FiZap,
            color: 'green'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className={`w-12 h-12 bg-${feature.color}-500 rounded-lg flex items-center justify-center mb-4`}>
              <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            
            <p className="text-gray-600">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default URLAnalyzer;