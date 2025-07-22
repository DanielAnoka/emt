import React, { useState } from 'react';
import { ServiceCharge, ServiceCategory } from '../../types';
import { X, Plus } from 'lucide-react';

interface AddChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (charge: Omit<ServiceCharge, 'id' | 'status' | 'createdBy' | 'createdAt'>) => void;
}

const categoryOptions: { value: ServiceCategory; label: string }[] = [
  { value: 'waste', label: 'Waste Management' },
  { value: 'water', label: 'Water Supply' },
  { value: 'light', label: 'Electricity' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'ground_rent', label: 'Ground Rent' },
  { value: 'estate_fee', label: 'Estate Fee' },
];

export const AddChargeModal: React.FC<AddChargeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'waste' as ServiceCategory,
    amount: '',
    duration: 'monthly' as 'monthly' | 'yearly' | 'one_time',
    dueDate: '',
    userId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      title: formData.title.trim(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      duration: formData.duration,
    });

    // Reset form
    setFormData({
      title: '',
      category: 'waste',
      amount: '',
      duration: 'monthly',
    });
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
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
          <h2 className="text-xl font-semibold text-gray-900">Add New Charge</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Charge Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Monthly Waste Management"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₦) *
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <select
              id="duration"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One Time Fee</option>
            </select>
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
              Add Charge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};