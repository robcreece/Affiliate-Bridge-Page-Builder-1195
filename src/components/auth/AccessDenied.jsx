import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiLock, FiArrowLeft, FiLogOut } = FiIcons;

const AccessDenied = ({ reason = "You don't have permission to access this page" }) => {
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">{reason}</p>

          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiLock} className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Current Access Level</span>
              </div>
              <div className="text-left space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Role:</span> {user.role}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Plan:</span> {user.plan}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Email:</span> {user.email}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              <span>Go Back</span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Need Access?</h4>
            <p className="text-sm text-blue-800">
              Contact your administrator to request the necessary permissions for this page.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;