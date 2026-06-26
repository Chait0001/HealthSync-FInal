'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import socketService from '../services/socketService';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // If no user or no token, disconnect
    if (!user?.token) {
      socketService.disconnect();
      setSocket(null);
      setIsConnected(false);
      prevUserIdRef.current = null;
      return;
    }

    // Handle user switching — disconnect old socket first
    if (prevUserIdRef.current && prevUserIdRef.current !== user._id) {
      socketService.disconnect();
    }
    prevUserIdRef.current = user._id;

    // Connect
    const sock = socketService.connect(user.token);
    setSocket(sock);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    sock.on('connect', onConnect);
    sock.on('disconnect', onDisconnect);

    // Set initial state
    if (sock.connected) {
      setIsConnected(true);
    }

    return () => {
      sock.off('connect', onConnect);
      sock.off('disconnect', onDisconnect);
    };
  }, [user?.token, user?._id]);

  // Disconnect on unmount (e.g., app close)
  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
