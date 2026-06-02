import mongoose from "mongoose";
export declare const RoleModel: mongoose.Model<{
    name: string;
    status: "active" | "inactive";
    key: string;
    role_type: "system" | "custom";
    scope_level: "global" | "department" | "hospital" | "own";
    description?: string | null | undefined;
    createdAt?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    status: "active" | "inactive";
    key: string;
    role_type: "system" | "custom";
    scope_level: "global" | "department" | "hospital" | "own";
    description?: string | null | undefined;
    createdAt?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    status: "active" | "inactive";
    key: string;
    role_type: "system" | "custom";
    scope_level: "global" | "department" | "hospital" | "own";
    description?: string | null | undefined;
    createdAt?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    status: "active" | "inactive";
    key: string;
    role_type: "system" | "custom";
    scope_level: "global" | "department" | "hospital" | "own";
    description?: string | null | undefined;
    createdAt?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    status: "active" | "inactive";
    key: string;
    role_type: "system" | "custom";
    scope_level: "global" | "department" | "hospital" | "own";
    description?: string | null | undefined;
    createdAt?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    status: "active" | "inactive";
    key: string;
    role_type: "system" | "custom";
    scope_level: "global" | "department" | "hospital" | "own";
    description?: string | null | undefined;
    createdAt?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Role.model.d.ts.map