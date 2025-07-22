import React, { useState } from 'react';
import { Property, User, ServiceCharge } from '../../types';
import { X, ArrowLeft, ArrowRight, Check, Home, User as UserIcon, CreditCard } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AddPropertyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (propertyData: any) => Promise<void>;
}

interface PropertyFormData {
  title: string;
  description: string;
  type: 'apartment' | 'flat' | 'house';
  estateType: 'estate' | 'non_estate';
  bedrooms: number;
  bathrooms: number;
  rent: number;
  serviceCharge: number;
  houseNumber: string;
  amenities: string[];
}

interface TenantFormData {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
}

interface ChargeFormData {
  id: string;
  title: string;
  category: string;
  amount: number;
  duration: 'monthly' | 'yearly' | 'one_time';
  selected: boolean;
}

const defaultCharges: ChargeFormData[] = [
  { id: '1', title: 'Waste Management', category: 'waste', amount: 5000, duration: 'monthly', selected: false },
  { id: '2', title: 'Water Supply', category: 'water', amount: 8000, duration: 'monthly', selected: false },
  { id: '3', title: 'Electricity', category: 'light', amount: 15000, duration: 'monthly', selected: false },
  { id: '4', title: 'Sanitation', category: 'sanitation', amount: 3000, duration: 'monthly', selected: false },
  { id: '5', title: 'Ground Rent', category: 'ground_rent', amount: 120000, duration: 'yearly', selected: false },
  { id: '6', title: 'Estate Fee', category: 'estate_fee', amount: 25000, duration: 'yearly', selected: false },
];

