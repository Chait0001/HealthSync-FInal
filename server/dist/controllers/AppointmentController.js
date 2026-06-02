"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
class AppointmentController {
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
        this.getMyAppointments = async (req, res, next) => {
            try {
                const appointments = await this.appointmentService.getMyAppointments(req.user._id.toString(), req.user.role);
                res.status(200).json(ApiResponse_1.ApiResponse.success(appointments, 'Appointments retrieved'));
            }
            catch (err) {
                next(err);
            }
        };
        this.bookAppointment = async (req, res, next) => {
            try {
                const appointment = await this.appointmentService.bookAppointment(req.user._id.toString(), req.body);
                res.status(201).json(ApiResponse_1.ApiResponse.success(appointment, 'Appointment booked', 201));
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=AppointmentController.js.map