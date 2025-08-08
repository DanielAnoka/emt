import React, { useState } from 'react';
import { Estate, User } from '../../types';
import { X, Users, Building, MapPin, Plus, Key, Mail, Phone } from 'lucide-react';
import { AddTenantToEstateModal } from './AddTenantToEstateModal';
import { GenerateLoginModal } from './GenerateLoginModal';

interface EstateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate: Estate;
}

// Mock tenants data for the estate
const mockTenants: User[] = [
  {
    id: '4',
    name: 'Lisa Tenant',
    email: 'lisa@email.com',
    phone: '+234-123-456-7893',
    role: 'tenant',
    houseNumber: 'B05',
    estateId: 'estate-1',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '6',
    name: 'John Smith',
    email: 'john@email.com',
    phone: '+234-123-456-7895',
    role: 'tenant',
    houseNumber: 'A12',
    estateId: 'estate-1',
    isActive: true,
    createdAt: '2024-01-06T00:00:00Z',
  },
  {
    id: '7',
    name: 'Mary Johnson',
    email: 'mary@email.com',
    phone: '+234-123-456-7896',
    role: 'tenant',
    houseNumber: 'C08',
    estateId: 'estate-1',
    isActive: true,
    createdAt: '2024-01-08T00:00:00Z',
  },
];

export const EstateDetailsModal: React.FC<EstateDetailsModalProps> = ({ isOpen, onClose, estate }) => {
  const [tenants, setTenants] = useState<User[]>(mockTenants);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [selectedUserForLogin, setSelectedUserForLogin] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants'>('overview');

  const handleAddTenant = (tenantData: Omit<User, 'id' | 'createdAt'>) => {
    const newTenant: User = {
      ...tenantData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      estateId: estate.id,
    };
    setTenants(prev => [newTenant, ...prev]);
    setIsAddTenantModalOpen(false);
  };

  const handleGenerateLogin = (user: User) => {
    setSelectedUserForLogin(user);
  };

  if (!isOpen) return null;

  const occupancyRate = Math.round((estate.occupiedUnits / estate.totalUnits) * 100);
  const vacantUnits = estate.totalUnits - estate.occupiedUnits;
  const estateTenants = tenants.filter(tenant => tenant.estateId === estate.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{estate.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{estate.address}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: Building },
              { id: 'tenants', name: 'Tenants', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                  {tab.id === 'tenants' && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {estateTenants.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Units</p>
                      <p className="text-2xl font-bold text-blue-900">{estate.totalUnits}</p>
                    </div>
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Occupied Units</p>
                      <p className="text-2xl font-bold text-green-900">{estate.occupiedUnits}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Vacant Units</p>
                      <p className="text-2xl font-bold text-orange-900">{vacantUnits}</p>
                    </div>
                    <Building className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Occupancy Rate */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Rate</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Occupancy</span>
                  <span className="text-lg font-bold text-gray-900">{occupancyRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{vacantUnits} units vacant</span>
                  <span>{estate.occupiedUnits} units occupied</span>
                </div>
              </div>

              {/* Estate Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estate Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{estate.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Estate ID: {estate.id}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Admin ID: {estate.adminId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Estate Tenants ({estateTenants.length})
                </h3>
                <button
                  onClick={() => setIsAddTenantModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tenant
                </button>
              </div>

              {/* Tenants List */}
              <div className="space-y-4">
                {estateTenants.map((tenant) => (
                  <div key={tenant.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{tenant.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {tenant.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {tenant.phone}
                            </div>
                            {tenant.houseNumber && (
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                Unit {tenant.houseNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tenant.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tenant.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => handleGenerateLogin(tenant)}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center"
                        >
                          <Key className="w-4 h-4 mr-1" />
                          Generate Login
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {estateTenants.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
                  <p className="text-gray-600">Add tenants to this estate to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Tenant Modal */}
      <AddTenantToEstateModal
        isOpen={isAddTenantModalOpen}
        onClose={() => setIsAddTenantModalOpen(false)}
        onAdd={handleAddTenant}
        estate={estate}
      />

      {/* Generate Login Modal */}
      {selectedUserForLogin && (
        <GenerateLoginModal
          isOpen={true}
          onClose={() => setSelectedUserForLogin(null)}
          user={selectedUserForLogin}
        />
      )}
    </div>
  );
};