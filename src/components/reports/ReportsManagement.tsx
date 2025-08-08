/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building, 
  AlertTriangle,
  FileText,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

// Mock data for reports
const monthlyRevenue = [
  { month: 'Jan', revenue: 2400000, expenses: 800000, profit: 1600000 },
  { month: 'Feb', revenue: 2800000, expenses: 900000, profit: 1900000 },
  { month: 'Mar', revenue: 3200000, expenses: 1000000, profit: 2200000 },
  { month: 'Apr', revenue: 2900000, expenses: 950000, profit: 1950000 },
  { month: 'May', revenue: 3500000, expenses: 1100000, profit: 2400000 },
  { month: 'Jun', revenue: 3800000, expenses: 1200000, profit: 2600000 },
];

const propertyTypeDistribution = [
  { name: 'Apartments', value: 45, color: '#3b82f6' },
  { name: 'Houses', value: 30, color: '#10b981' },
  { name: 'Flats', value: 25, color: '#f59e0b' },
];

const paymentStatus = [
  { name: 'Paid', value: 78, color: '#10b981' },
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Overdue', value: 7, color: '#ef4444' },
];

const occupancyTrends = [
  { month: 'Jan', occupied: 85, vacant: 15 },
  { month: 'Feb', occupied: 87, vacant: 13 },
  { month: 'Mar', occupied: 89, vacant: 11 },
  { month: 'Apr', occupied: 91, vacant: 9 },
  { month: 'May', occupied: 88, vacant: 12 },
  { month: 'Jun', occupied: 92, vacant: 8 },
];

const topPerformingEstates = [
  { name: 'Westpoint Estate', revenue: 1200000, occupancy: 95, properties: 45 },
  { name: 'Garden City Estate', revenue: 980000, occupancy: 88, properties: 38 },
  { name: 'Royal Gardens', revenue: 850000, occupancy: 92, properties: 32 },
  { name: 'Victoria Island Estate', revenue: 750000, occupancy: 85, properties: 28 },
  { name: 'Lekki Phase 1', revenue: 680000, occupancy: 90, properties: 25 },
];

const defaultersByCategory = [
  { category: 'Waste Management', count: 12, amount: 60000 },
  { category: 'Water Supply', count: 8, amount: 64000 },
  { category: 'Electricity', count: 15, amount: 225000 },
  { category: 'Ground Rent', count: 3, amount: 360000 },
  { category: 'Estate Fee', count: 5, amount: 125000 },
];

