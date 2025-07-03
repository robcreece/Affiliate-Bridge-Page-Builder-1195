import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiVideo, FiYoutube, FiCode, FiEye, FiEyeOff, FiTrash2, FiLink, FiPlay } = FiIcons;

const VideoEmbedManager = ({ videoData = {}, onVideoChange }) => {
  const [embedType, setEmbedType] = useState(videoData.type || 'youtube');
  const [youtubeUrl, setYoutubeUrl] = useState(videoData.youtubeUrl || '');
  const [customEmbed, setCustomEmbed] = useState(videoData.customEmbed || '');
  const [showPreview, setShowPreview] = useState(false);

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const generateYouTubeEmbed = (videoId) => {
    return `<div style="display: flex; justify-content: center; align-items: center; width: 100%;"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%; height: auto;"></iframe></div>`;
  };

  const ensureCenteredEmbed = (embed) => {
    if (!embed) return '';
    
    // If it's already wrapped in a centering div, return as is
    if (embed.includes('justify-content: center') || embed.includes('text-align: center')) {
      return embed;
    }
    
    // Wrap any embed code in a centering container
    return `<div style="display: flex; justify-content: center; align-items: center; width: 100%; text-align: center;">${embed}</div>`;
  };

  const handleVideoUpdate = (type, url, embed) => {
    const videoId = type === 'youtube' ? extractYouTubeId(url) : null;
    let finalEmbed = '';
    
    if (type === 'youtube' && videoId) {
      finalEmbed = generateYouTubeEmbed(videoId);
    } else if (type === 'custom' && embed) {
      finalEmbed = ensureCenteredEmbed(embed);
    }
    
    onVideoChange({
      type,
      youtubeUrl: url,
      customEmbed: embed,
      videoId,
      embed: finalEmbed,
      enabled: !!(finalEmbed && finalEmbed.trim())
    });
  };

  const handleYouTubeUrlChange = (url) => {
    setYoutubeUrl(url);
    handleVideoUpdate('youtube', url, customEmbed);
  };

  const handleCustomEmbedChange = (embed) => {
    setCustomEmbed(embed);
    handleVideoUpdate('custom', youtubeUrl, embed);
  };

  const handleTypeChange = (type) => {
    setEmbedType(type);
    handleVideoUpdate(type, youtubeUrl, customEmbed);
  };

  const clearVideo = () => {
    setYoutubeUrl('');
    setCustomEmbed('');
    setShowPreview(false);
    onVideoChange({
      type: 'youtube',
      youtubeUrl: '',
      customEmbed: '',
      videoId: null,
      embed: '',
      enabled: false
    });
  };

  const currentEmbed = embedType === 'youtube' && youtubeUrl ? 
    generateYouTubeEmbed(extractYouTubeId(youtubeUrl)) : 
    ensureCenteredEmbed(customEmbed);

  return (
    <div className="space-y-4">
      {/* Video Type Selection */}
      <div className="flex space-x-4">
        <button
          onClick={() => handleTypeChange('youtube')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
            embedType === 'youtube'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <SafeIcon icon={FiYoutube} className="w-4 h-4" />
          <span>YouTube URL</span>
        </button>
        <button
          onClick={() => handleTypeChange('custom')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
            embedType === 'custom'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <SafeIcon icon={FiCode} className="w-4 h-4" />
          <span>Custom HTML</span>
        </button>
      </div>

      {/* YouTube URL Input */}
      {embedType === 'youtube' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <div className="relative">
            <SafeIcon 
              icon={FiYoutube} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" 
            />
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => handleYouTubeUrlChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            />
          </div>
          {youtubeUrl && !extractYouTubeId(youtubeUrl) && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid YouTube URL
            </p>
          )}
        </div>
      )}

      {/* Custom HTML Input */}
      {embedType === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom HTML Embed Code
          </label>
          <textarea
            value={customEmbed}
            onChange={(e) => handleCustomEmbedChange(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="<iframe src='...' width='560' height='315' frameborder='0' allowfullscreen></iframe>"
          />
          <p className="mt-1 text-sm text-gray-500">
            Note: Videos will be automatically centered on the page
          </p>
        </div>
      )}

      {/* Preview Controls */}
      {currentEmbed && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiPlay} className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">Video Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <SafeIcon icon={showPreview ? FiEyeOff : FiEye} className="w-4 h-4" />
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>
            <button
              onClick={clearVideo}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Preview */}
      {showPreview && currentEmbed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-3">Live Preview (Centered):</h4>
          <div 
            className="bg-white rounded-lg p-4 max-w-full overflow-hidden"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            dangerouslySetInnerHTML={{ __html: currentEmbed }}
          />
        </motion.div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Video Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Videos are automatically centered on your page</li>
          <li>• Hero videos should be 30-90 seconds for maximum impact</li>
          <li>• Start with a compelling hook in the first 5 seconds</li>
          <li>• Keep it focused on the main benefit or transformation</li>
          <li>• End with a clear call-to-action</li>
          <li>• YouTube videos automatically include privacy-enhanced mode</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoEmbedManager;