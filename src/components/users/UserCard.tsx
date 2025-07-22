import React from 'react';
import { User } from '../../types';
import { Mail, Phone, MapPin, Edit, Power, Trash2, User as UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onToggleStatus?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  canEdit?: boolean;
}

const roleLabels = {
  super_admin: 'Super Admin',
  estate_admin: 'Estate Admin',
  landlord: 'Landlord',
  tenant: 'Tenant',
  caretaker: 'Caretaker',
  agent: 'Agent',
};

const roleColors = {
  super_admin: 'bg-purple-100 text-purple-800',
  estate_admin: 'bg-blue-100 text-blue-800',
  landlord: 'bg-green-100 text-green-800',
  tenant: 'bg-yellow-100 text-yellow-800',
  caretaker: 'bg-orange-100 text-orange-800',
  agent: 'bg-gray-100 text-gray-800',
};

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  canEdit = false 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            user.isActive ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <UserIcon className={`w-6 h-6 ${
              user.isActive ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
          </div>
        </div>
        
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          <span>{user.phone}</span>
        </div>
        {user.houseNumber && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>House {user.houseNumber}</span>
          </div>
        )}
      </div>

      {/* Created Date */}
      <div className="text-xs text-gray-500 mb-4">
        Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>

      {/* Actions */}
      {canEdit && (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit?.(user)}
            className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center justify-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onToggleStatus?.(user.id)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-center ${
              user.isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            <Power className="w-4 h-4 mr-2" />
            {user.isActive ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => onDelete?.(user.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};