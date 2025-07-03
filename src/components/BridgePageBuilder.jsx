import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBridgePage } from '../context/BridgePageContext';
import SafeIcon from '../common/SafeIcon';
import ColorPicker from './ColorPicker';
import BonusManager from './BonusManager';
import VideoEmbedManager from './VideoEmbedManager';
import * as FiIcons from 'react-icons/fi';

const { FiEdit3, FiEye, FiSave, FiType, FiVideo, FiGift, FiLink2, FiUpload } = FiIcons;

const BridgePageBuilder = () => {
  const { bridgePageData, updateBridgePageData } = useBridgePage();
  const [activeTab, setActiveTab] = useState('content');
  const navigate = useNavigate();

  const tabs = [
    { id: 'content', label: 'Content', icon: FiEdit3 },
    { id: 'design', label: 'Design', icon: FiType },
    { id: 'video', label: 'Video', icon: FiVideo },
    { id: 'bonuses', label: 'Bonuses', icon: FiGift },
    { id: 'links', label: 'Links', icon: FiLink2 }
  ];

  const handleInputChange = (field, value) => {
    updateBridgePageData({ [field]: value });
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...bridgePageData.bodyParagraphs];
    newParagraphs[index] = value;
    updateBridgePageData({ bodyParagraphs: newParagraphs });
  };

  const handleCTAChange = (index, value) => {
    const newCTAs = [...bridgePageData.ctaButtons];
    newCTAs[index] = value;
    updateBridgePageData({ ctaButtons: newCTAs });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'content' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={bridgePageData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your compelling headline..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subheadline
                </label>
                <input
                  type="text"
                  value={bridgePageData.subheadline}
                  onChange={(e) => handleInputChange('subheadline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Supporting subheadline..."
                />
              </div>

              {/* Hero Video Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiVideo} className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Hero Video</h3>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Displays under headline
                  </span>
                </div>
                <VideoEmbedManager
                  videoData={bridgePageData.heroVideo}
                  onVideoChange={(videoData) => handleInputChange('heroVideo', videoData)}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Body Paragraphs
                </label>
                {bridgePageData.bodyParagraphs.map((paragraph, index) => (
                  <div key={index}>
                    <label className="block text-xs text-gray-500 mb-1">
                      Paragraph {index + 1}
                    </label>
                    <textarea
                      value={paragraph}
                      onChange={(e) => handleParagraphChange(index, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter paragraph ${index + 1}...`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button 1
                  </label>
                  <input
                    type="text"
                    value={bridgePageData.ctaButtons[0]}
                    onChange={(e) => handleCTAChange(0, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Get Started Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button 2
                  </label>
                  <input
                    type="text"
                    value={bridgePageData.ctaButtons[1]}
                    onChange={(e) => handleCTAChange(1, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Yes, I Want This!"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'design' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <ColorPicker
                primaryColor={bridgePageData.primaryColor}
                secondaryColor={bridgePageData.secondaryColor}
                onPrimaryChange={(color) => handleInputChange('primaryColor', color)}
                onSecondaryChange={(color) => handleInputChange('secondaryColor', color)}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading Font
                  </label>
                  <select
                    value={bridgePageData.headingFont}
                    onChange={(e) => handleInputChange('headingFont', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Poppins">Poppins (Bold, Modern)</option>
                    <option value="Montserrat">Montserrat (Clean, Professional)</option>
                    <option value="Playfair Display">Playfair Display (Elegant, Serif)</option>
                    <option value="Roboto">Roboto (Simple, Readable)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Font
                  </label>
                  <select
                    value={bridgePageData.bodyFont}
                    onChange={(e) => handleInputChange('bodyFont', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Inter">Inter (Modern, Readable)</option>
                    <option value="Open Sans">Open Sans (Friendly, Clean)</option>
                    <option value="Lato">Lato (Humanist, Warm)</option>
                    <option value="Source Sans Pro">Source Sans Pro (Professional)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'video' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Embed Code
                </label>
                <textarea
                  value={bridgePageData.videoEmbed}
                  onChange={(e) => handleInputChange('videoEmbed', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Paste your YouTube embed code or custom video HTML here..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Video Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep videos under 3 minutes for maximum engagement</li>
                  <li>• Start with a hook in the first 5 seconds</li>
                  <li>• End with a clear call-to-action</li>
                  <li>• Use captions for accessibility</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'bonuses' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <BonusManager />
            </motion.div>
          )}

          {activeTab === 'links' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affiliate Link
                </label>
                <input
                  type="url"
                  value={bridgePageData.affiliateLink}
                  onChange={(e) => handleInputChange('affiliateLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-affiliate-link.com"
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Important:</h4>
                <p className="text-sm text-yellow-800">
                  Make sure your affiliate link is properly formatted and includes your tracking ID. Test the link before publishing your bridge page.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
              <span>Save Draft</span>
            </motion.button>

            <div className="flex space-x-3">
              <motion.button
                onClick={() => navigate('/preview')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                <span>Preview Page</span>
              </motion.button>

              <motion.button
                onClick={() => navigate('/publish')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
              >
                <SafeIcon icon={FiUpload} className="w-4 h-4" />
                <span>Publish Page</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BridgePageBuilder;