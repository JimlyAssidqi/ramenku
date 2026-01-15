import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/ramen';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple mock authentication for demo purposes
// In production, this would connect to Supabase/backend
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ramen-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, validate against backend
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email,
      };
      setUser(mockUser);
      localStorage.setItem('ramen-user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration
    if (name && email && password.length >= 6) {
      const mockUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
      };
      setUser(mockUser);
      localStorage.setItem('ramen-user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ramen-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
