import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { MessageService } from '../services/MessageService';
import { ApiResponse } from '../utils/ApiResponse';

export const createMessageRouter = (messageService: MessageService): Router => {
  const router = Router();

  // All message routes require authentication
  router.use(authenticate);

  // Send a message (admin only)
  router.post(
    '/send',
    requireRole('admin'),
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { toUserId, subject, message, appointmentId } = req.body;
        if (!toUserId || !subject || !message) {
          res.status(400).json(ApiResponse.error('toUserId, subject, and message are required', 400));
          return;
        }
        const msg = await messageService.sendMessage(
          req.user!._id.toString(),
          toUserId,
          subject,
          message,
          appointmentId
        );
        res.status(201).json(ApiResponse.success(msg, 'Message sent successfully', 201));
      } catch (err) {
        next(err);
      }
    }
  );

  // Get messages for the authenticated user
  router.get(
    '/',
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const messages = await messageService.getMessages(req.user!._id.toString());
        res.json(ApiResponse.success(messages, 'Messages retrieved'));
      } catch (err) {
        next(err);
      }
    }
  );

  // Mark a message as read
  router.put(
    '/:id/read',
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const msg = await messageService.markAsRead(String(req.params.id), req.user!._id.toString());
        res.json(ApiResponse.success(msg, 'Message marked as read'));
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
};
