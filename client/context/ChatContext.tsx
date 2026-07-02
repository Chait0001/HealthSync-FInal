'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from '../services/api';

export interface IChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  role: string;
  lastMessage: IChatMessage | null;
  unreadCount: number;
  department?: string;
}

interface ChatContextType {
  contacts: Contact[];
  totalUnreadCount: number;
  activeConversation: string | null;
  messages: IChatMessage[];
  openConversation: (userId: string | null) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  handleLocalTyping: () => void;
  otherUserTyping: boolean;
  loadingContacts: boolean;
  loadingMessages: boolean;
  fetchContacts: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  contacts: [],
  totalUnreadCount: 0,
  activeConversation: null,
  messages: [],
  openConversation: async () => {},
  sendMessage: async () => {},
  handleLocalTyping: () => {},
  otherUserTyping: false,
  loadingContacts: false,
  loadingMessages: false,
  fetchContacts: async () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeConversation, setActiveConversationState] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Keep a ref to the active conversation to avoid closures capturing stale state in socket handlers
  const activeConversationRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const setActiveConversation = (val: string | null) => {
    activeConversationRef.current = val;
    setActiveConversationState(val);
  };

  // Calculate total unread count from contacts
  const totalUnreadCount = contacts.reduce((sum, c) => sum + c.unreadCount, 0);

  // Checks if user is authorized to use chat based on their role
  const isAuthorized = user?.role === 'doctor' || user?.role === 'patient';

  // ─── Fetch contacts via REST ───────────────────────────────────────────────
  const fetchContacts = useCallback(async () => {
    if (!isAuthorized) return;
    setLoadingContacts(true);
    try {
      const res = await api.get('/chat/contacts');
      setContacts(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch chat contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  }, [isAuthorized]);

  // Fetch contacts on mount/auth state change
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // ─── Send typing status via socket ──────────────────────────────────────────
  const sendTypingStatus = useCallback(
    (isTypingVal: boolean) => {
      if (socket?.connected && activeConversationRef.current) {
        socket.emit('chat:typing', {
          toUserId: activeConversationRef.current,
          isTyping: isTypingVal,
        });
      }
    },
    [socket]
  );

  // Trigger typing notification (debounced)
  const handleLocalTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 2000);
  }, [isTyping, sendTypingStatus]);

  // ─── Socket Events Handler ──────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !isConnected || !isAuthorized) return;

    const handleChatReceive = (msg: IChatMessage) => {
      // 1. If message belongs to active thread, append it
      if (activeConversationRef.current === msg.senderId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        // Mark it as read on server & socket
        socket.emit('chat:mark_read', { otherUserId: msg.senderId });
        api.put(`/chat/${msg.senderId}/read`).catch((e) =>
          console.error('Failed to mark incoming message read:', e)
        );
      }

      // 2. Update contact list
      setContacts((prev) => {
        const updated = prev.map((c) => {
          if (c._id === msg.senderId) {
            return {
              ...c,
              lastMessage: msg,
              // Only increment unread count if conversation is NOT active/open
              unreadCount:
                activeConversationRef.current === msg.senderId
                  ? 0
                  : c.unreadCount + 1,
            };
          }
          return c;
        });

        // Re-sort list by last message date descending
        return [...updated].sort((a, b) => {
          const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    };

    const handleChatSent = (msg: IChatMessage) => {
      // If active thread is the receiver, append
      if (activeConversationRef.current === msg.receiverId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }

      // Update lastMessage in contacts
      setContacts((prev) => {
        const updated = prev.map((c) => {
          if (c._id === msg.receiverId) {
            return { ...c, lastMessage: msg };
          }
          return c;
        });
        return [...updated].sort((a, b) => {
          const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return timeB - timeA;
        });
      });
    };

    const handleChatReadReceipt = (data: { conversationId: string; readBy: string }) => {
      if (activeConversationRef.current === data.readBy) {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderId !== data.readBy && !m.isRead
              ? { ...m, isRead: true, readAt: new Date().toISOString() }
              : m
          )
        );
      }
    };

    const handleChatTyping = (data: { fromUserId: string; isTyping: boolean }) => {
      if (activeConversationRef.current === data.fromUserId) {
        setOtherUserTyping(!!data.isTyping);
      }
    };

    socket.on('chat:receive', handleChatReceive);
    socket.on('chat:sent', handleChatSent);
    socket.on('chat:read_receipt', handleChatReadReceipt);
    socket.on('chat:typing', handleChatTyping);

    return () => {
      socket.off('chat:receive', handleChatReceive);
      socket.off('chat:sent', handleChatSent);
      socket.off('chat:read_receipt', handleChatReadReceipt);
      socket.off('chat:typing', handleChatTyping);
    };
  }, [socket, isConnected, isAuthorized]);

  // ─── Open conversation ──────────────────────────────────────────────────────
  const openConversation = useCallback(
    async (userId: string | null) => {
      setActiveConversation(userId);
      setMessages([]);
      setOtherUserTyping(false);

      if (!userId) return;

      setLoadingMessages(true);
      try {
        // 1. Fetch conversation history via REST
        const res = await api.get(`/chat/${userId}/messages`);
        setMessages(res.data.data || []);

        // 2. Mark unread messages from this user as read
        setContacts((prev) =>
          prev.map((c) => (c._id === userId ? { ...c, unreadCount: 0 } : c))
        );

        if (socket?.connected) {
          socket.emit('chat:mark_read', { otherUserId: userId });
        }
        await api.put(`/chat/${userId}/read`);
      } catch (err) {
        console.error('Failed to open conversation:', err);
      } finally {
        setLoadingMessages(false);
      }
    },
    [socket]
  );

  // ─── Send message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const recipientId = activeConversationRef.current;
      if (!recipientId || !text.trim()) return;

      if (socket?.connected) {
        // Fast path: emit event
        socket.emit('chat:send', { toUserId: recipientId, text });
      } else {
        // Fallback path: REST call
        try {
          const res = await api.post(`/chat/${recipientId}/messages`, { text });
          const msg = res.data.data;

          // Manually append the message since socket is down
          setMessages((prev) => [...prev, msg]);

          // Update contact list
          setContacts((prev) => {
            const updated = prev.map((c) => {
              if (c._id === recipientId) {
                return { ...c, lastMessage: msg };
              }
              return c;
            });
            return [...updated].sort((a, b) => {
              const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
              const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
              return timeB - timeA;
            });
          });
        } catch (err) {
          console.error('REST fallback failed to send message:', err);
        }
      }
    },
    [socket]
  );

  // Reset typing timeouts on cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
