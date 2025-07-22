import React, { useState } from 'react';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';
import { AddPropertyWizard } from './AddPropertyWizard';
import { Toast } from '../ui/Toast';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    title: '3 Bedroom Luxury Apartment',
    description: 'Beautiful 3 bedroom apartment with modern amenities, spacious living area, and great location.',
    type: 'apartment',
    estateType: 'estate',
    bedrooms: 3,
    bathrooms: 2,
    rent: 250000,
    serviceCharge: 15000,
    isVacant: true,
    landlordId: '3',
    estateId: 'estate-1',
    houseNumber: 'A12',
    images: [],
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
    createdAt: '2024-01-15',
    approved: false,
  },
  {
    id: '2',
    title: '2 Bedroom Family Flat',
    description: 'Comfortable family flat with good ventilation and close to schools.',
    type: 'flat',
    estateType: 'estate',
    bedrooms: 2,
    bathrooms: 1,
    rent: 180000,
    serviceCharge: 12000,
    isVacant: false,
    landlordId: '3',
    estateId: 'estate-1',
    houseNumber: 'B05',
    images: [],
    amenities: ['Security', 'Parking', 'Playground'],
    createdAt: '2024-01-10',
    approved: true,
  },
  {
    id: '3',
    title: '4 Bedroom Executive House',
    description: 'Spacious executive house with garden, perfect for large families.',
    type: 'house',
    estateType: 'non_estate',
    bedrooms: 4,
    bathrooms: 3,
    rent: 400000,
    serviceCharge: 25000,
    isVacant: true,
    landlordId: '3',
    houseNumber: 'C15',
    images: [],
    amenities: ['Garden', 'Security', 'Parking', 'Backup Generator'],
    createdAt: '2024-01-08',
    approved: true,
  },
];

export const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vacant' | 'occupied' | 'pending'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddWizardOpen, setIsAddWizardOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const handleApprove = (propertyId: string) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === propertyId 
          ? { ...property, approved: true }
          : property
      )
    );
  };

  const handleReject = (propertyId: string) => {
    // In a real app, this would either remove the property or mark it as rejected
    setProperties(prev => prev.filter(property => property.id !== propertyId));
  };

  const handleView = (propertyId: string) => {
    // Navigate to property details
    console.log('Viewing property:', propertyId);
  };

  const handleAddProperty = async (propertyData: any) => {
    try {
      // Simulate API call with loading delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new property from wizard data
      const newProperty: Property = {
        id: Date.now().toString(),
        title: propertyData.property.title,
        description: propertyData.property.description,
        type: propertyData.property.type,
        estateType: propertyData.property.estateType,
        bedrooms: propertyData.property.bedrooms,
        bathrooms: propertyData.property.bathrooms,
        rent: propertyData.property.rent,
        serviceCharge: propertyData.property.serviceCharge,
        isVacant: false, // Since we're adding a tenant
        landlordId: '3', // Current user ID
        houseNumber: propertyData.property.houseNumber,
        images: [],
        amenities: [],
        createdAt: new Date().toISOString(),
        approved: false,
      };
      
      setProperties(prev => [newProperty, ...prev]);
      setIsAddWizardOpen(false);
      
      // Show success toast
      setToast({
        message: 'Property created successfully! Tenant and charges have been set up.',
        type: 'success',
        isVisible: true,
      });
      
      // Here you would also create the tenant and charges in a real app
      console.log('Property created with tenant and charges:', propertyData);
    } catch (error) {
      console.error('Error creating property:', error);
      setToast({
        message: 'Failed to create property. Please try again.',
        type: 'error',
        isVisible: true,
      });
    }
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.houseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'vacant' && property.isVacant) ||
      (filterStatus === 'occupied' && !property.isVacant) ||
      (filterStatus === 'pending' && !property.approved);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Property Management</h2>
          <p className="text-gray-600 mt-1">Manage and monitor all properties</p>
        </div>
        <button 
          onClick={() => setIsAddWizardOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Properties</option>
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-150 ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-150 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProperties.length} of {properties.length} properties
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-green-600 font-medium">
            {properties.filter(p => !p.isVacant).length} Occupied
          </span>
          <span className="text-yellow-600 font-medium">
            {properties.filter(p => p.isVacant).length} Vacant
          </span>
          <span className="text-blue-600 font-medium">
            {properties.filter(p => !p.approved).length} Pending
          </span>
        </div>
      </div>

      {/* Properties Grid */}
      <div className={`${
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }`}>
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleView}
            showActions={true}
          />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add Property Wizard */}
      <AddPropertyWizard
        isOpen={isAddWizardOpen}
        onClose={() => setIsAddWizardOpen(false)}
        onAdd={handleAddProperty}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </div>
  );
};