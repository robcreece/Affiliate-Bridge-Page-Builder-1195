import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTarget, FiArrowLeft, FiEye, FiEdit3, FiLink, FiUpload } = FiIcons;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/analyzer': return 'Sales Page Analyzer';
      case '/builder': return 'Bridge Page Builder';
      case '/preview': return 'Preview & Export';
      case '/publish': return 'Publish & Generate';
      default: return 'Bridge Page Builder';
    }
  };

  const getIcon = () => {
    switch (location.pathname) {
      case '/analyzer': return FiTarget;
      case '/builder': return FiEdit3;
      case '/preview': return FiEye;
      case '/publish': return FiUpload;
      default: return FiTarget;
    }
  };

  const getDescription = () => {
    switch (location.pathname) {
      case '/analyzer': return 'Analyze and extract insights from any sales page';
      case '/builder': return 'Create high-converting affiliate bridge pages';
      case '/preview': return 'Preview your page across all devices';
      case '/publish': return 'Deploy your page and get a live URL';
      default: return 'Professional bridge page creation tool';
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white shadow-sm border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SafeIcon icon={getIcon()} className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getTitle()}
              </h1>
              <p className="text-sm text-gray-600">
                {getDescription()}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              <span>Home</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;