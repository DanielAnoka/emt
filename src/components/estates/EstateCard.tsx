import React from 'react';
import { Estate } from '../../types';
import { MapPin, Users, Building, Eye, TrendingUp, Key, Power } from 'lucide-react';

interface EstateCardProps {
  estate: Estate;
  onView: (estate: Estate) => void;
  onGenerateLogin?: (estate: Estate) => void;
  onToggleStatus?: (estateId: string) => void;
}

export const EstateCard: React.FC<EstateCardProps> = ({ 
  estate, 
  onView, 
  onGenerateLogin, 
  onToggleStatus 
}) => {
  const occupancyRate = Math.round((estate.occupiedUnits / estate.totalUnits) * 100);
  const vacantUnits = estate.totalUnits - estate.occupiedUnits;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{estate.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{estate.address}</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          estate.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {estate.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Units</p>
              <p className="text-lg font-bold text-blue-900">{estate.totalUnits}</p>
            </div>
            <Building className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Occupied</p>
              <p className="text-lg font-bold text-green-900">{estate.occupiedUnits}</p>
            </div>
            <Users className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Occupancy Rate */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Occupancy Rate</span>
          <span className="text-sm font-bold text-gray-900">{occupancyRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{vacantUnits} vacant</span>
          <span>{estate.occupiedUnits} occupied</span>
        </div>
      </div>

      {/* Created Date */}
      <div className="text-xs text-gray-500 mb-4">
        Created {new Date(estate.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>

      {/* Action Button */}
      <div className="space-y-2">
        <button
          onClick={() => onView(estate)}
          className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
        
        <div className="flex space-x-2">
          {onGenerateLogin && (
            <button
              onClick={() => onGenerateLogin(estate)}
              className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-150 flex items-center justify-center"
            >
              <Key className="w-4 h-4 mr-1" />
              Generate Login
            </button>
          )}
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(estate.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-center ${
                estate.isActive
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              <Power className="w-4 h-4 mr-1" />
              {estate.isActive ? 'Disable' : 'Enable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};