export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  houseNumber?: string;
  estateId?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'super_admin' | 'estate_admin' | 'landlord' | 'tenant' | 'caretaker' | 'agent';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'flat' | 'house';
  estateType: 'estate' | 'non_estate';
  bedrooms: number;
  bathrooms: number;
  rent: number;
  serviceCharge: number;
  isVacant: boolean;
  landlordId: string;
  estateId?: string;
  houseNumber: string;
  images: string[];
  amenities: string[];
  createdAt: string;
  approved: boolean;
}

export interface ServiceCharge {
  id: string;
  userId?: string;
  category: ServiceCategory;
  title: string;
  amount: number;
  duration: 'monthly' | 'yearly' | 'one_time';
  dueDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentDate?: string;
  receiptUrl?: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export type ServiceCategory = 'waste' | 'water' | 'light' | 'sanitation' | 'ground_rent' | 'estate_fee';

export interface Estate {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  adminId: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Household {
  id: string;
  landlordId: string;
  tenants: string[];
  cars: number;
  houseNumber: string;
  estateId?: string;
}

export interface Estate {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  adminId: string;
  createdAt: string;
  isActive: boolean;
}

export interface DefaulterRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  houseNumber: string;
  estateName: string;
  chargeTitle: string;
  amount: number;
  dueDate: string;
  daysPastDue: number;
  category: ServiceCategory;
}