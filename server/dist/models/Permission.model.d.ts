import mongoose, { Types } from "mongoose";
export declare const PermissionModel: mongoose.Model<{
    status: "active" | "inactive";
    key: string;
    module: string;
    action: string;
    is_system: boolean;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    status: "active" | "inactive";
    key: string;
    module: string;
    action: string;
    is_system: boolean;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "active" | "inactive";
    key: string;
    module: string;
    action: string;
    is_system: boolean;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "active" | "inactive";
    key: string;
    module: string;
    action: string;
    is_system: boolean;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    status: "active" | "inactive";
    key: string;
    module: string;
    action: string;
    is_system: boolean;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    status: "active" | "inactive";
    key: string;
    module: string;
    action: string;
    is_system: boolean;
    category?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Permission.model.d.ts.map