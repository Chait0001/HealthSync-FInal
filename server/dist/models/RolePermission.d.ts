import mongoose from 'mongoose';
export declare const RolePermissionModel: mongoose.Model<{
    role_id: mongoose.Types.ObjectId;
    permission_id: mongoose.Types.ObjectId;
    permission_key: string;
    effect: "allow" | "deny";
    assigned_by?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    role_id: mongoose.Types.ObjectId;
    permission_id: mongoose.Types.ObjectId;
    permission_key: string;
    effect: "allow" | "deny";
    assigned_by?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    role_id: mongoose.Types.ObjectId;
    permission_id: mongoose.Types.ObjectId;
    permission_key: string;
    effect: "allow" | "deny";
    assigned_by?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    role_id: mongoose.Types.ObjectId;
    permission_id: mongoose.Types.ObjectId;
    permission_key: string;
    effect: "allow" | "deny";
    assigned_by?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    role_id: mongoose.Types.ObjectId;
    permission_id: mongoose.Types.ObjectId;
    permission_key: string;
    effect: "allow" | "deny";
    assigned_by?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    role_id: mongoose.Types.ObjectId;
    permission_id: mongoose.Types.ObjectId;
    permission_key: string;
    effect: "allow" | "deny";
    assigned_by?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=RolePermission.d.ts.map