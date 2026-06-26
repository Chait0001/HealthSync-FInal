'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/context/SocketContext';
import api from '@/services/api';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: {
    _id: string;
    name: string;
    role: string;
  };
}

/**
 * SendMessageModal — Modal for admin to send direct messages to users.
 * Sends via both socket (for instant delivery) and REST (for persistence).
 */
export function SendMessageModal({ isOpen, onClose, targetUser }: SendMessageModalProps) {
  const { socket } = useSocket();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!targetUser || !subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      // Send via REST API (persistence + socket emission handled server-side)
      await api.post('/messages/send', {
        toUserId: targetUser._id,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSubject('');
        setMessage('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setMessage('');
    setSent(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-lg bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Send Message
                  </h3>
                  {targetUser && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      To: <span className="font-medium text-slate-700 dark:text-slate-300">{targetUser.name}</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 capitalize">
                        {targetUser.role}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Message Sent!</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {targetUser?.name} will receive this instantly.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter message subject..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                        Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors resize-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {!sent && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!subject.trim() || !message.trim() || sending}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20"
                  >
                    {sending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
