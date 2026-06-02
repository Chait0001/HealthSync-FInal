"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * requireRole — RBAC middleware factory (SRP: only enforces role authorization)
 * Usage: router.get('/admin', authenticate, requireRole('admin'), handler)
 */
const requireRole = (...roles) => {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError('Access denied: insufficient permissions', 403));
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=role.middleware.js.map