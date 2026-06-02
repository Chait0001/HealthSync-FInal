"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
        this.getStats = async (_req, res, next) => {
            try {
                const stats = await this.adminService.getStats();
                res.status(200).json(ApiResponse_1.ApiResponse.success(stats, 'Stats retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
        this.getAllUsers = async (_req, res, next) => {
            try {
                const users = await this.adminService.getAllUsers();
                res.status(200).json(ApiResponse_1.ApiResponse.success(users, 'Users retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteUser = async (req, res, next) => {
            try {
                await this.adminService.deleteUser(String(req.params.id));
                res.status(200).json(ApiResponse_1.ApiResponse.success(null, 'User deleted'));
            }
            catch (err) {
                next(err);
            }
        };
        this.getPendingAppointments = async (_req, res, next) => {
            try {
                const appts = await this.adminService.getPendingAppointments();
                res.status(200).json(ApiResponse_1.ApiResponse.success(appts, 'Pending appointments retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
        this.getScheduledAppointments = async (_req, res, next) => {
            try {
                const appts = await this.adminService.getScheduledAppointments();
                res.status(200).json(ApiResponse_1.ApiResponse.success(appts, 'Scheduled appointments retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
        this.approveAppointment = async (req, res, next) => {
            try {
                const appt = await this.adminService.approveAppointment(String(req.params.id));
                res.status(200).json(ApiResponse_1.ApiResponse.success(appt, 'Appointment approved'));
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map