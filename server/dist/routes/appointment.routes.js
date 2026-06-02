"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointmentRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const createAppointmentRouter = (appointmentController) => {
    const router = (0, express_1.Router)();
    router.get('/my', auth_middleware_1.authenticate, appointmentController.getMyAppointments);
    router.post('/', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('patient'), appointmentController.bookAppointment);
    return router;
};
exports.createAppointmentRouter = createAppointmentRouter;
//# sourceMappingURL=appointment.routes.js.map