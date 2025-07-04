import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import questConfig from '../config/questConfig';

const { FiMessageCircle, FiChevronLeft, FiChevronRight, FiX } = FiIcons;

const EnhancedFeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check if user has interacted with feedback before
  useEffect(() => {
    const feedbackHistory = localStorage.getItem('feedbackHistory');
    if (feedbackHistory) {
      setHasInteracted(true);
    }
  }, []);

  const EventTracking = () => {
    // Enhanced tracking with more context
    const trackingData = {
      timestamp: Date.now(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      hasInteractedBefore: hasInteracted
    };

    console.log('Feedback button clicked', trackingData);
    
    // Store interaction in localStorage
    localStorage.setItem('feedbackHistory', JSON.stringify(trackingData));
  };

  const handleToggle = () => {
    EventTracking();
    setIsOpen((prev) => !prev);
    setHasInteracted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.div
        className="fixed top-1/2 -translate-y-1/2 z-50"
        initial={{ opacity: 0, x: 50 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          right: isHovered ? '0px' : '-40px'
        }}
        transition={{ duration: 0.3, delay: 1 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ right: '-40px' }}
      >
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 text-white font-semibold text-sm rounded-l-md transition-all duration-300 shadow-lg hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${questConfig.PRIMARY_COLOR} 0%, #1e40af 100%)`,
            transform: 'rotate(270deg)',
            transformOrigin: 'center'
          }}
        >
          <div 
            className="w-fit h-fit transition-all duration-300"
            style={{ transform: 'rotate(90deg)' }}
          >
            <SafeIcon 
              icon={isOpen ? FiX : FiMessageCircle} 
              className="w-4 h-4" 
            />
          </div>
          <span className="whitespace-nowrap">
            {isOpen ? 'Close' : 'Feedback'}
          </span>
        </motion.button>

        {/* Tooltip for first-time users */}
        {!hasInteracted && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 -translate-y-1/2 right-full mr-2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            style={{ transform: 'translateY(-50%) rotate(0deg)' }}
          >
            Share your thoughts!
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Feedback Workflow Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <FeedbackWorkflow
                uniqueUserId={localStorage.getItem('userId') || questConfig.USER_ID}
                questId={questConfig.QUEST_FEEDBACK_QUESTID}
                isOpen={isOpen}
                accent={questConfig.PRIMARY_COLOR}
                onClose={handleClose}
                styleConfig={{
                  primaryColor: questConfig.PRIMARY_COLOR,
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  fontFamily: 'Inter, sans-serif',
                  maxWidth: '400px'
                }}
              >
                <FeedbackWorkflow.ThankYou />
              </FeedbackWorkflow>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedFeedbackButton;