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

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) throw new Error('Status is required');
      const appointment = await this.appointmentService.updateAppointmentStatus(
        id as string, status as string, req.user!._id.toString(), req.user!.role
      );
      res.json(ApiResponse.success(appointment, 'Appointment status updated'));
    } catch (err) { next(err); }
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
