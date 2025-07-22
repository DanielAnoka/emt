import React, { useState } from 'react';
import { ServiceCharge, ServiceCategory } from '../../types';
import { ChargeCard } from './ChargeCard';
import { AddChargeModal } from './AddChargeModal';
import { Search, Filter, Plus, Download, CreditCard, Users } from 'lucide-react';

// Mock data
const mockCharges: ServiceCharge[] = [
  {
    id: '1',
    userId: '4',
    category: 'waste',
    title: 'Monthly Waste Management',
    amount: 5000,
    duration: 'monthly',
    dueDate: '2024-02-15',
    status: 'pending',
    createdBy: '2',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    userId: '4',
    category: 'water',
    title: 'Water Supply Service',
    amount: 8000,
    duration: 'monthly',
    dueDate: '2024-02-10',
    status: 'overdue',
    createdBy: '2',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    userId: '3',
    category: 'ground_rent',
    title: 'Annual Ground Rent',
    amount: 120000,
    duration: 'yearly',
    dueDate: '2024-06-01',
    status: 'pending',
    createdBy: '1',
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    userId: '4',
    category: 'estate_fee',
    title: 'Security Upgrade Fee',
    amount: 25000,
    duration: 'one_time',
    dueDate: '2024-03-01',
    status: 'pending',
    createdBy: '2',
    createdAt: '2024-01-15',
  },
];

export const ChargeManagement: React.FC = () => {
  const [charges, setCharges] = useState<ServiceCharge[]>(mockCharges);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [filterDuration, setFilterDuration] = useState<'all' | 'monthly' | 'yearly' | 'one_time'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddCharge = (chargeData: Omit<ServiceCharge, 'id' | 'status' | 'createdBy' | 'createdAt'>) => {
    const newCharge: ServiceCharge = {
      ...chargeData,
      id: Date.now().toString(),
      status: 'pending',
      createdBy: '1', // Current user ID
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setCharges(prev => [newCharge, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeleteCharge = (chargeId: string) => {
    if (window.confirm('Are you sure you want to delete this charge?')) {
      setCharges(prev => prev.filter(charge => charge.id !== chargeId));
    }
  };

  const handleToggleCharge = (chargeId: string) => {
    setCharges(prev => prev.map(charge => 
      charge.id === chargeId 
        ? { ...charge, isActive: !charge.isActive }
        : charge
    ));
  };

  const getFilteredCharges = () => {
    return charges.filter(charge => {
      const searchMatch = searchTerm === '' || 
        charge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        charge.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isOverdue = new Date(charge.dueDate) < new Date() && charge.status !== 'paid';
      const actualStatus = isOverdue ? 'overdue' : charge.status;
      
      const statusMatch = filterStatus === 'all' || actualStatus === filterStatus;
      const durationMatch = filterDuration === 'all' || charge.duration === filterDuration;
      
      return searchMatch && statusMatch && durationMatch;
    });
  };

  const filteredCharges = getFilteredCharges();
  
  const totalCharges = filteredCharges.length;
  const pendingCharges = filteredCharges.filter(c => c.status === 'pending').length;
  const paidCharges = filteredCharges.filter(c => c.status === 'paid').length;
  const overdueCharges = filteredCharges.filter(c => 
    new Date(c.dueDate) < new Date() && c.status !== 'paid'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Charge Management</h2>
          <p className="text-gray-600 mt-1">Create and manage service charges for residents</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Charge
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Charges</p>
              <p className="text-2xl font-bold text-gray-900">{totalCharges}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCharges}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">{paidCharges}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueCharges}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
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
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterDuration}
              onChange={(e) => setFilterDuration(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Duration</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharges.map((charge) => (
          <ChargeCard
            key={charge.id}
            charge={charge}
            onDelete={handleDeleteCharge}
            onToggle={handleToggleCharge}
          />
        ))}
      </div>

      {filteredCharges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No charges found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Charge Modal */}
      <AddChargeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCharge}
      />
    </div>
  );
};