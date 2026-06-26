import { Server as SocketIOServer, Socket } from 'socket.io';

interface OnlineUser {
  userId: string;
  name: string;
  role: string;
}

/**
 * SocketService — Singleton that manages all Socket.IO connections.
 *
 * Tracks active users via two maps:
 *  - socketToUser: socketId → userId  (for disconnect cleanup)
 *  - userSockets:  userId  → Set<socketId> (supports multiple tabs)
 *  - userMeta:     userId  → { role, name }  (for online-user queries)
 *
 * Uses Socket.IO rooms for efficient broadcasting:
 *  - `user:<userId>` — personal room (all tabs of the same user)
 *  - `role:<role>`   — role-based room (admin, doctor, patient)
 */
export class SocketService {
  private static instance: SocketService;
  private io!: SocketIOServer;

  // socketId → userId
  private socketToUser = new Map<string, string>();
  // userId → Set<socketId>
  private userSockets = new Map<string, Set<string>>();
  // userId → user metadata
  private userMeta = new Map<string, { role: string; name: string }>();

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Initialize with the Socket.IO server instance. Called once from app.ts.
   */
  initialize(io: SocketIOServer): void {
    this.io = io;
  }

  /**
   * Get the raw Socket.IO server (for advanced use cases).
   */
  getIO(): SocketIOServer {
    return this.io;
  }

  // ─── Connection Management ───────────────────────────────────────────────────

  /**
   * Register a newly connected user socket.
   * Joins the socket to personal and role rooms.
   */
  registerUser(socket: Socket, userId: string, role: string, name: string): void {
    // Track the mapping
    this.socketToUser.set(socket.id, userId);

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);

    this.userMeta.set(userId, { role, name });

    // Join rooms for targeted broadcasting
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);

    // Broadcast to all that this user is online
    this.io.emit('user_online', { userId, name, role });

    console.log(`✅ User registered: ${name} (${role}) — socket ${socket.id}`);
  }

  /**
   * Unregister a disconnected socket.
   * Only broadcasts user_offline when ALL tabs are closed.
   */
  unregisterUser(socketId: string): void {
    const userId = this.socketToUser.get(socketId);
    if (!userId) return;

    this.socketToUser.delete(socketId);

    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        // Last connection — user is truly offline
        this.userSockets.delete(userId);
        const meta = this.userMeta.get(userId);
        this.userMeta.delete(userId);
        this.io.emit('user_offline', { userId, name: meta?.name, role: meta?.role });
        console.log(`❌ User offline: ${meta?.name || userId}`);
      }
    }
  }

  // ─── Queries ─────────────────────────────────────────────────────────────────

  /**
   * Get list of online users, optionally filtered by role.
   */
  getOnlineUsers(role?: string): OnlineUser[] {
    const users: OnlineUser[] = [];
    for (const [userId, meta] of this.userMeta.entries()) {
      if (!role || meta.role === role) {
        users.push({ userId, name: meta.name, role: meta.role });
      }
    }
    return users;
  }

  /**
   * Check if a specific user has at least one active connection.
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return !!sockets && sockets.size > 0;
  }

  // ─── Emitting ────────────────────────────────────────────────────────────────

  /**
   * Send an event to a specific user (all their tabs).
   */
  sendToUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Broadcast an event to all users with a specific role.
   */
  broadcastToRole(role: string, event: string, data: any): void {
    this.io.to(`role:${role}`).emit(event, data);
  }

  /**
   * Broadcast an event to ALL connected sockets.
   */
  broadcastAll(event: string, data: any): void {
    this.io.emit(event, data);
  }
}
