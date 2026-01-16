import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, RegisteredUser } from '@/types/ramen';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo admin account
const DEMO_ADMIN: RegisteredUser = {
  id: 'admin-001',
  name: 'Admin Ramenku',
  email: 'admin@ramenku.com',
  password: 'admin123',
  role: 'admin',
};

const getStoredUsers = (): RegisteredUser[] => {
  const stored = localStorage.getItem('ramen-registered-users');
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with demo admin
  const initialUsers = [DEMO_ADMIN];
  localStorage.setItem('ramen-registered-users', JSON.stringify(initialUsers));
  return initialUsers;
};

const saveUsers = (users: RegisteredUser[]) => {
  localStorage.setItem('ramen-registered-users', JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ramen-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      return { success: false, message: 'Email tidak terdaftar. Silakan daftar terlebih dahulu.' };
    }
    
    if (foundUser.password !== password) {
      return { success: false, message: 'Password salah. Silakan coba lagi.' };
    }
    
    const loggedInUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };
    
    setUser(loggedInUser);
    localStorage.setItem('ramen-current-user', JSON.stringify(loggedInUser));
    return { success: true, message: 'Login berhasil!' };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!name || !email || !password) {
      return { success: false, message: 'Semua field harus diisi.' };
    }
    
    if (password.length < 6) {
      return { success: false, message: 'Password minimal 6 karakter.' };
    }
    
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
    }
    
    const newUser: RegisteredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: 'user',
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const loggedInUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    
    setUser(loggedInUser);
    localStorage.setItem('ramen-current-user', JSON.stringify(loggedInUser));
    return { success: true, message: 'Registrasi berhasil!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ramen-current-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
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
