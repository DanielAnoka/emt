import React, { useState } from 'react';
import { Estate } from '../../types';
import { X, Plus } from 'lucide-react';

interface AddEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (estate: Omit<Estate, 'id' | 'createdAt'>) => void;
}

export const AddEstateModal: React.FC<AddEstateModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalUnits: '',
    adminId: '2', // Default to current estate admin
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Estate name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.totalUnits || parseInt(formData.totalUnits) <= 0) {
      newErrors.totalUnits = 'Valid number of units is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      name: formData.name.trim(),
      address: formData.address.trim(),
      totalUnits: parseInt(formData.totalUnits),
      occupiedUnits: 0,
      adminId: formData.adminId,
      isActive: formData.isActive,
    });

    // Reset form
    setFormData({
      name: '',
      address: '',
      totalUnits: '',
      adminId: '2',
      isActive: true,
    });
    setErrors({});
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Estate</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Estate Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Estate Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Westpoint Estate"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter complete address"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Total Units */}
          <div>
            <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700 mb-2">
              Total Units *
            </label>
            <input
              id="totalUnits"
              type="number"
              min="1"
              value={formData.totalUnits}
              onChange={(e) => handleChange('totalUnits', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.totalUnits ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., 120"
            />
            {errors.totalUnits && <p className="text-red-600 text-sm mt-1">{errors.totalUnits}</p>}
          </div>

          {/* Status */}
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
              Active Estate
            </label>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Estate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};