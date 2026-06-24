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
import notificationRouter from './routes/notification.routes';

// Middleware
import { errorMiddleware } from './middleware/error.middleware';

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

const authController        = new AuthController(authService);
const doctorController      = new DoctorController(doctorService);
const appointmentController = new AppointmentController(appointmentService);
const adminController       = new AdminController(adminService);
const roleController        = new RoleController(roleService);

// ─── Express App ─────────────────────────────────────────────────────────────
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
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