export const AddPropertyWizard: React.FC<AddPropertyWizardProps> = ({ isOpen, onClose, onAdd }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    title: '',
    description: '',
    type: 'apartment',
    estateType: 'estate',
    bedrooms: 1,
    bathrooms: 1,
    rent: 0,
    serviceCharge: 0,
    houseNumber: '',
    amenities: [],
  });
  
  const [tenantData, setTenantData] = useState<TenantFormData>({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
  });
  
  const [charges, setCharges] = useState<ChargeFormData[]>(defaultCharges);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: 0, name: 'Property Details', icon: Home },
    { id: 1, name: 'Tenant Information', icon: UserIcon },
    { id: 2, name: 'Service Charges', icon: CreditCard },
  ];

  const validateCurrentTab = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentTab === 0) {
      if (!propertyData.title.trim()) newErrors.title = 'Property title is required';
      if (!propertyData.description.trim()) newErrors.description = 'Description is required';
      if (!propertyData.houseNumber.trim()) newErrors.houseNumber = 'House number is required';
      if (propertyData.rent <= 0) newErrors.rent = 'Rent amount is required';
    } else if (currentTab === 1) {
      if (!tenantData.name.trim()) newErrors.tenantName = 'Tenant name is required';
      if (!tenantData.email.trim()) newErrors.tenantEmail = 'Tenant email is required';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (tenantData.email && !emailRegex.test(tenantData.email)) {
        newErrors.tenantEmail = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      setCurrentTab(prev => Math.min(prev + 1, tabs.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentTab(prev => Math.max(prev - 1, 0));
  };

  const handlePropertyChange = (field: keyof PropertyFormData, value: any) => {
    setPropertyData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTenantChange = (field: keyof TenantFormData, value: string) => {
    setTenantData(prev => ({ ...prev, [field]: value }));
    if (errors[`tenant${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`tenant${field.charAt(0).toUpperCase() + field.slice(1)}`]: '' }));
    }
  };

  const handleChargeToggle = (chargeId: string) => {
    setCharges(prev => prev.map(charge => 
      charge.id === chargeId 
        ? { ...charge, selected: !charge.selected }
        : charge
    ));
  };

  const handleChargeAmountChange = (chargeId: string, amount: number) => {
    setCharges(prev => prev.map(charge => 
      charge.id === chargeId 
        ? { ...charge, amount }
        : charge
    ));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
    const selectedCharges = charges.filter(charge => charge.selected);
    
    const completeData = {
      property: propertyData,
      tenant: tenantData,
      charges: selectedCharges,
    };
    
    onAdd(completeData);
    
    // Reset form
    setCurrentTab(0);
    setPropertyData({
      title: '',
      description: '',
      type: 'apartment',
      estateType: 'estate',
      bedrooms: 1,
      bathrooms: 1,
      rent: 0,
      serviceCharge: 0,
      houseNumber: '',
      amenities: [],
    });
    setTenantData({
      name: '',
      email: '',
      phone: '',
      emergencyContact: '',
    });
    setCharges(defaultCharges);
    setErrors({});
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Property</h2>
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
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              const isCompleted = currentTab > tab.id;
              
              return (
                <button
                  key={tab.id}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : isCompleted
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                  {isCompleted && <Check className="w-4 h-4 ml-2" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentTab === 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    value={propertyData.title}
                    onChange={(e) => handlePropertyChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 3 Bedroom Luxury Apartment"
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={propertyData.type}
                    onChange={(e) => handlePropertyChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estate Type *
                  </label>
                  <select
                    value={propertyData.estateType}
                    onChange={(e) => handlePropertyChange('estateType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="estate">Estate Property</option>
                    <option value="non_estate">Non-Estate Property</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Number *
                  </label>
                  <input
                    type="text"
                    value={propertyData.houseNumber}
                    onChange={(e) => handlePropertyChange('houseNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.houseNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., A12, B05"
                  />
                  {errors.houseNumber && <p className="text-red-600 text-sm mt-1">{errors.houseNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₦) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={propertyData.rent}
                    onChange={(e) => handlePropertyChange('rent', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.rent ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="250000"
                  />
                  {errors.rent && <p className="text-red-600 text-sm mt-1">{errors.rent}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={propertyData.bedrooms}
                    onChange={(e) => handlePropertyChange('bedrooms', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={propertyData.bathrooms}
                    onChange={(e) => handlePropertyChange('bathrooms', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    value={propertyData.description}
                    onChange={(e) => handlePropertyChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe the property features and amenities..."
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>
          )}

          {currentTab === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={tenantData.name}
                    onChange={(e) => handleTenantChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tenantName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter tenant's full name"
                  />
                  {errors.tenantName && <p className="text-red-600 text-sm mt-1">{errors.tenantName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={tenantData.email}
                    onChange={(e) => handleTenantChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tenantEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="tenant@email.com"
                  />
                  {errors.tenantEmail && <p className="text-red-600 text-sm mt-1">{errors.tenantEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={tenantData.phone}
                    onChange={(e) => handleTenantChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tenantPhone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+234-123-456-7890"
                  />
                  {errors.tenantPhone && <p className="text-red-600 text-sm mt-1">{errors.tenantPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={tenantData.emergencyContact}
                    onChange={(e) => handleTenantChange('emergencyContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+234-123-456-7890"
                  />
                </div>
              </div>
            </div>
          )}

          {currentTab === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Service Charges</h3>
              <p className="text-sm text-gray-600 mb-6">
                Select the service charges that apply to this property. You can customize the amounts as needed.
              </p>
              
              <div className="space-y-4">
                {charges.map((charge) => (
                  <div key={charge.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`charge-${charge.id}`}
                          checked={charge.selected}
                          onChange={() => handleChargeToggle(charge.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`charge-${charge.id}`} className="ml-3 text-sm font-medium text-gray-900">
                          {charge.title}
                        </label>
                      </div>
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                        {charge.duration}
                      </span>
                    </div>
                    
                    {charge.selected && (
                      <div className="mt-3 pl-7">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount (₦)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={charge.amount}
                          onChange={(e) => handleChargeAmountChange(charge.id, parseInt(e.target.value) || 0)}
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentTab === 0}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentTab
                    ? 'bg-blue-600'
                    : index < currentTab
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentTab < tabs.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating Property...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Property
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};