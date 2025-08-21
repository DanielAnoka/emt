import React, { useState } from 'react';
import { Estate } from '../../types';
import { AddEstateModal } from './AddEstateModal';
import { EstateDetailsModal } from './EstateDetailsModal';
import { GenerateEstateLoginModal } from './GenerateEstateLoginModal';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Search, Filter, Building, Users, MapPin, Eye, Key, Power, MoreHorizontal } from 'lucide-react';

// Mock data
const mockEstates: Estate[] = [
  {
    id: 'estate-1',
    name: 'Westpoint Estate',
    address: '123 Victoria Island, Lagos',
    totalUnits: 120,
    occupiedUnits: 95,
    adminId: '2',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true,
  },
  {
    id: 'estate-2',
    name: 'Garden City Estate',
    address: '456 Lekki Phase 1, Lagos',
    totalUnits: 80,
    occupiedUnits: 68,
    adminId: '2',
    createdAt: '2024-01-15T00:00:00Z',
    isActive: true,
  },
  {
    id: 'estate-3',
    name: 'Royal Gardens',
    address: '789 Ikoyi, Lagos',
    totalUnits: 60,
    occupiedUnits: 45,
    adminId: '2',
    createdAt: '2024-02-01T00:00:00Z',
    isActive: true,
  },
];

export const EstateManagement: React.FC = () => {
  const { user } = useAuth();
  const [estates, setEstates] = useState<Estate[]>(mockEstates);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
  const [estateForLogin, setEstateForLogin] = useState<Estate | null>(null);

  const handleAddEstate = (estateData: Omit<Estate, 'id' | 'createdAt'>) => {
    const newEstate: Estate = {
      ...estateData,
      id: `estate-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEstates(prev => [newEstate, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleViewEstate = (estate: Estate) => {
    setSelectedEstate(estate);
  };

  const handleGenerateLogin = (estate: Estate) => {
    setEstateForLogin(estate);
  };

  const handleToggleStatus = (estateId: string) => {
    setEstates(prev => prev.map(estate => 
      estate.id === estateId 
        ? { ...estate, isActive: !estate.isActive }
        : estate
    ));
  };

  const filteredEstates = estates.filter(estate =>
    estate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estate.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEstates = filteredEstates.length;
  const totalUnits = filteredEstates.reduce((sum, estate) => sum + estate.totalUnits, 0);
  const totalOccupied = filteredEstates.reduce((sum, estate) => sum + estate.occupiedUnits, 0);
  const averageOccupancy = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estate Management</h2>
          <p className="text-gray-600 mt-1">Manage and monitor all estates in the system</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Estate
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Estates</p>
              <p className="text-2xl font-bold text-gray-900">{totalEstates}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied Units</p>
              <p className="text-2xl font-bold text-green-600">{totalOccupied}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Occupancy</p>
              <p className="text-2xl font-bold text-blue-600">{averageOccupancy}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search estates by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Estates Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEstates.map((estate) => {
                const occupancyRate = Math.round((estate.occupiedUnits / estate.totalUnits) * 100);
                
                return (
                  <tr key={estate.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{estate.name}</div>
                          <div className="text-sm text-gray-500">ID: {estate.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={estate.address}>
                        {estate.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{estate.totalUnits} Total</div>
                        <div className="text-gray-500">{estate.occupiedUnits} Occupied</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 w-16">
                          <div 
                            className={`h-2 rounded-full ${
                              occupancyRate >= 80 ? 'bg-green-500' : 
                              occupancyRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{occupancyRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        estate.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {estate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(estate.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewEstate(estate)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors duration-150"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user?.role === 'super_admin' && (
                          <>
                            <button
                              onClick={() => handleGenerateLogin(estate)}
                              className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors duration-150"
                              title="Generate Login"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(estate.id)}
                              className={`p-1 rounded-md transition-colors duration-150 ${
                                estate.isActive
                                  ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                  : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                              }`}
                              title={estate.isActive ? 'Disable Estate' : 'Enable Estate'}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEstates.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No estates found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new estate</p>
        </div>
      )}

      {/* Add Estate Modal */}
      <AddEstateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEstate}
      />

      {/* Estate Details Modal */}
      {selectedEstate && (
        <EstateDetailsModal
          isOpen={true}
          onClose={() => setSelectedEstate(null)}
          estate={selectedEstate}
        />
      )}

      {/* Generate Estate Login Modal */}
      {estateForLogin && (
        <GenerateEstateLoginModal
          isOpen={true}
          onClose={() => setEstateForLogin(null)}
          estate={estateForLogin}
        />
      )}
    </div>
  );
};