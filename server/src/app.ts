import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Config
import { DatabaseConnection } from './config/database';

// Repositories
import { UserRepository } from './repositories/UserRepository';
import { DoctorRepository } from './repositories/DoctorRepository';
import { AppointmentRepository } from './repositories/AppointmentRepository';
import { RoleRepository } from './repositories/RoleRepository';
import { PermissionRepository } from './repositories/PermissionRepository';
import { RolePermissionRepository } from './repositories/RolePermissionRepository';

// Services
import { AuthService } from './services/AuthService';
import { DoctorService } from './services/DoctorService';
import { AppointmentService } from './services/AppointmentService';
import { AdminService } from './services/AdminService';
import { RoleService } from './services/RoleService';
import { SocketService } from './services/SocketService';
import { MessageService } from './services/MessageService';

// Controllers
import { AuthController } from './controllers/AuthController';
import { DoctorController } from './controllers/DoctorController';
import { AppointmentController } from './controllers/AppointmentController';
import { AdminController } from './controllers/AdminController';
import { RoleController } from './controllers/RoleController';

// Routes
import { createAuthRouter } from './routes/auth.routes';
import { createDoctorRouter } from './routes/doctor.routes';
import { createAppointmentRouter } from './routes/appointment.routes';
import { createAdminRouter } from './routes/admin.routes';
import { createRoleRouter } from './routes/role.routes';
import { createMessageRouter } from './routes/message.routes';
import notificationRouter from './routes/notification.routes';

// Middleware
import { errorMiddleware } from './middleware/error.middleware';

// Utils
import { verifyToken } from './utils/jwt.utils';
import { NotificationModel } from './models/Notification.model';
import { MessageModel } from './models/Message.model';

// ─── Composition Root (DIP: wire all dependencies here) ─────────────────────
const userRepo        = new UserRepository();
const doctorRepo      = new DoctorRepository();
const appointmentRepo = new AppointmentRepository();
const roleRepo        = new RoleRepository();
const permRepo        = new PermissionRepository();
const rolePermRepo    = new RolePermissionRepository();

const roleService        = new RoleService(roleRepo, permRepo, rolePermRepo, userRepo);
const authService        = new AuthService(userRepo, doctorRepo, roleService);
const doctorService      = new DoctorService(doctorRepo);
const appointmentService = new AppointmentService(appointmentRepo, doctorRepo);
const adminService       = new AdminService(userRepo, doctorRepo, appointmentRepo, roleRepo, roleService, permRepo);
const socketService      = SocketService.getInstance();
const messageService     = new MessageService(socketService);

const authController        = new AuthController(authService);
const doctorController      = new DoctorController(doctorService);
const appointmentController = new AppointmentController(appointmentService, socketService);
const adminController       = new AdminController(adminService, socketService);
const roleController        = new RoleController(roleService);

// ─── Express App ─────────────────────────────────────────────────────────────
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.set('io', io);

// Initialize SocketService with the io instance
socketService.initialize(io);

// ─── Socket.IO Authentication Middleware ─────────────────────────────────────
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token);
    const user = await userRepo.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user data to socket for use in event handlers
    socket.data.userId = user._id.toString();
    socket.data.role = user.role;
    socket.data.name = user.name;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// ─── Socket.IO Connection Handler ────────────────────────────────────────────
io.on('connection', (socket) => {
  const { userId, role, name } = socket.data;

  console.log(`🔌 Client connected: ${name} (${role}) — ${socket.id}`);

  // Register the user in SocketService
  socketService.registerUser(socket, userId, role, name);

  // Send the user the initial online users list
  socket.emit('online_users_list', {
    users: socketService.getOnlineUsers(),
  });

  // ─── Event: get_online_users ────────────────────────────────────────────────
  socket.on('get_online_users', (data?: { role?: string }) => {
    socket.emit('online_users_list', {
      users: socketService.getOnlineUsers(data?.role),
    });
  });

  // ─── Event: notification_read ───────────────────────────────────────────────
  socket.on('notification_read', async (data: { notificationId: string }) => {
    try {
      if (!data?.notificationId) return;
      await NotificationModel.findByIdAndUpdate(data.notificationId, {
        isRead: true,
        readAt: new Date(),
      });
      // Confirm back to the client
      socket.emit('notification_read_confirmed', { notificationId: data.notificationId });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  });

  // ─── Event: send_message (admin only) ───────────────────────────────────────
  socket.on('send_message', async (data: { toUserId: string; subject: string; message: string; appointmentId?: string }) => {
    try {
      if (role !== 'admin') {
        socket.emit('error_message', { message: 'Only admins can send messages' });
        return;
      }
      if (!data?.toUserId || !data?.subject || !data?.message) {
        socket.emit('error_message', { message: 'toUserId, subject, and message are required' });
        return;
      }

      // Use MessageService which handles DB + socket emission
      await messageService.sendMessage(
        userId,
        data.toUserId,
        data.subject,
        data.message,
        data.appointmentId
      );

      socket.emit('message_sent_confirmation', {
        toUserId: data.toUserId,
        subject: data.subject,
        sentAt: new Date(),
      });
    } catch (err) {
      console.error('Error sending message via socket:', err);
      socket.emit('error_message', { message: 'Failed to send message' });
    }
  });

  // ─── Event: disconnect ──────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${name} (${role}) — ${socket.id}`);
    socketService.unregisterUser(socket.id);
  });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         createAuthRouter(authController));
app.use('/api/doctors',      createDoctorRouter(doctorController));
app.use('/api/appointments', createAppointmentRouter(appointmentController));
app.use('/api/admin',        createAdminRouter(adminController));
app.use('/api/roles',        createRoleRouter(roleController));
app.use('/api/notifications', notificationRouter);
app.use('/api/messages',     createMessageRouter(messageService));

app.get('/', (_req, res) => res.json({ message: 'HealthSync API running ✅' }));

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorMiddleware);

// ─── Bootstrap ───────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 8080;

const start = async (): Promise<void> => {
  // Start listening FIRST so Render detects the port immediately
  httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  // Then connect to MongoDB (if it fails, routes will error individually
  // instead of blocking the entire server from starting)
  await DatabaseConnection.getInstance().connect();
};

start();

export default app;
