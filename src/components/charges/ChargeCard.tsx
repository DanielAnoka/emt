import React from 'react';
import { ServiceCharge, ServiceCategory } from '../../types';
import { Calendar, Clock, CheckCircle, AlertTriangle, Trash2, User, Power } from 'lucide-react';

interface ChargeCardProps {
  charge: ServiceCharge;
  onDelete?: (chargeId: string) => void;
  onToggle?: (chargeId: string) => void;
}

const categoryLabels: Record<ServiceCategory, string> = {
  waste: 'Waste Management',
  water: 'Water Supply',
  light: 'Electricity',
  sanitation: 'Sanitation',
  ground_rent: 'Ground Rent',
  estate_fee: 'Estate Fee',
};

const categoryColors: Record<ServiceCategory, string> = {
  waste: 'bg-green-100 text-green-800',
  water: 'bg-blue-100 text-blue-800',
  light: 'bg-yellow-100 text-yellow-800',
  sanitation: 'bg-purple-100 text-purple-800',
  ground_rent: 'bg-red-100 text-red-800',
  estate_fee: 'bg-gray-100 text-gray-800',
};

const durationLabels = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  one_time: 'One Time',
};

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Pending' },
  paid: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', label: 'Paid' },
  overdue: { icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200', label: 'Overdue' },
};

export const ChargeCard: React.FC<ChargeCardProps> = ({ charge, onDelete, onToggle }) => {
  const isOverdue = new Date(charge.dueDate) < new Date() && charge.status !== 'paid';
  const actualStatus = isOverdue ? 'overdue' : charge.status;
  const config = statusConfig[actualStatus];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{charge.title}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[charge.category]}`}>
              {categoryLabels[charge.category]}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {durationLabels[charge.duration]}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              charge.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {charge.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ₦{charge.amount.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {onToggle && (
            <button
              onClick={() => onToggle(charge.id)}
              className={`p-2 rounded-lg transition-colors duration-150 ${
                charge.isActive
                  ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Power className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(charge.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Due Date */}
      {charge.dueDate && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            Due: {new Date(charge.dueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {isOverdue && (
            <span className="ml-2 text-red-600 font-medium">
              ({Math.ceil((Date.now() - new Date(charge.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue)
            </span>
          )}
        </div>
      )}

      {/* User Info */}
      {charge.userId && (
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <User className="w-4 h-4 mr-2" />
          <span>Assigned to User ID: {charge.userId}</span>
        </div>
      )}

      {/* Created Info */}
      <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
        Created on {new Date(charge.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    </div>
  );
};