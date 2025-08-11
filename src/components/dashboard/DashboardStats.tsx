/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Users, 
  Building, 
  CreditCard, 
  TrendingUp, 
  Home,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  trend?: string;
  trendDirection?: 'up' | 'down';
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection, 
  color 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    red: 'bg-red-100 text-red-600 border-red-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 flex items-center ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { title: 'Total Users', value: '1,234', icon: Users, trend: '+12% from last month', trendDirection: 'up' as const, color: 'blue' as const },
          { title: 'Active Estates', value: '45', icon: Building, trend: '+3 new estates', trendDirection: 'up' as const, color: 'green' as const },
          { title: 'Monthly Revenue', value: '₦2.4M', icon: CreditCard, trend: '+8% from last month', trendDirection: 'up' as const, color: 'purple' as const },
          { title: 'System Alerts', value: '7', icon: AlertTriangle, trend: '3 resolved today', trendDirection: 'down' as const, color: 'red' as const },
        ];
      
      case 'estate_admin':
        return [
          { title: 'Total Residents', value: '156', icon: Users, trend: '+8 new residents', trendDirection: 'up' as const, color: 'blue' as const },
          { title: 'Occupied Units', value: '89', icon: Home, trend: '85% occupancy', trendDirection: 'up' as const, color: 'green' as const },
          { title: 'Monthly Collections', value: '₦345K', icon: CreditCard, trend: '+5% from last month', trendDirection: 'up' as const, color: 'purple' as const },
          { title: 'Pending Approvals', value: '12', icon: Clock, trend: '4 processed today', trendDirection: 'down' as const, color: 'yellow' as const },
        ];
      
      case 'landlord':
        return [
          { title: 'My Properties', value: '3', icon: Building, trend: '1 newly listed', trendDirection: 'up' as const, color: 'blue' as const },
          { title: 'Occupied Units', value: '2', icon: Home, trend: '67% occupancy', trendDirection: 'up' as const, color: 'green' as const },
          { title: 'Monthly Income', value: '₦45K', icon: CreditCard, trend: 'On time payments', trendDirection: 'up' as const, color: 'purple' as const },
          { title: 'Pending Charges', value: '₦8,500', icon: AlertTriangle, trend: 'Due in 5 days', trendDirection: 'down' as const, color: 'red' as const },
        ];
      
      case 'tenant':
        return [
          { title: 'Current Rent', value: '₦25K', icon: Home, trend: 'Paid this month', trendDirection: 'up' as const, color: 'green' as const },
          { title: 'Service Charges', value: '₦12K', icon: CreditCard, trend: 'Due in 10 days', trendDirection: 'down' as const, color: 'yellow' as const },
          { title: 'Payment History', value: '100%', icon: CheckCircle, trend: 'Always on time', trendDirection: 'up' as const, color: 'blue' as const },
          { title: 'Outstanding', value: '₦0', icon: AlertTriangle, trend: 'All cleared', trendDirection: 'up' as const, color: 'green' as const },
        ];
      
      default:
        return [
          { title: 'Dashboard', value: '1', icon: Home, color: 'blue' as const },
          { title: 'Active', value: '✓', icon: CheckCircle, color: 'green' as const },
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};