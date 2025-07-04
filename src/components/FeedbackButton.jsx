import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import questConfig from '../config/questConfig';

const { FiMessageCircle, FiChevronLeft, FiChevronRight } = FiIcons;

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const EventTracking = () => {
    // Track feedback button click
    console.log('Feedback button clicked', {
      timestamp: Date.now(),
      page: window.location.pathname,
      userAgent: navigator.userAgent
    });
  };

  const handleToggle = () => {
    EventTracking();
    setIsOpen((prev) => !prev);
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-1/2 -translate-y-1/2 -right-10 z-50 flex items-center gap-2 px-3 py-2 text-white font-semibold text-sm rounded-t-md rounded-b-none transition-all duration-300 hover:right-0 shadow-lg hover:shadow-xl"
        style={{
          background: questConfig.PRIMARY_COLOR,
          transform: 'rotate(270deg)',
          transformOrigin: 'center'
        }}
      >
        <div 
          className="w-fit h-fit transition-all duration-300"
          style={{ transform: 'rotate(90deg)' }}
        >
          <SafeIcon 
            icon={isOpen ? FiChevronRight : FiChevronLeft} 
            className="w-4 h-4" 
          />
        </div>
        <span className="whitespace-nowrap">Feedback</span>
      </motion.button>

      {/* Feedback Workflow Component */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="relative max-w-md w-full mx-4">
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
          </div>
        </motion.div>
      )}
    </>
  );
};

export default FeedbackButton;