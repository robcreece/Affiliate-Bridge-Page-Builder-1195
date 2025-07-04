import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import questConfig from '../config/questConfig';

const { FiMessageCircle, FiChevronLeft, FiChevronRight, FiX } = FiIcons;

const EnhancedFeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Check if user has interacted with feedback before
  useEffect(() => {
    const feedbackHistory = localStorage.getItem('feedbackHistory');
    if (feedbackHistory) {
      setHasInteracted(true);
    }
  }, []);

  const EventTracking = () => {
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

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.button
        onClick={handleToggle}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 1 }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-1/2 -translate-y-1/2 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm rounded-l-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        style={{
          transform: 'rotate(270deg)',
          transformOrigin: 'center',
          right: hasInteracted ? '16px' : '-20px'
        }}
      >
        <div className="w-fit h-fit transition-all duration-300" 
             style={{ transform: 'rotate(90deg)' }}>
          <SafeIcon 
            icon={isOpen ? FiX : FiMessageCircle} 
            className="w-4 h-4" 
          />
        </div>
        <span className="whitespace-nowrap">
          {isOpen ? 'Close' : 'Feedback'}
        </span>

        {/* Pulse effect for new users */}
        {!hasInteracted && (
          <motion.div
            className="absolute inset-0 bg-blue-400 rounded-l-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>

      {/* Feedback Modal */}
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
              transition={{ duration: 0.3 }}
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
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  fontFamily: 'Inter, sans-serif'
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