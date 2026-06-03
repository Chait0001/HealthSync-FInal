'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { io, Socket } from 'socket.io-client';

interface PermissionsContextType {
  permissions: Record<string, boolean>;
  loading: boolean;
  refetch: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    if (!user || !user.roleId) {
      setPermissions({});
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/roles/${user.roleId}/permissions`);
      const data = response.data.data || {};
      setPermissions(data);
    } catch (error) {
      console.error('Failed to fetch permissions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [user?.roleId]);

  useEffect(() => {
    if (!user || !user.roleId) return;

    let socketUrl = 'http://localhost:8080';
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        socketUrl = new URL(process.env.NEXT_PUBLIC_API_URL).origin;
      } catch (e) {
        console.error('Invalid NEXT_PUBLIC_API_URL', e);
      }
    }

    const socket: Socket = io(socketUrl);

    socket.on('permissions:updated', (data: { roleId: string }) => {
      if (data.roleId === user.roleId) {
        console.log('Permissions updated for current role, refetching...');
        fetchPermissions();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.roleId]);

  return (
    <PermissionsContext.Provider value={{ permissions, loading, refetch: fetchPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
};
