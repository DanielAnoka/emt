import React, { useState } from 'react';
import { Notification, NotificationType, NotificationPriority } from '../../types';
import { NotificationCard } from './NotificationCard';
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
  MoreHorizontal
} from 'lucide-react';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '4',
    type: 'payment',
    priority: 'high',
    title: 'Payment Overdue',
    message: 'Your monthly waste management fee of ₦5,000 is now 5 days overdue. Please make payment to avoid service interruption.',
    isRead: false,
    createdAt: '2024-01-25T10:30:00Z',
    metadata: {
      amount: 5000,
      propertyId: 'prop-1',
      dueDate: '2024-01-20',
    },
  },
  {
    id: '2',
    userId: '4',
    type: 'system',
    priority: 'medium',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance will occur on Sunday, February 4th from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.',
    isRead: false,
    createdAt: '2024-01-24T14:15:00Z',
    metadata: {
      maintenanceDate: '2024-02-04',
      duration: '2 hours',
    },
  },
  {
    id: '3',
    userId: '4',
    type: 'success',
    priority: 'low',
    title: 'Payment Confirmed',
    message: 'Your electricity bill payment of ₦15,000 has been successfully processed. Receipt has been sent to your email.',
    isRead: true,
    createdAt: '2024-01-23T09:45:00Z',
    metadata: {
      amount: 15000,
      receiptId: 'RCP-001',
      paymentMethod: 'Bank Transfer',
    },
  },
  {
    id: '4',
    userId: '4',
    type: 'alert',
    priority: 'urgent',
    title: 'Security Alert',
    message: 'Unusual login activity detected from a new device. If this was not you, please contact support immediately.',
    isRead: false,
    createdAt: '2024-01-22T16:20:00Z',
    metadata: {
      ipAddress: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'Lagos, Nigeria',
    },
  },
  {
    id: '5',
    userId: '4',
    type: 'user',
    priority: 'medium',
    title: 'Profile Update Required',
    message: 'Please update your contact information to ensure you receive important notifications about your property.',
    isRead: false,
    createdAt: '2024-01-21T11:00:00Z',
  },
  {
    id: '6',
    userId: '4',
    type: 'property',
    priority: 'low',
    title: 'Maintenance Request Update',
    message: 'Your plumbing maintenance request for Unit B05 has been assigned to our maintenance team and will be addressed within 24 hours.',
    isRead: true,
    createdAt: '2024-01-20T13:30:00Z',
    metadata: {
      requestId: 'MR-001',
      propertyId: 'prop-1',
      assignedTo: 'Maintenance Team A',
    },
  },
  {
    id: '7',
    userId: '4',
    type: 'info',
    priority: 'low',
    title: 'New Feature Available',
    message: 'We\'ve added a new mobile app for easier access to your account. Download it from the App Store or Google Play.',
    isRead: true,
    createdAt: '2024-01-19T08:00:00Z',
  },
  {
    id: '8',
    userId: '4',
    type: 'payment',
    priority: 'medium',
    title: 'Upcoming Payment Due',
    message: 'Your water supply service charge of ₦8,000 is due in 3 days. Set up auto-pay to never miss a payment.',
    isRead: false,
    createdAt: '2024-01-18T12:00:00Z',
    metadata: {
      amount: 8000,
      dueDate: '2024-01-30',
      autoPayAvailable: true,
    },
  },
];

export const NotificationsManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | NotificationType>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | NotificationPriority>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all');

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      setNotifications([]);
    }
  };

  const handleView = (notificationId: string) => {
    // Mark as read when viewing
    handleMarkAsRead(notificationId);
    // In a real app, this might open a detailed view or navigate to relevant section
    console.log('Viewing notification:', notificationId);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 mt-1">Stay updated with important alerts and messages</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleMarkAllAsRead}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </button>
          <button 
            onClick={handleDeleteAll}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors duration-150 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setFilterStatus('unread')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-150"
          >
            <BellRing className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">View Unread ({unreadCount})</span>
          </button>
          
          <button
            onClick={() => setFilterPriority('urgent')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors duration-150"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Urgent ({urgentCount})</span>
          </button>
          
          <button
            onClick={() => setFilterType('payment')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-150"
          >
            <CreditCard className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Payment Alerts</span>
          </button>
          
          <button
            onClick={() => setFilterType('system')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-150"
          >
            <Settings className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">System Updates</span>
          </button>
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
            onDelete={handleDelete}
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

      {/* Notification Settings Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
            <div className="space-y-3">
              {[
                { id: 'payment-reminders', label: 'Payment Reminders', enabled: true },
                { id: 'system-updates', label: 'System Updates', enabled: true },
                { id: 'security-alerts', label: 'Security Alerts', enabled: true },
                { id: 'maintenance-updates', label: 'Maintenance Updates', enabled: false },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{setting.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={setting.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Push Notifications</h4>
            <div className="space-y-3">
              {[
                { id: 'urgent-alerts', label: 'Urgent Alerts', enabled: true },
                { id: 'payment-due', label: 'Payment Due Reminders', enabled: true },
                { id: 'new-messages', label: 'New Messages', enabled: false },
                { id: 'weekly-summary', label: 'Weekly Summary', enabled: false },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{setting.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={setting.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};