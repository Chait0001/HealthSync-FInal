import mongoose, { Types } from 'mongoose';
import { IDoctor } from '../interfaces/IDoctor';
export declare const DoctorModel: mongoose.Model<IDoctor, {}, {}, {}, mongoose.Document<unknown, {}, IDoctor, {}, {}> & IDoctor & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Doctor.model.d.ts.map