import { Router, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationModel } from '../models/Notification.model';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// Get all notifications for logged-in user
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await NotificationModel.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(ApiResponse.success(notifications, 'Notifications retrieved'));
  } catch (err) { next(err); }
});

// Mark all as read
router.put('/read-all', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await NotificationModel.updateMany({ userId: req.user!._id, isRead: false }, { isRead: true });
    res.json(ApiResponse.success(null, 'All notifications marked as read'));
  } catch (err) { next(err); }
});

// Mark one as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await NotificationModel.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json(ApiResponse.success(null, 'Notification marked as read'));
  } catch (err) { next(err); }
});

export default router;
