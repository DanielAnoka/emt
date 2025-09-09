import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { X, Save } from 'lucide-react';

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tenant: User) => void;
  tenant: User;
  landlordProperties: any[];
}

export const EditTenantModal: React.FC<EditTenantModalProps> = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  tenant,
  landlordProperties 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    houseNumber: '',
    estateId: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        houseNumber: tenant.houseNumber || '',
        estateId: tenant.estateId || '',
        isActive: tenant.isActive,
      });
    }
  }, [tenant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.houseNumber) newErrors.houseNumber = 'Property is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onEdit({
      ...tenant,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      houseNumber: formData.houseNumber,
      estateId: formData.estateId.trim() || undefined,
      isActive: formData.isActive,
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
          <h2 className="text-xl font-semibold text-gray-900">Edit Tenant</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter tenant's full name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="tenant@email.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="+234-123-456-7890"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Property Selection */}
          <div>
            <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Property *
            </label>
            <select
              id="houseNumber"
              value={formData.houseNumber}
              onChange={(e) => handleChange('houseNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.houseNumber ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a property</option>
              {landlordProperties.map(property => (
                <option key={property.id} value={property.houseNumber}>
                  {property.houseNumber} - {property.title}
                </option>
              ))}
            </select>
            {errors.houseNumber && <p className="text-red-600 text-sm mt-1">{errors.houseNumber}</p>}
          </div>

          {/* Estate ID (Optional) */}
          <div>
            <label htmlFor="estateId" className="block text-sm font-medium text-gray-700 mb-2">
              Estate ID (Optional)
            </label>
            <input
              id="estateId"
              type="text"
              value={formData.estateId}
              onChange={(e) => handleChange('estateId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter estate ID if applicable"
            />
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
              Active Tenant
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
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};