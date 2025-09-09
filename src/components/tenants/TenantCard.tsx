import React, { useState } from 'react';
import { User } from '../../types';
import { EditTenantModal } from './EditTenantModal';
import { Mail, Phone, MapPin, Edit, Power, Trash2, User as UserIcon, Calendar, Clock } from 'lucide-react';

interface TenantCardProps {
  tenant: User;
  onEdit: (tenant: User) => void;
  onToggleStatus: (tenantId: string) => void;
  onDelete: (tenantId: string) => void;
  landlordProperties: any[];
}

export const TenantCard: React.FC<TenantCardProps> = ({ 
  tenant, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  landlordProperties 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (updatedTenant: User) => {
    onEdit(updatedTenant);
    setIsEditModalOpen(false);
  };

  const getPropertyTitle = (houseNumber: string) => {
    const property = landlordProperties.find(p => p.houseNumber === houseNumber);
    return property ? property.title : 'Unknown Property';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              tenant.isActive ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <UserIcon className={`w-6 h-6 ${
                tenant.isActive ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tenant.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {tenant.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            <span className="truncate">{tenant.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{tenant.phone}</span>
          </div>
          {tenant.houseNumber && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <div>
                <span className="font-medium">{tenant.houseNumber}</span>
                <div className="text-xs text-gray-500">{getPropertyTitle(tenant.houseNumber)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="space-y-1 mb-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Joined {new Date(tenant.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}</span>
          </div>
          {tenant.lastLogin && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>Last login {new Date(tenant.lastLogin).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center justify-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onToggleStatus(tenant.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-center ${
              tenant.isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            <Power className="w-4 h-4 mr-2" />
            {tenant.isActive ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => onDelete(tenant.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTenantModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEdit}
        tenant={tenant}
        landlordProperties={landlordProperties}
      />
    </>
  );
};