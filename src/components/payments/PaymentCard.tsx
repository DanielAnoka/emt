import React from 'react';
import { ServiceCharge, ServiceCategory } from '../../types';
import { Calendar, CreditCard, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react';

interface PaymentCardProps {
  payment: ServiceCharge;
  onPay?: (paymentId: string) => void;
  onDownloadReceipt?: (paymentId: string) => void;
}

const categoryLabels: Record<ServiceCategory, string> = {
  waste: 'Waste Management',
  water: 'Water Supply',
  light: 'Electricity',
  sanitation: 'Sanitation',
  ground_rent: 'Ground Rent',
  estate_fee: 'Estate Fee',
};

const categoryColors: Record<ServiceCategory, string> = {
  waste: 'bg-green-100 text-green-800',
  water: 'bg-blue-100 text-blue-800',
  light: 'bg-yellow-100 text-yellow-800',
  sanitation: 'bg-purple-100 text-purple-800',
  ground_rent: 'bg-red-100 text-red-800',
  estate_fee: 'bg-gray-100 text-gray-800',
};

const durationLabels = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  one_time: 'One Time',
};

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Pending' },
  paid: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200', label: 'Paid' },
  overdue: { icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200', label: 'Overdue' },
};

export const PaymentCard: React.FC<PaymentCardProps> = ({ 
  payment, 
  onPay, 
  onDownloadReceipt 
}) => {
  const config = statusConfig[payment.status];
  const StatusIcon = config.icon;
  
  const isOverdue = new Date(payment.dueDate) < new Date() && payment.status !== 'paid';
  const actualStatus = isOverdue ? 'overdue' : payment.status;
  const actualConfig = statusConfig[actualStatus];
  const ActualStatusIcon = actualConfig.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{payment.title}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[payment.category]}`}>
              {categoryLabels[payment.category]}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {durationLabels[payment.duration]}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ₦{payment.amount.toLocaleString()}
          </div>
        </div>
        
        <div className={`flex items-center px-3 py-1 rounded-full border ${actualConfig.color}`}>
          <ActualStatusIcon className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{actualConfig.label}</span>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        <span>
          Due: {new Date(payment.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        {isOverdue && (
          <span className="ml-2 text-red-600 font-medium">
            ({Math.ceil((Date.now() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue)
          </span>
        )}
      </div>

      {/* Payment Date (if paid) */}
      {payment.status === 'paid' && payment.paymentDate && (
        <div className="flex items-center text-sm text-green-600 mb-4">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>
            Paid on {new Date(payment.paymentDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        {payment.status !== 'paid' && onPay && (
          <button
            onClick={() => onPay(payment.id)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </button>
        )}
        
        {payment.status === 'paid' && payment.receiptUrl && onDownloadReceipt && (
          <button
            onClick={() => onDownloadReceipt(payment.id)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </button>
        )}

        {payment.status === 'paid' && !payment.receiptUrl && (
          <div className="flex-1 text-center text-sm text-gray-500 py-2">
            Receipt will be available shortly
          </div>
        )}
      </div>
    </div>
  );
};