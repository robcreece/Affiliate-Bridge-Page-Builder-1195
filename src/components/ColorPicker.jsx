import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPalette, FiRefreshCw } = FiIcons;

const ColorPicker = ({ primaryColor, secondaryColor, onPrimaryChange, onSecondaryChange }) => {
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

  const colorPresets = [
    { name: 'Blue Ocean', primary: '#3b82f6', secondary: '#1e40af' },
    { name: 'Purple Sunset', primary: '#8b5cf6', secondary: '#5b21b6' },
    { name: 'Green Forest', primary: '#10b981', secondary: '#047857' },
    { name: 'Orange Fire', primary: '#f59e0b', secondary: '#d97706' },
    { name: 'Red Passion', primary: '#ef4444', secondary: '#dc2626' },
    { name: 'Pink Blossom', primary: '#ec4899', secondary: '#be185d' },
    { name: 'Teal Wave', primary: '#14b8a6', secondary: '#0f766e' },
    { name: 'Indigo Night', primary: '#6366f1', secondary: '#4338ca' }
  ];

  const applyPreset = (preset) => {
    onPrimaryChange(preset.primary);
    onSecondaryChange(preset.secondary);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <SafeIcon icon={FiPalette} className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Color Scheme</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
              onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => onPrimaryChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#3b82f6"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Color
          </label>
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: secondaryColor }}
              onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => onSecondaryChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#1e40af"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Color Presets</h4>
          <button
            onClick={() => applyPreset(colorPresets[Math.floor(Math.random() * colorPresets.length)])}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            <span>Random</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {colorPresets.map((preset, index) => (
            <motion.button
              key={index}
              onClick={() => applyPreset(preset)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div
                  className="w-8 h-8"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-8 h-8"
                  style={{ backgroundColor: preset.secondary }}
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all" />
              <div className="text-xs text-gray-600 text-center mt-1 group-hover:text-gray-900">
                {preset.name}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Color Preview</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div
              className="h-8 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
              }}
            />
          </div>
          <div className="text-sm text-gray-600">
            Gradient Preview
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;