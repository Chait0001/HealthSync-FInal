"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * ApiError — Custom operational error class.
 * isOperational = true means it is a known/expected error (e.g. 404, 400).
 * Unhandled errors will have isOperational = false and can be caught by the global handler.
 */
class ApiError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Maintain prototype chain (required when extending built-ins in TS)
        Object.setPrototypeOf(this, ApiError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map