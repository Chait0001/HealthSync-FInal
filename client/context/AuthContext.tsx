'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string; // open — supports custom roles beyond patient/doctor/admin
  roleId?: string;
  token: string;
  permissions_cache: string[]; 
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  can: (permission: string) => boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const can = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions_cache?.includes(permission) ?? false;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          permissions_cache: parsedUser.permissions_cache ?? []
        });
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data.data || response.data; // Handle both standard and wrapped responses

    const userToSave = {
      ...userData,
      permissions_cache: userData.permissions_cache ?? []
    };

    localStorage.setItem('user', JSON.stringify(userToSave));
    localStorage.setItem('token', userData.token);
    setUser(userToSave);

    // Redirect based on role
    if (userData.role === 'admin') router.push('/dashboard/admin');
    else if (userData.role === 'doctor') router.push('/dashboard/doctor');
    else if (userData.role === 'patient') router.push('/dashboard/patient');
    else router.push('/dashboard/custom');
  };

  const register = async (submitData: any) => {
    const response = await api.post('/auth/register', submitData);
    const userData = response.data.data || response.data;

    const userToSave = {
      ...userData,
      permissions_cache: userData.permissions_cache ?? []
    };

    localStorage.setItem('user', JSON.stringify(userToSave));
    localStorage.setItem('token', userData.token);
    setUser(userToSave);

    // Redirect based on role
    if (userData.role === 'admin') router.push('/dashboard/admin');
    else if (userData.role === 'doctor') router.push('/dashboard/doctor');
    else if (userData.role === 'patient') router.push('/dashboard/patient');
    else router.push('/dashboard/custom');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
