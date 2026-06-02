"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const ApiError_1 = require("../utils/ApiError");
class DoctorService {
    constructor(doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    async getAllDoctors() {
        return this.doctorRepo.findAllWithUserInfo();
    }
    async getDoctorByUserId(userId) {
        const doctor = await this.doctorRepo.findByUserId(userId);
        if (!doctor)
            throw new ApiError_1.ApiError('Doctor profile not found', 404);
        return doctor;
    }
    async updateDoctorProfile(userId, data) {
        const doctor = await this.doctorRepo.findByUserId(userId);
        if (!doctor)
            throw new ApiError_1.ApiError('Doctor profile not found', 404);
        return this.doctorRepo.update(doctor._id.toString(), data);
    }
}
exports.DoctorService = DoctorService;
//# sourceMappingURL=DoctorService.js.map