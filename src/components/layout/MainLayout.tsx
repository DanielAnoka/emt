import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Dashboard } from '../dashboard/Dashboard';
import { EstateManagement } from '../estates/EstateManagement';
import { PropertyManagement } from '../properties/PropertyManagement';
import { PaymentManagement } from '../payments/PaymentManagement';
import { ChargeManagement } from '../charges/ChargeManagement';
import { UserManagement } from '../users/UserManagement';
import { DefaultersManagement } from '../defaulters/DefaultersManagement';
import { ReportsManagement } from '../reports/ReportsManagement';
import { NotificationsManagement } from '../notifications/NotificationsManagement';

export const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={handleMobileMenuClose}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMobileMenuToggle={handleMobileMenuToggle} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/estates" element={<EstateManagement />} />
              <Route path="/properties" element={<PropertyManagement />} />
              <Route path="/charges" element={<ChargeManagement />} />
              <Route path="/payments" element={<PaymentManagement />} />
              <Route path="/defaulters" element={<DefaultersManagement />} />
              <Route path="/reports" element={<ReportsManagement />} />
              <Route path="/notifications" element={<NotificationsManagement />} />
              <Route path="/compliance" element={
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance & Monitoring</h2>
                  <p className="text-gray-600">Compliance monitoring functionality coming soon...</p>
                </div>
              } />
              <Route path="/search" element={
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Public Search</h2>
                  <p className="text-gray-600">Public search functionality coming soon...</p>
                </div>
              } />
              <Route path="/roles" element={
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Roles & Permissions</h2>
                  <p className="text-gray-600">Role management functionality coming soon...</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                  <p className="text-gray-600">Settings panel coming soon...</p>
                </div>
              } />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};