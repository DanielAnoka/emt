import React, { useState } from 'react';
import { UserRole } from '../../types';
import { X, Plus, Bell } from 'lucide-react';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (notification: {
    title: string;
    message: string;
    type: string;
    estateId?: string;
    url?: string;
  }) => void;
  userRole: UserRole;
}

const notificationTypes = [
  { value: 'System Alert', label: 'System Alert' },
  { value: 'Payment', label: 'Payment' },
  { value: 'Alert', label: 'Alert' },
  { value: 'Success', label: 'Success' },
  { value: 'Info', label: 'Info' },
  { value: 'User', label: 'User' },
  { value: 'Property', label: 'Property' },
];

export const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  userRole,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'System Alert',
    estateId: '',
    url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    // Estate ID is required for estate admin
    if (userRole === 'estate_admin' && !formData.estateId.trim()) {
      newErrors.estateId = 'Estate ID is required for estate admin';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const notificationData: any = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      type: formData.type,
      url: formData.url.trim() || undefined,
    };

    // Add estate ID only for estate admin
    if (userRole === 'estate_admin' && formData.estateId.trim()) {
      notificationData.estateId = formData.estateId.trim();
    }

    onCreate(notificationData);

    // Reset form
    setFormData({
      title: '',
      message: '',
      type: 'System Alert',
      estateId: '',
      url: '',
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Notification</h2>
          </div>
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
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Estate Meeting"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter notification message..."
            />
            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {notificationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Estate ID - Only for estate admin */}
          {userRole === 'estate_admin' && (
            <div>
              <label htmlFor="estateId" className="block text-sm font-medium text-gray-700 mb-2">
                Estate ID *
              </label>
              <input
                id="estateId"
                type="number"
                value={formData.estateId}
                onChange={(e) => handleChange('estateId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.estateId ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter estate ID"
              />
              {errors.estateId && <p className="text-red-600 text-sm mt-1">{errors.estateId}</p>}
            </div>
          )}

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL (Optional)
            </label>
            <input
              id="url"
              type="text"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., /notification/1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional URL to redirect users when they click on the notification
            </p>
          </div>

          {/* Role Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Notification Scope</h4>
            <p className="text-sm text-blue-700">
              {userRole === 'super_admin' && 'This notification will be sent to all users in the system.'}
              {userRole === 'estate_admin' && 'This notification will be sent to users in the specified estate.'}
            </p>
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
              Create Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};