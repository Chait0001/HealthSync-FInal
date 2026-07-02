import { ChatMessageModel, getConversationId, IChatMessage } from '../models/Chat.model';
import { AppointmentModel } from '../models/Appointment.model';
import { DoctorModel } from '../models/Doctor.model';
import { UserModel } from '../models/User.model';
import { SocketService } from './SocketService';
import { ApiError } from '../utils/ApiError';
import { Types } from 'mongoose';

interface Contact {
  _id: string;
  name: string;
  email: string;
  role: string;
  lastMessage: IChatMessage | null;
  unreadCount: number;
  department?: string;
}

export class ChatService {
  constructor(private readonly socketService: SocketService) {}

  /**
   * Helper to verify cross-role chat permission between two users.
   * Only patient-to-doctor and doctor-to-patient messaging is allowed.
   */
  async verifyAppointment(userIdA: string, userIdB: string): Promise<boolean> {
    const userA = await UserModel.findById(userIdA).select('role');
    const userB = await UserModel.findById(userIdB).select('role');
    if (!userA || !userB) return false;

    const isPatientDoctor = userA.role === 'patient' && userB.role === 'doctor';
    const isDoctorPatient = userA.role === 'doctor' && userB.role === 'patient';

    return isPatientDoctor || isDoctorPatient;
  }

  /**
   * Fetch contacts for a user.
   * If patient, fetch all doctors.
   * If doctor, fetch all patients.
   */
  async getContacts(userId: string, role: string): Promise<Contact[]> {
    if (role !== 'patient' && role !== 'doctor') {
      return [];
    }

    let mappedUsers: Array<{ _id: string; name: string; email: string; role: string; department?: string }> = [];

    if (role === 'patient') {
      // Patients should see all doctors. Fetch doctor profiles and populate user information.
      const doctors = await DoctorModel.find({})
        .populate('userId', 'name email role')
        .lean();

      mappedUsers = doctors
        .filter((d) => d.userId && (d.userId as any)._id.toString() !== userId)
        .map((d) => ({
          _id: (d.userId as any)._id.toString(),
          name: (d.userId as any).name,
          email: (d.userId as any).email,
          role: (d.userId as any).role,
          department: d.department || d.specialization || '',
        }));
    } else {
      // Doctors should see all patients.
      const patients = await UserModel.find({
        role: 'patient',
        _id: { $ne: new Types.ObjectId(userId) },
      }).select('name email role').lean();

      mappedUsers = patients.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        email: p.email,
        role: p.role,
      }));
    }

    if (mappedUsers.length === 0) {
      return [];
    }

    // Gather last message and unread counts for each contact
    const contacts: Contact[] = await Promise.all(
      mappedUsers.map(async (userObj) => {
        const counterpartId = userObj._id;
        const conversationId = getConversationId(userId, counterpartId);

        // Find the most recent message in the conversation
        const lastMessage = await ChatMessageModel.findOne({ conversationId })
          .sort({ createdAt: -1 })
          .exec();

        // Count unread messages received from this contact
        const unreadCount = await ChatMessageModel.countDocuments({
          conversationId,
          receiverId: new Types.ObjectId(userId),
          isRead: false,
        });

        return {
          _id: counterpartId,
          name: userObj.name,
          email: userObj.email,
          role: userObj.role,
          lastMessage,
          unreadCount,
          department: userObj.department,
        };
      })
    );

    // Sort by last message date descending, placing contacts with no messages at the bottom
    return contacts.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  /**
   * Fetch conversation history. PAGINATED oldest-to-newest.
   */
  async getConversation(
    userId: string,
    otherUserId: string,
    options: { before?: string; limit?: number } = {}
  ): Promise<IChatMessage[]> {
    // 1. Authorization check
    const hasAppointment = await this.verifyAppointment(userId, otherUserId);
    if (!hasAppointment) {
      throw new ApiError('You are not authorized to view this conversation', 403);
    }

    const conversationId = getConversationId(userId, otherUserId);
    const limit = options.limit || 30;

    const query: any = { conversationId };
    if (options.before) {
      query.createdAt = { $lt: new Date(options.before) };
    }

    // Query newest first for cursor pagination, then reverse for render order
    const messages = await ChatMessageModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return messages.reverse();
  }

  /**
   * Send a chat message.
   */
  async sendMessage(senderId: string, receiverId: string, text: string): Promise<IChatMessage> {
    if (!text || !text.trim()) {
      throw new ApiError('Message text cannot be empty', 400);
    }

    // 1. Authorization check
    const hasAppointment = await this.verifyAppointment(senderId, receiverId);
    if (!hasAppointment) {
      throw new ApiError('You are not authorized to message this user', 403);
    }

    const conversationId = getConversationId(senderId, receiverId);

    const message = await ChatMessageModel.create({
      conversationId,
      senderId: new Types.ObjectId(senderId),
      receiverId: new Types.ObjectId(receiverId),
      text: text.trim(),
      isRead: false,
    });

    // 2. Real-time delivery via SocketService
    this.socketService.sendToUser(receiverId, 'chat:receive', message);
    this.socketService.sendToUser(senderId, 'chat:sent', message);

    return message;
  }

  /**
   * Mark all unread messages in a conversation as read.
   */
  async markConversationRead(userId: string, otherUserId: string): Promise<void> {
    const conversationId = getConversationId(userId, otherUserId);

    await ChatMessageModel.updateMany(
      {
        conversationId,
        receiverId: new Types.ObjectId(userId),
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    // Notify the other user (sender) about the read receipt
    this.socketService.sendToUser(otherUserId, 'chat:read_receipt', {
      conversationId,
      readBy: userId,
    });
  }
}
