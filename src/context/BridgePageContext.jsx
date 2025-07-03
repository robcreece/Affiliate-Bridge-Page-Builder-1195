import React, { createContext, useContext, useState } from 'react';

const BridgePageContext = createContext();

export const useBridgePage = () => {
  const context = useContext(BridgePageContext);
  if (!context) {
    throw new Error('useBridgePage must be used within a BridgePageProvider');
  }
  return context;
};

export const BridgePageProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [bridgePageData, setBridgePageData] = useState({
    headline: '',
    subheadline: '',
    heroVideo: {
      type: 'youtube',
      youtubeUrl: '',
      customEmbed: '',
      videoId: null,
      embed: '',
      enabled: false
    },
    bodyParagraphs: ['', '', ''],
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    headingFont: 'Poppins',
    bodyFont: 'Inter',
    ctaButtons: ['', ''],
    affiliateLink: '',
    bonuses: [],
    videoEmbed: ''
  });

  const updateBridgePageData = (newData) => {
    setBridgePageData(prev => ({ ...prev, ...newData }));
  };

  const generateBonuses = (productType) => {
    const bonusTemplates = {
      'business': [
        {
          title: 'Ultimate Business Launch Checklist',
          description: 'A comprehensive 50-point checklist covering everything from market research to first sale.',
          enabled: true,
          type: 'PDF Checklist'
        },
        {
          title: 'Profit Maximization Templates',
          description: 'Ready-to-use spreadsheets and calculators for pricing, profit margins, and ROI tracking.',
          enabled: true,
          type: 'Excel Templates'
        },
        {
          title: 'High-Converting Email Swipe Files',
          description: 'Proven email sequences for customer acquisition, retention, and sales conversion.',
          enabled: true,
          type: 'Swipe Files'
        },
        {
          title: 'Market Research Toolkit',
          description: 'Step-by-step guides and templates for identifying profitable niches and target audiences.',
          enabled: false,
          type: 'PDF Guide'
        },
        {
          title: '30-Day Action Plan Workbook',
          description: 'Day-by-day implementation guide with milestones, tasks, and progress tracking.',
          enabled: false,
          type: 'Interactive PDF'
        }
      ],
      'health': [
        {
          title: '7-Day Kickstart Meal Plan',
          description: 'Complete meal planning guide with shopping lists and prep instructions.',
          enabled: true,
          type: 'PDF Guide'
        },
        {
          title: 'Progress Tracking Templates',
          description: 'Customizable charts and logs for monitoring your transformation journey.',
          enabled: true,
          type: 'Printable Templates'
        },
        {
          title: 'Quick Win Exercise Library',
          description: '50+ exercises you can do anywhere, anytime - no equipment required.',
          enabled: true,
          type: 'Video Library'
        },
        {
          title: 'Motivation Mindset Audio Series',
          description: 'Daily affirmations and mindset training to keep you motivated and focused.',
          enabled: false,
          type: 'Audio Series'
        },
        {
          title: 'Emergency Craving Buster Kit',
          description: 'Instant strategies and healthy alternatives for when cravings strike.',
          enabled: false,
          type: 'Quick Reference'
        }
      ],
      'marketing': [
        {
          title: 'Conversion Optimization Checklist',
          description: 'Proven strategies to increase your conversion rates by 200% or more.',
          enabled: true,
          type: 'PDF Checklist'
        },
        {
          title: 'Social Media Content Calendar',
          description: '90 days of ready-to-post content with captions and hashtag research.',
          enabled: true,
          type: 'Content Templates'
        },
        {
          title: 'High-Converting Landing Page Templates',
          description: 'Tested and proven page layouts that convert visitors into customers.',
          enabled: true,
          type: 'HTML Templates'
        },
        {
          title: 'Email Marketing Automation Blueprints',
          description: 'Complete funnel sequences for every stage of the customer journey.',
          enabled: false,
          type: 'Strategy Guide'
        },
        {
          title: 'ROI Tracking Dashboard',
          description: 'Pre-built analytics dashboard to monitor and optimize your marketing spend.',
          enabled: false,
          type: 'Spreadsheet Tool'
        }
      ],
      'technology': [
        {
          title: 'Setup & Installation Guide',
          description: 'Step-by-step walkthrough with screenshots for quick and easy implementation.',
          enabled: true,
          type: 'PDF Guide'
        },
        {
          title: 'Troubleshooting Handbook',
          description: 'Solutions to common problems and issues you might encounter.',
          enabled: true,
          type: 'Reference Guide'
        },
        {
          title: 'Advanced Tips & Tricks',
          description: 'Pro-level strategies and hidden features to maximize your results.',
          enabled: true,
          type: 'Video Training'
        },
        {
          title: 'Integration Templates',
          description: 'Ready-to-use code snippets and configurations for popular platforms.',
          enabled: false,
          type: 'Code Templates'
        },
        {
          title: 'Performance Optimization Guide',
          description: 'Techniques to improve speed, efficiency, and overall system performance.',
          enabled: false,
          type: 'Technical Guide'
        }
      ],
      'finance': [
        {
          title: 'Wealth Building Calculator Suite',
          description: 'Interactive spreadsheets for budgeting, investing, and retirement planning.',
          enabled: true,
          type: 'Excel Tools'
        },
        {
          title: 'Investment Strategy Templates',
          description: 'Proven frameworks for portfolio diversification and risk management.',
          enabled: true,
          type: 'Strategy Templates'
        },
        {
          title: 'Tax Optimization Checklist',
          description: 'Legal strategies to minimize tax burden and maximize your wealth retention.',
          enabled: true,
          type: 'PDF Checklist'
        },
        {
          title: 'Emergency Fund Blueprint',
          description: 'Step-by-step plan to build and maintain your financial safety net.',
          enabled: false,
          type: 'Action Plan'
        },
        {
          title: 'Debt Elimination Workbook',
          description: 'Proven methods to eliminate debt faster and save thousands in interest.',
          enabled: false,
          type: 'Interactive Workbook'
        }
      ]
    };

    return bonusTemplates[productType] || bonusTemplates['business'];
  };

  const value = {
    analysisData,
    setAnalysisData,
    bridgePageData,
    setBridgePageData,
    updateBridgePageData,
    generateBonuses
  };

  return (
    <BridgePageContext.Provider value={value}>
      {children}
    </BridgePageContext.Provider>
  );
};