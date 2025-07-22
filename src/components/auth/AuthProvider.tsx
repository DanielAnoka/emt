import React from 'react';
import { useAuthProvider, AuthContext } from '../../hooks/useAuth';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any, password: string) => Promise<boolean>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};