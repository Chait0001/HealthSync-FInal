'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/services/api';
import { Bell, X, Check } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { console.error(e); }
  };

  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  };

  const TYPE_COLORS: Record<string, string> = {
    reminder: 'bg-blue-500',
    approval: 'bg-green-500',
    cancellation: 'bg-red-500',
    general: 'bg-slate-500',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-teal-600" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-teal-600 dark:text-teal-400 hover:underline px-2 py-1">
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-sm text-slate-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={28} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  onClick={() => markRead(n._id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${!n.isRead ? 'bg-teal-50/50 dark:bg-teal-500/5' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${TYPE_COLORS[n.type] || TYPE_COLORS.general}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.isRead && <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
