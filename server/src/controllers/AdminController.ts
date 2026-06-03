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
}
