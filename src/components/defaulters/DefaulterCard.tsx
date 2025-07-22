import React from 'react';
import { DefaulterRecord, ServiceCategory } from '../../types';
import { Mail, Phone, MapPin, Calendar, AlertTriangle, Send, CheckCircle } from 'lucide-react';

interface DefaulterCardProps {
  defaulter: DefaulterRecord;
  onSendReminder?: (defaulterId: string) => void;
  onMarkPaid?: (defaulterId: string) => void;
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

export const DefaulterCard: React.FC<DefaulterCardProps> = ({ 
  defaulter, 
  onSendReminder, 
  onMarkPaid 
}) => {
  const getSeverityColor = (days: number) => {
    if (days >= 30) return 'text-red-600 bg-red-50 border-red-200';
    if (days >= 14) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{defaulter.userName}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[defaulter.category]}`}>
              {categoryLabels[defaulter.category]}
            </span>
          </div>
        </div>
        
        <div className={`flex items-center px-3 py-1 rounded-full border ${getSeverityColor(defaulter.daysPastDue)}`}>
          <AlertTriangle className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{defaulter.daysPastDue} days</span>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">{defaulter.chargeTitle}</div>
        <div className="text-2xl font-bold text-red-600">₦{defaulter.amount.toLocaleString()}</div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="truncate">{defaulter.userEmail}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{defaulter.houseNumber} • {defaulter.estateName}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            Due: {new Date(defaulter.dueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onSendReminder?.(defaulter.id)}
          className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center justify-center"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Reminder
        </button>
        <button
          onClick={() => onMarkPaid?.(defaulter.id)}
          className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-150 flex items-center justify-center"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark Paid
        </button>
      </div>
    </div>
  );
};