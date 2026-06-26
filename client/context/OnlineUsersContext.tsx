'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useSocket } from './SocketContext';

export interface OnlineUser {
  userId: string;
  name: string;
  role: string;
}

interface OnlineUsersContextType {
  onlineUsers: OnlineUser[];
  isUserOnline: (userId: string) => boolean;
  getOnlineByRole: (role: string) => OnlineUser[];
  onlineCount: number;
}

const OnlineUsersContext = createContext<OnlineUsersContextType>({
  onlineUsers: [],
  isUserOnline: () => false,
  getOnlineByRole: () => [],
  onlineCount: 0,
});

export const OnlineUsersProvider = ({ children }: { children: ReactNode }) => {
  const { socket, isConnected } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Request initial online users list
    socket.emit('get_online_users');

    const handleOnlineUsersList = (data: { users: OnlineUser[] }) => {
      setOnlineUsers(data.users || []);
    };

    const handleUserOnline = (data: OnlineUser) => {
      setOnlineUsers((prev) => {
        // Avoid duplicates
        if (prev.some((u) => u.userId === data.userId)) return prev;
        return [...prev, data];
      });
    };

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    socket.on('online_users_list', handleOnlineUsersList);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('online_users_list', handleOnlineUsersList);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, [socket, isConnected]);

  const isUserOnline = useCallback(
    (userId: string) => onlineUsers.some((u) => u.userId === userId),
    [onlineUsers]
  );

  const getOnlineByRole = useCallback(
    (role: string) => onlineUsers.filter((u) => u.role === role),
    [onlineUsers]
  );

  return (
    <OnlineUsersContext.Provider
      value={{
        onlineUsers,
        isUserOnline,
        getOnlineByRole,
        onlineCount: onlineUsers.length,
      }}
    >
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => useContext(OnlineUsersContext);
