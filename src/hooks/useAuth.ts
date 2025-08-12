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

// Backend API configuration
const API_BASE_URL = 'https://api.digital-receipt.westapp.com.ng/api';

// Map backend role_id to our UserRole type
const mapRoleIdToUserRole = (roleId: number): UserRole => {
  switch (roleId) {
    case 1:
      return 'super_admin';
    case 2:
      return 'estate_admin';
    case 3:
      return 'landlord';
    case 4:
      return 'tenant';
    case 5:
      return 'caretaker';
    case 6:
      return 'agent';
    default:
      return 'tenant';
  }
};

// Transform backend user response to our User type
const transformBackendUser = (backendUser: any): User => {
  return {
    id: backendUser.id.toString(),
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone_number || '',
    role: mapRoleIdToUserRole(backendUser.role_id),
    isActive: true, // Assuming logged in users are active
    createdAt: backendUser.created_at,
    lastLogin: new Date().toISOString(),
  };
};

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
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('estate_user');
    const storedToken = localStorage.getItem('estate_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      
      if (data.token && data.user) {
        const transformedUser = transformBackendUser(data.user);
        
        setUser(transformedUser);
        setAuthToken(data.token);
        
        // Store in localStorage
        localStorage.setItem('estate_user', JSON.stringify(transformedUser));
        localStorage.setItem('estate_token', data.token);
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Call backend logout endpoint if we have a token
      if (authToken) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and storage regardless of API call success
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('estate_user');
      localStorage.removeItem('estate_token');
      setIsLoading(false);
      
      // Redirect to landing page after logout
      window.location.href = '/';
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Note: You'll need to implement the register endpoint on your backend
      // For now, this is a placeholder that matches your expected API structure
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone_number: userData.phone,
          password,
          password_confirmation: password,
          role_id: 4, // Default to tenant role (role_id: 4)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      
      if (data.token && data.user) {
        const transformedUser = transformBackendUser(data.user);
        
        setUser(transformedUser);
        setAuthToken(data.token);
        
        // Store in localStorage
        localStorage.setItem('estate_user', JSON.stringify(transformedUser));
        localStorage.setItem('estate_token', data.token);
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Function to get current auth token (useful for API calls)
  const getAuthToken = () => authToken;

  // Function to check if user is authenticated
  const isAuthenticated = () => !!user && !!authToken;

  return {
    user,
    login,
    logout,
    register,
    isLoading,
    getAuthToken,
    isAuthenticated,
  };
};