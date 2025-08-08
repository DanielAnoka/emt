import React, { useState } from 'react';
import { AuthProvider } from './components/auth/AuthProvider';
import { LandingPage } from './components/landing/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { EstateManagement } from './components/estates/EstateManagement';
import { PropertyManagement } from './components/properties/PropertyManagement';
import { PaymentManagement } from './components/payments/PaymentManagement';
import { ChargeManagement } from './components/charges/ChargeManagement';
import { UserManagement } from './components/users/UserManagement';
import { DefaultersManagement } from './components/defaulters/DefaultersManagement';
import { ReportsManagement } from './components/reports/ReportsManagement';
import { useAuth } from './hooks/useAuth';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setActiveTab('dashboard');
    setShowLogin(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  if (!user) {
    if (!showLogin) {
      return <LandingPage onGetStarted={handleGetStarted} />;
    }
    return <LoginForm onSuccess={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'estates':
        return <EstateManagement />;
      case 'properties':
        return <PropertyManagement />;
      case 'charges':
        return <ChargeManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'users':
        return <UserManagement />;
      case 'defaulters':
        return <DefaultersManagement />;
      case 'compliance':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance & Monitoring</h2>
            <p className="text-gray-600">Compliance monitoring functionality coming soon...</p>
          </div>
        );
      case 'search':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Public Search</h2>
            <p className="text-gray-600">Public search functionality coming soon...</p>
          </div>
        );
      case 'reports':
        return <ReportsManagement />;
      case 'notifications':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
            <p className="text-gray-600">Notification system coming soon...</p>
          </div>
        );
      case 'roles':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Roles & Permissions</h2>
            <p className="text-gray-600">Role management functionality coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;