"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Doctor_model_1 = require("../models/Doctor.model");
class DoctorRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Doctor_model_1.DoctorModel);
    }
    async findByUserId(userId) {
        return this.model.findOne({ userId }).populate('userId', 'name email phone').exec();
    }
    async findAllWithUserInfo() {
        return this.model.find({}).populate('userId', 'name email phone').exec();
    }
    async deleteByUserId(userId) {
        const result = await this.model.findOneAndDelete({ userId }).exec();
        return !!result;
    }
}
exports.DoctorRepository = DoctorRepository;
//# sourceMappingURL=DoctorRepository.js.map