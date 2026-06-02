"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Config
const database_1 = require("./config/database");
// Repositories
const UserRepository_1 = require("./repositories/UserRepository");
const DoctorRepository_1 = require("./repositories/DoctorRepository");
const AppointmentRepository_1 = require("./repositories/AppointmentRepository");
// Services
const AuthService_1 = require("./services/AuthService");
const DoctorService_1 = require("./services/DoctorService");
const AppointmentService_1 = require("./services/AppointmentService");
const AdminService_1 = require("./services/AdminService");
// Controllers
const AuthController_1 = require("./controllers/AuthController");
const DoctorController_1 = require("./controllers/DoctorController");
const AppointmentController_1 = require("./controllers/AppointmentController");
const AdminController_1 = require("./controllers/AdminController");
// Routes
const auth_routes_1 = require("./routes/auth.routes");
const doctor_routes_1 = require("./routes/doctor.routes");
const appointment_routes_1 = require("./routes/appointment.routes");
const admin_routes_1 = require("./routes/admin.routes");
// Middleware
const error_middleware_1 = require("./middleware/error.middleware");
// ─── Composition Root (DIP: wire all dependencies here) ─────────────────────
const userRepo = new UserRepository_1.UserRepository();
const doctorRepo = new DoctorRepository_1.DoctorRepository();
const appointmentRepo = new AppointmentRepository_1.AppointmentRepository();
const authService = new AuthService_1.AuthService(userRepo, doctorRepo);
const doctorService = new DoctorService_1.DoctorService(doctorRepo);
const appointmentService = new AppointmentService_1.AppointmentService(appointmentRepo, doctorRepo);
const adminService = new AdminService_1.AdminService(userRepo, doctorRepo, appointmentRepo);
const authController = new AuthController_1.AuthController(authService);
const doctorController = new DoctorController_1.DoctorController(doctorService);
const appointmentController = new AppointmentController_1.AppointmentController(appointmentService);
const adminController = new AdminController_1.AdminController(adminService);
// ─── Express App ─────────────────────────────────────────────────────────────
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', (0, auth_routes_1.createAuthRouter)(authController));
app.use('/api/doctors', (0, doctor_routes_1.createDoctorRouter)(doctorController));
app.use('/api/appointments', (0, appointment_routes_1.createAppointmentRouter)(appointmentController));
app.use('/api/admin', (0, admin_routes_1.createAdminRouter)(adminController));
app.get('/', (_req, res) => res.json({ message: 'HealthSync API running ✅' }));
// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(error_middleware_1.errorMiddleware);
// ─── Bootstrap ───────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 8080;
const start = async () => {
    await database_1.DatabaseConnection.getInstance().connect();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};
start();
exports.default = app;
//# sourceMappingURL=app.js.map