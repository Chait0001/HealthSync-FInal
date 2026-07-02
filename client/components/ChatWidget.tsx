'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, ArrowLeft, Send, X, Check, CheckCheck, Loader2 } from 'lucide-react';
import { useChat, Contact } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';

/**
 * ChatWidget — Real-time Chat UI popup in the sticky header.
 * Powers two-way Doctor-Patient chat with real-time updates,
 * unread badges, typing indicators, read receipts, and auto-scroll.
 */
export function ChatWidget() {
  const { user } = useAuth();
  const {
    contacts,
    totalUnreadCount,
    activeConversation,
    messages,
    openConversation,
    sendMessage,
    handleLocalTyping,
    otherUserTyping,
    loadingContacts,
    loadingMessages,
    fetchContacts,
  } = useChat();

  const [open, setOpen] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [inputText, setInputText] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowContacts(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Find active contact details
  const activeContact = contacts.find((c) => c._id === activeConversation);

  // Auto-scroll to bottom of conversation thread on new messages
  useEffect(() => {
    if (activeConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, otherUserTyping, activeConversation]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText(''); // Clear input immediately for responsiveness
    await sendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    handleLocalTyping();
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div ref={widgetRef} className="relative">
      {/* Header Toggle Icon Button */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) {
            setShowContacts(false);
            fetchContacts();
          }
        }}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
        aria-label="Toggle chat panel"
      >
        <MessageSquare size={20} />
        {totalUnreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </span>
        )}
      </button>

      {/* Main Chat Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-96 h-[500px] bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          
          {!activeConversation ? (
            !showContacts ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Messages</span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Clickable prompt */}
                <div 
                  className="flex-1 flex items-center justify-center p-8 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                  onClick={() => setShowContacts(true)}
                >
                  <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 text-center animate-pulse">
                    {user?.role === 'doctor' ? "Let's cure patients 😊" : "Let's Consult 😊"}
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Messages</span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Contacts Body */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                  {loadingContacts ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                      <Loader2 size={24} className="animate-spin text-teal-500" />
                      <span>Loading chats...</span>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <MessageSquare size={36} className="text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {user?.role === 'patient' ? 'No doctors registered yet' : 'No patients registered yet'}
                      </p>
                    </div>
                  ) : (
                    contacts.map((contact) => (
                      <div
                        key={contact._id}
                        onClick={() => openConversation(contact._id)}
                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        {user?.role === 'doctor' ? (
                          <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">{contact.name}</span>
                        ) : (
                          <div className="flex flex-col justify-center min-w-0">
                            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{contact.name}</span>
                            <span className="text-xs text-slate-400 mt-0.5">{contact.department || 'General Medicine'}</span>
                          </div>
                        )}
                        {contact.unreadCount > 0 && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 ml-2 animate-pulse" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )
          ) : (
            
            /* VIEW 2: ACTIVE CHAT THREAD */
            <>
              {/* Active Thread Header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => openConversation(null)}
                    className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors shrink-0"
                    aria-label="Back to contacts"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {activeContact?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {activeContact?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Thread Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-black/10">
                {loadingMessages ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                    <Loader2 size={24} className="animate-spin text-teal-500" />
                    <span>Loading history...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageSquare size={28} className="text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-xs font-medium text-slate-500">No messages yet</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Send a message to begin the conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.senderId === user?._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-3.5 py-2.5 text-sm rounded-2xl ${
                            isSelf
                              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-tr-none shadow-sm'
                              : 'bg-white dark:bg-white/5 border border-slate-100 dark:border-white/[0.03] text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                          }`}
                        >
                          <p className="leading-relaxed break-words">{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 px-1">
                          <span className="text-[9px] text-slate-400">
                            {formatTime(msg.createdAt)}
                          </span>
                          {isSelf && (
                            <span className="text-slate-400">
                              {msg.isRead ? (
                                <CheckCheck size={11} className="text-teal-500 dark:text-teal-400" />
                              ) : (
                                <Check size={11} />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Counterpart Typing Indicator bubble */}
                {otherUserTyping && (
                  <div className="flex flex-col items-start animate-pulse">
                    <div className="bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/[0.03] text-slate-500 dark:text-slate-400 px-3.5 py-2 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 text-white shadow-md shadow-teal-500/10 dark:shadow-none transition-all duration-200 shrink-0"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
