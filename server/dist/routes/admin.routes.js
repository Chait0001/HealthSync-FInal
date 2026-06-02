"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const createAdminRouter = (adminController) => {
    const router = (0, express_1.Router)();
    // All admin routes require authentication + admin role (RBAC)
    router.use(auth_middleware_1.authenticate, (0, role_middleware_1.requireRole)('admin'));
    router.get('/stats', adminController.getStats);
    router.get('/users', adminController.getAllUsers);
    router.delete('/users/:id', adminController.deleteUser);
    router.get('/appointments/pending', adminController.getPendingAppointments);
    router.get('/appointments/scheduled', adminController.getScheduledAppointments);
    router.put('/appointments/:id/approve', adminController.approveAppointment);
    return router;
};
exports.createAdminRouter = createAdminRouter;
//# sourceMappingURL=admin.routes.js.map