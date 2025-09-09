import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { TenantCard } from './TenantCard';
import { AddTenantModal } from './AddTenantModal';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';
import { Search, Filter, Plus, Users, UserCheck, UserX, Building } from 'lucide-react';

export const TenantManagement: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Get landlord's properties for filtering
  const [landlordProperties, setLandlordProperties] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'landlord') {
      fetchTenants();
      fetchLandlordProperties();
    }
  }, [user]);

  const fetchTenants = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Fetch tenants for this landlord
      const response = await api.get<{ tenants: any[] }>(`/landlord/${user.id}/tenants`);
      
      // Transform backend tenants to frontend format
      const transformedTenants = response.tenants.map((tenant: any) => ({
        id: tenant.id.toString(),
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone_number || '',
        role: 'tenant' as const,
        houseNumber: tenant.house_number,
        estateId: tenant.estate_id?.toString(),
        isActive: Boolean(tenant.is_active),
        createdAt: tenant.created_at,
        lastLogin: tenant.last_login,
      }));

      setTenants(transformedTenants);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      // Load mock data if API fails
      setTenants(getMockTenants());
    } finally {
      setLoading(false);
    }
  };

  const fetchLandlordProperties = async () => {
    if (!user) return;

    try {
      // Fetch properties owned by this landlord
      const response = await api.get<{ properties: any[] }>(`/landlord/${user.id}/properties`);
      setLandlordProperties(response.properties);
    } catch (error) {
      console.error('Failed to fetch landlord properties:', error);
      // Mock properties for demo
      setLandlordProperties([
        { id: '1', title: '3 Bedroom Apartment', houseNumber: 'A12' },
        { id: '2', title: '2 Bedroom Flat', houseNumber: 'B05' },
        { id: '3', title: '4 Bedroom House', houseNumber: 'C15' },
      ]);
    }
  };

  const getMockTenants = (): User[] => [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+234-123-456-7890',
      role: 'tenant',
      houseNumber: 'A12',
      estateId: 'estate-1',
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      lastLogin: '2024-01-20T10:30:00Z',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+234-123-456-7891',
      role: 'tenant',
      houseNumber: 'B05',
      estateId: 'estate-1',
      isActive: true,
      createdAt: '2024-01-10T00:00:00Z',
      lastLogin: '2024-01-19T14:15:00Z',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+234-123-456-7892',
      role: 'tenant',
      houseNumber: 'C15',
      isActive: false,
      createdAt: '2024-01-05T00:00:00Z',
      lastLogin: '2024-01-18T09:45:00Z',
    },
  ];

  const handleAddTenant = async (tenantData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const payload = {
        name: tenantData.name,
        email: tenantData.email,
        phone_number: tenantData.phone,
        house_number: tenantData.houseNumber,
        estate_id: tenantData.estateId ? parseInt(tenantData.estateId) : null,
        landlord_id: user?.id,
        is_active: tenantData.isActive ? 1 : 0,
      };

      await api.post('/tenant/create', payload);
      
      // Refresh tenants list
      await fetchTenants();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add tenant:', error);
      
      // Fallback: Add to local state for demo
      const newTenant: User = {
        ...tenantData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        role: 'tenant',
      };
      setTenants(prev => [newTenant, ...prev]);
      setIsAddModalOpen(false);
    }
  };

  const handleEditTenant = async (tenantData: User) => {
    try {
      const payload = {
        name: tenantData.name,
        email: tenantData.email,
        phone_number: tenantData.phone,
        house_number: tenantData.houseNumber,
        estate_id: tenantData.estateId ? parseInt(tenantData.estateId) : null,
        is_active: tenantData.isActive ? 1 : 0,
      };

      await api.put(`/tenant/${tenantData.id}`, payload);
      
      // Update local state
      setTenants(prev => prev.map(t => t.id === tenantData.id ? tenantData : t));
    } catch (error) {
      console.error('Failed to update tenant:', error);
      
      // Fallback: Update local state for demo
      setTenants(prev => prev.map(t => t.id === tenantData.id ? tenantData : t));
    }
  };

  const handleToggleStatus = async (tenantId: string) => {
    try {
      await api.put(`/tenant/${tenantId}/toggle-status`, {});
      
      // Update local state
      setTenants(prev => prev.map(t => 
        t.id === tenantId ? { ...t, isActive: !t.isActive } : t
      ));
    } catch (error) {
      console.error('Failed to toggle tenant status:', error);
      
      // Fallback: Update local state for demo
      setTenants(prev => prev.map(t => 
        t.id === tenantId ? { ...t, isActive: !t.isActive } : t
      ));
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!window.confirm('Are you sure you want to remove this tenant?')) return;

    try {
      await api.delete(`/tenant/${tenantId}`);
      
      // Remove from local state
      setTenants(prev => prev.filter(t => t.id !== tenantId));
    } catch (error) {
      console.error('Failed to delete tenant:', error);
      
      // Fallback: Remove from local state for demo
      setTenants(prev => prev.filter(t => t.id !== tenantId));
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const searchMatch = searchTerm === '' || 
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.houseNumber && tenant.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && tenant.isActive) ||
      (filterStatus === 'inactive' && !tenant.isActive);
    
    const propertyMatch = filterProperty === 'all' || tenant.houseNumber === filterProperty;
    
    return searchMatch && statusMatch && propertyMatch;
  });

  const totalTenants = filteredTenants.length;
  const activeTenants = filteredTenants.filter(t => t.isActive).length;
  const inactiveTenants = filteredTenants.filter(t => !t.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tenants</h2>
          <p className="text-gray-600 mt-1">Manage tenants in your properties</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{totalTenants}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-green-600">{activeTenants}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Tenants</p>
              <p className="text-2xl font-bold text-red-600">{inactiveTenants}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Properties</option>
              {landlordProperties.map(property => (
                <option key={property.id} value={property.houseNumber}>
                  {property.houseNumber} - {property.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            onEdit={handleEditTenant}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTenant}
            landlordProperties={landlordProperties}
          />
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
          <p className="text-gray-600">
            {tenants.length === 0 
              ? 'Add your first tenant to get started' 
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      )}

      {/* Add Tenant Modal */}
      <AddTenantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTenant}
        landlordProperties={landlordProperties}
      />
    </div>
  );
};