"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const createDoctorRouter = (doctorController) => {
    const router = (0, express_1.Router)();
    router.get('/', doctorController.getAllDoctors);
    router.get('/me', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('doctor'), doctorController.getMyProfile);
    router.put('/me', auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('doctor'), doctorController.updateMyProfile);
    return router;
};
exports.createDoctorRouter = createDoctorRouter;
//# sourceMappingURL=doctor.routes.js.map