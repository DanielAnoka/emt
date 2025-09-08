import React, { useState, useEffect } from 'react';
import { Notification, NotificationType, NotificationPriority } from '../../types';
import { NotificationCard } from './NotificationCard';
import { CreateNotificationModal } from './CreateNotificationModal';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  Trash2, 
  Settings,
  BellRing,
  AlertTriangle,
  Info,
  Users,
  CreditCard,
  Building,
  Plus
} from 'lucide-react';

export const NotificationsManagement: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | NotificationType>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | NotificationPriority>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check if user can create notifications
  const canCreateNotifications = user?.role === 'super_admin' || user?.role === 'estate_admin';

  // Check if user can see all notifications
  const canSeeAllNotifications = user?.role === 'super_admin';

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let endpoint = '';

      if (canSeeAllNotifications) {
        // Super admin sees all notifications
        endpoint = '/notifications';
      } else {
        // Estate admin, landlord, tenant see their own notifications
        endpoint = `/notification/${user.id}`;
      }

      const response = await api.get<{ notifications: any[] }>(endpoint);
      
      // Transform backend notifications to frontend format
      const transformedNotifications = response.notifications.map((notif: any) => ({
        id: notif.id.toString(),
        userId: notif.user_id?.toString() || '',
        type: mapBackendTypeToFrontend(notif.type),
        priority: mapBackendPriorityToFrontend(notif.priority || 'medium'),
        title: notif.title,
        message: notif.message,
        isRead: Boolean(notif.is_read),
        createdAt: notif.created_at,
        readAt: notif.read_at,
        metadata: {
          estateId: notif.estate_id?.toString(),
          url: notif.url,
        },
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapBackendTypeToFrontend = (backendType: string): NotificationType => {
    const typeMap: Record<string, NotificationType> = {
      'System Alert': 'system',
      'Payment': 'payment',
      'Alert': 'alert',
      'Success': 'success',
      'Info': 'info',
      'User': 'user',
      'Property': 'property',
    };
    return typeMap[backendType] || 'info';
  };

  const mapBackendPriorityToFrontend = (backendPriority: string): NotificationPriority => {
    const priorityMap: Record<string, NotificationPriority> = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'urgent': 'urgent',
    };
    return priorityMap[backendPriority] || 'medium';
  };

  const handleCreateNotification = async (notificationData: {
    title: string;
    message: string;
    type: string;
    estateId?: string;
    url?: string;
  }) => {
    try {
      const payload: any = {
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        url: notificationData.url || '',
        is_read: 0, // Default to unread
      };

      // Add estate_id only for estate admin
      if (user?.role === 'estate_admin' && notificationData.estateId) {
        payload.estate_id = parseInt(notificationData.estateId);
      }

      await api.post('/notification/create', payload);
      
      // Refresh notifications
      await fetchNotifications();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notification/${notificationId}/read`, {});
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read', {});
      
      setNotifications(prev =>
        prev.map(notification => ({ 
          ...notification, 
          isRead: true, 
          readAt: new Date().toISOString() 
        }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await api.delete(`/notification/${notificationId}`);
      
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      try {
        await api.delete('/notifications');
        setNotifications([]);
      } catch (error) {
        console.error('Failed to delete all notifications:', error);
      }
    }
  };

  const handleView = (notificationId: string) => {
    // Mark as read when viewing
    handleMarkAsRead(notificationId);
    
    // Find notification and navigate to URL if available
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.metadata?.url) {
      window.location.href = notification.metadata.url;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const searchMatch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const typeMatch = filterType === 'all' || notification.type === filterType;
    const priorityMatch = filterPriority === 'all' || notification.priority === filterPriority;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'read' && notification.isRead) ||
      (filterStatus === 'unread' && !notification.isRead);
    
    return searchMatch && typeMatch && priorityMatch && statusMatch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.isRead).length;
  const todayCount = notifications.filter(n => {
    const today = new Date();
    const notificationDate = new Date(n.createdAt);
    return notificationDate.toDateString() === today.toDateString();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 mt-1">
            {canSeeAllNotifications 
              ? 'Manage all system notifications' 
              : 'Stay updated with important alerts and messages'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          {canCreateNotifications && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Notification
            </button>
          )}
          <button 
            onClick={handleMarkAllAsRead}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </button>
          {canSeeAllNotifications && (
            <button 
              onClick={handleDeleteAll}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors duration-150 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BellRing className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">{todayCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="system">System</option>
              <option value="alert">Alert</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
              <option value="user">User</option>
              <option value="property">Property</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-blue-600 font-medium">
            {unreadCount} Unread
          </span>
          <span className="text-red-600 font-medium">
            {urgentCount} Urgent
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
            onDelete={canSeeAllNotifications ? handleDelete : undefined}
            onView={handleView}
          />
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-600">
            {notifications.length === 0 
              ? 'You\'re all caught up! No new notifications.' 
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      )}

      {/* Create Notification Modal */}
      {canCreateNotifications && (
        <CreateNotificationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateNotification}
          userRole={user?.role || 'tenant'}
        />
      )}
    </div>
  );
};