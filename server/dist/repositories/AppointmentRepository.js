"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
const mongoose_1 = require("mongoose");
const BaseRepository_1 = require("./BaseRepository");
const Appointment_model_1 = require("../models/Appointment.model");
class AppointmentRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Appointment_model_1.AppointmentModel);
    }
    async findByPatientId(patientId) {
        return this.model
            .find({ patientId: new mongoose_1.Types.ObjectId(patientId) })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ date: 1 })
            .exec();
    }
    async findByDoctorId(doctorId) {
        return this.model
            .find({ doctorId: new mongoose_1.Types.ObjectId(doctorId) })
            .populate('patientId', 'name email')
            .sort({ date: 1 })
            .exec();
    }
    async findByStatus(status) {
        return this.model
            .find({ status })
            .populate('patientId', 'name email')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
            .sort({ date: 1 })
            .exec();
    }
    async updateStatus(id, status) {
        return this.model.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
    async deleteByParticipant(userId) {
        const oid = new mongoose_1.Types.ObjectId(userId);
        await this.model.deleteMany({ $or: [{ patientId: oid }, { doctorId: oid }] });
    }
}
exports.AppointmentRepository = AppointmentRepository;
//# sourceMappingURL=AppointmentRepository.js.map