import mongoose, { Schema } from "mongoose";
const roleSchema = new Schema({
    key: { type: String, required: true, unique: true},
    name: { type: String, required: true, unique: true},
    description: { type: String },
    role_type:   { type: String, enum: ['system', 'custom'], default: 'system' },
    scope_level: { type: String, enum: ['global', 'hospital', 'department', 'own'], default: 'hospital' },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdAt: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })
export const RoleModel=mongoose.model("Role",roleSchema);