"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const createAuthRouter = (authController) => {
    const router = (0, express_1.Router)();
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.get('/me', auth_middleware_1.authenticate, authController.getMe);
    return router;
};
exports.createAuthRouter = createAuthRouter;
//# sourceMappingURL=auth.routes.js.map