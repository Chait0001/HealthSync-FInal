import { Request, Response, NextFunction } from 'express';
import { IDoctorService } from '../interfaces/IServices';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class DoctorController {
  constructor(private readonly doctorService: IDoctorService) {}

  getAllDoctors = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doctors = await this.doctorService.getAllDoctors();
      res.status(200).json(ApiResponse.success(doctors, 'Doctors retrieved'));
    } catch (err) {
      next(err);
    }
  };

  getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doctor = await this.doctorService.getDoctorByUserId(req.user!._id.toString());
      res.status(200).json(ApiResponse.success(doctor, 'Doctor profile retrieved'));
    } catch (err) {
      next(err);
    }
  };

  updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doctor = await this.doctorService.updateDoctorProfile(req.user!._id.toString(), req.body);
      res.status(200).json(ApiResponse.success(doctor, 'Doctor profile updated'));
    } catch (err) {
      next(err);
    }
  };
}
