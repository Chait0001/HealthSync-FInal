"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
/**
 * errorMiddleware — Global Express error handler (SRP: only formats errors into API responses)
 * Must have 4 parameters to be recognized by Express as an error middleware.
 */
const errorMiddleware = (err, _req, res, _next) => {
    const statusCode = err instanceof ApiError_1.ApiError ? err.statusCode : 500;
    const message = process.env.NODE_ENV === 'production' && !(err instanceof ApiError_1.ApiError)
        ? 'Internal Server Error'
        : err.message;
    res.status(statusCode).json(ApiResponse_1.ApiResponse.error(message, statusCode));
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map