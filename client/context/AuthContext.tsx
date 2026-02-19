'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });

    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    setUser(data);

    // Redirect based on role
    if (data.role === 'admin') router.push('/dashboard/admin');
    else if (data.role === 'doctor') router.push('/dashboard/doctor');
    else router.push('/dashboard/patient');
  };

  const register = async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);

    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    setUser(data);

    // Redirect based on role
    if (data.role === 'admin') router.push('/dashboard/admin');
    else if (data.role === 'doctor') router.push('/dashboard/doctor');
    else router.push('/dashboard/patient');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
