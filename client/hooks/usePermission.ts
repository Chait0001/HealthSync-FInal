'use client';

import { usePermissionsContext } from '../context/PermissionsContext';
import { useAuth } from '../context/AuthContext';

export const usePermission = (key: string): boolean => {
  const { user } = useAuth();
  const { permissions } = usePermissionsContext();

  if (user?.role === 'admin') {
    return true;
  }

  return !!permissions[key];
};