export const ReportsManagement: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');

  const handleExportReport = (reportType: string) => {
    // In a real app, this would generate and download the actual report
    console.log(`Exporting ${reportType} report for period: ${selectedPeriod}`);
    
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${reportType}-report-${selectedPeriod}.pdf`;
    link.click();
  };

  const ReportCard: React.FC<{
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-sm mt-1 flex items-center ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${changeType === 'negative' ? 'rotate-180' : ''}`} />
            {change}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button 
            onClick={() => handleExportReport('comprehensive')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title="Total Revenue"
          value="₦18.6M"
          change="+12.5% from last period"
          changeType="positive"
          icon={DollarSign}
          color="bg-green-500"
        />
        <ReportCard
          title="Active Properties"
          value="248"
          change="+8 new properties"
          changeType="positive"
          icon={Building}
          color="bg-blue-500"
        />
        <ReportCard
          title="Total Users"
          value="1,234"
          change="+15.2% growth"
          changeType="positive"
          icon={Users}
          color="bg-purple-500"
        />
        <ReportCard
          title="Outstanding Payments"
          value="₦834K"
          change="-5.8% from last month"
          changeType="positive"
          icon={AlertTriangle}
          color="bg-orange-500"
        />
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'financial', name: 'Financial', icon: DollarSign },
              { id: 'properties', name: 'Properties', icon: Building },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'defaulters', name: 'Defaulters', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedReport === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedReport(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {selectedReport === 'overview' && (
            <div className="space-y-8">
              {/* Revenue Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Profit Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number) => [`₦${(value / 1000000).toFixed(1)}M`, '']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        name="Revenue"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stackId="2"
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Profit"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Property Distribution and Payment Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Type Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={propertyTypeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {propertyTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {propertyTypeDistribution.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {paymentStatus.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'financial' && (
            <div className="space-y-8">
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Total Revenue</h4>
                  <p className="text-2xl font-bold text-green-900">₦18,600,000</p>
                  <p className="text-sm text-green-600 mt-1">+12.5% from last period</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Total Expenses</h4>
                  <p className="text-2xl font-bold text-blue-900">₦5,950,000</p>
                  <p className="text-sm text-blue-600 mt-1">+8.2% from last period</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Net Profit</h4>
                  <p className="text-2xl font-bold text-purple-900">₦12,650,000</p>
                  <p className="text-sm text-purple-600 mt-1">+15.1% from last period</p>
                </div>
              </div>

              {/* Revenue vs Expenses Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number) => [`₦${(value / 1000000).toFixed(1)}M`, '']}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'properties' && (
            <div className="space-y-8">
              {/* Occupancy Trends */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={occupancyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: number) => [`${value}%`, '']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="occupied" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        name="Occupied"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vacant" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                        name="Vacant"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performing Estates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Estates</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estate Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Occupancy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Properties
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topPerformingEstates.map((estate, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {estate.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{estate.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${estate.occupancy}%` }}
                                />
                              </div>
                              <span>{estate.occupancy}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {estate.properties}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'users' && (
            <div className="space-y-8">
              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Total Users</h4>
                  <p className="text-2xl font-bold text-blue-900">1,234</p>
                  <p className="text-sm text-blue-600 mt-1">+15.2% growth</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Active Users</h4>
                  <p className="text-2xl font-bold text-green-900">1,156</p>
                  <p className="text-sm text-green-600 mt-1">93.7% active rate</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">New This Month</h4>
                  <p className="text-2xl font-bold text-yellow-900">89</p>
                  <p className="text-sm text-yellow-600 mt-1">+12 from last month</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Landlords</h4>
                  <p className="text-2xl font-bold text-purple-900">156</p>
                  <p className="text-sm text-purple-600 mt-1">12.6% of total users</p>
                </div>
              </div>

              {/* User Role Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Role Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { role: 'Tenants', count: 856, percentage: 69.4, color: 'bg-blue-500' },
                    { role: 'Landlords', count: 156, percentage: 12.6, color: 'bg-green-500' },
                    { role: 'Caretakers', count: 89, percentage: 7.2, color: 'bg-yellow-500' },
                    { role: 'Agents', count: 67, percentage: 5.4, color: 'bg-purple-500' },
                    { role: 'Estate Admins', count: 45, percentage: 3.6, color: 'bg-red-500' },
                    { role: 'Super Admins', count: 21, percentage: 1.7, color: 'bg-gray-500' },
                  ].map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{item.role}</span>
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'defaulters' && (
            <div className="space-y-8">
              {/* Defaulter Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Total Defaulters</h4>
                  <p className="text-2xl font-bold text-red-900">43</p>
                  <p className="text-sm text-red-600 mt-1">3.5% of all users</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-orange-800 mb-2">Outstanding Amount</h4>
                  <p className="text-2xl font-bold text-orange-900">₦834,000</p>
                  <p className="text-sm text-orange-600 mt-1">-5.8% from last month</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Avg Days Overdue</h4>
                  <p className="text-2xl font-bold text-yellow-900">18</p>
                  <p className="text-sm text-yellow-600 mt-1">2 days less than last month</p>
                </div>
              </div>

              {/* Defaulters by Category */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Defaulters by Service Category</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {defaultersByCategory.map((category, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₦{category.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                              Send Reminders
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Financial Report', description: 'Revenue, expenses, and profit analysis', type: 'financial' },
            { name: 'Property Report', description: 'Occupancy rates and property performance', type: 'property' },
            { name: 'User Report', description: 'User statistics and role distribution', type: 'user' },
            { name: 'Defaulter Report', description: 'Outstanding payments and overdue analysis', type: 'defaulter' },
          ].map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-150">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <button
                  onClick={() => handleExportReport(report.type)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Export
                </button>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
              <p className="text-sm text-gray-600">{report.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};