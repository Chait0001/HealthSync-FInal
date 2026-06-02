import mongoose from 'mongoose';
import { IAppointment } from '../interfaces/IAppointment';
export declare const AppointmentModel: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment, {}, {}> & IAppointment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Appointment.model.d.ts.map