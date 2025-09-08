import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Building,
  Users,
  CreditCard
} from 'lucide-react';

interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string;
  category: 'general' | 'notifications' | 'security' | 'payment' | 'estate';
  type: 'text' | 'number' | 'boolean' | 'email' | 'password' | 'textarea';
  isPublic: boolean;
}

export const SettingsManagement: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [changes, setChanges] = useState<Record<string, string>>({});

  // Check if user can manage settings
  const canManageSettings = user?.role === 'super_admin';
  const canManageEstateSettings = user?.role === 'estate_admin';

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let endpoint = '';

      if (canManageSettings) {
        // Super admin sees all settings
        endpoint = '/settings';
      } else if (canManageEstateSettings) {
        // Estate admin sees estate-specific settings
        endpoint = `/settings/${user.id}`;
      } else {
        // Other users see limited settings
        endpoint = `/settings/${user.id}`;
      }

      const response = await api.get<{ settings: any[] }>(endpoint);
      
      // Transform backend settings to frontend format
      const transformedSettings = response.settings.map((setting: any) => ({
        id: setting.id.toString(),
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category || 'general',
        type: setting.type || 'text',
        isPublic: Boolean(setting.is_public),
      }));

      setSettings(transformedSettings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Load default settings if API fails
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSettings = (): SystemSettings[] => {
    const baseSettings = [
      // General Settings
      {
        id: '1',
        key: 'site_name',
        value: 'EstateHub',
        description: 'The name of your estate management system',
        category: 'general' as const,
        type: 'text' as const,
        isPublic: true,
      },
      {
        id: '2',
        key: 'site_description',
        value: 'Modern estate management made simple',
        description: 'A brief description of your platform',
        category: 'general' as const,
        type: 'textarea' as const,
        isPublic: true,
      },
      {
        id: '3',
        key: 'contact_email',
        value: 'admin@estatehub.com',
        description: 'Primary contact email for the system',
        category: 'general' as const,
        type: 'email' as const,
        isPublic: true,
      },
      {
        id: '4',
        key: 'support_phone',
        value: '+234-123-456-7890',
        description: 'Support phone number',
        category: 'general' as const,
        type: 'text' as const,
        isPublic: true,
      },

      // Notification Settings
      {
        id: '5',
        key: 'email_notifications',
        value: 'true',
        description: 'Enable email notifications',
        category: 'notifications' as const,
        type: 'boolean' as const,
        isPublic: false,
      },
      {
        id: '6',
        key: 'sms_notifications',
        value: 'false',
        description: 'Enable SMS notifications',
        category: 'notifications' as const,
        type: 'boolean' as const,
        isPublic: false,
      },
      {
        id: '7',
        key: 'notification_frequency',
        value: 'daily',
        description: 'How often to send notification summaries',
        category: 'notifications' as const,
        type: 'text' as const,
        isPublic: false,
      },

      // Security Settings
      {
        id: '8',
        key: 'password_min_length',
        value: '8',
        description: 'Minimum password length',
        category: 'security' as const,
        type: 'number' as const,
        isPublic: false,
      },
      {
        id: '9',
        key: 'session_timeout',
        value: '1440',
        description: 'Session timeout in minutes',
        category: 'security' as const,
        type: 'number' as const,
        isPublic: false,
      },
      {
        id: '10',
        key: 'two_factor_auth',
        value: 'false',
        description: 'Enable two-factor authentication',
        category: 'security' as const,
        type: 'boolean' as const,
        isPublic: false,
      },

      // Payment Settings
      {
        id: '11',
        key: 'payment_gateway',
        value: 'stripe',
        description: 'Default payment gateway',
        category: 'payment' as const,
        type: 'text' as const,
        isPublic: false,
      },
      {
        id: '12',
        key: 'currency',
        value: 'NGN',
        description: 'Default currency',
        category: 'payment' as const,
        type: 'text' as const,
        isPublic: true,
      },
      {
        id: '13',
        key: 'payment_due_days',
        value: '30',
        description: 'Default payment due period in days',
        category: 'payment' as const,
        type: 'number' as const,
        isPublic: false,
      },
    ];

    // Add estate-specific settings for estate admin
    if (canManageEstateSettings) {
      baseSettings.push(
        {
          id: '14',
          key: 'estate_name',
          value: 'My Estate',
          description: 'Name of your estate',
          category: 'estate' as const,
          type: 'text' as const,
          isPublic: true,
        },
        {
          id: '15',
          key: 'estate_address',
          value: '',
          description: 'Estate address',
          category: 'estate' as const,
          type: 'textarea' as const,
          isPublic: true,
        },
        {
          id: '16',
          key: 'estate_units',
          value: '100',
          description: 'Total number of units in the estate',
          category: 'estate' as const,
          type: 'number' as const,
          isPublic: false,
        }
      );
    }

    return baseSettings;
  };

  const handleSettingChange = (settingId: string, value: string) => {
    setChanges(prev => ({ ...prev, [settingId]: value }));
  };

  const handleSaveSettings = async () => {
    if (Object.keys(changes).length === 0) return;

    try {
      setSaving(true);
      
      // Prepare settings data for API
      const settingsToUpdate = Object.entries(changes).map(([settingId, value]) => {
        const setting = settings.find(s => s.id === settingId);
        return {
          id: settingId,
          key: setting?.key,
          value,
        };
      });

      await api.post('/settings/update', { settings: settingsToUpdate });
      
      // Update local state
      setSettings(prev => 
        prev.map(setting => ({
          ...setting,
          value: changes[setting.id] || setting.value,
        }))
      );
      
      setChanges({});
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (settingId: string) => {
    setShowPasswords(prev => ({ ...prev, [settingId]: !prev[settingId] }));
  };

  const categories = [
    { id: 'general', name: 'General', icon: Globe, color: 'text-blue-600 bg-blue-100' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-green-600 bg-green-100' },
    { id: 'security', name: 'Security', icon: Shield, color: 'text-red-600 bg-red-100' },
    { id: 'payment', name: 'Payment', icon: CreditCard, color: 'text-purple-600 bg-purple-100' },
    ...(canManageEstateSettings ? [
      { id: 'estate', name: 'Estate', icon: Building, color: 'text-orange-600 bg-orange-100' }
    ] : []),
  ];

  const filteredSettings = settings.filter(setting => {
    if (activeCategory === 'all') return true;
    return setting.category === activeCategory;
  });

  const renderSettingInput = (setting: SystemSettings) => {
    const currentValue = changes[setting.id] !== undefined ? changes[setting.id] : setting.value;
    const isPassword = setting.type === 'password';
    const showPassword = showPasswords[setting.id];

    switch (setting.type) {
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue === 'true'}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked ? 'true' : 'false')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );

      case 'textarea':
        return (
          <textarea
            value={currentValue}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(setting.id)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        );

      default:
        return (
          <input
            type={setting.type}
            value={currentValue}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canManageSettings && !canManageEstateSettings) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600">You don't have permission to access system settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">
            {canManageSettings 
              ? 'Manage system-wide settings and configurations' 
              : 'Manage your estate settings and preferences'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={fetchSettings}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button 
            onClick={handleSaveSettings}
            disabled={Object.keys(changes).length === 0 || saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Changes Indicator */}
      {Object.keys(changes).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <p className="text-yellow-800 text-sm">
              You have {Object.keys(changes).length} unsaved change{Object.keys(changes).length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <nav className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      isActive ? category.color : 'text-gray-400 bg-gray-100'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {category.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {activeCategory} Settings
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure {activeCategory} related options and preferences
              </p>
            </div>

            <div className="p-6 space-y-6">
              {filteredSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    {!setting.isPublic && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Private
                      </span>
                    )}
                  </div>
                  
                  {renderSettingInput(setting)}
                  
                  {setting.description && (
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  )}
                </div>
              ))}

              {filteredSettings.length === 0 && (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
                  <p className="text-gray-600">No settings available for this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};