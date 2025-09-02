import React from 'react';
import { Notification } from '../../types';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  CreditCard, 
  Users, 
  Building,
  Clock,
  X,
  Eye
} from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onView?: (notificationId: string) => void;
}

const typeConfig = {
  payment: { 
    icon: CreditCard, 
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    bgColor: 'bg-blue-50',
    label: 'Payment'
  },
  system: { 
    icon: Bell, 
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    bgColor: 'bg-gray-50',
    label: 'System'
  },
  alert: { 
    icon: AlertTriangle, 
    color: 'text-red-600 bg-red-50 border-red-200',
    bgColor: 'bg-red-50',
    label: 'Alert'
  },
  success: { 
    icon: CheckCircle, 
    color: 'text-green-600 bg-green-50 border-green-200',
    bgColor: 'bg-green-50',
    label: 'Success'
  },
  info: { 
    icon: Info, 
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    bgColor: 'bg-blue-50',
    label: 'Info'
  },
  user: { 
    icon: Users, 
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    bgColor: 'bg-purple-50',
    label: 'User'
  },
  property: { 
    icon: Building, 
    color: 'text-green-600 bg-green-50 border-green-200',
    bgColor: 'bg-green-50',
    label: 'Property'
  },
};

const priorityColors = {
  low: 'border-l-gray-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onView 
}) => {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${priorityColors[notification.priority]} ${
      !notification.isRead ? 'border border-gray-200' : 'border border-gray-100'
    } hover:shadow-md transition-shadow duration-200`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`text-sm font-semibold ${
                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {notification.priority}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className={`text-sm ${
            !notification.isRead ? 'text-gray-800' : 'text-gray-600'
          }`}>
            {notification.message}
          </p>
          
          {notification.metadata && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 space-y-1">
                {notification.metadata.amount && (
                  <div>Amount: ₦{notification.metadata.amount.toLocaleString()}</div>
                )}
                {notification.metadata.propertyId && (
                  <div>Property ID: {notification.metadata.propertyId}</div>
                )}
                {notification.metadata.userId && (
                  <div>User ID: {notification.metadata.userId}</div>
                )}
                {notification.metadata.estateId && (
                  <div>Estate ID: {notification.metadata.estateId}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {!notification.isRead && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-150"
              >
                Mark as read
              </button>
            )}
            {onView && (
              <button
                onClick={() => onView(notification.id)}
                className="text-gray-600 hover:text-gray-800 text-xs font-medium hover:bg-gray-50 px-2 py-1 rounded transition-colors duration-150 flex items-center"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </button>
            )}
          </div>
          
          {onDelete && (
            <button
              onClick={() => onDelete(notification.id)}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};