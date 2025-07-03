import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBridgePage } from '../context/BridgePageContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGift, FiPlus, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } = FiIcons;

const BonusManager = () => {
  const { bridgePageData, updateBridgePageData } = useBridgePage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBonus, setNewBonus] = useState({
    title: '',
    description: '',
    type: 'PDF Guide',
    enabled: true
  });

  const bonusTypes = [
    'PDF Guide',
    'Video Training',
    'Excel Templates',
    'Swipe Files',
    'Checklist',
    'Audio Series',
    'Code Templates',
    'Interactive Workbook'
  ];

  const handleToggleBonus = (index) => {
    const updatedBonuses = [...bridgePageData.bonuses];
    updatedBonuses[index].enabled = !updatedBonuses[index].enabled;
    updateBridgePageData({ bonuses: updatedBonuses });
  };

  const handleAddBonus = () => {
    if (newBonus.title.trim() && newBonus.description.trim()) {
      const updatedBonuses = [...bridgePageData.bonuses, { ...newBonus }];
      updateBridgePageData({ bonuses: updatedBonuses });
      setNewBonus({ title: '', description: '', type: 'PDF Guide', enabled: true });
      setShowAddForm(false);
    }
  };

  const handleDeleteBonus = (index) => {
    const updatedBonuses = bridgePageData.bonuses.filter((_, i) => i !== index);
    updateBridgePageData({ bonuses: updatedBonuses });
  };

  const handleEditBonus = (index, field, value) => {
    const updatedBonuses = [...bridgePageData.bonuses];
    updatedBonuses[index][field] = value;
    updateBridgePageData({ bonuses: updatedBonuses });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiGift} className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bonus Offers</h3>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Add Bonus</span>
        </motion.button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 rounded-lg p-4 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonus Title
              </label>
              <input
                type="text"
                value={newBonus.title}
                onChange={(e) => setNewBonus({ ...newBonus, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ultimate Success Guide"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newBonus.type}
                onChange={(e) => setNewBonus({ ...newBonus, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {bonusTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newBonus.description}
              onChange={(e) => setNewBonus({ ...newBonus, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of what this bonus provides..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBonus}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Bonus
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {bridgePageData.bonuses.map((bonus, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-4 ${
              bonus.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => handleToggleBonus(index)}
                    className="text-2xl"
                  >
                    <SafeIcon 
                      icon={bonus.enabled ? FiToggleRight : FiToggleLeft} 
                      className={`w-6 h-6 ${
                        bonus.enabled ? 'text-green-500' : 'text-gray-400'
                      }`} 
                    />
                  </button>
                  <input
                    type="text"
                    value={bonus.title}
                    onChange={(e) => handleEditBonus(index, 'title', e.target.value)}
                    className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  />
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {bonus.type}
                  </span>
                </div>
                <textarea
                  value={bonus.description}
                  onChange={(e) => handleEditBonus(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 resize-none"
                />
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleDeleteBonus(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {bridgePageData.bonuses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <SafeIcon icon={FiGift} className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No bonuses added yet. Click "Add Bonus" to get started!</p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Bonus Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Offer 3-5 bonuses for maximum impact without overwhelming</li>
          <li>• Make bonuses complement the main product perfectly</li>
          <li>• Use specific, benefit-focused titles</li>
          <li>• Include perceived value in descriptions</li>
          <li>• Enable/disable bonuses to test conversion rates</li>
        </ul>
      </div>
    </div>
  );
};

export default BonusManager;