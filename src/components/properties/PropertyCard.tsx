import React from 'react';
import { Property } from '../../types';
import { MapPin, Bed, Bath, Car, Check, X, Eye } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onApprove?: (propertyId: string) => void;
  onReject?: (propertyId: string) => void;
  onView?: (propertyId: string) => void;
  showActions?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onApprove, 
  onReject, 
  onView,
  showActions = false 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Property Image */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">Property Image</span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.approved 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.approved ? 'Approved' : 'Pending'}
          </span>
        </div>

        {/* Vacancy Status */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.isVacant 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {property.isVacant ? 'Vacant' : 'Occupied'}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
            {property.title}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">₦{property.rent.toLocaleString()}</div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">
            {property.houseNumber} • {property.estateType === 'estate' ? 'Estate Property' : 'Non-Estate'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Property Features */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center">
            <Car className="w-4 h-4 mr-1" />
            <span>Parking</span>
          </div>
        </div>

        {/* Service Charge */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-600">Service Charge</div>
          <div className="text-lg font-semibold text-gray-900">₦{property.serviceCharge.toLocaleString()}</div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onView?.(property.id)}
              className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </button>
            {!property.approved && onApprove && (
              <button
                onClick={() => onApprove(property.id)}
                className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors duration-150 flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </button>
            )}
            {onReject && (
              <button
                onClick={() => onReject(property.id)}
                className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-150 flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};