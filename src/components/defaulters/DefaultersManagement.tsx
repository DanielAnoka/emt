import React, { useState } from 'react';
import { DefaulterRecord } from '../../types';
import { DefaulterCard } from './DefaulterCard';
import { Search, Filter, Download, AlertTriangle, Clock, DollarSign } from 'lucide-react';

// Mock data
const mockDefaulters: DefaulterRecord[] = [
  {
    id: '1',
    userId: '4',
    userName: 'Lisa Tenant',
    userEmail: 'lisa@email.com',
    houseNumber: 'B05',
    estateName: 'Westpoint Estate',
    chargeTitle: 'Monthly Waste Management',
    amount: 5000,
    dueDate: '2024-01-15',
    daysPastDue: 15,
    category: 'waste',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Mike Landlord',
    userEmail: 'mike@email.com',
    houseNumber: 'A12',
    estateName: 'Westpoint Estate',
    chargeTitle: 'Water Supply Service',
    amount: 8000,
    dueDate: '2024-01-10',
    daysPastDue: 20,
    category: 'water',
  },
  {
    id: '3',
    userId: '5',
    userName: 'James Caretaker',
    userEmail: 'james@estate.com',
    houseNumber: 'C08',
    estateName: 'Westpoint Estate',
    chargeTitle: 'Electricity Bill',
    amount: 15000,
    dueDate: '2024-01-05',
    daysPastDue: 25,
    category: 'light',
  },
  {
    id: '4',
    userId: '6',
    userName: 'John Smith',
    userEmail: 'john@email.com',
    houseNumber: 'D12',
    estateName: 'Garden City Estate',
    chargeTitle: 'Ground Rent',
    amount: 120000,
    dueDate: '2023-12-01',
    daysPastDue: 60,
    category: 'ground_rent',
  },
];

export const DefaultersManagement: React.FC = () => {
  const [defaulters, setDefaulters] = useState<DefaulterRecord[]>(mockDefaulters);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstate, setFilterEstate] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleSendReminder = (defaulterId: string) => {
    // In a real app, this would send an email/SMS reminder
    console.log('Sending reminder to defaulter:', defaulterId);
    // Show success message
    alert('Reminder sent successfully!');
  };

  const handleMarkPaid = (defaulterId: string) => {
    // Remove from defaulters list when marked as paid
    setDefaulters(prev => prev.filter(d => d.id !== defaulterId));
  };

  const filteredDefaulters = defaulters.filter(defaulter => {
    const searchMatch = searchTerm === '' || 
      defaulter.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defaulter.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defaulter.houseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const estateMatch = filterEstate === 'all' || defaulter.estateName === filterEstate;
    const categoryMatch = filterCategory === 'all' || defaulter.category === filterCategory;
    
    return searchMatch && estateMatch && categoryMatch;
  });

  const totalDefaulters = filteredDefaulters.length;
  const totalAmount = filteredDefaulters.reduce((sum, d) => sum + d.amount, 0);
  const avgDaysPastDue = filteredDefaulters.length > 0 
    ? Math.round(filteredDefaulters.reduce((sum, d) => sum + d.daysPastDue, 0) / filteredDefaulters.length)
    : 0;

  const uniqueEstates = [...new Set(defaulters.map(d => d.estateName))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Defaulters</h2>
          <p className="text-gray-600 mt-1">Track and manage overdue payments</p>
        </div>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Defaulters</p>
              <p className="text-2xl font-bold text-red-600">{totalDefaulters}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount Due</p>
              <p className="text-2xl font-bold text-red-600">₦{totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Days Overdue</p>
              <p className="text-2xl font-bold text-orange-600">{avgDaysPastDue}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
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
              placeholder="Search by name, email, or house number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterEstate}
              onChange={(e) => setFilterEstate(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Estates</option>
              {uniqueEstates.map(estate => (
                <option key={estate} value={estate}>{estate}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              <option value="waste">Waste Management</option>
              <option value="water">Water Supply</option>
              <option value="light">Electricity</option>
              <option value="sanitation">Sanitation</option>
              <option value="ground_rent">Ground Rent</option>
              <option value="estate_fee">Estate Fee</option>
            </select>
          </div>
        </div>
      </div>

      {/* Defaulters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDefaulters.map((defaulter) => (
          <DefaulterCard
            key={defaulter.id}
            defaulter={defaulter}
            onSendReminder={handleSendReminder}
            onMarkPaid={handleMarkPaid}
          />
        ))}
      </div>

      {filteredDefaulters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No defaulters found</h3>
          <p className="text-gray-600">
            {defaulters.length === 0 
              ? 'All payments are up to date!' 
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      )}
    </div>
  );
};