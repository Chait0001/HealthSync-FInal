import { Request, Response, NextFunction } from 'express';
import { IAdminService } from '../interfaces/IServices';
import { ApiResponse } from '../utils/ApiResponse';

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
}
