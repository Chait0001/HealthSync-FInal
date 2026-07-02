import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { ChatService } from '../services/ChatService';
import { ApiResponse } from '../utils/ApiResponse';

export const createChatRouter = (chatService: ChatService): Router => {
  const router = Router();

  // All chat routes require authentication
  router.use(authenticate);

  // Get contact list for the logged-in doctor/patient
  router.get(
    '/contacts',
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const contacts = await chatService.getContacts(
          req.user!._id.toString(),
          req.user!.role
        );
        res.json(ApiResponse.success(contacts, 'Contacts retrieved successfully'));
      } catch (err) {
        next(err);
      }
    }
  );

  // Get messages in a conversation
  router.get(
    '/:otherUserId/messages',
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { before, limit } = req.query;
        const messages = await chatService.getConversation(
          req.user!._id.toString(),
          String(req.params.otherUserId),
          {
            before: before ? String(before) : undefined,
            limit: limit ? Number(limit) : undefined,
          }
        );
        res.json(ApiResponse.success(messages, 'Conversation retrieved successfully'));
      } catch (err) {
        next(err);
      }
    }
  );

  // Send a message (REST fallback)
  router.post(
    '/:otherUserId/messages',
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { text } = req.body;
        const message = await chatService.sendMessage(
          req.user!._id.toString(),
          String(req.params.otherUserId),
          text
        );
        res.status(201).json(ApiResponse.success(message, 'Message sent successfully', 201));
      } catch (err) {
        next(err);
      }
    }
  );

  // Mark all messages in a conversation as read
  router.put(
    '/:otherUserId/read',
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        await chatService.markConversationRead(
          req.user!._id.toString(),
          String(req.params.otherUserId)
        );
        res.json(ApiResponse.success(null, 'Conversation marked as read'));
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
};
