import { Request, Response, NextFunction } from 'express';
import { IAdminService } from '../interfaces/IServices';
import { ApiResponse } from '../utils/ApiResponse';
import { NotificationModel } from '../models/Notification.model';

export class AdminController {
  constructor(private readonly adminService: IAdminService) {}

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.adminService.getStats();
      res.status(200).json(ApiResponse.success(stats, 'Stats retrieved'));
    } catch (err) {
      next(err);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.adminService.createUser(req.body);
      res.status(201).json(ApiResponse.success(user, 'User created successfully'));
    } catch (err) { next(err); }
  };

  getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.adminService.getAllUsers();
      res.status(200).json(ApiResponse.success(users, 'Users retrieved'));
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.adminService.deleteUser(String(req.params.id));
      res.status(200).json(ApiResponse.success(null, 'User deleted'));
    } catch (err) {
      next(err);
    }
  };

  getPendingAppointments = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appts = await this.adminService.getPendingAppointments();
      res.status(200).json(ApiResponse.success(appts, 'Pending appointments retrieved'));
    } catch (err) {
      next(err);
    }
  };

  getScheduledAppointments = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appts = await this.adminService.getScheduledAppointments();
      res.status(200).json(ApiResponse.success(appts, 'Scheduled appointments retrieved'));
    } catch (err) {
      next(err);
    }
  };

  approveAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appt = await this.adminService.approveAppointment(String(req.params.id));
      res.status(200).json(ApiResponse.success(appt, 'Appointment approved'));
    } catch (err) {
      next(err);
    }
  };

  getAllRoles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.adminService.getAllRoles();
      res.status(200).json(ApiResponse.success(roles, 'Roles retrieved'));
    } catch (err) {
      next(err);
    }
  };

  getAllPermissions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissions = await this.adminService.getAllPermissions();
      res.status(200).json(ApiResponse.success(permissions, 'Permissions retrieved'));
    } catch (err) {
      next(err);
    }
  };

  sendReminder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const appointment = await this.adminService.getAppointmentById(String(req.params.id));
      if (!appointment) {
        res.status(404).json({ message: 'Appointment not found' });
        return;
      }

      const dateStr = new Date(appointment.date).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      const timeStr = new Date(appointment.date).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit'
      });

      const patientId = (appointment.patientId as any)?._id || appointment.patientId;
      const doctorUserId = (appointment.doctorId as any)?.userId?._id || (appointment.doctorId as any)?.userId;
      const doctorName = (appointment.doctorId as any)?.userId?.name || 'your doctor';
      const patientName = (appointment.patientId as any)?.name || 'your patient';

      // Notify patient
      await NotificationModel.create({
        userId: patientId,
        title: 'Appointment Reminder',
        message: `Reminder: You have an appointment with Dr. ${doctorName} on ${dateStr} at ${timeStr}.`,
        type: 'reminder',
        appointmentId: appointment._id,
      });

      // Notify doctor
      if (doctorUserId) {
        await NotificationModel.create({
          userId: doctorUserId,
          title: 'Appointment Reminder',
          message: `Reminder: You have an appointment with patient ${patientName} on ${dateStr} at ${timeStr}.`,
          type: 'reminder',
          appointmentId: appointment._id,
        });
      }

      res.json(ApiResponse.success(null, 'Reminder notifications sent successfully'));
    } catch (err) { next(err); }
  };
}
