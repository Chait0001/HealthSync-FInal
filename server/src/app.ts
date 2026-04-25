import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Config
import { DatabaseConnection } from './config/database';

// Repositories
import { UserRepository } from './repositories/UserRepository';
import { DoctorRepository } from './repositories/DoctorRepository';
import { AppointmentRepository } from './repositories/AppointmentRepository';

// Services
import { AuthService } from './services/AuthService';
import { DoctorService } from './services/DoctorService';
import { AppointmentService } from './services/AppointmentService';
import { AdminService } from './services/AdminService';

// Controllers
import { AuthController } from './controllers/AuthController';
import { DoctorController } from './controllers/DoctorController';
import { AppointmentController } from './controllers/AppointmentController';
import { AdminController } from './controllers/AdminController';

// Routes
import { createAuthRouter } from './routes/auth.routes';
import { createDoctorRouter } from './routes/doctor.routes';
import { createAppointmentRouter } from './routes/appointment.routes';
import { createAdminRouter } from './routes/admin.routes';

// Middleware
import { errorMiddleware } from './middleware/error.middleware';

// ─── Composition Root (DIP: wire all dependencies here) ─────────────────────
const userRepo        = new UserRepository();
const doctorRepo      = new DoctorRepository();
const appointmentRepo = new AppointmentRepository();

const authService        = new AuthService(userRepo, doctorRepo);
const doctorService      = new DoctorService(doctorRepo);
const appointmentService = new AppointmentService(appointmentRepo, doctorRepo);
const adminService       = new AdminService(userRepo, doctorRepo, appointmentRepo);

const authController        = new AuthController(authService);
const doctorController      = new DoctorController(doctorService);
const appointmentController = new AppointmentController(appointmentService);
const adminController       = new AdminController(adminService);

// ─── Express App ─────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         createAuthRouter(authController));
app.use('/api/doctors',      createDoctorRouter(doctorController));
app.use('/api/appointments', createAppointmentRouter(appointmentController));
app.use('/api/admin',        createAdminRouter(adminController));

app.get('/', (_req, res) => res.json({ message: 'HealthSync API running ✅' }));

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorMiddleware);

// ─── Bootstrap ───────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 8080;

const start = async (): Promise<void> => {
  await DatabaseConnection.getInstance().connect();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();

export default app;
