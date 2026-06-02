"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const jwt_utils_1 = require("../utils/jwt.utils");
const ApiError_1 = require("../utils/ApiError");
const userRepo = new UserRepository_1.UserRepository();
/**
 * authenticate — JWT verification middleware (SRP: only verifies tokens)
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return next(new ApiError_1.ApiError('Not authorized, no token', 401));
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        const user = await userRepo.findById(decoded.id);
        if (!user)
            return next(new ApiError_1.ApiError('User not found', 401));
        req.user = user;
        next();
    }
    catch (err) {
        next(new ApiError_1.ApiError('Not authorized', 401));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map