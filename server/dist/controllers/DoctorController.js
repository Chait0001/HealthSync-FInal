"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
class DoctorController {
    constructor(doctorService) {
        this.doctorService = doctorService;
        this.getAllDoctors = async (_req, res, next) => {
            try {
                const doctors = await this.doctorService.getAllDoctors();
                res.status(200).json(ApiResponse_1.ApiResponse.success(doctors, 'Doctors retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
        this.getMyProfile = async (req, res, next) => {
            try {
                const doctor = await this.doctorService.getDoctorByUserId(req.user._id.toString());
                res.status(200).json(ApiResponse_1.ApiResponse.success(doctor, 'Doctor profile retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
        this.updateMyProfile = async (req, res, next) => {
            try {
                const doctor = await this.doctorService.updateDoctorProfile(req.user._id.toString(), req.body);
                res.status(200).json(ApiResponse_1.ApiResponse.success(doctor, 'Doctor profile updated'));
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.DoctorController = DoctorController;
//# sourceMappingURL=DoctorController.js.map