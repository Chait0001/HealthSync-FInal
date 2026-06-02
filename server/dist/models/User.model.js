"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'Please add a name'] },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: { type: String, required: [true, 'Please add a password'], minlength: 6, select: false },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' }, // keep for backward compat
    roles: [{
            role_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role' },
            role_key: { type: String },
            role_name: { type: String },
            is_primary: { type: Boolean, default: false },
            assigned_at: { type: Date, default: Date.now },
        }],
    permissions_cache: [{ type: String }], // e.g. ["patients.view", "appointments.create"]
    department_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department' },
    // Patient fields
    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    phone: { type: String },
    address: { type: String },
    bloodGroup: { type: String },
    createdAt: { type: Date, default: Date.now },
});
// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// Instance method — password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcryptjs_1.default.compare(enteredPassword, this.password);
};
exports.UserModel = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.model.js.map