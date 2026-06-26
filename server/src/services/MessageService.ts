import { MessageModel, IMessage } from '../models/Message.model';
import { NotificationModel } from '../models/Notification.model';
import { SocketService } from './SocketService';
import { ApiError } from '../utils/ApiError';

/**
 * MessageService — Handles direct messaging from admin to users.
 * Creates DB records and emits socket events for real-time delivery.
 */
export class MessageService {
  constructor(private readonly socketService: SocketService) {}

  /**
   * Send a direct message from one user to another.
   * Creates a Message record + Notification record, then emits via socket.
   */
  async sendMessage(
    fromUserId: string,
    toUserId: string,
    subject: string,
    message: string,
    appointmentId?: string
  ): Promise<IMessage> {
    if (!subject || !message) {
      throw new ApiError('Subject and message are required', 400);
    }

    // Create the message record
    const msg = await MessageModel.create({
      fromUserId,
      toUserId,
      subject,
      message,
      type: 'direct_message',
      appointmentId: appointmentId || undefined,
    });

    // Also create a notification for the recipient
    const notification = await NotificationModel.create({
      userId: toUserId,
      title: `New Message: ${subject}`,
      message,
      type: 'general',
      sentViaSocket: this.socketService.isUserOnline(toUserId),
      deliveredAt: this.socketService.isUserOnline(toUserId) ? new Date() : undefined,
    });

    // Populate sender info for the socket payload
    const populatedMsg = await MessageModel.findById(msg._id)
      .populate('fromUserId', 'name email role')
      .exec();

    // Emit real-time events to recipient
    this.socketService.sendToUser(toUserId, 'message_received', {
      _id: populatedMsg?._id,
      from: populatedMsg?.fromUserId,
      subject: populatedMsg?.subject,
      message: populatedMsg?.message,
      type: populatedMsg?.type,
      createdAt: populatedMsg?.createdAt,
    });

    this.socketService.sendToUser(toUserId, 'notification_received', {
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: false,
      createdAt: notification.createdAt,
    });

    return msg;
  }

  /**
   * Get messages for a specific user, most recent first.
   */
  async getMessages(userId: string, limit = 50): Promise<IMessage[]> {
    return MessageModel.find({ toUserId: userId })
      .populate('fromUserId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Mark a message as read.
   */
  async markAsRead(messageId: string, userId: string): Promise<IMessage | null> {
    const msg = await MessageModel.findById(messageId);
    if (!msg) throw new ApiError('Message not found', 404);
    if (msg.toUserId.toString() !== userId) {
      throw new ApiError('Not your message', 403);
    }

    return MessageModel.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    ).exec();
  }
}
