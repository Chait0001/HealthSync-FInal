"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const ApiError_1 = require("../utils/ApiError");
class AdminService {
    constructor(userRepo, doctorRepo, appointmentRepo) {
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
        this.appointmentRepo = appointmentRepo;
    }
    async getStats() {
        const [totalUsers, totalDoctors, totalPatients] = await Promise.all([
            this.userRepo.countAll(),
            this.userRepo.countByRole('doctor'),
            this.userRepo.countByRole('patient'),
        ]);
        return { totalUsers, totalDoctors, totalPatients };
    }
    async getAllUsers() {
        return this.userRepo.findAllWithoutPassword();
    }
    async deleteUser(id) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new ApiError_1.ApiError('User not found', 404);
        if (user.role === 'doctor') {
            await this.doctorRepo.deleteByUserId(user._id.toString());
        }
        await this.appointmentRepo.deleteByParticipant(user._id.toString());
        await this.userRepo.delete(id);
    }
    async getPendingAppointments() {
        return this.appointmentRepo.findByStatus('pending');
    }
    async getScheduledAppointments() {
        return this.appointmentRepo.findByStatus('approved');
    }
    async approveAppointment(id) {
        const appt = await this.appointmentRepo.updateStatus(id, 'approved');
        if (!appt)
            throw new ApiError_1.ApiError('Appointment not found', 404);
        return appt;
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=AdminService.js.map