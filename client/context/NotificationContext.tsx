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
import api from '../services/api';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'reminder' | 'approval' | 'cancellation' | 'general';
  isRead: boolean;
  appointmentId?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  /** The latest notification that just arrived (for toast display) */
  latestNotification: Notification | null;
  clearLatest: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  fetchNotifications: async () => {},
  latestNotification: null,
  clearLatest: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ─── Fetch notifications via REST (initial load / fallback) ─────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Socket listeners for real-time notifications ───────────────────────────
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNotification = (data: Notification) => {
      setNotifications((prev) => {
        // Avoid duplicates
        if (prev.some((n) => n._id === data._id)) return prev;
        return [data, ...prev];
      });
      setLatestNotification(data);
    };

    const handleReminderNotification = (data: { notification: Notification }) => {
      if (data?.notification) {
        handleNotification(data.notification);
      }
    };

    const handleMessageReceived = (data: any) => {
      // Convert message to notification format for display
      const notif: Notification = {
        _id: data._id || `msg-${Date.now()}`,
        title: data.subject || 'New Message',
        message: data.message || '',
        type: 'general',
        isRead: false,
        createdAt: data.createdAt || new Date().toISOString(),
      };
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notif._id)) return prev;
        return [notif, ...prev];
      });
      setLatestNotification(notif);
    };

    const handleReadConfirmed = (data: { notificationId: string }) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === data.notificationId ? { ...n, isRead: true } : n
        )
      );
    };

    socket.on('notification_received', handleNotification);
    socket.on('reminder_notification', handleReminderNotification);
    socket.on('message_received', handleMessageReceived);
    socket.on('notification_read_confirmed', handleReadConfirmed);

    return () => {
      socket.off('notification_received', handleNotification);
      socket.off('reminder_notification', handleReminderNotification);
      socket.off('message_received', handleMessageReceived);
      socket.off('notification_read_confirmed', handleReadConfirmed);
    };
  }, [socket, isConnected]);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const markAsRead = useCallback(
    async (id: string) => {
      try {
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );

        // Notify server via socket (fast path)
        if (socket?.connected) {
          socket.emit('notification_read', { notificationId: id });
        }

        // Also update via REST (reliable path)
        await api.put(`/notifications/${id}/read`);
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    },
    [socket]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await api.put('/notifications/read-all');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, []);

  const clearLatest = useCallback(() => {
    setLatestNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
        latestNotification,
        clearLatest,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
