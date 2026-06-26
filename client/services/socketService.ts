'use client';

import { io, Socket } from 'socket.io-client';

/**
 * SocketService — Singleton that manages the Socket.IO client connection.
 *
 * Connects to the server with JWT authentication, handles reconnection
 * with exponential backoff, and provides a clean API for the React contexts.
 */
class SocketServiceClass {
  private socket: Socket | null = null;
  private isInitialized = false;

  /**
   * Connect to the Socket.IO server.
   * Extracts the base URL from NEXT_PUBLIC_API_URL (strips /api suffix).
   */
  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Disconnect any stale socket before creating a new one
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Derive socket URL from API URL (remove /api suffix)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const socketUrl = apiUrl.replace(/\/api\/?$/, '');

    this.socket = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 10,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket?.id);
      this.isInitialized = true;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error.message);
      // If auth error, don't keep retrying with the same bad token
      if (error.message.includes('Authentication error')) {
        console.warn('🔌 Authentication failed — stopping reconnection');
        this.socket?.disconnect();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    return this.socket;
  }

  /**
   * Disconnect and clean up the socket.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isInitialized = false;
    }
  }

  /**
   * Get the current socket instance (may be null if not connected).
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if the socket is currently connected.
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Export a singleton instance
const socketService = new SocketServiceClass();
export default socketService;
