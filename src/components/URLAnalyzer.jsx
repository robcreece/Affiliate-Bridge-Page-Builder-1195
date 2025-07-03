import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBridgePage } from '../context/BridgePageContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLink, FiSearch, FiArrowRight, FiAlertCircle, FiCheckCircle, FiLoader, FiTarget } = FiIcons;

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

    // Simulate analysis (in real app, this would call your analysis API)
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
    }, 3000);
  };

  const generateBridgeContent = (analysis) => {
    const headlines = {
      'urgent-confident': `WARNING: This ${analysis.bigIdea.split(' ')[0]} Method Is About To Change Everything...`,
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

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
          Analyze Any Sales Page
        </h2>
        <p className="text-xl text-gray-600 font-body">
          Enter the URL of the product you want to promote and we'll analyze it to create your perfect bridge page
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
                disabled={isAnalyzing}
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center space-x-2 text-red-600"
              >
                <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                <span className="text-sm font-body">{error}</span>
              </motion.div>
            )}
          </div>

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
                  <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
                  <span>Analyzing Sales Page...</span>
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

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500" />
                <span className="text-sm font-body">Extracting headline and offer details...</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiLoader} className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="text-sm font-body">Analyzing pain points and benefits...</span>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <SafeIcon icon={FiLoader} className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-body">Generating bridge page content...</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Smart Analysis',
            description: 'AI-powered analysis of sales pages to extract key conversion elements',
            icon: FiSearch
          },
          {
            title: 'Proven Templates',
            description: 'High-converting bridge page templates based on successful campaigns',
            icon: FiTarget
          },
          {
            title: 'Bonus Generation',
            description: 'Automatic bonus ideas to increase your affiliate conversion rates',
            icon: FiCheckCircle
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <SafeIcon icon={feature.icon} className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">
              {feature.title}
            </h3>
            <p className="text-gray-600 font-body">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default URLAnalyzer;