import { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Super Admin',
    email: 'admin@westpoint.com',
    password: 'admin123',
    phone: '+234-123-456-7890',
    role: 'super_admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Estate Manager',
    email: 'sarah@estate.com',
    password: 'sarah123',
    phone: '+234-123-456-7891',
    role: 'estate_admin',
    estateId: 'estate-1',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mike Landlord',
    email: 'mike@email.com',
    password: 'mike123',
    phone: '+234-123-456-7892',
    role: 'landlord',
    houseNumber: 'A12',
    estateId: 'estate-1',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Lisa Tenant',
    email: 'lisa@email.com',
    password: 'lisa123',
    phone: '+234-123-456-7893',
    role: 'tenant',
    houseNumber: 'B05',
    estateId: 'estate-1',
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('estate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password && u.isActive);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const updatedUser = { ...userWithoutPassword, lastLogin: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('estate_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estate_user');
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'tenant',
      houseNumber: userData.houseNumber,
      estateId: userData.estateId,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('estate_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  return {
    user,
    login,
    logout,
    register,
    isLoading,
  };
};