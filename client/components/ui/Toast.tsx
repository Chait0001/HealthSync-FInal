'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useNotifications, Notification } from '@/context/NotificationContext';

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string; border: string }> = {
  reminder:     { icon: Clock,        color: 'text-blue-400',  bg: 'bg-blue-500/10',  border: 'border-blue-500/20' },
  approval:     { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  cancellation: { icon: AlertCircle,  color: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20' },
  general:      { icon: Bell,         color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
};

interface ToastItem {
  id: string;
  notification: Notification;
}

/**
 * ToastContainer — Renders animated toast notifications in the top-right corner.
 * Listens to latestNotification from NotificationContext.
 * Auto-dismisses after 5 seconds.
 */
export function ToastContainer() {
  const { latestNotification, clearLatest, markAsRead } = useNotifications();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // When a new notification arrives, add it to the toast queue
  useEffect(() => {
    if (!latestNotification) return;

    const toastId = `${latestNotification._id}-${Date.now()}`;
    setToasts((prev) => [...prev, { id: toastId, notification: latestNotification }]);
    clearLatest();

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 5000);

    return () => clearTimeout(timer);
  }, [latestNotification, clearLatest]);

  const dismissToast = useCallback(
    (toastId: string, notificationId: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
      markAsRead(notificationId);
    },
    [markAsRead]
  );

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = TYPE_CONFIG[toast.notification.type] || TYPE_CONFIG.general;
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto rounded-xl border ${config.border} ${config.bg} backdrop-blur-xl bg-white/90 dark:bg-[#161b27]/95 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden`}
            >
              <div className="flex items-start gap-3 p-4">
                <div className={`mt-0.5 p-1.5 rounded-lg ${config.bg}`}>
                  <Icon size={16} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {toast.notification.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {toast.notification.message}
                  </p>
                </div>
                <button
                  onClick={() => dismissToast(toast.id, toast.notification._id)}
                  className="p-1 rounded-md hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-400 transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
              {/* Auto-dismiss progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className={`h-0.5 origin-left ${config.color.replace('text-', 'bg-')}`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
