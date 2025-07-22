import React, { useState } from 'react';
import { ServiceCharge } from '../../types';
import { PaymentCard } from './PaymentCard';
import { Search, Filter, Plus, Download, CreditCard } from 'lucide-react';

// Mock data
const mockPayments: ServiceCharge[] = [
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
    userId: '4',
    category: 'light',
    title: 'Electricity Bill',
    amount: 15000,
    duration: 'monthly',
    dueDate: '2024-01-20',
    status: 'paid',
    paymentDate: '2024-01-18',
    receiptUrl: '/receipts/receipt-3.pdf',
    createdBy: '2',
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    userId: '4',
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
    id: '5',
    userId: '4',
    category: 'sanitation',
    title: 'Sanitation Service',
    amount: 3000,
    duration: 'monthly',
    dueDate: '2024-02-25',
    status: 'pending',
    createdBy: '2',
    createdAt: '2024-01-01',
  },
];

export const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<ServiceCharge[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  const handlePay = (paymentId: string) => {
    // In a real app, this would integrate with a payment gateway
    setPayments(prev =>
      prev.map(payment =>
        payment.id === paymentId
          ? {
              ...payment,
              status: 'paid' as const,
              paymentDate: new Date().toISOString(),
              receiptUrl: `/receipts/receipt-${paymentId}.pdf`,
            }
          : payment
      )
    );
  };

  const handleDownloadReceipt = (paymentId: string) => {
    // In a real app, this would download the actual receipt
    console.log('Downloading receipt for payment:', paymentId);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `receipt-${paymentId}.pdf`;
    link.click();
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => {
      const searchMatch = searchTerm === '' || 
        payment.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isOverdue = new Date(payment.dueDate) < new Date() && payment.status !== 'paid';
      const actualStatus = isOverdue ? 'overdue' : payment.status;
      
      const statusMatch = filterStatus === 'all' || actualStatus === filterStatus;
      
      return searchMatch && statusMatch;
    });
  };

  const filteredPayments = getFilteredPayments();
  
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const overdueAmount = filteredPayments
    .filter(p => new Date(p.dueDate) < new Date() && p.status !== 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600 mt-1">Track and manage service charges</p>
        </div>
        <div className="flex space-x-2">
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
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">₦{paidAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">₦{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">₦{overdueAmount.toLocaleString()}</p>
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
              placeholder="Search by service category..."
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
        </div>
      </div>

      {/* Payments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            onPay={handlePay}
            onDownloadReceipt={handleDownloadReceipt}
          />
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};