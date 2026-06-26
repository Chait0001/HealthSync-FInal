import { Response, NextFunction } from 'express';
import { IAppointmentService } from '../interfaces/IServices';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationModel } from '../models/Notification.model';
import { SocketService } from '../services/SocketService';

export class AppointmentController {
  constructor(
    private readonly appointmentService: IAppointmentService,
    private readonly socketService: SocketService
  ) {}

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

      // ─── Real-time: notify all relevant parties about the status change ───────
      const changedBy = { userId: req.user!._id, name: req.user!.name, role: req.user!.role };
      const statusPayload = {
        appointmentId: appointment._id,
        newStatus: appointment.status,
        appointment,
        changedBy,
      };

      // Extract participant IDs
      const patientId = (appointment.patientId as any)?._id?.toString() || appointment.patientId.toString();
      const doctorId = (appointment.doctorId as any)?.userId?._id?.toString()
        || (appointment.doctorId as any)?.userId?.toString()
        || undefined;

      // Emit status change to patient
      this.socketService.sendToUser(patientId, 'appointment_status_changed', statusPayload);

      // Create notification for patient
      const statusLabels: Record<string, string> = {
        approved: 'has been approved',
        cancelled: 'has been cancelled',
        completed: 'has been marked as completed',
        pending: 'is now pending',
      };
      const statusText = statusLabels[status] || `status changed to ${status}`;

      const patientNotification = await NotificationModel.create({
        userId: patientId,
        title: 'Appointment Update',
        message: `Your appointment ${statusText}.`,
        type: status === 'approved' ? 'approval' : status === 'cancelled' ? 'cancellation' : 'general',
        appointmentId: appointment._id,
        sentViaSocket: this.socketService.isUserOnline(patientId),
        deliveredAt: this.socketService.isUserOnline(patientId) ? new Date() : undefined,
      });

      this.socketService.sendToUser(patientId, 'notification_received', {
        _id: patientNotification._id,
        title: patientNotification.title,
        message: patientNotification.message,
        type: patientNotification.type,
        isRead: false,
        appointmentId: appointment._id,
        createdAt: patientNotification.createdAt,
      });

      // Emit status change to doctor (if we have their userId)
      if (doctorId) {
        this.socketService.sendToUser(doctorId, 'appointment_status_changed', statusPayload);

        const doctorNotification = await NotificationModel.create({
          userId: doctorId,
          title: 'Appointment Update',
          message: `An appointment ${statusText}.`,
          type: status === 'approved' ? 'approval' : status === 'cancelled' ? 'cancellation' : 'general',
          appointmentId: appointment._id,
          sentViaSocket: this.socketService.isUserOnline(doctorId),
          deliveredAt: this.socketService.isUserOnline(doctorId) ? new Date() : undefined,
        });

        this.socketService.sendToUser(doctorId, 'notification_received', {
          _id: doctorNotification._id,
          title: doctorNotification.title,
          message: doctorNotification.message,
          type: doctorNotification.type,
          isRead: false,
          appointmentId: appointment._id,
          createdAt: doctorNotification.createdAt,
        });
      }

      // Notify all admins about the status change
      this.socketService.broadcastToRole('admin', 'appointment_status_changed', statusPayload);

      res.json(ApiResponse.success(appointment, 'Appointment status updated'));
    } catch (err) { next(err); }
  };

  bookAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patientId = req.body.patientId || req.user!._id.toString();
      const appointment = await this.appointmentService.bookAppointment(
        patientId,
        req.body
      );
      res.status(201).json(ApiResponse.success(appointment, 'Appointment booked', 201));
    } catch (err) {
      next(err);
    }
  };
}
