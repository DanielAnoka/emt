import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { UserCard } from './UserCard';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { useAuth } from '../../hooks/useAuth';
import { Search, Filter, Plus, Users, UserCheck, UserX } from 'lucide-react';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Super Admin',
    email: 'admin@westpoint.com',
    phone: '+234-123-456-7890',
    role: 'super_admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah Estate Manager',
    email: 'sarah@estate.com',
    phone: '+234-123-456-7891',
    role: 'estate_admin',
    estateId: 'estate-1',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Mike Landlord',
    email: 'mike@email.com',
    phone: '+234-123-456-7892',
    role: 'landlord',
    houseNumber: 'A12',
    estateId: 'estate-1',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
  },
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
    id: '5',
    name: 'James Caretaker',
    email: 'james@estate.com',
    phone: '+234-123-456-7894',
    role: 'caretaker',
    estateId: 'estate-1',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
  },
];

export const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const getAllowedRoles = (): UserRole[] => {
    if (user?.role === 'super_admin') {
      return ['estate_admin', 'landlord', 'tenant', 'caretaker', 'agent'];
    } else if (user?.role === 'estate_admin') {
      return ['landlord', 'tenant', 'caretaker'];
    }
    return [];
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleEditUser = (userData: User) => {
    setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
    setEditingUser(null);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(u => {
    const searchMatch = searchTerm === '' || 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    
    const roleMatch = filterRole === 'all' || u.role === filterRole;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && u.isActive) ||
      (filterStatus === 'inactive' && !u.isActive);
    
    return searchMatch && roleMatch && statusMatch;
  });

  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(u => u.isActive).length;
  const inactiveUsers = filteredUsers.filter(u => !u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
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
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="estate_admin">Estate Admin</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
              <option value="caretaker">Caretaker</option>
              <option value="agent">Agent</option>
            </select>
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
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={setEditingUser}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteUser}
            canEdit={true}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
        allowedRoles={getAllowedRoles()}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onEdit={handleEditUser}
          user={editingUser}
          allowedRoles={getAllowedRoles()}
        />
      )}
    </div>
  );
};