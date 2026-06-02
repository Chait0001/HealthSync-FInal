"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const ApiError_1 = require("../utils/ApiError");
const mongoose_1 = require("mongoose");
class AppointmentService {
    constructor(appointmentRepo, doctorRepo) {
        this.appointmentRepo = appointmentRepo;
        this.doctorRepo = doctorRepo;
    }
    async getMyAppointments(userId, role) {
        if (role === 'patient') {
            return this.appointmentRepo.findByPatientId(userId);
        }
        if (role === 'doctor') {
            const doctor = await this.doctorRepo.findByUserId(userId);
            if (!doctor)
                throw new ApiError_1.ApiError('Doctor profile not found', 404);
            return this.appointmentRepo.findByDoctorId(doctor._id.toString());
        }
        return []; // Admin sees nothing here — use AdminService instead
    }
    async bookAppointment(patientId, data) {
        const { doctorId, date, reason } = data;
        if (!doctorId || !date || !reason) {
            throw new ApiError_1.ApiError('Please provide doctorId, date and reason', 400);
        }
        return this.appointmentRepo.create({
            patientId: new mongoose_1.Types.ObjectId(patientId),
            doctorId: new mongoose_1.Types.ObjectId(doctorId),
            date: new Date(date),
            reason,
        });
    }
}
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=AppointmentService.js.map