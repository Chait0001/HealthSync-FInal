import { Response, NextFunction } from 'express';
import { IAppointmentService } from '../interfaces/IServices';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class AppointmentController {
  constructor(private readonly appointmentService: IAppointmentService) {}

  getMyAppointments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appointments = await this.appointmentService.getMyAppointments(
        req.user!._id.toString(),
        req.user!.role
      );
      res.status(200).json(ApiResponse.success(appointments, 'Appointments retrieved'));
    } catch (err) {
      next(err);
    }
  };

  bookAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appointment = await this.appointmentService.bookAppointment(
        req.user!._id.toString(),
        req.body
      );
      res.status(201).json(ApiResponse.success(appointment, 'Appointment booked', 201));
    } catch (err) {
      next(err);
    }
  };
}
