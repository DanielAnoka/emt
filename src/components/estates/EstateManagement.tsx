import React, { useState } from 'react';
import { Estate } from '../../types';
import { EstateCard } from './EstateCard';
import { AddEstateModal } from './AddEstateModal';
import { EstateDetailsModal } from './EstateDetailsModal';
import { Plus, Search, Filter, Building, Users, MapPin } from 'lucide-react';

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
  const [estates, setEstates] = useState<Estate[]>(mockEstates);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEstates.map((estate) => (
          <EstateCard
            key={estate.id}
            estate={estate}
            onView={handleViewEstate}
          />
        ))}
      </div>

      {filteredEstates.length === 0 && (
        <div className="text-center py-12">
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
    </div>
  );
};